"use client";

import * as React from "react";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children}
      {/* Privacy-friendly, cookieless page + event analytics. No-ops off Vercel. */}
      <Analytics />
    </ThemeProvider>
  );
}
