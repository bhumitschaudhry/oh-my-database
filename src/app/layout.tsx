import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "ohmydatabase - Turn Natural Language into SQL",
  description: "Query your database using natural language. No SQL knowledge required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
