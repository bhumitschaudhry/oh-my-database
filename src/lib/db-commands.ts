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

// Language options for extraction commands
export type Language = "en" | "es" | "fr" | "de" | "ja";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
};

// Localized extraction commands by database type
export const LOCALIZED_COMMANDS: Record<Language, Record<DBType, string>> = {
  en: {
    postgresql: "pg_dump -s -t '*' --schema-only [DB_NAME]",
    mysql: "mysqldump -d [DB_NAME]",
    sqlite: ".schema",
  },
  es: {
    postgresql: "pg_dump -s -t '*' --schema-only [NOMBRE_DB]",
    mysql: "mysqldump -d [NOMBRE_DB]",
    sqlite: ".schema",
  },
  fr: {
    postgresql: "pg_dump -s -t '*' --schema-only [NOM_BD]",
    mysql: "mysqldump -d [NOM_BD]",
    sqlite: ".schema",
  },
  de: {
    postgresql: "pg_dump -s -t '*' --schema-only [DB_NAME]",
    mysql: "mysqldump -d [DB_NAME]",
    sqlite: ".schema",
  },
  ja: {
    postgresql: "pg_dump -s -t '*' --schema-only [データベース名]",
    mysql: "mysqldump -d [データベース名]",
    sqlite: ".schema",
  },
};
