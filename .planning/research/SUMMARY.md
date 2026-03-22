# Project Research Summary

**Project:** QueryForge
**Domain:** Text-to-SQL web application (client-side only, GitHub Pages hosted, BYOK model)
**Researched:** 2026-03-22
**Confidence:** HIGH

## Executive Summary

QueryForge is a client-side text-to-SQL web application that converts natural language queries into SQL using LLMs, executed via WebAssembly in the browser. The product uses a **BYOK (Bring Your Own Key)** model where users provide their own API keys for AI providers, differentiating it from server-side competitors. The recommended stack is **SvelteKit 5.x** (compiler-first, ~5KB runtime vs React's ~46KB) with **@sveltejs/adapter-static** for GitHub Pages deployment, **Vercel AI SDK** for multi-provider abstraction (OpenAI, Anthropic, Google, NVIDIA NIM via OpenAI-compatible endpoint), and **sqlparser-ts** WASM for SQL parsing and validation.

The core challenge is that LLMs generate **syntactically valid but semantically wrong SQL** — queries that run without errors but produce quietly incorrect results. This makes user-facing SQL display before execution non-negotiable. Security is also paramount: prompt-to-SQL injection, API key exposure via XSS, and destructive SQL execution must be prevented at multiple layers.

Recommended development phases: (1) Foundation with project scaffold, API key management, and schema parsing; (2) Core AI integration with SQL generation, security validation, and multi-provider support; (3) Polish with rate limiting, UX refinements, and multi-turn conversations.

## Key Findings

### Recommended Stack

**Framework:** SvelteKit 5.x with adapter-static for GitHub Pages deployment. Svelte's compiler-first approach produces ~47KB gzipped vs React's ~156KB — critical for client-side-only apps. Native static adapter with 180+ contributors.

**AI Integration:** Vercel AI SDK 6.x provides unified interface for 15+ providers with streaming support. NVIDIA NIM integrates via OpenAI-compatible endpoint (`https://integrate.api.nvidia.com/v1`). Fallback to direct OpenAI SDK (34.3KB) if needed.

**SQL Processing:** @guanmingchiu/sqlparser-ts (WASM-based, ~600KB gzipped) for parsing, validating, and formatting SQL in 14 dialects. Browser-compatible, no native dependencies.

**UI Components:** shadcn-svelte 1.1.x with Bits UI 2.x for accessible Radix-based primitives, Tailwind CSS 4.x for styling.

**Core technologies:**
- **SvelteKit 5.x**: Application framework — smallest bundle size, native GitHub Pages adapter
- **Vercel AI SDK 6.x**: Multi-provider AI abstraction — unified API, streaming, provider switching
- **sqlparser-ts**: SQL parsing/validation — WASM-based, browser-compatible, 14 dialects
- **shadcn-svelte + Bits UI**: UI primitives — accessible, Tailwind-based, Svelte 5 compatible
- **Token Bucket (custom)**: Rate limiting — better burst control for NVIDIA quota protection

### Expected Features

**Must have (table stakes):**
- Schema paste input — users paste DDL; parsed into structured format for LLM context
- NL to SQL generation — LLM converts natural language + schema → SQL for specified dialect
- SQL display with syntax highlighting + copy — users must review before execution
- Query execution — client-side WASM (SQL.js or sqlparser-ts); results in table format
- Result display + copy — show results; one-click clipboard export
- Multi-provider support — OpenAI, Anthropic, Google, NVIDIA NIM; user provides own keys
- Rate limiting UX — quota display, pre-flight cost estimate, block on exhaustion
- Polished SAAS UI — landing page, settings (API keys), professional appearance

**Should have (competitive differentiators):**
- Query explanation — plain English summary of generated SQL below the SQL block
- Query feedback — thumbs up/down per query; localStorage session log
- Multi-turn conversations — follow-up questions carry context; session-persistent
- Pre-built templates — 5-10 example questions with demo schema

**Defer (v2+):**
- Schema visualization — ER-style table/column cards
- Smart schema parsing — auto-detect format (pg_dump, MySQL export)
- Progressive schema disclosure — surface relevant tables based on query keywords
- Prompt injection protection — sandboxing for malicious schema input

### Architecture Approach

The application follows a layered architecture: **UI Layer** (SchemaInput, QueryInput, ResultTable, Settings panels) → **State Management** (Zustand for client state, TanStack Query for async AI state) → **Service Layer** (AIProvider, SQLParser, RateLimiter, Validator services) → **Provider Abstraction Layer** (NVIDIA NIM, OpenAI, Gemini, Anthropic, OpenRouter adapters).

Key patterns: **Provider Adapter** for multi-provider abstraction (easy to add/switch providers), **Streaming State** with TanStack Query mutations (real-time token display with caching), **Token Bucket Rate Limiting** per provider (quota protection with burst handling), **Multi-layer SQL Security Validation** (SELECT-only enforcement via AST analysis).

Critical security boundaries: API keys stay client-side with encryption wrapper; generated SQL validated before execution; no destructive operations permitted.

### Critical Pitfalls

1. **Quietly Wrong Results** — Syntactically valid SQL that runs but produces incorrect data. Users act on wrong decisions with no error signal. **Prevention:** Always display generated SQL for review before execution; add confirmation step; implement sanity checks on results.

2. **Prompt-to-SQL Injection** — Malicious instructions in user queries that manipulate LLM output to generate destructive SQL. **Prevention:** Multi-layer validation: AST parsing rejects non-SELECT queries, forbidden pattern matching, SELECT-only enforcement.

3. **API Key Exposure** — Keys stored insecurely (plain localStorage) accessible to XSS attacks. **Prevention:** Use sessionStorage or encrypted localStorage; implement CSP headers; never log keys; add "clear all keys" functionality.

4. **Rate Limit Without Recovery** — Users hit quota, see generic error, lose context, abandon or retry blindly. **Prevention:** Token bucket with per-provider tracking; show remaining quota; display clear retry-after guidance; implement request queuing.

5. **Schema Hallucination** — LLM generates SQL referencing non-existent tables/columns from pasted schema. **Prevention:** Parse schema into structured format before prompts; validate all references against parsed schema; include only relevant tables in context.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation
**Rationale:** All downstream features depend on schema parsing and secure API key storage. Must establish security baseline before any AI integration.

**Delivers:**
- Project scaffold (SvelteKit 5.x, Tailwind 4.x, TypeScript)
- UI component primitives (Button, Input, Card, Dialog)
- Encrypted API key storage (sessionStorage/localStorage + Web Crypto)
- Schema parsing and validation (DDL → structured format)
- Schema preview display

**Addresses:** Features — schema paste input. Pitfalls — API key exposure, schema parsing failures.

### Phase 2: Core AI Integration
**Rationale:** The value proposition. Must get working SQL generation with security validation before user-facing launch.

**Delivers:**
- AI provider abstraction layer (types, factory, NVIDIA NIM adapter)
- Prompt builder (schema + query → structured prompt)
- Response parser (extract SQL from streaming response)
- SQL validation (SELECT-only, AST analysis, forbidden patterns)
- Query execution (client-side WASM)
- Result display (table, SQL preview, copy buttons)
- SQL syntax highlighting (highlight.js)

**Addresses:** Features — NL to SQL generation, SQL display, query execution, result display, multi-provider support. Pitfalls — quietly wrong results, prompt-to-SQL injection, schema hallucination, missing/wrong joins.

### Phase 3: Polish & Scale
**Rationale:** Rate limiting protects users from quota exhaustion; polish features differentiate from competitors.

**Delivers:**
- Token bucket rate limiter (per-provider tracking)
- Quota display UX (remaining requests, cost estimates)
- Settings modal (provider selection, API key management)
- Polished UI (landing page, error states, loading states)
- Multi-turn conversations (session-based context)
- Query feedback mechanism (thumbs up/down)

**Addresses:** Features — rate limiting UX, query explanation, query feedback, multi-turn conversations, pre-built templates. Pitfalls — rate limit without recovery.

### Phase Ordering Rationale

- **Phase 1 before 2:** Schema parsing output feeds directly into AI prompts. Without parsing, no structured context for generation. API key security must be established before provider integration.
- **Phase 2 before 3:** SQL generation is the core value prop. Rate limiting wraps generation calls but doesn't depend on their internal implementation. Polish features enhance existing working functionality.
- **Security validation is Phase 2, not Phase 3:** PITFALLS.md explicitly maps prompt-to-SQL injection prevention to Phase 2. Must not launch with security gaps.
- **Rate limiting in Phase 3:** Rate limiting wraps AI calls but requires provider abstraction first (Phase 2). Quota tracking needs provider-specific limit configurations.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Schema Parsing):** Schema formats vary widely (pg_dump, MySQL SHOW CREATE, IDE exports). May need format detection research if supporting multiple input styles.
- **Phase 2 (SQL Validation):** AST-based validation with sqlparser-ts. Verify browser WASM compatibility, error handling, and performance with complex queries.

Phases with standard patterns (skip research-phase):
- **Phase 1 (Project Scaffold):** SvelteKit + adapter-static is well-documented. Vite ecosystem has established patterns.
- **Phase 2 (AI Provider Abstraction):** Vercel AI SDK patterns are documented. NVIDIA NIM OpenAI-compatible endpoint is straightforward.
- **Phase 3 (Rate Limiting):** Token bucket is well-understood. Client-side implementation patterns are established.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified with Context7, official docs (SvelteKit adapter-static, Vercel AI SDK), and recent web search. Bundle size benchmarks from March 2026. |
| Features | MEDIUM-HIGH | Competitor analysis done (AI2SQL, Text2SQL.ai, Vanna.ai). Market sources are current but some are vendor-marketing. MVP definition is opinionated but reasonable. |
| Architecture | HIGH | Patterns from AWS Generative AI Atlas, Vercel AI SDK, TanStack AI docs. Build order from architecture research is well-grounded. |
| Pitfalls | MEDIUM-HIGH | Sources include Google Cloud (authoritative), real-world CVE analysis, and multiple community posts. Client-side specifics less documented but well-reasoned. |

**Overall confidence:** HIGH

### Gaps to Address

- **SQL dialect nuances:** Research assumes dialect detection works. Need to verify sqlparser-ts handles edge cases for PostgreSQL vs MySQL syntax differences during Phase 1 planning.
- **NVIDIA NIM rate limits:** Specific limits (30 req/min default) from API docs but enterprise tier limits unclear. May need to add dynamic limit detection.
- **Schema size limits:** No research on practical schema size limits for LLM context windows. Need to validate with 50-table, 100-table, 500-table schemas during Phase 1.
- **Multi-provider response normalization:** OpenRouter response formats may vary. Phase 2 planning should include response shape validation.

## Sources

### Primary (HIGH confidence)
- [SvelteKit Adapter Static](https://svelte.dev/docs/kit/adapter-static) — GitHub Pages deployment
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs) — Multi-provider architecture, streaming
- [NVIDIA NIM API](https://docs.api.nvidia.com/nim/docs/introduction) — OpenAI-compatible endpoint
- [AWS Generative AI Atlas - Text-to-SQL](https://awslabs.github.io/generative-ai-atlas/) — Architecture patterns
- [sqlparser-ts GitHub](https://github.com/guan404ming/sqlparser-ts) — WASM SQL parser
- [The Six Failures of Text-to-SQL - Google Cloud](https://medium.com/google-cloud/the-six-failures-of-text-to-sql-and-how-to-fix-them-with-agents-ef5fd2b74b68) — Critical pitfalls

### Secondary (MEDIUM confidence)
- [Svelte 5 vs React 19 Performance](https://javascript.plainenglish.io/svelte-5-vs-react-19-performance-myths-vs-production-reality-977a83e59eca) — Bundle size benchmarks
- [shadcn-svelte GitHub](https://github.com/huntabyte/shadcn-svelte) — 180 contributors, Svelte 5 support
- [Rate Limiting Algorithms - ByteByteGo](https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter) — Token bucket vs sliding window
- [Text-to-SQL AI Failures & Fixes - August Infotech](https://www.augustinfotech.com/blogs/text-to-sql-ai-failures-vs-fixes-a-short-guide/) — Common error patterns

### Tertiary (LOW confidence)
- [Prompt-to-SQL Injection CVE - DEV Community](https://dev.to/aviral_srivastava_ba4f282/) — Real-world security case study (needs validation in production context)
- [Text2SQL.ai 2025 Guide](https://text2sql.ai/) — Security and API comparisons (vendor-marketing, verify independently)

---
*Research completed: 2026-03-22*
*Ready for roadmap: yes*
