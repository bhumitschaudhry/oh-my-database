"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Database, Zap, Sparkles, Code2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 bg-gradient-to-b from-blue-500/10 to-violet-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="flex flex-col items-center">
        <Badge variant="outline" className="mb-8 px-4 py-1.5 text-sm font-medium border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-300">
          <Zap className="mr-2 h-3.5 w-3.5 fill-blue-500" />
          The smarter way to query databases
        </Badge>

        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Query your database in
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            plain English
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
          The AI-powered SQL generator that understands your schema. No complex setups, 
          no manual SQL writing. Just ask and get results in seconds.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-14 gap-2 rounded-full bg-blue-600 px-8 text-lg font-semibold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
            <a href="/query">
              Start Building Now
              <ArrowRight className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="lg" className="h-14 rounded-full px-8 text-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800">
            View Documentation
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground font-medium">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Local & Secure</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Powered by Gemini</span>
          </div>
        </div>
      </div>

      {/* Mock UI Preview */}
      <div className="mt-24 relative">
        <div className="absolute inset-x-0 -top-10 -z-10 h-24 bg-gradient-to-b from-transparent to-background" />
        <div className="rounded-2xl border bg-card/80 p-4 shadow-2xl backdrop-blur-sm lg:p-8">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-full">
              <Code2 className="h-3 w-3" />
              query-interface.sql
            </div>
          </div>
          
          <div className="space-y-6 text-left max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Natural Language</div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border font-medium text-slate-800 dark:text-slate-200">
                Show me the top 5 customers by revenue in the last 30 days
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-semibold text-violet-600 uppercase tracking-wider">Generated SQL</div>
              <div className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-sm leading-relaxed overflow-x-auto border border-slate-800 shadow-inner">
                <span className="text-pink-400">SELECT</span> c.name, <span className="text-blue-400">SUM</span>(o.total) <span className="text-pink-400">AS</span> revenue<br />
                <span className="text-pink-400">FROM</span> customers c<br />
                <span className="text-pink-400">JOIN</span> orders o <span className="text-pink-400">ON</span> c.id = o.customer_id<br />
                <span className="text-pink-400">WHERE</span> o.order_date &gt; <span className="text-amber-300">CURRENT_DATE</span> - <span className="text-amber-300">INTERVAL</span> <span className="text-blue-300">'30 days'</span><br />
                <span className="text-pink-400">GROUP BY</span> c.name<br />
                <span className="text-pink-400">ORDER BY</span> revenue <span className="text-pink-400">DESC</span><br />
                <span className="text-pink-400">LIMIT</span> <span className="text-blue-300">5</span>;
              </div>
            </div>
          </div>
        </div>
        
        {/* Glow effect for the mock UI */}
        <div className="absolute -inset-4 -z-20 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-indigo-500/20 blur-3xl rounded-[2rem] opacity-50" />
      </div>
    </section>
  );
}
