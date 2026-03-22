# Feature Research

**Domain:** Text-to-SQL SaaS (Browser-based, Client-side, BYOK)
**Researched:** 2026-03-22
**Confidence:** MEDIUM-HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels broken or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| NL to SQL generation | Core value prop — without this nothing else matters | MEDIUM | LLM generates SQL from natural language; accuracy depends on schema context quality |
| Schema awareness | Tools without schema context hallucinate table/column names; accuracy drops 20-30% | MEDIUM | Paste schema → inject into LLM prompt. Schema quality (completeness, naming clarity) directly drives output accuracy |
| SQL dialect awareness | Wrong syntax = query fails; PostgreSQL LIMIT vs MySQL vs SQL Server matter | LOW | Detect or let user specify dialect; inject dialect into prompt context |
| Display generated SQL | Users need to verify and trust the output before running it | LOW | Show SQL block clearly formatted; syntax highlighting |
| Execute query + show results | The moment of truth; if results look wrong, trust collapses | MEDIUM | Client-side SQL execution via WebWorkers/SQLite WASM; display as table/chart |
| Copy results to clipboard | No file export in scope; clipboard is the primary export path | LOW | One-click copy for both results and generated SQL |
| Multi-provider support | Users have different AI providers; lock-in feels risky | LOW | Abstract provider behind single interface; user provides their own API keys |
| Rate limiting UX | With BYOK model, users fear quota exhaustion; they need visibility and control | MEDIUM | Show remaining quota, warn before expensive queries, block on exhaustion |
| Polished SAAS appearance | First impression matters for paying users; "side project" UI kills trust | LOW | Professional styling, landing page, settings page, clear visual hierarchy |
| Schema input (paste) | The primary interaction; must feel effortless | LOW | Paste DDL or table definitions; optional: paste sample data for column hints |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but where we win.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Schema visualization | Users paste schema but can't read DDL; ER diagram or table graph makes schema approachable | MEDIUM | Render tables/columns as collapsible cards or simple graph; no need for full ER diagram tool |
| Multi-turn conversational queries | "Show me Q1 sales" → "now filter to California" → "compare YoY" — context carries across | MEDIUM | Maintain conversation history in prompt context; per-session (no backend needed) |
| Query explanation in plain English | Non-technical users need to understand what SQL does before trusting it | LOW | LLM summarizes the generated SQL in plain language; one paragraph below SQL block |
| Pre-built query templates | Users don't know what to ask; templates guide discovery and demonstrate capability | LOW | 5-10 example questions per demo schema; "starters" section in UI |
| Query feedback mechanism | Users mark queries as good/bad; builds trust signal and surfaces accuracy issues | LOW | Thumbs up/down per query; localStorage session storage; no backend needed |
| Prompt injection protection | Users paste arbitrary schema; malicious DDL could manipulate prompts | MEDIUM | Strip dangerous patterns from schema input; sandbox prompt assembly |
| Progressive schema disclosure | Full schema dump overwhelms users; show relevant tables based on query | LOW | Simple keyword matching to surface "maybe relevant" tables; not full semantic matching |
| Smart schema parsing | User pastes unstructured output; extract table/column/relationship definitions reliably | MEDIUM | Parse common formats (pg_dump, MySQL SHOW CREATE, IDE schema export); regex + heuristic approach |
| Estimated query cost | Users fear surprise API bills; show "this query will cost ~X tokens" before execution | LOW | Estimate based on schema size + prompt length; show cost tier (low/medium/high) |
| NVIDIA NIM as first-class provider | NVIDIA NIM is the primary target; native integration with rate limiting for quota protection | MEDIUM | First provider in settings; clear NVIDIA branding; optimized for NIM's specific API shape |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this product's constraints.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Direct database connections | "Connect my real database" sounds better than paste | Credentials, security, network access, driver complexity — all break the client-side-only model | Schema paste is the right abstraction; explain tradeoff clearly |
| Query history persistence | Users want to revisit old queries across sessions | No backend = no persistence; localStorage is fragile and per-browser | Session history is sufficient; bookmark queries instead |
| File export (CSV, JSON, etc.) | Users want to save results to files | Adds complexity; exceeds stated scope; clipboard is sufficient for MVP | Copy to clipboard; browser print dialog for formatted output |
| Multiple simultaneous queries | "Let me run a batch of queries" | Parallel execution, result aggregation, quota multiplication all problematic | Single query at a time; clearly state this constraint |
| User accounts / authentication | "I want my queries to persist" | No backend server; auth complexity outweighs benefit | Session-only is the right model; explain why |
| Full BI dashboard | "Can I build dashboards?" | Scope explosion; separate product category | Stay focused on single-query workflow; no dashboards |
| Collaborative features | "Can my team share queries?" | No backend; introduces complexity (permissions, conflict) | Not in scope for v1 |
| Real-time query streaming | "Show results as they come in" | WebSQL/WASM limitations; complexity vs. value | Standard result display after execution completes |
| Automatic schema inference | "Just scan my database" | Would require backend or database drivers — breaks client-only constraint | Manual paste is intentional; guide users on what to paste |

## Feature Dependencies

```
[Schema Input (paste)] ──required──> [Schema Parsing]
                                       └──required──> [NL to SQL Generation]
                                                            ├──required──> [SQL Display]
                                                            ├──required──> [Query Execution]
                                                            └──required──> [Result Display]

[NL to SQL Generation] ──optional──> [Query Explanation]
[NL to SQL Generation] ──optional──> [Multi-turn Conversations]
[Multi-turn Conversations] ──requires──> [NL to SQL Generation]

[Rate Limiting Engine] ──applied──> [NL to SQL Generation]
[Rate Limiting Engine] ──powers──> [Quota Display UX]

[Query Feedback] ──enhances──> [Schema Parsing] (improves via negative examples)

[Query Templates] ──independent──> [All features] (starter content, no dependencies)
```

### Dependency Notes

- **Schema parsing requires schema input:** Users must paste something before the tool can work. Good UX for paste input is prerequisite.
- **SQL generation requires parsed schema:** The LLM prompt must contain structured schema context. Garbage in = garbage out.
- **Query explanation requires generated SQL:** Cannot explain what doesn't exist yet.
- **Multi-turn requires SQL generation:** Each turn generates a new SQL based on conversation history.
- **Rate limiting is orthogonal but touches everything:** It wraps the generation call but doesn't depend on it — can be added to any phase.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [x] **Schema paste input** — Users paste DDL or table definitions; parsed into structured format for LLM context
- [x] **NL to SQL generation** — LLM converts natural language + schema → SQL query for specified dialect
- [x] **SQL display** — Show generated SQL with syntax highlighting; copy button
- [x] **Query execution** — Client-side SQL execution (WebAssembly SQL.js or similar); results in table format
- [x] **Result display + copy** — Show results; one-click copy to clipboard
- [x] **Multi-provider abstraction** — OpenAI, Anthropic, Google, NVIDIA NIM, OpenRouter — user provides own keys
- [x] **Rate limiting UX** — Quota display, pre-flight cost estimate, warn on expensive queries, block on exhaustion
- [x] **Polished SAAS UI** — Landing page, settings (API keys), main query interface; professional appearance

### Add After Validation (v1.x)

Features to add once core is working and user feedback confirms direction.

- [ ] **Query explanation** — Plain English summary of generated SQL below the SQL block
- [ ] **Query feedback** — Thumbs up/down on each query; localStorage session log
- [ ] **Multi-turn conversations** — Follow-up questions carry context; session-persistent conversation
- [ ] **Pre-built templates** — 5-10 example questions with demo schema; "get started" section

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] **Schema visualization** — ER-style table/column cards; auto-detect relationships
- [ ] **Smart schema parsing** — Auto-detect format (pg_dump, MySQL export, IDE output); handle messy input
- [ ] **Progressive schema disclosure** — Surface relevant tables based on query keywords; reduce context overload
- [ ] **Prompt injection protection** — Sandboxing for malicious schema input; input sanitization layer
- [ ] **NVIDIA NIM native integration** — First-class support with optimized API handling and quota dashboard

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Schema paste input | HIGH | LOW | P1 |
| NL to SQL generation | HIGH | MEDIUM | P1 |
| SQL display + copy | HIGH | LOW | P1 |
| Query execution | HIGH | MEDIUM | P1 |
| Result display + copy | HIGH | LOW | P1 |
| Multi-provider support | HIGH | LOW | P1 |
| Rate limiting UX | HIGH | MEDIUM | P1 |
| Polished SAAS UI | HIGH | MEDIUM | P1 |
| Query explanation | MEDIUM | LOW | P2 |
| Query feedback | MEDIUM | LOW | P2 |
| Multi-turn conversations | MEDIUM | MEDIUM | P2 |
| Pre-built templates | MEDIUM | LOW | P2 |
| Schema visualization | MEDIUM | MEDIUM | P3 |
| Smart schema parsing | MEDIUM | MEDIUM | P3 |
| Progressive schema disclosure | MEDIUM | MEDIUM | P3 |
| Prompt injection protection | MEDIUM | MEDIUM | P3 |
| NVIDIA NIM native integration | MEDIUM | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add in v1.x after validation
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | AI2SQL | Text2SQL.ai | Vanna.ai | QueryForge (Our Approach) |
|---------|--------|-------------|----------|---------------------------|
| Schema awareness | Yes (direct connect) | Yes (import) | Yes (RAG from DDL) | Yes (paste) |
| Schema input | Direct DB connection | Import/DDL paste | DDL paste | DDL paste only |
| SQL generation | Yes | Yes | Yes | Yes |
| SQL display | Yes | Yes | Yes | Yes |
| Query execution | Via connection | No (generation only) | Yes (DB connection) | Yes (client-side WASM) |
| Result display | Table + chart | Table | Table + chart | Table + copy |
| Multi-provider | Limited | API only | Yes (LLM agnostic) | Yes (user keys) |
| Rate limiting UX | Server-side | Server-side | Server-side | Client-side (BYOK) |
| Multi-turn | Basic | Chat-based | Yes | Session-based |
| Query history | Server-side | Server-side | Server-side | Session-only |
| Export | CSV, JSON | CSV, JSON, SQL | CSV, JSON | Clipboard only |
| UI | Web app | Web app | Web + API | Client-side SPA |
| Pricing model | Subscription | Subscription + API | Subscription + API | BYOK (user pays provider) |

**Key differentiator:** QueryForge's BYOK model + client-side only architecture is unique. Most competitors use direct DB connections + server-side processing. We deliberately avoid that for security and simplicity. The tradeoff is: no query history persistence, no file export, no collaborative features — and that's the right tradeoff.

## Sources

- AI2SQL 2026 Comparison (ai2sql.io, 2026-03-10) — schema awareness benchmarks
- Querio Best Text-to-SQL 2026 (querio.ai, 2025-12-18) — market overview and pricing
- Fabi.ai Comparison (medium.com/@marc_60867, 2026-02-26) — tool landscape categorization
- Bytebase Top 5 2026 (bytebase.com, 2026-02-03) — Vanna 2.0, DataGrip, DBHub
- Text2SQL.ai 2025 Guide (text2sql.ai, 2025-10-27) — security and API comparisons
- BlazeSQL NL2SQL Guide (blazesql.com, 2026-02-23) — technology stack breakdown
- BrightCoding Text-to-SQL Stack (blog.brightcoding.dev, 2025-12-10) — model benchmarks (CHASE-SQL 91.2%)
- Athenic AI Rate Limiting (getathenic.com, 2025-12-02) — multi-level rate limiting patterns
- Reintech LLM Quota Management (reintech.io, 2025-12-31) — token bucket, circuit breakers
- Zuplo API Rate Limiting Best Practices (zuplo.com, 2025-01-06) — 2025 patterns and algorithms
- Product Teacher: Table Stakes vs Differentiators (productteacher.com, 2024-04-15) — framework for categorization

---
*Feature research for: text-to-SQL SaaS — QueryForge*
*Researched: 2026-03-22*
