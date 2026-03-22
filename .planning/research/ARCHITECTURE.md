# Architecture Research: Text-to-SQL Web Applications

**Domain:** Browser-based text-to-SQL applications
**Project:** QueryForge
**Researched:** 2026-03-22
**Confidence:** HIGH

## Executive Summary

Text-to-SQL web applications convert natural language questions into SQL queries using LLMs. For client-side-only deployments (GitHub Pages), the architecture must handle AI provider integration, schema management, SQL generation, query validation, and result display entirely in the browser. The key architectural decisions center on separating concerns: UI layer, AI abstraction, state management, and security boundaries—with API keys staying client-side since there's no backend proxy.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           UI Layer                                    │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ SchemaInput │  │ QueryInput  │  │ ResultTable │  │ Settings  │ │
│  │   Panel     │  │   Panel     │  │   Display   │  │   Modal   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                        State Management                               │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐   │
│  │  TanStack Query     │  │  Zustand Store                      │   │
│  │  (Server State)     │  │  (Client State)                    │   │
│  │  - AI responses     │  │  - Schema text                     │   │
│  │  - Query results    │  │  - Provider configs                 │   │
│  │  - Streaming cache  │  │  - UI state                        │   │
│  └─────────────────────┘  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                       Service Layer                                  │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ AIProvider  │  │ SQLParser   │  │ RateLimiter │  │ Validator │ │
│  │ Service     │  │ Service     │  │ Service     │  │ Service   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                    Provider Abstraction Layer                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ NVIDIA  │  │ OpenAI  │  │Gemini   │  │Anthropic│  │OpenRouter│ │
│  │  NIM    │  │         │  │         │  │         │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| SchemaInputPanel | Accept and parse database schema text (DDL paste) | React textarea with syntax highlighting, validation feedback |
| QueryInputPanel | Accept natural language queries, trigger generation | React input with streaming display of LLM response |
| ResultTableDisplay | Render SQL results, generated SQL, copy functionality | React component with data grid |
| SettingsModal | Manage API keys, select provider, configure rate limits | React component with localStorage persistence |
| AIProviderService | Unified interface for all LLM providers | Adapter pattern with provider-specific implementations |
| SQLParserService | Extract SQL from LLM responses, handle formatting | Regex + parsing utilities |
| RateLimiterService | Track and throttle API calls per provider | Token bucket or sliding window algorithm |
| ValidatorService | Security checks on generated SQL (SELECT-only enforcement) | Regex patterns, AST analysis |

## Recommended Project Structure

```
queryforge/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.tsx                    # App entry point
│   ├── App.tsx                     # Root component with routing
│   │
│   ├── components/                 # Shared UI components
│   │   ├── ui/                     # Base components (Button, Input, Card)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── SchemaInput/
│   │   │   ├── SchemaInputPanel.tsx
│   │   │   └── SchemaPreview.tsx
│   │   ├── QueryInput/
│   │   │   ├── QueryInputPanel.tsx
│   │   │   └── StreamingDisplay.tsx
│   │   ├── ResultDisplay/
│   │   │   ├── ResultTable.tsx
│   │   │   ├── SQLPreview.tsx
│   │   │   └── CopyButton.tsx
│   │   └── Settings/
│   │       ├── SettingsModal.tsx
│   │       ├── ApiKeyInput.tsx
│   │       └── ProviderSelector.tsx
│   │
│   ├── services/                   # Core business logic
│   │   ├── providers/
│   │   │   ├── types.ts            # Unified provider interface
│   │   │   ├── ProviderFactory.ts  # Factory for creating providers
│   │   │   ├── NVIDIAProvider.ts
│   │   │   ├── OpenAIProvider.ts
│   │   │   ├── GeminiProvider.ts
│   │   │   ├── AnthropicProvider.ts
│   │   │   └── OpenRouterProvider.ts
│   │   ├── ai/
│   │   │   ├── AIService.ts        # Main AI orchestration
│   │   │   ├── PromptBuilder.ts    # Schema + query → prompt
│   │   │   └── ResponseParser.ts   # Extract SQL from response
│   │   ├── rateLimit/
│   │   │   ├── RateLimiter.ts      # Token bucket implementation
│   │   │   └── RateLimitConfig.ts  # Per-provider limits
│   │   └── validation/
│   │       ├── SQLValidator.ts      # SELECT-only enforcement
│   │       └── SchemaValidator.ts  # Schema parsing/validation
│   │
│   ├── stores/                     # State management
│   │   ├── useAppStore.ts          # Zustand store for client state
│   │   └── useQueryStore.ts        # TanStack Query for AI state
│   │
│   ├── hooks/                      # Shared custom hooks
│   │   ├── useAIQuery.ts           # AI generation with streaming
│   │   ├── useRateLimit.ts         # Rate limit checking
│   │   └── useLocalStorage.ts      # Secure localStorage wrapper
│   │
│   ├── lib/                        # Utilities
│   │   ├── storage.ts             # localStorage with encryption
│   │   └── constants.ts           # App constants
│   │
│   └── styles/
│       └── index.css              # Global styles (Tailwind)
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

### Structure Rationale

- **`services/providers/`:** AI abstraction layer isolated from UI, enabling easy provider additions
- **`services/`:** Business logic separated from components for testability
- **`stores/`:** Zustand for synchronous client state, TanStack Query for async server state
- **`hooks/`:** Reusable logic extracted from components for cleaner architecture
- **`components/`:** Feature-based grouping with UI components as shared primitives

## Architectural Patterns

### Pattern 1: Provider Adapter (AI Abstraction)

**What:** Unified interface over multiple LLM providers with provider-specific adapters

**When to use:** When supporting multiple AI backends with different APIs but similar functionality

**Trade-offs:**
- Pros: Easy to add providers, switch providers, compare outputs
- Cons: Abstraction may leak for provider-specific features

```typescript
// services/providers/types.ts
export interface AIProvider {
  name: string;
  generateSQL(params: GenerateParams): Promise<GenerateResult>;
  streamGenerate(params: GenerateParams, onChunk: (chunk: string) => void): Promise<void>;
}

export interface GenerateParams {
  schema: string;
  query: string;
  model?: string;
  apiKey: string;
}

export interface GenerateResult {
  sql: string;
  explanation?: string;
  tokens: number;
}

// services/providers/ProviderFactory.ts
export class ProviderFactory {
  static createProvider(type: ProviderType, apiKey: string): AIProvider {
    switch (type) {
      case 'nvidia':
        return new NVIDIAProvider(apiKey);
      case 'openai':
        return new OpenAIProvider(apiKey);
      // ... other providers
    }
  }
}
```

### Pattern 2: Streaming State with TanStack Query

**What:** Use TanStack Query mutations with streaming callbacks to handle AI responses

**When to use:** For AI features requiring real-time token display with caching/component reusability

**Trade-offs:**
- Pros: Built-in caching, loading states, error handling; integrates with UI libraries
- Cons: May be overkill for simple use cases; learning curve

```typescript
// hooks/useAIQuery.ts
export function useAIQuery() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: QueryParams) => {
      const provider = ProviderFactory.createProvider(params.provider, params.apiKey);
      
      return new Promise((resolve, reject) => {
        let fullResponse = '';
        provider.streamGenerate(params, (chunk) => {
          fullResponse += chunk;
          // Update streaming state in query cache
          queryClient.setQueryData(['stream', params.query], fullResponse);
        }).then(() => {
          resolve(parseSQLResponse(fullResponse));
        }).catch(reject);
      });
    },
    onSuccess: (data) => {
      // Clear streaming state, store final result
      queryClient.setQueryData(['stream', data.query], null);
    },
  });
}
```

### Pattern 3: Token Bucket Rate Limiting

**What:** Client-side rate limiting using token bucket algorithm per provider

**When to use:** When API providers have strict quotas and no server-side rate limiting is possible

**Trade-offs:**
- Pros: Effective quota protection, handles bursts gracefully
- Cons: Client-side only—sophisticated users can bypass; state lost on refresh

```typescript
// services/rateLimit/RateLimiter.ts
export class TokenBucketRateLimiter {
  private buckets: Map<string, { tokens: number; lastRefill: number }>;
  
  constructor(
    private capacity: number,
    private refillRate: number // tokens per second
  ) {
    this.buckets = new Map();
  }
  
  async acquire(key: string): Promise<boolean> {
    const bucket = this.getBucket(key);
    this.refill(bucket);
    
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    return false;
  }
  
  private getBucket(key: string) {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, { tokens: this.capacity, lastRefill: Date.now() });
    }
    return this.buckets.get(key)!;
  }
  
  private refill(bucket: { tokens: number; lastRefill: number }) {
    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000;
    const refillAmount = elapsed * this.refillRate;
    bucket.tokens = Math.min(this.capacity, bucket.tokens + refillAmount);
    bucket.lastRefill = now;
  }
}
```

### Pattern 4: SQL Security Validation

**What:** Multi-layer validation to prevent dangerous SQL execution

**When to use:** When executing user-generated SQL against any database

**Trade-offs:**
- Pros: Defense in depth; catches common attack patterns
- Cons: No absolute guarantee; determined attacker may find bypasses

```typescript
// services/validation/SQLValidator.ts
export class SQLValidator {
  private readonly FORBIDDEN_PATTERNS = [
    /\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|MERGE)\b/i,
    /\b(EXEC|EXECUTE|GRANT|REVOKE)\b/i,
    /--/,
    /;\s*\w+/,
  ];
  
  validate(sql: string): ValidationResult {
    const errors: string[] = [];
    
    // Layer 1: Pattern matching
    for (const pattern of this.FORBIDDEN_PATTERNS) {
      if (pattern.test(sql)) {
        errors.push(`Forbidden pattern detected: ${pattern}`);
      }
    }
    
    // Layer 2: Must start with SELECT
    const trimmed = sql.trim().toUpperCase();
    if (!trimmed.startsWith('SELECT')) {
      errors.push('Query must start with SELECT');
    }
    
    // Layer 3: AST validation (if sql-parser available)
    try {
      const ast = parse(sql);
      if (!this.validateAST(ast)) {
        errors.push('Invalid SQL structure');
      }
    } catch {
      errors.push('SQL parse error');
    }
    
    return { valid: errors.length === 0, errors };
  }
}
```

## Data Flow

### Query Generation Flow

```
[User enters natural language query]
              ↓
[QueryInputPanel] → [useAIQuery hook]
              ↓
[RateLimiter check] → [if limited, show warning, block]
              ↓
[PromptBuilder] → Combines schema + query into prompt
              ↓
[ProviderFactory] → Creates provider instance
              ↓
[AI Provider] → Streams response tokens
              ↓
[StreamingDisplay] → Updates UI in real-time
              ↓
[ResponseParser] → Extracts SQL from response
              ↓
[SQLValidator] → Security checks
              ↓
[ResultTable] → Displays results
              ↓
[CopyButton] → Clipboard export
```

### Schema Configuration Flow

```
[User pastes DDL in SchemaInputPanel]
              ↓
[SchemaValidator] → Parse and validate schema structure
              ↓
[useAppStore] → Persist to Zustand state
              ↓
[localStorage] → Encrypted backup for session persistence
```

### API Key Configuration Flow

```
[User enters API key in SettingsModal]
              ↓
[Encrypted localStorage storage] → Secure key storage
              ↓
[useAppStore] → Provider selection and key reference
              ↓
[ProviderFactory] → Retrieves key when making API calls
```

## Component Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| UI Components ↔ Services | React hooks | Components don't call providers directly |
| Services ↔ Providers | TypeScript interfaces | Abstractions hide provider differences |
| State ↔ Storage | Zustand actions | LocalStorage wrapped with encryption |
| Rate Limiter ↔ AI Service | Promise-based acquire | Non-blocking when limited |

## Security Boundaries

### API Key Handling (Client-Side Only)

Since this is a client-side-only application, API keys are:
- **Entered by users** for their own provider accounts
- **Stored in localStorage** with encryption
- **Never transmitted** except directly to respective providers
- **Never exposed** to third parties or logged

```typescript
// lib/storage.ts
import { encrypt, decrypt } from './crypto';

const STORAGE_KEY = 'queryforge_secrets';

export function saveApiKey(provider: string, key: string): void {
  const encrypted = encrypt(key);
  const secrets = getSecrets();
  secrets[provider] = encrypted;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(secrets));
}

export function getApiKey(provider: string): string | null {
  const secrets = getSecrets();
  const encrypted = secrets[provider];
  return encrypted ? decrypt(encrypted) : null;
}
```

### SQL Execution Boundary

- Generated SQL is **displayed for review** before execution
- Validation ensures **SELECT-only** queries
- Results are **client-side only** (no server transmission)
- No query history is persisted

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|-------------------------|
| 0-100 users | Single-page React app, localStorage for keys, client-side rate limiting |
| 100-1K users | Add persistent rate limit state via BroadcastChannel for multi-tab sync |
| 1K-10K users | Consider IndexedDB for better storage performance |
| 10K+ users | Would require backend migration; current architecture insufficient |

### Scaling Bottlenecks

1. **Rate limit state loss on refresh:** Mitigate with IndexedDB persistence
2. **Schema parsing in memory:** Large schemas may cause performance issues; implement virtualized display
3. **Streaming response handling:** Ensure React 18 concurrent features properly cancel streams on unmount

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct Provider Calls in Components

**What people do:** Calling `fetch()` directly in React components for AI APIs

**Why it's wrong:** Violates separation of concerns; makes provider switching difficult; no centralized error handling

**Do this instead:** Use the `AIService` abstraction with hooks

### Anti-Pattern 2: Storing Unencrypted API Keys

**What people do:** `localStorage.setItem('apiKey', key)`

**Why it's wrong:** Any XSS vulnerability exposes keys; not compliant with security best practices

**Do this instead:** Use encryption wrapper before localStorage

### Anti-Pattern 3: Blocking Rate Limiting

**What people do:** `while (!canProceed()) await sleep(1000)`

**Why it's wrong:** Blocks UI thread; poor UX; may cause browser warnings

**Do this instead:** Non-blocking check with user-visible countdown and disabled state

### Anti-Pattern 4: Executing SQL Without Validation

**What people do:** Running LLM output directly without security checks

**Why it's wrong:** SQL injection risk; destructive queries could execute

**Do this instead:** Multi-layer validation with SELECT-only enforcement

## Build Order Dependencies

For optimal development flow:

```
1. Project scaffold (Vite + React + TypeScript)
   ↓
2. UI component library (Button, Input, Card primitives)
   ↓
3. State management setup (Zustand store, TanStack Query)
   ↓
4. Storage utilities (encrypted localStorage)
   ↓
5. Provider abstraction layer (types, factory, one provider)
   ↓
6. Core AI service (prompt building, response parsing)
   ↓
7. Rate limiter service
   ↓
8. SQL validator service
   ↓
9. UI panels (SchemaInput, QueryInput, ResultDisplay)
   ↓
10. Settings modal
    ↓
11. Additional providers
    ↓
12. Polish (animations, error states, edge cases)
```

**Critical path:** Steps 4-8 form the core services that UI components depend on. Build and test each service independently before integrating.

## Sources

- [AWS Generative AI Atlas - Text-to-SQL Architecture](https://awslabs.github.io/generative-ai-atlas/topics/3_0_architecture_and_design_patterns/3_1_system_and_application_design_patterns_for_genai/3_1_2_architecture_patterns_by_application_type/3_1_2_4_data_insight_architecture/3_1_2_4_1_text_to_sql_application/3_1_2_4_1_text_to_sql_application.html) (HIGH)
- [Vercel AI SDK - Unified Provider Architecture](https://github.com/vercel-labs/ai) (HIGH)
- [TanStack AI - Streaming Patterns](https://tanstack.com/ai/latest/docs/guides/streaming) (HIGH)
- [core-ai - Type-safe LLM Abstraction](https://github.com/agdevhq/core-ai) (HIGH)
- [Enterprise Text-to-SQL Patterns - Towards AI](https://pub.towardsai.net/building-production-text-to-sql-for-70-000-tables-openais-data-agent-architecture-bcd695990d55) (MEDIUM)
- [3-Layer AST SQL Validator - Towards AI](https://pub.towardsai.net/how-i-built-a-production-ai-query-engine-on-28-tables-and-why-i-used-both-text-to-sql-and-function-calling-5794d407d6ab) (MEDIUM)
- [React + AI Patterns 2026 - Level Up Coding](https://levelup.gitconnected.com/react-ai-building-intelligent-web-applications-in-2026-6d412830f705) (MEDIUM)
- [Token Storage Security - ZamDev](https://tools.zamdevai.com/blog/stop-storing-jwts-in-localstorage) (MEDIUM)

---
*Architecture research for: QueryForge text-to-SQL application*
*Researched: 2026-03-22*
