import { ApiKeysSection } from "@/components/providers/api-keys-section";
import { SchemaInput } from "@/components/schema/schema-input";
import { SchemaPreview } from "@/components/schema/schema-preview";
import { QuotaSection } from "@/components/quota/quota-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsHeader from "./header";
import { Database } from "lucide-react";

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

          <QuotaSection />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Schema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <SchemaInput />
              <SchemaPreview />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
