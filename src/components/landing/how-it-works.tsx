"use client";

import { Database, BrainCircuit, Terminal, MoveRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Database,
    title: "Import Schema",
    description: "Export your database schema as SQL and paste it. We index it locally in your browser.",
    bgClass: "bg-blue-600 shadow-blue-500/20",
    borderClass: "border-blue-100 dark:border-blue-900",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Configure AI",
    description: "Connect your Gemini or OpenAI API key. We use it to translate your questions to SQL.",
    bgClass: "bg-indigo-600 shadow-indigo-500/20",
    borderClass: "border-indigo-100 dark:border-indigo-900",
  },
  {
    number: "03",
    icon: Terminal,
    title: "Ask & Execute",
    description: "Ask questions like 'Show me monthly sales' and execute the generated SQL instantly.",
    bgClass: "bg-violet-600 shadow-violet-500/20",
    borderClass: "border-violet-100 dark:border-violet-900",
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
          No complex database drivers or server-side setups. ohmydatabase works 
          wherever your browser does.
        </p>
      </div>

      <div className="relative grid gap-12 md:grid-cols-3">
        {/* Connection lines (desktop) */}
        <div className="absolute top-1/2 left-[15%] right-[15%] hidden h-px -translate-y-1/2 border-t-2 border-dashed border-slate-200 dark:border-slate-800 md:block" />
        
        {steps.map((step, index) => (
          <div key={index} className="relative group">
            <div className={`mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl ${step.bgClass} group-hover:scale-110 transition-transform duration-300 relative z-10`}>
              <step.icon className="h-8 w-8" />
              <div className={`absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-slate-950 border-2 ${step.borderClass} text-xs font-bold text-slate-900 dark:text-white`}>
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
