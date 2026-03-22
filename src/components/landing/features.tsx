"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Database, KeyRound, Zap, Gem } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "No SQL knowledge required",
    description:
      "Ask questions in plain English. oh-my-database translates your questions into accurate SQL queries.",
  },
  {
    icon: Database,
    title: "Works with your schema",
    description:
      "Paste your database schema and oh-my-database understands your tables, columns, and relationships.",
  },
  {
    icon: KeyRound,
    title: "Your keys, your data",
    description:
      "Connect your own AI API keys. Your database credentials never leave your browser.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description:
      "Get SQL results immediately. Review before execution for complete control.",
  },
  {
    icon: Gem,
    title: "Free tier with Gemini",
    description:
      "Get started for free with Google Gemini. 1,000 requests/month at no cost — no credit card required.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
        Everything you need to query your data
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {features.map((feature, index) => (
          <Card key={index} className="border-0 bg-slate-50/50 dark:bg-slate-900/50">
            <CardHeader className="pb-2">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
