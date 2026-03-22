'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (question: string) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
  hasQuota?: boolean;
  providerName?: string;
}

export function QueryInput({ onSubmit, onClear, isLoading, hasQuota = true, providerName }: QueryInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = async () => {
    if (!question.trim()) return;
    await onSubmit(question);
  };

  const isDisabled = isLoading || !question.trim() || !hasQuota;
  const disableReason = !hasQuota ? `Quota exceeded for ${providerName || 'provider'}. Switch providers or wait for reset.` : '';

  return (
    <div className="flex flex-col gap-4 h-full">
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