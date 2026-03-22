# Stack Research

**Domain:** Text-to-SQL web application (client-side only, GitHub Pages hosted)
**Researched:** 2026-03-22
**Confidence:** HIGH (verified with Context7, official docs, and recent web search)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **SvelteKit** | 5.x | Application framework | Compiler-first approach produces smallest bundles (~5KB runtime vs React's ~46KB). Native GitHub Pages adapter via `@sveltejs/adapter-static`. Active development, 180 contributors. |
| **Svelte** | 5.x | UI components | Compile-time reactivity, no virtual DOM. 47KB gzipped for full app vs React's 156KB. Runes ($state, $derived) provide explicit reactivity. |
| **Tailwind CSS** | 4.x | Styling | Utility-first, minimal runtime. Native integration with SvelteKit. shadcn-svelte uses it. |
| **Vite** | 6.x | Build tool | Standard for SvelteKit. Fast HMR, optimized production builds. |

### AI Provider Integration

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Vercel AI SDK** | 6.x | Multi-provider AI abstraction | Unified API for 15+ providers. Single-line model switching. Streaming support. Works client-side. Supports OpenAI, Anthropic, Google, and **NVIDIA NIM via OpenAI-compatible endpoint** (`https://integrate.api.nvidia.com/v1`). |
| **OpenAI SDK** | 6.32.x | Direct API access (fallback) | 13.7M weekly downloads. Can be used directly with NVIDIA NIM's OpenAI-compatible API. Smaller bundle (34.3KB gzipped) than Vercel AI SDK. |

**NVIDIA NIM Integration Path:**
```typescript
import { createOpenAI } from '@ai-sdk/openai';

const nvidia = createOpenAI({
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY, // User provides their own key
});

// Models: meta/llama-3.3-70b-instruct, deepseek-ai/deepseek-v3, etc.
```

### SQL Parsing & Validation

| Library | Version | Purpose | Why Recommended |
|---------|---------|---------|-----------------|
| **@guanmingchiu/sqlparser-ts** | 0.61.x | SQL parsing, validation, formatting | WASM-based (Rust + WebAssembly), browser-compatible, ~600KB gzipped. Supports 14 SQL dialects including PostgreSQL, MySQL, SQLite, BigQuery. No native dependencies. Active development (Apache Airflow integration Feb 2026). |
| **node-sql-parser** | 5.4.x | Alternative parser | Larger bundle but 180+ releases, 10M+ weekly downloads. Browser-compatible UMD build available. |

### Rate Limiting

| Approach | Implementation | Why Recommended |
|----------|---------------|-----------------|
| **Token Bucket (custom)** | In-browser implementation with localStorage persistence | Sliding Window Counter is industry standard, but Token Bucket better for burst control (NVIDIA quota protection). Custom implementation avoids dependency for this simple use case. |
| **Per-Provider Tracking** | Store request counts per provider in localStorage | Each provider has different rate limits. Track separately to prevent one provider's usage affecting others. |

**Recommended Token Bucket Config for NVIDIA NIM:**
```typescript
interface RateLimitConfig {
  maxRequests: 30;      // NVIDIA NIM default limit
  windowMs: 60_000;     // 1 minute window
  refillRate: 0.5;      // 1 token per 2 seconds
}
```

### API Key Storage

| Approach | Security Level | Recommendation |
|----------|---------------|----------------|
| **localStorage (plain)** | LOW | NOT recommended for API keys |
| **sessionStorage** | LOW-MEDIUM | Slightly better (cleared on tab close) |
| **localStorage + encryption** | MEDIUM | Use Web Crypto API with user-derived key |
| **IndexedDB + encryption** | MEDIUM-HIGH | Better for larger datasets |

**For client-side only apps, API keys in browser are inherently exposed to XSS.** Best mitigations:
1. Use short-lived keys if provider supports
2. Warn users about security implications
3. Implement CSP headers where possible
4. Consider browser extension security (keys visible to all extensions)

### UI Components

| Library | Purpose | Why Recommended |
|---------|---------|-----------------|
| **shadcn-svelte** | 1.1.x | Copy-paste component library (same philosophy as shadcn/ui). Built on Bits UI primitives, Tailwind CSS, fully accessible. Official Svelte 5 + Tailwind v4 support. 180 contributors. |
| **Bits UI** | 2.x | Headless UI primitives powering shadcn-svelte. WAI-ARIA compliant. |

---

## Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **zod** | 3.x | Schema validation | Validate user inputs, API responses, schema parsing. Industry standard for TypeScript. |
| **marked** | 15.x | Markdown parsing | Render AI-generated explanations. Lightweight alternative to full remark ecosystem. |
| **highlight.js** | 11.x | Syntax highlighting | Highlight generated SQL in output. 400+ language support. |
| **@tanstack/svelte-query** | 5.x | Data fetching | If async data patterns needed. Otherwise Svelte stores suffice. |

---

## Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **TypeScript** | Type safety | Non-negotiable for AI integrations (streaming responses, tool calls). |
| **ESLint + svelte-check** | Linting | Catch errors early. SvelteKit includes pre-configured options. |
| **Vitest** | Testing | Native Svelte testing support. Lighter than Jest. |
| **Playwright** | E2E testing | Browser automation for GitHub Pages deployment verification. |

---

## Installation

```bash
# Core framework
npm create svelte@latest queryforge -- --template minimal --types ts
cd queryforge
npm install

# Static site adapter for GitHub Pages
npm install -D @sveltejs/adapter-static

# AI integration
npm install ai @ai-sdk/openai @anthropic-ai/sdk @google/generative-ai

# SQL parsing (WASM)
npm install @guanmingchiu/sqlparser-ts

# UI components
npm install -D tailwindcss@4 @tailwindcss/vite
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button card dialog input textarea table

# Utilities
npm install zod marked highlight.js

# Testing
npm install -D vitest playwright @playwright/test
```

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Frontend** | Svelte 5 | React 19 | React's ~156KB bundle vs Svelte's ~47KB is significant for client-side only app. React Compiler doesn't change baseline size. |
| **Frontend** | Svelte 5 | Vue 4 | Vue's ~89KB bundle is reasonable but Svelte's compiler-first approach wins on bundle size. Vue Vapor Mode still in beta mid-2026. |
| **AI SDK** | Vercel AI SDK | LangChain JS | LangChain has 50+ providers but 500KB+ bundle. Vercel AI SDK's 19.5KB (OpenAI provider) is more appropriate for static site. |
| **AI SDK** | Vercel AI SDK | Direct OpenAI SDK | Direct SDK is smaller but requires more code for multi-provider. Vercel AI SDK provides unified interface. |
| **SQL Parser** | sqlparser-ts | node-sql-parser | node-sql-parser has more downloads but sqlparser-ts has WASM for better performance and newer development. |
| **UI Library** | shadcn-svelte | DaisyUI | DaisyUI has 35 themes and more installs, but shadcn-svelte provides accessible Radix-based primitives with better customization. |
| **Build** | Vite | webpack | Vite is standard for SvelteKit, faster builds, better tree-shaking. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Next.js** | Requires Node.js server for SSR. GitHub Pages can't host it. | SvelteKit with adapter-static |
| **Nuxt** | Vue-based, larger bundle than SvelteKit equivalent. | SvelteKit |
| **Express/Server-side anything** | GitHub Pages is static-only. No backend. | Pure client-side alternatives |
| **LocalStorage for unencrypted secrets** | XSS can exfiltrate API keys. | Encrypt with Web Crypto API or accept risk with clear user warning |
| **LangChain JS** | 500KB+ bundle size. Overkill for simple text-to-SQL use case. | Vercel AI SDK or direct provider SDKs |
| **Full JQuery/old frameworks** | Unnecessary weight. Modern vanilla JS covers everything needed. | Svelte or vanilla Web APIs |

---

## Stack Patterns by Variant

**If hosting on GitHub Pages (static):**
- SvelteKit + adapter-static (RECOMMENDED)
- Client-side AI SDK calls
- localStorage for API keys (with user warning)

**If hosting on Vercel (serverless):**
- SvelteKit + Vercel adapter
- Server-side AI SDK calls (keys never exposed to client)
- Vercel KV for rate limiting
- httpOnly cookies possible for API keys

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| svelte@5 | @sveltejs/kit@2 | Required. Svelte 5 runes syntax. |
| svelte@5 | shadcn-svelte@1.x | Official Svelte 5 support as of Jan 2026 |
| Tailwind CSS 4 | Vite 6 | Use @tailwindcss/vite plugin |
| Vercel AI SDK 6 | Node.js 18+ | Edge runtime support required for streaming |
| @guanmingchiu/sqlparser-ts | Vite 6 | Exclude from optimizeDeps in vite.config.ts |
| shadcn-svelte | Bits UI 2.x | Required peer dependency |

---

## NVIDIA NIM Specific Configuration

NVIDIA NIM provides OpenAI-compatible API at `https://integrate.api.nvidia.com/v1`.

**Rate limits vary by model:**
- Default: 30 requests/minute
- Some models: 10 requests/minute
- Enterprise: Higher limits available

**Models available for text-to-SQL:**
- `meta/llama-3.3-70b-instruct` - Good general SQL generation
- `deepseek-ai/deepseek-v3` - Strong reasoning capabilities
- `nvidia/llama-3.1-nemotron-70b-instruct` - NVIDIA optimized

---

## Sources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs) — Multi-provider architecture, streaming, provider switching
- [SvelteKit Adapter Static](https://svelte.dev/docs/kit/adapter-static) — GitHub Pages deployment
- [sqlparser-ts GitHub](https://github.com/guan404ming/sqlparser-ts) — WASM SQL parser, 14 dialects, browser support
- [shadcn-svelte GitHub](https://github.com/huntabyte/shadcn-svelte) — 180 contributors, Svelte 5 support
- [Svelte 5 vs React 19 Performance](https://javascript.plainenglish.io/svelte-5-vs-react-19-performance-myths-vs-production-reality-977a83e59eca) — Bundle size benchmarks
- [NVIDIA NIM API](https://docs.api.nvidia.com/nim/docs/introduction) — OpenAI-compatible endpoint documentation
- [Rate Limiting Algorithms](https://bytebytego.com/courses/system-design-interview/design-a-rate-limiter) — Token bucket vs sliding window comparison
- [Web Storage Security](https://trevorlasn.com/blog/the-problem-with-local-storage) — Why localStorage is risky for secrets

---
*Stack research for: QueryForge text-to-SQL web application*
*Researched: 2026-03-22*
