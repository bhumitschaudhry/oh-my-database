import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

export async function initDatabase(): Promise<void> {
  if (db) return;
  
  SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`,
  });
  db = new SQL.Database();
}

export interface QueryResult {
  columns: string[];
  values: unknown[][];
  rowCount: number;
}

export function isSelectOnly(sql: string): boolean {
  const trimmed = sql.trim().toUpperCase();
  const forbidden = ['INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 'TRUNCATE'];
  const hasForbidden = forbidden.some((kw) => trimmed.startsWith(kw));
  return !hasForbidden && (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH'));
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
    if (error instanceof Error) {
      throw new Error(`SQL Error: ${error.message}`);
    }
    throw new Error('Unknown SQL error');
  }
}