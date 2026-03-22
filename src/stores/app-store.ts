import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Provider = 'nvidia' | 'openai' | 'gemini' | 'anthropic' | 'openrouter';

export const PROVIDER_LIMITS: Record<Provider, number> = {
  nvidia: 10000,
  openai: 100,
  gemini: 1000,
  anthropic: 100,
  openrouter: 50,
};

export interface ProviderQuota {
  requestsUsed: number;
  lastReset: number;
  limit: number;
}

export interface ProviderKey {
  id: string;
  provider: Provider;
  key: string;
  createdAt: number;
}

export interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
}

export interface ParsedColumn {
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface ParseResult {
  success: boolean;
  dialect?: 'postgresql' | 'mysql' | 'sqlite';
  tables: ParsedTable[];
  tableCount: number;
  columnCount: number;
  relationshipCount: number;
  error?: string;
}

export interface AppState {
  providerKeys: ProviderKey[];
  activeProvider: Provider | null;
  schema: string | null;
  parsedSchema: ParseResult | null;
  quotas: Record<Provider, ProviderQuota>;
  
  addProviderKey: (provider: Provider, key: string) => void;
  removeProviderKey: (id: string) => void;
  setActiveProvider: (provider: Provider | null) => void;
  setSchema: (schema: string | null) => void;
  setParsedSchema: (result: ParseResult | null) => void;
  getQuota: (provider: Provider) => ProviderQuota;
  incrementQuota: (provider: Provider) => void;
  resetQuota: (provider: Provider) => void;
  hasQuota: (provider: Provider) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      providerKeys: [],
      activeProvider: null,
      schema: null,
      parsedSchema: null,
      quotas: {
        nvidia: { requestsUsed: 0, lastReset: Date.now(), limit: PROVIDER_LIMITS.nvidia },
        openai: { requestsUsed: 0, lastReset: Date.now(), limit: PROVIDER_LIMITS.openai },
        gemini: { requestsUsed: 0, lastReset: Date.now(), limit: PROVIDER_LIMITS.gemini },
        anthropic: { requestsUsed: 0, lastReset: Date.now(), limit: PROVIDER_LIMITS.anthropic },
        openrouter: { requestsUsed: 0, lastReset: Date.now(), limit: PROVIDER_LIMITS.openrouter },
      },
      
      addProviderKey: (provider, key) =>
        set((state) => ({
          providerKeys: [
            ...state.providerKeys,
            {
              id: `${provider}-${Date.now()}`,
              provider,
              key,
              createdAt: Date.now(),
            },
          ],
        })),
      
      removeProviderKey: (id) =>
        set((state) => ({
          providerKeys: state.providerKeys.filter((k) => k.id !== id),
        })),
      
      setActiveProvider: (provider) => set({ activeProvider: provider }),
      
      setSchema: (schema) => set({ schema }),
      
      setParsedSchema: (result) => set({ parsedSchema: result }),
      
      getQuota: (provider) => {
        const state = get();
        return state.quotas[provider];
      },
      
      incrementQuota: (provider) =>
        set((state) => ({
          quotas: {
            ...state.quotas,
            [provider]: {
              ...state.quotas[provider],
              requestsUsed: state.quotas[provider].requestsUsed + 1,
            },
          },
        })),
      
      resetQuota: (provider) =>
        set((state) => ({
          quotas: {
            ...state.quotas,
            [provider]: {
              requestsUsed: 0,
              lastReset: Date.now(),
              limit: state.quotas[provider].limit,
            },
          },
        })),
      
      hasQuota: (provider) => {
        const state = get();
        const quota = state.quotas[provider];
        return quota && quota.requestsUsed < quota.limit;
      },
    }),
    {
      name: 'oh-my-database-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const PROVIDER_LABELS: Record<Provider, string> = {
  nvidia: 'NVIDIA NIM',
  openai: 'OpenAI',
  gemini: 'Google Gemini',
  anthropic: 'Anthropic',
  openrouter: 'OpenRouter',
};

export const PROVIDER_ICONS: Record<Provider, string> = {
  nvidia: 'GPU',
  openai: 'AI',
  gemini: 'Gem',
  anthropic: 'Human',
  openrouter: 'Router',
};
