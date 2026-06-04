"use client";

import { useState } from "react";
import { PrimeRadiantGlyph } from "../icons/FoundationMotifs";
import { useOS } from "./osStore";
import { readDeepLink } from "./urlState";

const TOUR_KEY = "terminusos.tour.v1";

const beats = [
  {
    app: "operator",
    title: "Operator",
    detail: "Who I am, the headline numbers, and how to reach me.",
  },
  {
    app: "cases",
    title: "Case Files",
    detail: "Projects at carrier scale — each with the impact it shipped.",
  },
  {
    app: "activity",
    title: "Activity",
    detail: "The toolkit, broken down by what it's actually used for.",
  },
] as const;

/**
 * One-time orientation shown on a visitor's first entry. It explains the OS in three beats
 * and offers a fast path to the condensed Dossier. Suppressed when a deep link brought the
 * visitor straight to specific content (they came for that, not a tour) and never shown
 * again once dismissed (persisted in localStorage).
 */
export default function FirstRunGuide() {
  const { openApp } = useOS();
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    if (readDeepLink()) return false;
    try {
      return localStorage.getItem(TOUR_KEY) !== "1";
    } catch {
      return false;
    }
  });

  if (!open) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(TOUR_KEY, "1");
    } catch {
      // Storage unavailable — it'll just show again next time; harmless.
    }
    setOpen(false);
  };

  const openDossier = () => {
    dismiss();
    openApp("dossier");
  };

  return (
    <div
      className="absolute inset-0 z-[120] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to the system"
    >
      <button
        type="button"
        aria-label="Dismiss welcome"
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-background/60 backdrop-blur-sm"
      />
      <div className="os-fade-in glass-panel relative w-full max-w-md rounded-2xl p-6 shadow-[0_30px_90px_-30px_color-mix(in_oklch,var(--primary)_45%,transparent)] ring-1 ring-primary/15">
        <span className="inline-flex items-center gap-2 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <PrimeRadiantGlyph className="size-3.5" />
          Welcome aboard
        </span>
        <h2 className="mt-2.5 font-display text-xl font-semibold tracking-[-0.03em] text-foreground">
          This portfolio is a small operating system
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Everything lives in apps. Open them from the dock — here&apos;s where to start.
        </p>

        <ul className="mt-4 space-y-2">
          {beats.map((beat, index) => (
            <li
              key={beat.app}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-3"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-primary/40 font-mono text-[0.6rem] font-semibold text-primary tabular-nums">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-semibold tracking-[-0.01em] text-foreground">
                  {beat.title}
                </span>
                <span className="mt-0.5 block text-[0.78rem] leading-5 text-muted-foreground">
                  {beat.detail}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2 @sm:flex-row">
          <button
            type="button"
            autoFocus
            onClick={openDossier}
            className="group inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            Open the 30-second brief
            <span
              aria-hidden="true"
              className="text-primary transition-transform group-hover:translate-x-0.5"
            >
              {">_"}
            </span>
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-border/60 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-border hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            Explore on my own
          </button>
        </div>
      </div>
    </div>
  );
}
