# Roadmap: QueryForge

## Overview

QueryForge delivers a client-side text-to-SQL experience where non-technical users paste their database schema, add their own AI API keys, and query their data using natural language. The journey builds from foundation (schema parsing, API key management) through core AI-powered SQL generation to polish features (rate limiting).

## Phases

- [x] **Phase 1: Foundation** - Project scaffold, schema input, API key management, landing page (2026-03-22)
- [x] **Phase 2: Core Query Flow** - AI integration, SQL generation, query execution, results display (2026-03-22)
- [x] **Phase 3: Rate Limiting** - API quota tracking, enforcement, persistence across sessions (2026-03-22)

## Phase Details

### Phase 1: Foundation
**Goal**: Users can access the app, configure their AI provider API keys, and provide database schema
**Depends on**: Nothing (first phase)
**Requirements**: SCHM-01, SCHM-02, SCHM-03, SCHM-04, PROV-01, PROV-02, PROV-03, PROV-04, PROV-05, PROV-06, PROV-07, UI-01, UI-02, UI-04
**Success Criteria** (what must be TRUE):
  1. User can access polished landing page with product description
  2. User can add and manage API keys for any supported provider (NVIDIA NIM, OpenAI, Gemini, Anthropic, OpenRouter)
  3. User can select active provider from configured keys
  4. User can paste database schema and see parsed confirmation
  5. User can access clean settings page for API key management
  6. UI is responsive on desktop and tablet
**Plans**: 3/3 (01-01, 01-02, 01-03)

### Phase 2: Core Query Flow
**Goal**: Users can enter natural language questions and receive, review, execute SQL with results
**Depends on**: Phase 1
**Requirements**: QUERY-01, QUERY-02, QUERY-03, QUERY-04, QUERY-05, QUERY-06, RESL-01, RESL-02, RESL-03, RESL-04, UI-03, UI-05, UI-06
**Success Criteria** (what must be TRUE):
  1. User can enter natural language question about their data ✓
  2. User sees generated SQL with syntax highlighting before execution ✓
  3. User can copy generated SQL to clipboard ✓
  4. User must explicitly confirm SQL before execution ✓
  5. User sees loading state during AI processing ✓
  6. User sees query results displayed as formatted table ✓
  7. User can copy results to clipboard ✓
  8. User sees clear error message when query fails ✓
  9. User receives toast notifications for success/error feedback ✓
**Plans**: 3/3 (02-01, 02-02, 02-03)

### Phase 3: Rate Limiting
**Goal**: API usage is tracked and limited to prevent quota exhaustion
**Depends on**: Phase 2
**Requirements**: RATE-01, RATE-02, RATE-03, RATE-04
**Success Criteria** (what must be TRUE):
  1. User sees remaining quota display for current provider ✓
  2. System prevents API calls when quota is exhausted ✓
  3. Quota state persists across page refreshes ✓
**Plans**: 3/3 (03-01, 03-02, 03-03)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | Complete | 2026-03-22 |
| 2. Core Query Flow | 3/3 | Complete | 2026-03-22 |
| 3. Rate Limiting | 3/3 | Complete | 2026-03-22 |
