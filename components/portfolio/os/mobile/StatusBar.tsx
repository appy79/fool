"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import Clock from "../Clock";
import { useOS } from "../osStore";

export default function StatusBar() {
  const { lock } = useOS();

  return (
    <header className="z-30 flex h-9 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card/70 px-3 backdrop-blur-md">
      <Clock className="font-mono text-[0.62rem] font-semibold tabular-nums tracking-[0.1em] text-foreground" />
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-primary">
        <span className="status-dot" aria-hidden="true" />
        nominal
      </span>
      <div className="flex items-center gap-1.5">
        <ThemeToggle className="size-7" />
        <button
          type="button"
          aria-label="Lock screen"
          onClick={lock}
          className="grid size-7 place-items-center rounded-md text-muted-foreground transition hover:bg-primary/12 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <rect
              x="5"
              y="10.5"
              width="14"
              height="9.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M8 10.5V7.5a4 4 0 0 1 8 0v3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
