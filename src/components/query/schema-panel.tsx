'use client';

import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SchemaPanelProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function SchemaPanel({ collapsed, onToggle }: SchemaPanelProps) {
  const { parsedSchema } = useAppStore();

  if (collapsed) {
    return (
      <div className="h-full flex items-center justify-center p-2">
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="font-medium">Schema</span>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3">
        {parsedSchema ? (
          <div className="space-y-4">
            {parsedSchema.tables.map((table) => (
              <div key={table.name} className="border border-border rounded-lg p-3">
                <div className="font-mono font-medium text-sm mb-2">{table.name}</div>
                <div className="space-y-1">
                  {table.columns.map((col) => (
                    <div key={col.name} className="text-xs font-mono text-muted-foreground">
                      <span className="text-foreground">{col.name}</span>
                      <span className="text-muted-foreground"> {col.type}</span>
                      {col.primaryKey && <span className="text-primary"> PK</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No schema provided
          </div>
        )}
      </div>
    </div>
  );
}