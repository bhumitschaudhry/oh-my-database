"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/stores/app-store";
import { parseSchema } from "@/lib/schema-parser";
import { FileText, Loader2, X } from "lucide-react";

const PLACEHOLDER_SCHEMA = `-- PostgreSQL Example:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT FALSE
);

-- MySQL Example:
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- SQLite Example:
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);`;

export function SchemaInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSchema, setParsedSchema } = useAppStore();

  const handleParse = async () => {
    if (!input.trim()) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = parseSchema(input);
    setSchema(input);
    setParsedSchema(result);
    setLoading(false);
  };

  const handleClear = () => {
    setInput("");
    setSchema(null);
    setParsedSchema(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Database Schema</h3>
          <p className="text-sm text-muted-foreground">
            Paste your CREATE TABLE statements below
          </p>
        </div>
        {input && (
          <Button variant="ghost" size="sm" onClick={handleClear}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={PLACEHOLDER_SCHEMA}
        className="min-h-[250px] font-mono text-sm"
      />

      <div className="flex items-center gap-4">
        <Button onClick={handleParse} disabled={!input.trim() || loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
          Parse Schema
        </Button>

        <p className="text-sm text-muted-foreground">
          Supports PostgreSQL, MySQL, and SQLite
        </p>
      </div>
    </div>
  );
}
