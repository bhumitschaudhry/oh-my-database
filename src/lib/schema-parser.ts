import { ParsedTable, ParsedColumn, ParseResult } from "@/stores/app-store";

export function parseSchema(ddl: string): ParseResult {
  if (!ddl.trim()) {
    return {
      success: false,
      tables: [],
      tableCount: 0,
      columnCount: 0,
      relationshipCount: 0,
      error: "Schema is empty. Please paste your database schema.",
    };
  }

  const dialect = detectDialect(ddl);
  const tables: ParsedTable[] = [];
  let relationshipCount = 0;

  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"']?(\w+)[`"']?\s*\(([\s\S]*?)\)(?:\s*;|$)/gi;
  let match;

  while ((match = createTableRegex.exec(ddl)) !== null) {
    const tableName = match[1];
    const columnsBlock = match[2];

    const columns = parseColumns(columnsBlock, dialect);

    const relationships = columns.filter(
      (c) => c.foreignKey !== undefined
    ).length;
    relationshipCount += relationships;

    tables.push({
      name: tableName,
      columns,
    });
  }

  if (tables.length === 0) {
    return {
      success: false,
      tables: [],
      tableCount: 0,
      columnCount: 0,
      relationshipCount: 0,
      error:
        "No valid CREATE TABLE statements found. Please check your schema format.",
    };
  }

  const columnCount = tables.reduce((sum, table) => sum + table.columns.length, 0);

  return {
    success: true,
    dialect,
    tables,
    tableCount: tables.length,
    columnCount,
    relationshipCount,
  };
}

function detectDialect(
  ddl: string
): "postgresql" | "mysql" | "sqlite" {
  const upperDdl = ddl.toUpperCase();

  if (
    /\bSERIAL\b|\bBIGSERIAL\b|\bUUID\b|\bTIMESTAMP\s+WITHOUT\s+TIME\s+ZONE\b|\bTEXT\b(?!\s*\()/.test(
      upperDdl
    ) ||
    upperDdl.includes("FOREIGN KEY")
  ) {
    return "postgresql";
  }

  if (
    /\bAUTO_INCREMENT\b|\bENGINE\s*=\s*INNODB\b|`.+`/.test(upperDdl)
  ) {
    return "mysql";
  }

  if (
    /\bINTEGER\s+PRIMARY\s+KEY(?:\s+AUTOINCREMENT)?\b/i.test(upperDdl)
  ) {
    return "sqlite";
  }

  return "postgresql";
}

function parseColumns(
  columnsBlock: string,
  dialect: "postgresql" | "mysql" | "sqlite"
): ParsedColumn[] {
  const columns: ParsedColumn[] = [];

  const lines = splitColumnDefinitions(columnsBlock);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.toUpperCase().startsWith("PRIMARY KEY") || trimmedLine.toUpperCase().startsWith("FOREIGN KEY") || trimmedLine.toUpperCase().startsWith("UNIQUE") || trimmedLine.toUpperCase().startsWith("CHECK") || trimmedLine.toUpperCase().startsWith("CONSTRAINT")) {
      continue;
    }

    const column = parseColumnDefinition(trimmedLine, dialect);
    if (column) {
      columns.push(column);
    }
  }

  return columns;
}

function splitColumnDefinitions(columnsBlock: string): string[] {
  const result: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (const char of columnsBlock) {
    if (char === "(") {
      parenDepth++;
      current += char;
    } else if (char === ")") {
      parenDepth--;
      current += char;
    } else if (char === "," && parenDepth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    result.push(current.trim());
  }

  return result;
}

function parseColumnDefinition(
  line: string,
  dialect: "postgresql" | "mysql" | "sqlite"
): ParsedColumn | null {
  const cleanLine = line.trim();
  if (!cleanLine) return null;

  const words = cleanLine.split(/\s+/);
  if (words.length < 2) return null;

  let name = words[0].replace(/[`"']/g, "");
  const type = words.slice(1).join(" ").toUpperCase();

  const nullable = !type.includes("NOT NULL") && !type.includes("PRIMARY KEY");
  const primaryKey =
    type.includes("PRIMARY KEY") ||
    type.match(/\bSERIAL\b/i) !== null ||
    type.match(/\bINTEGER\s+PRIMARY\s+KEY\b/i) !== null;

  let foreignKey: ParsedColumn["foreignKey"] = undefined;

  const referencesMatch = cleanLine.match(
    /REFERENCES\s+[`"']?(\w+)[`"']?\s*\([^)]+\)/i
  );
  if (referencesMatch) {
    const refTable = referencesMatch[1];
    const colMatch = cleanLine.match(/\(([^)]+)\)\s*REFERENCES/i);
    const refColumn = colMatch ? colMatch[1].replace(/[`"']/g, "") : "id";
    foreignKey = { table: refTable, column: refColumn };
  }

  return {
    name,
    type: normalizeType(type),
    nullable,
    primaryKey,
    foreignKey,
  };
}

function normalizeType(type: string): string {
  return type
    .replace(/[`"']/g, "")
    .replace(/\s+ARRAY/gi, "[]")
    .replace(/CHARACTER\s+VARYING/gi, "VARCHAR")
    .replace(/CHARACTER/gi, "CHAR")
    .replace(/INTEGER\s+SERIAL/gi, "SERIAL")
    .replace(/BIGINT\s+SERIAL/gi, "BIGSERIAL")
    .replace(/DECIMAL\s*\(\d+,\s*\d+\)/gi, "DECIMAL")
    .replace(/NUMERIC\s*\(\d+,\s*\d+\)/gi, "NUMERIC")
    .split(" ")[0];
}

export function formatSchemaSummary(result: ParseResult): string {
  if (!result.success) {
    return result.error || "Failed to parse schema";
  }

  const parts: string[] = [];

  parts.push(`${result.tableCount} table${result.tableCount !== 1 ? "s" : ""}`);
  parts.push(`${result.columnCount} column${result.columnCount !== 1 ? "s" : ""}`);

  if (result.relationshipCount > 0) {
    parts.push(
      `${result.relationshipCount} relationship${
        result.relationshipCount !== 1 ? "s" : ""
      }`
    );
  }

  if (result.dialect) {
    parts.push(`(${result.dialect})`);
  }

  return parts.join(", ");
}
