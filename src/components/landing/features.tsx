"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Database, KeyRound, Zap, Gem, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Natural Language to SQL",
    description:
      "Ask questions in plain English. Our AI translates them into optimized SQL queries instantly.",
    color: "blue",
  },
  {
    icon: Database,
    title: "Schema Intelligence",
    description:
      "Automatically understands your table relationships and data types for pinpoint accuracy.",
    color: "indigo",
  },
  {
    icon: KeyRound,
    title: "Your Keys, Your Control",
    description:
      "Connect your own AI providers. Your database credentials never leave your local environment.",
    color: "violet",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    description:
      "We don't store your data or your queries. Everything happens in your browser and on your machine.",
    color: "emerald",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Execute generated SQL with one click and get results back in a beautiful, filterable table.",
    color: "amber",
  },
  {
    icon: Gem,
    title: "Generous Free Tier",
    description:
      "Get 1,000 free requests per month with Gemini API. Start building without a credit card.",
    color: "pink",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Powerful features for every developer
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Built for speed, security, and simplicity. oh-my-database gives you the power 
          of a senior DBA in a simple chat interface.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="group relative overflow-hidden border-0 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300 shadow-sm hover:shadow-xl">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${feature.color}-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <CardHeader className="pb-2">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/30 text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
