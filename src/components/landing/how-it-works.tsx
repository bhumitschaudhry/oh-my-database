"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileCode2, Settings2, Sparkles, MoveRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: FileCode2,
    title: "Import Schema",
    description: "Export your database schema as SQL and paste it. We index it locally in your browser.",
    color: "blue",
  },
  {
    number: "02",
    icon: Settings2,
    title: "Configure AI",
    description: "Connect your Gemini or OpenAI API key. We use it to translate your questions to SQL.",
    color: "indigo",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Ask & Execute",
    description: "Ask questions like 'Show me monthly sales' and execute the generated SQL instantly.",
    color: "violet",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Get started in minutes
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          No complex database drivers or server-side setups. oh-my-database works 
          wherever your browser does.
        </p>
      </div>

      <div className="relative grid gap-12 md:grid-cols-3">
        {/* Connection lines (desktop) */}
        <div className="absolute top-1/2 left-[15%] right-[15%] hidden h-px -translate-y-1/2 border-t-2 border-dashed border-slate-200 dark:border-slate-800 md:block" />
        
        {steps.map((step, index) => (
          <div key={index} className="relative group">
            <div className={`mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-${step.color}-600 text-white shadow-xl shadow-${step.color}-500/20 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
              <step.icon className="h-8 w-8" />
              <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white">
                {step.number}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
            
            {/* Arrow for mobile */}
            {index < steps.length - 1 && (
              <div className="mt-8 flex justify-center md:hidden">
                <MoveRight className="h-6 w-6 text-slate-300 rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
