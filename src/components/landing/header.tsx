"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold">QueryForge</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Button asChild size="sm">
            <Link href="/settings">Start</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
