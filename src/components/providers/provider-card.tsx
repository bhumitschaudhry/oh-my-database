"use client";

import { useAppStore, ProviderKey, PROVIDER_LABELS } from "@/stores/app-store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, Check } from "lucide-react";

interface ProviderCardProps {
  providerKey: ProviderKey;
  isActive: boolean;
}

export function ProviderCard({ providerKey, isActive }: ProviderCardProps) {
  const { removeProviderKey, setActiveProvider } = useAppStore();

  const maskedKey = (key: string) => {
    if (key.length <= 12) return "***" + key.slice(-4);
    return key.slice(0, 4) + "..." + key.slice(-4);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className={isActive ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium truncate">
                {PROVIDER_LABELS[providerKey.provider]}
              </h4>
              {isActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  <Check className="h-3 w-3" />
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-sm text-muted-foreground">
              {maskedKey(providerKey.key)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Added {formatDate(providerKey.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isActive && providerKey.key && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveProvider(providerKey.provider)}
                title="Set as active"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProviderKey(providerKey.id)}
              className="text-destructive hover:text-destructive"
              title="Remove key"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
