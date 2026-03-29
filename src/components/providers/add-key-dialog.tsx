"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore, Provider, PROVIDER_LABELS } from "@/stores/app-store";
import { Plus, ChevronDown, Loader2 } from "lucide-react";

const providers: Provider[] = ["gemini"];

const providerEndpoints: Record<Provider, string> = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
};

export function AddKeyDialog() {
  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addProviderKey, setActiveProvider, activeProvider } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider || !apiKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const isValid = await validateApiKey(selectedProvider, apiKey);

      if (isValid) {
        addProviderKey(selectedProvider, apiKey);
        if (!activeProvider) {
          setActiveProvider(selectedProvider);
        }
        setApiKey("");
        setSelectedProvider(null);
        setOpen(false);
      } else {
        setError("Invalid API key. Please check and try again.");
      }
    } catch {
      setError("Failed to validate API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateApiKey = async (provider: Provider, key: string): Promise<boolean> => {
    const keyPatterns: Record<Provider, RegExp> = {
      gemini: /^AIza[A-Za-z0-9_-]{30,}$/,
    };

    const pattern = keyPatterns[provider];
    if (!pattern || !pattern.test(key)) {
      return false;
    }

    try {
      const testEndpoint = providerEndpoints[provider];
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      };

      const response = await fetch(testEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({ model: 'gemini-3-flash-preview', max_tokens: 1, messages: [{ role: 'user', content: 'test' }] }),
      });

      if (response.status === 401 || response.status === 403) {
        return false;
      }

      return response.ok;
    } catch {
      return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add API Key
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
            <DialogDescription>
              Add your AI provider API key to enable natural language to SQL
              conversion.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="provider">Provider</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="provider"
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedProvider
                      ? PROVIDER_LABELS[selectedProvider]
                      : "Select provider..."}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {providers.map((provider) => (
                    <DropdownMenuItem
                      key={provider}
                      onClick={() => setSelectedProvider(provider)}
                      className={
                        selectedProvider === provider
                          ? "bg-accent"
                          : undefined
                      }
                    >
                      {PROVIDER_LABELS[provider]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="apikey">API Key</Label>
              <Input
                id="apikey"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="off"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              <strong>Security notice:</strong> Your API key is stored locally
              in your browser and is never sent to our servers.
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!selectedProvider || !apiKey.trim() || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save API Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
