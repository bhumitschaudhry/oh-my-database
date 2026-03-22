import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Provider = 'nvidia' | 'openai' | 'gemini' | 'anthropic' | 'openrouter';

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
  
  addProviderKey: (provider: Provider, key: string) => void;
  removeProviderKey: (id: string) => void;
  setActiveProvider: (provider: Provider | null) => void;
  setSchema: (schema: string | null) => void;
  setParsedSchema: (result: ParseResult | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      providerKeys: [],
      activeProvider: null,
      schema: null,
      parsedSchema: null,
      
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
    }),
    {
      name: 'queryforge-storage',
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
