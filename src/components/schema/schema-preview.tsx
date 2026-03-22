"use client";

import { useAppStore } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSchemaSummary } from "@/lib/schema-parser";
import { Database, AlertCircle, ChevronDown, ChevronRight, Table, Link2 } from "lucide-react";
import { useState } from "react";

export function SchemaPreview() {
  const { parsedSchema, setParsedSchema, setSchema } = useAppStore();
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  if (!parsedSchema) {
    return null;
  }

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const handleEdit = () => {
    setParsedSchema(null);
  };

  if (!parsedSchema.success) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Parse Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{parsedSchema.error}</p>
          <div className="mt-4">
            <Button variant="outline" onClick={handleEdit}>
              Try Again
            </Button>
          </div>
          <div className="mt-6 rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Expected format:</p>
            <pre className="mt-2 text-xs text-muted-foreground">
{`CREATE TABLE table_name (
    id SERIAL PRIMARY KEY,
    column_name VARCHAR(255) NOT NULL,
    ...
);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Schema Parsed Successfully
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            Edit Schema
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-base px-3 py-1">
            <Table className="mr-1.5 h-4 w-4" />
            {parsedSchema.tableCount} table{parsedSchema.tableCount !== 1 ? "s" : ""}
          </Badge>
          <Badge variant="secondary" className="text-base px-3 py-1">
            {parsedSchema.columnCount} column{parsedSchema.columnCount !== 1 ? "s" : ""}
          </Badge>
          {parsedSchema.relationshipCount > 0 && (
            <Badge variant="secondary" className="text-base px-3 py-1">
              <Link2 className="mr-1.5 h-4 w-4" />
              {parsedSchema.relationshipCount} relationship
              {parsedSchema.relationshipCount !== 1 ? "s" : ""}
            </Badge>
          )}
          {parsedSchema.dialect && (
            <Badge variant="outline" className="text-base px-3 py-1">
              {parsedSchema.dialect}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          {parsedSchema.tables.map((table) => (
            <div key={table.name} className="rounded-lg border">
              <button
                onClick={() => toggleTable(table.name)}
                className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium">{table.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {table.columns.length} col
                  </Badge>
                  {expandedTables.has(table.name) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {expandedTables.has(table.name) && (
                <div className="border-t p-3 bg-muted/30">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="pb-2 font-medium">Column</th>
                        <th className="pb-2 font-medium">Type</th>
                        <th className="pb-2 font-medium">Constraints</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((col) => (
                        <tr key={col.name} className="border-t">
                          <td className="py-1.5 font-mono">{col.name}</td>
                          <td className="py-1.5 text-muted-foreground">
                            {col.type}
                          </td>
                          <td className="py-1.5">
                            <div className="flex gap-1 flex-wrap">
                              {col.primaryKey && (
                                <Badge variant="default" className="text-xs">
                                  PK
                                </Badge>
                              )}
                              {!col.nullable && !col.primaryKey && (
                                <Badge variant="secondary" className="text-xs">
                                  NOT NULL
                                </Badge>
                              )}
                              {col.foreignKey && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-blue-600"
                                >
                                  FK: {col.foreignKey.table}
                                </Badge>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
