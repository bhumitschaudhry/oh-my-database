"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-lg font-bold tracking-tight">ohmydatabase</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/query">Start for free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
