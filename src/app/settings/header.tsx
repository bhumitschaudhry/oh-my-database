"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function SettingsHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold">QueryForge</span>
        </Link>

        <nav className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Settings</span>
        </nav>
      </div>
    </header>
  );
}
