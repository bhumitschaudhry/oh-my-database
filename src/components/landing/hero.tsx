"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Zap, Shield } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl" />
      </div>

      <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm">
        <Zap className="mr-1.5 h-3.5 w-3.5" />
        No SQL knowledge required
      </Badge>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        Turn Natural Language
        <br />
        <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          into SQL
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Query your database using simple questions. QueryForge understands your schema
        and generates accurate SQL — no SQL knowledge required.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <a href="/settings">
            Start using app
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Database className="h-4 w-4" />
        Your data stays local — we never store your queries
      </p>
    </section>
  );
}
