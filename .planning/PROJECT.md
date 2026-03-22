# QueryForge

## What This Is

A browser-based text-to-SQL agent that connects to user-provided AI API keys to help users query their databases using natural language. Users provide their own database schema (via paste), add their own API keys for AI providers, and ask questions in plain English—QueryForge generates and executes SQL queries.

## Core Value

Non-technical users can explore and understand their own database data without writing SQL or installing software.

## Requirements

### Active

- [ ] User can paste database schema (structure output) for any SQL database
- [ ] User can configure API keys for multiple providers (NVIDIA NIM, OpenAI, Google Gemini, Anthropic, OpenRouter)
- [ ] User can ask questions in plain English about their data
- [ ] System generates SQL query from natural language
- [ ] System executes query and displays results
- [ ] System shows generated SQL for transparency
- [ ] User can copy results to clipboard
- [ ] UI has polished SAAS appearance (landing page, settings, result display)
- [ ] Rate limiting to prevent excessive API calls (NVIDIA quota protection)

### Out of Scope

- Direct database connections (credentials, security) — users paste schema only
- Query history persistence — session-only
- Multiple query execution — single query at a time
- Export to files — copy to clipboard only

## Context

- Hosted on GitHub Pages (static site, no backend server)
- Must work entirely client-side
- NVIDIA NIM as primary model provider with rate limiting
- Multiple provider fallback for flexibility

## Constraints

- **Tech**: Static site (GitHub Pages) — no server-side code
- **Security**: API keys stored in localStorage only, never transmitted except to respective providers
- **Rate Limit**: NVIDIA API calls limited to prevent quota exhaustion
- **Browser**: Modern browsers only (ES2020+)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Schema via paste | Avoids credential security concerns | — Pending |
| Client-side only | GitHub Pages hosting requirement | — Pending |
| Rate limiting | Protect NVIDIA quota | — Pending |

---
*Last updated: 2026-03-22 after initialization*
