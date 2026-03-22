# Pitfalls Research

**Domain:** Client-side text-to-SQL web application (schema paste, multi-provider AI, rate-limited)
**Researched:** 2026-03-22
**Confidence:** MEDIUM-HIGH (multiple sources, though client-side specifics less documented)

## Critical Pitfalls

### Pitfall 1: Quietly Wrong Results

**What goes wrong:**
The query executes successfully and returns plausible-but-incorrect data. Users see numbers that look reasonable, act on them, and make wrong decisions. No error is thrown, no warning appears.

**Why it happens:**
LLMs generate syntactically valid SQL that runs without errors. The correctness gap is semantic, not syntactic. Missing joins, wrong filters, or incorrect aggregations produce valid results that are subtly wrong.

**How to avoid:**
- Always display generated SQL for user review before execution
- Implement a "confirm before run" step for queries
- Add query result sanity checks (row counts, value ranges)
- Include explicit SQL execution warnings about potential inaccuracies
- Log failure patterns to improve prompts over time

**Warning signs:**
- Users report results that "feel off" but can't articulate why
- Results look too clean or too complete
- No errors but unexpected null counts
- Aggregations that don't match manual estimates

**Phase to address:**
Phase 2 (SQL Generation) — must include user-facing SQL display and confirmation

---

### Pitfall 2: Schema Hallucination

**What goes wrong:**
The LLM generates SQL referencing tables or columns that don't exist in the pasted schema. Users see query errors or, worse, the LLM invents plausible-sounding tables.

**Why it happens:**
- Schema is ambiguous or uses cryptic names (e.g., `usr_trx_fl`, `tmp_stage_agg`)
- Domain terms in user's question match table names vaguely but incorrectly
- No disambiguation between similar-sounding entities

**How to avoid:**
- Parse the pasted schema into a structured format before generating prompts
- Validate all table/column references against parsed schema before execution
- Include only relevant tables in the prompt context (scope reduction)
- Add explicit "tables available" list to system prompt

**Warning signs:**
- Schema uses abbreviations, single letters, or non-descriptive names
- Multiple tables have similar names
- User questions reference domain concepts not explicitly in schema

**Phase to address:**
Phase 2 (Schema Parsing & SQL Generation) — validation must happen before query execution

---

### Pitfall 3: Prompt-to-SQL Injection

**What goes wrong:**
A user embeds malicious instructions in their natural language query. The LLM interprets these as authoritative and generates destructive SQL (DROP TABLE, unauthorized data access) or reveals schema information it shouldn't.

**Why it happens:**
The LLM processes system instructions and user input in a single context. There's no architectural separation between "instructions" and "data." Attackers can embed instructions that override system prompts (indirect injection) or directly manipulate the SQL generation (P2SQL injection).

**How to avoid:**
- Never execute INSERT, UPDATE, DELETE, DROP, ALTER, GRANT, or TRUNCATE
- Parse generated SQL into AST before execution
- Reject queries containing forbidden operations at the AST level
- Add `sqlglot` or similar to validate query structure client-side
- Implement input filtering without relying on it as sole defense
- Never assume LLM output is trustworthy

**Warning signs:**
- Unusual query patterns (unexpected capitalization, hidden characters)
- Queries referencing multiple schemas unexpectedly
- User questions that repeat or redirect mid-sentence

**Phase to address:**
Phase 2 (Security Layer) — critical to implement before any query execution

---

### Pitfall 4: Missing or Wrong Joins

**What goes wrong:**
The LLM either omits required join conditions (producing cross joins with exponential rows) or joins on semantically wrong columns (e.g., `order.id = customer.id` instead of `order.customer_id = customer.id`).

**Why it happens:**
- Schema doesn't explicitly define foreign key relationships in the pasted format
- User's question doesn't specify the relationship between entities
- Vector search finds relevant tables but misses join path requirements

**How to avoid:**
- Parse foreign key definitions from pasted schema if provided
- Build a schema graph and require multi-hop paths to be explicit
- Ask clarifying questions when query requires joining 3+ tables
- Validate join conditions against schema structure
- Reject queries that would produce cartesian products

**Warning signs:**
- Queries that join more than 3 tables
- Questions using "and" to connect entities (e.g., "customers and their orders")
- Schemas with many-to-many relationship tables

**Phase to address:**
Phase 2 (Schema Parsing) — must extract and validate relationships

---

### Pitfall 5: Rate Limit Exceeded Without Recovery

**What goes wrong:**
User hits API rate limit, sees generic error, loses query context, and either abandons or retries blindly. NVIDIA NIM quota gets exhausted unexpectedly.

**Why it happens:**
- No client-side rate limiting before API calls
- No exponential backoff implementation
- Error messages don't explain what happened or when to retry
- Quota tracking happens server-side (if it exists) but isn't surfaced to user

**How to avoid:**
- Implement client-side token bucket with configurable limits per provider
- Track request counts and show remaining quota in UI
- Use exponential backoff with jitter for retries
- Display clear "rate limited" messages with retry-after guidance
- Implement request queuing to smooth burst traffic
- Cache common query patterns to reduce API calls

**Warning signs:**
- Users reporting intermittent "Network Error" messages
- Quota exhaustion notifications from providers
- Increasing error rates during peak usage

**Phase to address:**
Phase 3 (Rate Limiting) — must be implemented before user-facing launch

---

### Pitfall 6: API Key Exposure in Client-Side Code

**What goes wrong:**
User-provided API keys are stored insecurely, accessible to XSS attacks, or transmitted to unintended destinations. User's expensive AI credits get stolen.

**Why it happens:**
- localStorage is accessible to any JavaScript on the page (including XSS payloads)
- No httpOnly option for client-side storage
- Keys might accidentally get logged or included in error reports
- Third-party scripts on GitHub Pages could read storage

**How to avoid:**
- Store API keys in sessionStorage (cleared on tab close) instead of localStorage
- Never log keys or include them in error reporting
- Use Subresource Integrity for any third-party scripts
- Implement Content Security Policy headers
- Add "clear all keys" functionality in settings
- Warn users about localStorage risks on first key entry
- Consider IndexedDB with encryption for keys that must persist

**Warning signs:**
- Third-party scripts added to the page
- Security audits flag localStorage access patterns
- User reports of unauthorized API usage

**Phase to address:**
Phase 1 (API Key Management) — security foundation before any provider integration

---

### Pitfall 7: Schema Parsing Failures

**What goes wrong:**
The pasted schema fails to parse correctly, causing silent data loss or confusing errors. Users paste complex DDL or database dumps that overwhelm the parser.

**Why it happens:**
- Schema formats vary widely (CREATE TABLE statements, pg_dump output, ER diagrams)
- Complex data types aren't handled
- Foreign key constraints are in separate ALTER TABLE statements
- Users paste partial or malformed schema
- Context limits get exceeded with large schemas

**How to avoid:**
- Support multiple schema input formats with clear format detection
- Implement graceful degradation when schema is too large
- Show users a parsed schema preview before proceeding
- Allow users to annotate/pair down schema
- Set reasonable schema size limits with clear error messages
- Handle common SQL dialects (PostgreSQL, MySQL, SQLite, SQL Server)

**Warning signs:**
- Users pasting from pgAdmin, MySQL Workbench, or ER diagram tools
- Schemas exceeding 100 tables
- Schemas with complex stored procedures or triggers

**Phase to address:**
Phase 1 (Schema Parsing) — foundation for all downstream features

---

### Pitfall 8: Ambiguous Intent Without Clarification

**What goes wrong:**
The LLM guesses at ambiguous user intent and produces wrong results. User asked "active users" but the system doesn't know what "active" means. Results seem plausible but answer the wrong question.

**Why it happens:**
- Natural language inherently ambiguous (last month? fiscal or calendar quarter?)
- Business definitions live outside the database
- Users assume the system knows their domain terminology
- No clarification workflow exists

**How to avoid:**
- Build a clarification flow for ambiguous terms
- Detect ambiguous queries (filter keywords, date ranges, aggregations)
- Ask explicit follow-up questions before SQL generation
- Store user clarifications for session context
- Provide default interpretations with option to override

**Warning signs:**
- Questions using vague quantifiers ("recent", "many", "high")
- Business jargon without explicit definitions
- Questions spanning multiple time periods

**Phase to address:**
Phase 2 (User Experience) — clarify before generate approach

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|------------------|----------------|-----------------|
| Dump entire schema in prompt | Simple implementation | Context overflow, worse accuracy | Never — implement scope reduction |
| Trust LLM output blindly | Fast iteration | Security vulnerabilities, wrong results | Never |
| Skip SQL parsing validation | Saves development time | Injection attacks possible | Never |
| Store keys in localStorage | Quick implementation | XSS exposure, key theft | Only for non-sensitive test keys |
| Single-shot query generation | Simple flow | Higher error rate | MVP only, must iterate |
| No error categorization | Faster launch | Poor user experience | MVP only |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| NVIDIA NIM | Not tracking quota consumption | Implement client-side quota meter, show remaining requests |
| OpenAI API | Ignoring context window limits | Track token counts, truncate schema if needed |
| Anthropic API | No timeout handling | Set 60-90s timeouts, implement graceful degradation |
| Google Gemini | Model-specific prompt formatting | Abstract provider-specific requirements |
| OpenRouter | Inconsistent response formats | Normalize all responses before parsing |
| All Providers | Direct key exposure in errors | Never include keys in error messages |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Large schema in context | Slow response, token overflow | Scope reduction, relevance filtering | Schemas with 20+ tables |
| No response caching | High API costs, slow repeated queries | Cache recent queries with hash | Repeated similar questions |
| Burst without queuing | Rate limit hits, failed requests | Token bucket, request queuing | Multiple users simultaneously |
| No streaming response | Perceived slowness, timeout concerns | Stream tokens to user | Queries taking >10s |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Executing without AST validation | SQL injection, destructive operations | Parse with sqlglot, whitelist allowed operations |
| Storing keys in localStorage | XSS key theft | sessionStorage + CSP + SRI |
| Logging user queries with keys | Key exposure in logs | Never log full queries with credentials |
| Trusting provider errors | Information leakage | Sanitize all error messages to user |
| No CSRF for provider calls | N/A for client-side (no server) | N/A for static site |
| Third-party script injection | Key theft via compromised CDN | Subresource Integrity, minimal dependencies |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No query preview | Users don't know what will run | Always show generated SQL first |
| Generic error messages | User doesn't know how to fix | Specific errors with suggestions |
| No query history | Can't revisit previous questions | Session-based history panel |
| Silent failures | User thinks query succeeded | Explicit success/failure states |
| No "try again" for failed queries | Lost context, must re-type | Preserve query, offer retry |
| Schema errors not visualized | User doesn't know what's wrong | Highlight parsing failures in preview |

---

## "Looks Done But Isn't" Checklist

- [ ] **Rate Limiting:** Implemented client-side quota tracking — not just relying on API errors
- [ ] **SQL Validation:** AST parsing rejects non-SELECT queries — not just string matching
- [ ] **Schema Parsing:** User sees parsed preview before generation — not just "schema loaded"
- [ ] **Error Handling:** All provider errors show user-friendly messages — not raw API responses
- [ ] **Security:** API keys cleared on demand — not just on page close
- [ ] **Query Display:** Users see SQL before execution — not just after
- [ ] **Provider Fallback:** System recovers gracefully when primary provider fails — not crashes

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Rate limit hit | LOW | Show clear retry timer, preserve query, queue request |
| Provider outage | MEDIUM | Switch to fallback provider, notify user of switch |
| Wrong query results | HIGH | Show SQL, add "report wrong result" button, log pattern |
| Key compromised | MEDIUM | Clear instructions for user to revoke key at provider |
| Schema parse failure | LOW | Show specific failure, suggest format corrections |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| API Key Exposure | Phase 1: Foundation | Test XSS scenario, verify keys not in console logs |
| Schema Parsing Failures | Phase 1: Schema Parsing | Test multiple formats, verify parsed preview matches |
| Prompt-to-SQL Injection | Phase 2: SQL Generation | Red-team with DROP, UNION injection attempts |
| Quietly Wrong Results | Phase 2: SQL Display | Always show SQL, require confirmation |
| Missing/Wrong Joins | Phase 2: Schema Context | Test multi-table queries, verify join paths |
| Ambiguous Intent | Phase 2: UX Flow | Test edge cases with vague questions |
| Rate Limit Issues | Phase 3: Rate Limiting | Load test with multiple rapid queries |
| Provider Failures | Phase 3: Multi-Provider | Kill each provider, verify graceful fallback |

---

## Sources

- [Text-to-SQL AI Failures & Fixes - August Infotech](https://www.augustinfotech.com/blogs/text-to-sql-ai-failures-vs-fixes-a-short-guide/) — Common error patterns (HIGH confidence)
- [The Six Failures of Text-to-SQL - Google Cloud](https://medium.com/google-cloud/the-six-failures-of-text-to-sql-and-how-to-fix-them-with-agents-ef5fd2b74b68) — Agent architecture patterns (HIGH confidence)
- [Text-to-SQL Performance Cliff - Medium](https://medium.com/@visrow/the-text-to-sql-performance-cliff-2026-why-natural-language-to-sql-breaks-a7281a23dbea) — Enterprise schema challenges (MEDIUM confidence)
- [Prompt-to-SQL Injection CVE - DEV Community](https://dev.to/aviral_srivastava_ba4f282/i-found-a-sql-injection-in-an-ai-agent-it-taught-me-that-we-broke-the-first-rule-of-database-3cmb) — Real-world security case study (HIGH confidence)
- [SQL Injection in Age of LLMs - Medium](https://medium.com/@anshika-bhargava0202/sql-injection-in-the-age-of-llms-8f722c8f94af) — LLM-specific injection vectors (MEDIUM confidence)
- [LLM Rate Limiting Guide - Markaicode](https://markaicode.com/llm-rate-limiting-protect-api-from-abuse/) — Token bucket implementation (HIGH confidence)
- [Stop Storing JWTs in localStorage - ZamDev](https://tools.zamdevai.com/blog/stop-storing-jwts-in-localstorage) — API key security patterns (HIGH confidence)
- [Design Patterns for LLM-to-SQL - Medium](https://medium.com/@prasoonid/design-patterns-and-evaluations-for-reliable-llm-to-sql-systems-f139b4593dde) — Production reliability patterns (MEDIUM confidence)

---
*Pitfalls research for: Client-side text-to-SQL web application*
*Researched: 2026-03-22*
