import { Provider, ProviderKey, ParseResult, useAppStore } from '@/stores/app-store';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;
const rateLimitStore = new Map<string, RateLimitEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

function checkRateLimit(provider: Provider): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const key = `rate_${provider}`;
  const entry = rateLimitStore.get(key);
  
  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
  }
  
  entry.count++;
  return { allowed: true };
}

const ALLOWED_ORIGINS = [
  'api.openai.com',
  'generativelanguage.googleapis.com',
  'api.anthropic.com',
  'openrouter.ai',
];

function isHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && ALLOWED_ORIGINS.includes(parsed.hostname);
  } catch {
    return false;
  }
}

function sanitizeInput(input: string): string {
  const maxLength = 1000;
  let sanitized = input.trim();
  
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<script|javascript:|on\w+=/gi, '')
    .substring(0, maxLength);
}

function sanitizeApiError(message: string): string {
  const sensitivePatterns = [
    /api[_-]?key["']?\s*[:=]\s*["']?[A-Za-z0-9_-]+/gi,
    /bearer\s+[A-Za-z0-9_-]+/gi,
    /token["']?\s*[:=]\s*["']?[A-Za-z0-9_-]+/gi,
    /password["']?\s*[:=]\s*["']?[^\s"']+/gi,
    /authorization/i,
  ];
  
  let sanitized = message;
  for (const pattern of sensitivePatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  
  return sanitized
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .substring(0, 200);
}

const PROVIDER_CONFIGS: Record<Provider, { endpoint: string; model: string }> = {
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
  },
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-2.0-flash',
  },
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307',
  },
  openrouter: {
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'google/gemini-2.0-flash-001',
  },
};

function formatSchemaForPrompt(parsedSchema: ParseResult): string {
  return parsedSchema.tables
    .map((table) => {
      const columns = table.columns
        .map((col) => {
          let colStr = `  ${col.name} ${col.type}`;
          if (col.primaryKey) colStr += ' PRIMARY KEY';
          if (col.foreignKey) colStr += ` REFERENCES ${col.foreignKey.table}(${col.foreignKey.column})`;
          return colStr;
        })
        .join(',\n');
      return `CREATE TABLE ${table.name} (\n${columns}\n);`;
    })
    .join('\n\n');
}

function buildPrompt(question: string, schema: string): string {
  return `You are a SQL expert. Given a database schema and a question, generate a valid SQL query.

Schema:
${schema}

Question: ${question}

Respond only with the SQL query, no explanation.`;
}

function getProviderApiKey(provider: Provider): string | null {
  const store = useAppStore.getState();
  const keyEntry = store.providerKeys.find((k) => k.provider === provider);
  return keyEntry?.key || null;
}

export async function generateSQL(
  question: string,
  parsedSchema: ParseResult,
  provider: Provider
): Promise<string> {
  const rateLimit = checkRateLimit(provider);
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. Please wait ${rateLimit.retryAfter} seconds before trying again.`);
  }

  const store = useAppStore.getState();
  const quota = store.quotas[provider];
  
  if (quota && quota.requestsUsed >= quota.limit) {
    throw new Error(`Quota exceeded for ${provider}. Please wait for reset or switch providers.`);
  }

  const apiKey = getProviderApiKey(provider);
  if (!apiKey) {
    throw new Error(`No API key configured for ${provider}`);
  }

  const config = PROVIDER_CONFIGS[provider];
  
  if (!isHttpsUrl(config.endpoint)) {
    throw new Error('Invalid endpoint: HTTPS required');
  }

  const sanitizedQuestion = sanitizeInput(question);
  const schemaStr = formatSchemaForPrompt(parsedSchema);
  const prompt = buildPrompt(sanitizedQuestion, schemaStr);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let body: Record<string, unknown>;

  if (provider === 'anthropic') {
    headers['x-api-key'] = apiKey;
    headers['anthropic-version'] = '2023-06-01';
    body = {
      model: config.model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    };
  } else {
    headers['Authorization'] = `Bearer ${apiKey}`;
    body = {
      model: config.model,
      messages: [{ role: 'user', content: prompt }],
    };
  }

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorMessage = 'API request failed';
    
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = sanitizeApiError(errorData.error.message);
      }
    } catch {
      errorMessage = `API error (${response.status})`;
    }
    
    throw new Error(errorMessage);
  }

  const data = await response.json();

  let sql: string;
  if (provider === 'anthropic') {
    sql = data.content?.[0]?.text?.trim() || '';
  } else {
    sql = data.choices?.[0]?.message?.content?.trim() || '';
  }

  if (!sql) {
    throw new Error('No SQL generated');
  }

  useAppStore.getState().incrementQuota(provider);

  return sql;
}