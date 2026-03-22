import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        
        <footer className="border-t py-8">
          <div className="mx-auto max-w-5xl px-6 text-center text-sm text-muted-foreground">
            <p>QueryForge — Query your database using natural language</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
