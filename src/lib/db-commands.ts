export const DB_COMMANDS = {
  postgresql: "pg_dump -s -t '*' --schema-only [DB_NAME]",
  mysql: "mysqldump -d [DB_NAME]",
  sqlite: ".schema",
} as const;

export type DBType = keyof typeof DB_COMMANDS;

export const DB_LABELS: Record<DBType, string> = {
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  sqlite: "SQLite",
};
