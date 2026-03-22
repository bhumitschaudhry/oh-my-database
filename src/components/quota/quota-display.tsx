'use client';

import { useAppStore, PROVIDER_LABELS, Provider } from '@/stores/app-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface QuotaDisplayProps {
  provider: Provider;
  compact?: boolean;
}

export function QuotaDisplay({ provider, compact = false }: QuotaDisplayProps) {
  const quotas = useAppStore((state) => state.quotas);
  const resetQuota = useAppStore((state) => state.resetQuota);
  const providerKeys = useAppStore((state) => state.providerKeys);

  const hasKey = providerKeys.some((k) => k.provider === provider);
  if (!hasKey && !compact) return null;

  const quota = quotas[provider];
  const remaining = quota.limit - quota.requestsUsed;
  const percentage = Math.round((remaining / quota.limit) * 100);

  const handleReset = () => {
    resetQuota(provider);
  };

  if (compact) {
    const isExhausted = remaining <= 0;
    return (
      <span className={`text-sm ${isExhausted ? 'text-destructive' : 'text-muted-foreground'}`}>
        {remaining}/{quota.limit} {isExhausted ? '(exhausted)' : `(${percentage}%)`}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <div className="font-medium">{PROVIDER_LABELS[provider]}</div>
        <div className="text-sm text-muted-foreground">
          {remaining} of {quota.limit} requests remaining ({percentage}%)
        </div>
        <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full ${percentage < 20 ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={handleReset}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function QuotaSection() {
  const providerKeys = useAppStore((state) => state.providerKeys);
  const providersWithKeys = [...new Set(providerKeys.map((k) => k.provider))];

  if (providersWithKeys.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Quotas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {providersWithKeys.map((provider) => (
          <QuotaDisplay key={provider} provider={provider} />
        ))}
      </CardContent>
    </Card>
  );
}