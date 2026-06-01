"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? Moon : Sun;
  const nextTheme = isDark ? "light" : "dark";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme toggle"
        disabled
        className={cn(
          "relative z-50 inline-flex size-9 items-center justify-center rounded-md border border-border bg-transparent text-muted-foreground",
          className
        )}
      >
        <Sun size={16} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
      className={cn(
        "relative z-50 inline-flex size-9 items-center justify-center rounded-md border border-border bg-transparent text-foreground transition hover:border-primary/60 hover:bg-accent/35 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
      onClick={() => setTheme(nextTheme)}
    >
      <Icon size={16} aria-hidden="true" />
    </button>
  );
}
