import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

export type Provider = 'openai' | 'gemini' | 'anthropic' | 'openrouter';

export const PROVIDER_LIMITS: Record<Provider, number> = {
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

function generateSessionKey(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  const hexChars = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0'));
  return hexChars.join('');
}

const SESSION_KEY = (() => {
  if (typeof window === 'undefined') return 'server-side-key';
  const STORAGE_KEY = 'omd-session-key';
  if (!sessionStorage.getItem(STORAGE_KEY)) {
    sessionStorage.setItem(STORAGE_KEY, generateSessionKey());
  }
  return sessionStorage.getItem(STORAGE_KEY)!;
})();

async function deriveEncryptionKey(salt: ArrayBuffer): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const saltBytes = new Uint8Array(salt);
  const stretchedKey = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(SESSION_KEY + arrayBufferToBase64(saltBytes.buffer as ArrayBuffer))
  );
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stretchedKey,
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function encryptApiKey(plainKey: string): Promise<{ salt: string; iv: string; encrypted: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encryptionKey = await deriveEncryptionKey(salt.buffer as ArrayBuffer);
  const encoder = new TextEncoder();
  const dataWithMarker = 'v1:' + plainKey;
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    encryptionKey,
    encoder.encode(dataWithMarker)
  );
  return {
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    encrypted: arrayBufferToBase64(encrypted)
  };
}

export async function decryptApiKey(encrypted: { salt: string; iv: string; encrypted: string }): Promise<string> {
  try {
    const salt = new Uint8Array(base64ToArrayBuffer(encrypted.salt));
    const iv = new Uint8Array(base64ToArrayBuffer(encrypted.iv));
    const data = new Uint8Array(base64ToArrayBuffer(encrypted.encrypted));
    const encryptionKey = await deriveEncryptionKey(salt.buffer as ArrayBuffer);
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      data
    );
    const decoded = new TextDecoder().decode(decrypted);
    if (!decoded.startsWith('v1:')) {
      throw new Error('Invalid encrypted data format');
    }
    return decoded.substring(3);
  } catch (error) {
    if (error instanceof Error && error.message.includes('decryption')) {
      throw new Error('Failed to decrypt API key. Data may be corrupted.');
    }
    throw error;
  }
}

async function encryptForStorage(obj: unknown): Promise<string> {
  const str = JSON.stringify(obj);
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(salt.buffer as ArrayBuffer);
  const dataWithMarker = 'v1:' + str;
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(dataWithMarker)
  );
  return JSON.stringify({
    version: 'v1',
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer),
    data: arrayBufferToBase64(encrypted)
  });
}

async function decryptFromStorage(encryptedStr: string): Promise<unknown> {
  const combined = JSON.parse(encryptedStr);
  if (!combined.salt || !combined.iv || !combined.data) {
    throw new Error('Invalid encrypted storage format');
  }
  const salt = new Uint8Array(base64ToArrayBuffer(combined.salt));
  const iv = new Uint8Array(base64ToArrayBuffer(combined.iv));
  const data = new Uint8Array(base64ToArrayBuffer(combined.data));
  const key = await deriveEncryptionKey(salt.buffer as ArrayBuffer);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  const decoded = new TextDecoder().decode(decrypted);
  if (!decoded.startsWith('v1:')) {
    throw new Error('Invalid encrypted storage format');
  }
  return JSON.parse(decoded.substring(3));
}

class EncryptedStorage implements StateStorage {
  private pendingSave: ReturnType<typeof setTimeout> | null = null;
  
  async getItem(name: string): Promise<string | null> {
    const encrypted = localStorage.getItem(name);
    if (!encrypted) return null;
    
    try {
      const decrypted = await decryptFromStorage(encrypted);
      return JSON.stringify(decrypted);
    } catch (error) {
      console.warn('Failed to decrypt storage item, clearing data:', name);
      localStorage.removeItem(name);
      return null;
    }
  }
  
  setItem(name: string, value: string): void {
    const doEncrypt = async () => {
      const encrypted = await encryptForStorage(JSON.parse(value));
      localStorage.setItem(name, encrypted);
    };
    
    if (this.pendingSave) {
      clearTimeout(this.pendingSave);
    }
    this.pendingSave = setTimeout(doEncrypt, 0);
  }
  
  removeItem(name: string): void {
    localStorage.removeItem(name);
  }
}

const storage = typeof window !== 'undefined' ? new EncryptedStorage() : createJSONStorage(() => localStorage);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encryptedStorage = storage as any;

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
      name: 'ohmydatabase-storage',
      storage: encryptedStorage,
    }
  )
);

export const PROVIDER_LABELS: Record<Provider, string> = {
  openai: 'OpenAI',
  gemini: 'Google Gemini',
  anthropic: 'Anthropic',
  openrouter: 'OpenRouter',
};

export const PROVIDER_ICONS: Record<Provider, string> = {
  openai: 'AI',
  gemini: 'Gem',
  anthropic: 'Human',
  openrouter: 'Router',
};
