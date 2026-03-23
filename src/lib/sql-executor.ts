import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

const TRUSTED_ORIGINS = ['sql.js.org'];

export async function initDatabase(): Promise<void> {
  if (db) return;
  
  SQL = await initSqlJs({
    locateFile: (file: string) => {
      const url = `https://sql.js.org/dist/${file}`;
      if (!TRUSTED_ORIGINS.some(origin => url.includes(origin))) {
        throw new Error('Untrusted CDN origin for sql.js');
      }
      return url;
    },
  });
  db = new SQL.Database();
}

export interface QueryResult {
  columns: string[];
  values: unknown[][];
  rowCount: number;
}

export function isSelectOnly(sql: string): boolean {
  const normalized = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .trim()
    .toUpperCase();
  
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE', 'EXEC', 'EXECUTE', 'CALL'];
  const hasForbidden = forbidden.some((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`);
    return regex.test(normalized);
  });
  
  if (hasForbidden) return false;
  
  const validStarts = ['SELECT', 'WITH', 'PRAGMA', 'EXPLAIN', 'DESCRIBE'];
  return validStarts.some(start => normalized.startsWith(start));
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

export async function executeQuery(sql: string): Promise<QueryResult> {
  if (!db) {
    await initDatabase();
  }
  
  if (!db) {
    throw new Error('Database not initialized');
  }

  if (!isSelectOnly(sql)) {
    throw new Error('Only SELECT queries are allowed');
  }

  try {
    const results = db.exec(sql);
    
    if (results.length === 0) {
      return { columns: [], values: [], rowCount: 0 };
    }

    const { columns, values } = results[0];
    return {
      columns,
      values,
      rowCount: values.length,
    };
  } catch (error) {
    const safeErrorMessages = [
      'syntax error',
      'no such table',
      'no such column',
      'unrecognized token',
      'query returned empty',
    ];
    
    if (error instanceof Error) {
      const lowerMessage = error.message.toLowerCase();
      const isSafe = safeErrorMessages.some(safe => lowerMessage.includes(safe));
      if (isSafe) {
        const sanitizedMessage = escapeHtml(error.message.substring(0, 100));
        throw new Error(`SQL Error: ${sanitizedMessage}`);
      }
      throw new Error('SQL query failed');
    }
    throw new Error('Unknown SQL error');
  }
}