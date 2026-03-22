"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, MessageCircle, Play } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileText,
    title: "Paste your schema",
    description: "Copy your database schema (CREATE TABLE statements) and paste it into oh-my-database.",
  },
  {
    number: "02",
    icon: MessageCircle,
    title: "Ask in plain English",
    description: "Type your question about your data using natural language.",
  },
  {
    number: "03",
    icon: Play,
    title: "Get results instantly",
    description: "Review the generated SQL, then execute with one click.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
        How it works
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {index < steps.length - 1 && (
              <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 bg-border md:block" />
            )}
            <Card className="relative border-0 bg-white shadow-none dark:bg-slate-950">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="mb-2 block text-sm font-medium text-blue-600">
                  Step {step.number}
                </span>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
