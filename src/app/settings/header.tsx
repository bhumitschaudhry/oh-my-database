"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold">ohmydatabase</span>
        </Link>

        <nav className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Settings</span>
          <Button asChild size="sm">
            <Link href="/query" className="flex items-center gap-1">
              Query <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
