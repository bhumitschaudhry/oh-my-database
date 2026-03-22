import { ApiKeysSection } from "@/components/providers/api-keys-section";
import SettingsHeader from "./header";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <SettingsHeader />

      <main className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Configure your AI providers and database schema to get started.
          </p>
        </div>

        <div className="space-y-6">
          <ApiKeysSection />
        </div>
      </main>
    </div>
  );
}
