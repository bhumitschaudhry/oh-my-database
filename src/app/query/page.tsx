'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Header } from '@/components/landing/header';
import { SetupWizard } from '@/components/onboarding/setup-wizard';
import { QueryInput } from '@/components/query/query-input';
import { SqlDisplay } from '@/components/query/sql-display';
import { LoadingSkeleton } from '@/components/query/loading-skeleton';
import { SchemaPanel } from '@/components/query/schema-panel';
import { ConfirmationDialog } from '@/components/query/confirmation-dialog';
import { ResultsTable } from '@/components/query/results-table';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { initDatabase, executeQuery, QueryResult } from '@/lib/sql-executor';
import { toast } from 'sonner';

export default function QueryPage() {
  const { parsedSchema, activeProvider, quotas } = useAppStore();
  const [generatedSql, setGeneratedSql] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemaCollapsed, setSchemaCollapsed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [copiedResults, setCopiedResults] = useState(false);

  const hasQuota = activeProvider ? quotas[activeProvider].requestsUsed < quotas[activeProvider].limit : true;

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    const handleExecute = (e: Event) => {
      const customEvent = e as CustomEvent<{ sql: string }>;
      setGeneratedSql(customEvent.detail.sql);
      setShowConfirm(true);
    };
    window.addEventListener('execute-sql', handleExecute);
    return () => window.removeEventListener('execute-sql', handleExecute);
  }, []);

  const handleGenerateSql = async (question: string) => {
    if (!parsedSchema) {
      setError('Please add a database schema first');
      return;
    }
    if (!activeProvider) {
      setError('Please select an AI provider first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedSql(null);
    setQueryResult(null);

    try {
      const { generateSQL } = await import('@/lib/ai-provider');
      const sql = await generateSQL(question, parsedSchema, activeProvider);
      setGeneratedSql(sql);
      await navigator.clipboard.writeText(sql);
      toast.success('SQL generated and copied to clipboard');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate SQL';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!generatedSql) return;

    setIsExecuting(true);
    setError(null);

    try {
      const result = await executeQuery(generatedSql);
      setQueryResult(result);
      toast.success(`Query executed successfully (${result.rowCount} rows)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to execute query';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsExecuting(false);
      setShowConfirm(false);
    }
  };

  const handleCopyResults = async () => {
    if (!queryResult) return;
    const text = queryResult.values.map((row) => row.join('\t')).join('\n');
    await navigator.clipboard.writeText(text);
    setCopiedResults(true);
    setTimeout(() => setCopiedResults(false), 2000);
  };

  const handleClear = () => {
    setGeneratedSql(null);
    setQueryResult(null);
    setError(null);
  };

  if (!parsedSchema || !activeProvider) {
    return (
      <>
        <Header />
        <SetupWizard />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <ConfirmationDialog
        open={showConfirm}
        sql={generatedSql || ''}
        onConfirm={handleExecute}
        onCancel={() => setShowConfirm(false)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <div
          className={`border-r border-border transition-all duration-200 ${
            schemaCollapsed ? 'w-12' : 'w-80'
          }`}
        >
          <SchemaPanel collapsed={schemaCollapsed} onToggle={() => setSchemaCollapsed(!schemaCollapsed)} />
        </div>

        <div className="flex-1 flex flex-col p-6 gap-6 overflow-auto">
          <div className="shrink-0">
            <QueryInput onSubmit={handleGenerateSql} onClear={handleClear} isLoading={isLoading} hasQuota={hasQuota} providerName={activeProvider || undefined} />
          </div>

          <div className="flex-1 flex flex-col gap-4 min-h-[200px]">
            {isLoading || isExecuting ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="flex items-center gap-2 p-4 border border-destructive rounded-lg bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            ) : generatedSql ? (
              <div className="flex flex-col gap-4">
                <SqlDisplay sql={generatedSql} />
                {queryResult && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Results ({queryResult.rowCount} rows)</h3>
                      <Button variant="outline" size="sm" onClick={handleCopyResults}>
                        {copiedResults ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-1" /> Copy Results
                          </>
                        )}
                      </Button>
                    </div>
                    <ResultsTable result={queryResult} />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-border rounded-lg text-muted-foreground text-center">
                Generated SQL will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}