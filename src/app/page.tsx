import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        
        <div id="features" className="py-24 sm:py-32">
          <Features />
        </div>
        
        <div id="how-it-works" className="py-24 sm:py-32 bg-slate-50/50 dark:bg-slate-900/20">
          <HowItWorks />
        </div>

        {/* Final CTA Section */}
        <section className="py-24 sm:py-32 px-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-blue-600 px-6 py-16 text-center text-white shadow-2xl shadow-blue-500/20 md:px-12 md:py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-blue-500 blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-indigo-500 blur-3xl opacity-50" />
            
            <h2 className="relative z-10 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Ready to stop writing SQL?
            </h2>
            <p className="relative z-10 mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              Join hundreds of developers who are querying their databases faster with AI. 
              Get started for free today.
            </p>
            <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/query"
                className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-600 shadow-lg hover:bg-blue-50 transition-all hover:scale-105"
              >
                Start for free
              </Link>
              <Link
                href="https://github.com"
                className="rounded-full border border-blue-400 bg-blue-500/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm hover:bg-blue-500/30 transition-all"
              >
                Star on GitHub
              </Link>
            </div>
          </div>
        </section>
        
        <footer className="border-t bg-slate-50/50 dark:bg-slate-950 px-6 py-12 md:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
              <div className="col-span-2 lg:col-span-2">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-lg font-bold">ohmydatabase</span>
                </Link>
                <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                  Query your database using natural language. Fast, secure, and powered by Gemini.
                </p>
                <div className="mt-6 flex gap-4">
                  <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-muted-foreground hover:text-blue-600 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                  <li><Link href="#how-it-works" className="hover:text-foreground">How it works</Link></li>
                  <li><Link href="/query" className="hover:text-foreground">Query App</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Resources</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground">Documentation</Link></li>
                  <li><Link href="#" className="hover:text-foreground">GitHub</Link></li>
                  <li><Link href="#" className="hover:text-foreground">API Reference</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                  <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} ohmydatabase. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
