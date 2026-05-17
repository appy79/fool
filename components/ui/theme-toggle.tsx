"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const value = theme ?? "system";

  const Icon = value === "light" ? Sun : value === "dark" ? Moon : Monitor;

  if (!mounted) {
    return (
      <div className={cn("relative inline-flex items-center", className)}>
        <div className="pointer-events-none absolute left-2 flex items-center">
          <Monitor size={16} />
        </div>
        <select aria-label="Theme selector" disabled className="glass w-auto rounded-md border border-border pl-8 pr-3 py-2 text-sm text-foreground">
          <option>System</option>
        </select>
      </div>
    );
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <div className="pointer-events-none absolute left-2 flex items-center">
        <Icon size={16} />
      </div>
      <select
        aria-label="Theme selector"
        value={value}
        onChange={(e) => setTheme(e.target.value)}
        className="w-auto rounded-md glass pl-8 pr-3 py-2 text-sm"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
