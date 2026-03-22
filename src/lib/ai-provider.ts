import { Provider, ProviderKey, ParseResult, useAppStore } from '@/stores/app-store';

const PROVIDER_CONFIGS: Record<Provider, { endpoint: string; model: string }> = {
  nvidia: {
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'nvidia/llama-3.1-nemotron-70b-instruct',
  },
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
  const schemaStr = formatSchemaForPrompt(parsedSchema);
  const prompt = buildPrompt(question, schemaStr);

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
    const errorText = await response.text();
    throw new Error(`API error (${response.status}): ${errorText}`);
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