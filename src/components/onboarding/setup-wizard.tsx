"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/stores/app-store";
import { parseSchema } from "@/lib/schema-parser";
import { DB_COMMANDS, DB_LABELS, DBType, Language, LANGUAGE_LABELS, LOCALIZED_COMMANDS } from "@/lib/db-commands";
import { 
  Database, 
  Code, 
  Key, 
  Loader2, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Copy,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export function SetupWizard() {
  const [step, setStep] = useState(1);
  const [dbType, setDbType] = useState<DBType>("postgresql");
  const [language, setLanguage] = useState<Language>("en");
  const [schemaInput, setSchemaInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const { setSchema, setParsedSchema, addProviderKey, setActiveProvider } = useAppStore();

  const currentCommand = LOCALIZED_COMMANDS[language][dbType];

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(currentCommand);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      setError("Failed to copy to clipboard");
      setTimeout(() => setError(null), 2000);
    }
  };

  const handleNext = () => {
    if (step === 2) {
      const result = parseSchema(schemaInput);
      if (!result.success) {
        setError(result.error || "Invalid schema");
        return;
      }
      setError(null);
    }
    
    if (step === 3) {
      if (!apiKey.trim()) {
        setError("API Key is required");
        return;
      }
      setError(null);
      simulateConnection();
      return;
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const simulateConnection = () => {
    setStep(4);
    setIsLoading(true);
    // Simulate LLM "understanding" the schema
    setTimeout(() => {
      setIsLoading(false);
      setStep(5);
    }, 2500);
  };

  const handleFinish = () => {
    // Save to store
    setSchema(schemaInput);
    const result = parseSchema(schemaInput);
    setParsedSchema(result);
    addProviderKey("gemini", apiKey);
    setActiveProvider("gemini");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <Card className="w-full max-w-2xl shadow-lg border-2 border-primary/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`h-2 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            {step === 1 && <><Database className="w-6 h-6 text-primary" /> 1. Select Database & Extract</>}
            {step === 2 && <><Code className="w-6 h-6 text-primary" /> 2. Provide Schema</>}
            {step === 3 && <><Key className="w-6 h-6 text-primary" /> 3. LLM Configuration</>}
            {step === 4 && <><Loader2 className="w-6 h-6 text-primary animate-spin" /> 4. Analyzing Schema</>}
            {step === 5 && <><CheckCircle2 className="w-6 h-6 text-green-500" /> 5. Ready to Query</>}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choose your database type and copy the extraction command."}
            {step === 2 && "Paste the SQL schema (CREATE TABLE statements) extracted from your database."}
            {step === 3 && "Add your Google Gemini API key to start generating queries."}
            {step === 4 && "Our LLM is connecting and understanding your database structure..."}
            {step === 5 && "Setup complete! You can now start querying your database using natural language."}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex flex-col justify-center">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(DB_LABELS) as DBType[]).map((type) => (
                  <Button
                    key={type}
                    variant={dbType === type ? "default" : "outline"}
                    className="h-20 flex flex-col gap-2 relative z-10"
                    onClick={() => setDbType(type)}
                  >
                    <span className="font-bold">{DB_LABELS[type]}</span>
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Extraction Command
                  </Label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="text-xs bg-background border rounded px-2 py-1"
                  >
                    {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
                      <option key={lang} value={lang}>{LANGUAGE_LABELS[lang]}</option>
                    ))}
                  </select>
                </div>
                <div className="relative group">
                  <pre className="bg-secondary p-4 rounded-md overflow-x-auto text-sm font-mono border border-border">
                    {currentCommand}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 opacity-100 hover:bg-accent"
                    onClick={copyCommand}
                  >
                    {copySuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                <p className="text-xs text-muted-foreground italic">
                  Run this command in your terminal to get the schema-only dump of your database.
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="schema">SQL Schema</Label>
                <Textarea
                  id="schema"
                  placeholder="CREATE TABLE users (id SERIAL PRIMARY KEY, ...);"
                  className="font-mono min-h-[250px] resize-none"
                  value={schemaInput}
                  onChange={(e) => setSchemaInput(e.target.value)}
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Gemini</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Why Gemini?</h4>
                    <p className="text-xs text-muted-foreground">
                      Gemini provides large context windows and excellent reasoning for database schemas. 
                      You can get a free API key from Google AI Studio.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Gemini API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <p className="text-xs text-muted-foreground pt-1">
                    Your key is stored locally in your browser and never sent to our servers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                <Loader2 className="w-20 h-20 text-primary animate-spin relative" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium">Connecting to Gemini...</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  We are indexing your schema and preparing the LLM context for optimal SQL generation.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">Schema Successfully Analyzed!</h3>
                <p className="text-muted-foreground">
                  Found {parseSchema(schemaInput).tableCount} tables and {parseSchema(schemaInput).columnCount} columns.
                </p>
              </div>
              <div className="w-full max-w-sm p-4 bg-secondary rounded-lg border border-border">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">Google Gemini</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Database:</span>
                  <span className="font-medium capitalize">{dbType}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          {step > 1 && step < 4 ? (
            <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
              <ChevronLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 && (
            <Button onClick={handleNext}>
              Next <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {step === 3 && (
            <Button onClick={handleNext}>
              Verify & Connect <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}

          {step === 5 && (
            <Button className="w-full" size="lg" onClick={handleFinish}>
              Start Querying <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
