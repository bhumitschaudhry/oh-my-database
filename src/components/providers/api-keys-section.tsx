"use client";

import { useAppStore, PROVIDER_LABELS, Provider } from "@/stores/app-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddKeyDialog } from "@/components/providers/add-key-dialog";
import { ProviderCard } from "@/components/providers/provider-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown, KeyRound } from "lucide-react";

export function ApiKeysSection() {
  const { providerKeys, activeProvider, setActiveProvider } = useAppStore();

  const configuredProviders = providerKeys.map((k) => k.provider);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            API Keys
          </CardTitle>
          <AddKeyDialog />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Your keys are stored locally
              </p>
              <p className="mt-1 text-amber-700 dark:text-amber-300">
                API keys are stored in your browser&apos;s local storage. We never
                send your keys to any server except the AI provider you configure.
              </p>
            </div>
          </div>
        </div>

        {providerKeys.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              No API keys configured. Add your first key to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Provider</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    {activeProvider
                      ? PROVIDER_LABELS[activeProvider]
                      : "Select provider..."}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {providerKeys.map((pk) => (
                    <DropdownMenuItem
                      key={pk.id}
                      onClick={() => setActiveProvider(pk.provider as Provider)}
                    >
                      {PROVIDER_LABELS[pk.provider]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              {providerKeys.map((pk) => (
                <ProviderCard
                  key={pk.id}
                  providerKey={pk}
                  isActive={activeProvider === pk.provider}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
