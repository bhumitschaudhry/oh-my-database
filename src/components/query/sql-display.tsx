'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SqlDisplayProps {
  sql: string;
}

export function SqlDisplay({ sql }: SqlDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecute = () => {
    // This will be handled by the parent - triggers confirmation dialog
    const event = new CustomEvent('execute-sql', { detail: { sql } });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated SQL</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy SQL'}
          </Button>
          <Button size="sm" onClick={handleExecute}>
            Execute
          </Button>
        </div>
      </div>
      <pre className="flex-1 p-4 bg-muted rounded-lg overflow-auto font-mono text-sm">
        <code>{sql}</code>
      </pre>
    </div>
  );
}