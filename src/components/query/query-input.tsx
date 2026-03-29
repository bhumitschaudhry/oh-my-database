'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { useAppStore, SqlDialect } from '@/stores/app-store';

const DIALECT_LABELS: Record<SqlDialect, string> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
};

interface QueryInputProps {
  onSubmit: (question: string) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
  hasQuota?: boolean;
  providerName?: string;
}

export function QueryInput({ onSubmit, onClear, isLoading, hasQuota = true, providerName }: QueryInputProps) {
  const [question, setQuestion] = useState('');
  const { dialect, setDialect } = useAppStore();

  const handleSubmit = async () => {
    if (!question.trim()) return;
    await onSubmit(question);
  };

  const isDisabled = isLoading || !question.trim() || !hasQuota;
  const disableReason = !hasQuota ? `Quota exceeded for ${providerName || 'provider'}. Switch providers or wait for reset.` : '';

  const DIALECTS: SqlDialect[] = ['postgresql', 'mysql', 'sqlite'];

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Output SQL:</label>
        <div className="flex gap-1">
          {DIALECTS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDialect(d)}
              className={`text-xs px-2 py-1 rounded border relative z-10 ${
                dialect === d
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              {DIALECT_LABELS[d]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your data..."
          className="h-full min-h-[100px] resize-none font-mono"
          disabled={isLoading}
        />
      </div>
      {!hasQuota && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {disableReason}
        </div>
      )}
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={isDisabled}>
          {isLoading ? 'Generating...' : !hasQuota ? 'Quota Exceeded' : 'Generate SQL'}
        </Button>
        <Button variant="outline" onClick={onClear} disabled={isLoading}>
          Clear
        </Button>
      </div>
    </div>
  );
}