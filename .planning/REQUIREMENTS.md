# Requirements: QueryForge

**Defined:** 2026-03-22
**Core Value:** Non-technical users can explore and understand their own database data without writing SQL or installing software.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Schema Input

- [ ] **SCHM-01**: User can paste database schema (DDL output, structure description)
- [ ] **SCHM-02**: System parses and validates pasted schema format
- [ ] **SCHM-03**: System displays parsed schema for user confirmation
- [ ] **SCHM-04**: System handles common SQL dialects (PostgreSQL, MySQL, SQLite)

### AI Provider Configuration

- [ ] **PROV-01**: User can add and manage API keys for NVIDIA NIM
- [ ] **PROV-02**: User can add and manage API keys for OpenAI
- [ ] **PROV-03**: User can add and manage API keys for Google Gemini
- [ ] **PROV-04**: User can add and manage API keys for Anthropic
- [ ] **PROV-05**: User can add and manage API keys for OpenRouter
- [ ] **PROV-06**: User can select active provider from configured keys
- [ ] **PROV-07**: API keys stored securely in localStorage with warning

### Query Processing

- [ ] **QUERY-01**: User can enter natural language question about their data
- [ ] **QUERY-02**: System sends question + schema to selected AI provider
- [ ] **QUERY-03**: System displays generated SQL query for user review
- [ ] **QUERY-04**: User confirms SQL before execution
- [ ] **QUERY-05**: System executes confirmed SQL query (client-side via SQL.js)
- [ ] **QUERY-06**: System displays query results in table format

### Results & Export

- [ ] **RESL-01**: Query results displayed as formatted table
- [ ] **RESL-02**: User can copy results to clipboard
- [ ] **RESL-03**: User can copy generated SQL to clipboard
- [ ] **RESL-04**: Error messages displayed clearly when query fails

### Rate Limiting

- [ ] **RATE-01**: System tracks API calls per provider
- [ ] **RATE-02**: System displays remaining quota for current provider
- [ ] **RATE-03**: System prevents calls when quota exhausted
- [ ] **RATE-04**: Rate limit state persists across page refreshes

### UI/UX

- [ ] **UI-01**: Polished SAAS-style landing page with product description
- [ ] **UI-02**: Clean settings page for API key management
- [ ] **UI-03**: Main query interface with schema, question, SQL, results panels
- [ ] **UI-04**: Responsive design for desktop and tablet
- [ ] **UI-05**: Loading states during AI processing
- [ ] **UI-06**: Toast notifications for success/error feedback

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Query Enhancement

- **EXPL-01**: System explains what the generated SQL does
- **EXPL-02**: System provides query optimization suggestions

### Multi-Turn

- **TURN-01**: User can ask follow-up questions referencing previous query
- **TURN-02**: System maintains conversation context

### Templates

- **TEMP-01**: Pre-built query templates for common operations

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Direct database connections (credentials) | Security concerns, added complexity |
| Query history persistence | GitHub Pages static hosting, client-only |
| Export to files (CSV, JSON) | Copy to clipboard sufficient for v1 |
| Multi-query execution | Keep v1 simple, single query at a time |
| Schema visualization | Nice-to-have, defer to v2 |
| Real-time collaboration | Out of scope for initial release |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCHM-01 | 1 - Foundation | Pending |
| SCHM-02 | 1 - Foundation | Pending |
| SCHM-03 | 1 - Foundation | Pending |
| SCHM-04 | 1 - Foundation | Pending |
| PROV-01 | 1 - Foundation | Pending |
| PROV-02 | 1 - Foundation | Pending |
| PROV-03 | 1 - Foundation | Pending |
| PROV-04 | 1 - Foundation | Pending |
| PROV-05 | 1 - Foundation | Pending |
| PROV-06 | 1 - Foundation | Pending |
| PROV-07 | 1 - Foundation | Pending |
| QUERY-01 | 2 - Core Query Flow | Pending |
| QUERY-02 | 2 - Core Query Flow | Pending |
| QUERY-03 | 2 - Core Query Flow | Pending |
| QUERY-04 | 2 - Core Query Flow | Pending |
| QUERY-05 | 2 - Core Query Flow | Pending |
| QUERY-06 | 2 - Core Query Flow | Pending |
| RESL-01 | 2 - Core Query Flow | Pending |
| RESL-02 | 2 - Core Query Flow | Pending |
| RESL-03 | 2 - Core Query Flow | Pending |
| RESL-04 | 2 - Core Query Flow | Pending |
| RATE-01 | 3 - Rate Limiting | Pending |
| RATE-02 | 3 - Rate Limiting | Pending |
| RATE-03 | 3 - Rate Limiting | Pending |
| RATE-04 | 3 - Rate Limiting | Pending |
| UI-01 | 1 - Foundation | Pending |
| UI-02 | 1 - Foundation | Pending |
| UI-03 | 2 - Core Query Flow | Pending |
| UI-04 | 1 - Foundation | Pending |
| UI-05 | 2 - Core Query Flow | Pending |
| UI-06 | 2 - Core Query Flow | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after roadmap creation (traceability updated)*
