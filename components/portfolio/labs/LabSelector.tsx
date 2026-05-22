"use client";

import { Badge } from "@/components/ui/badge";
import type { LabExhibit } from "./types";

type LabSelectorProps = {
  labs: readonly LabExhibit[];
  activeLabId: string;
  onSelect: (labId: string) => void;
};

export default function LabSelector({ labs, activeLabId, onSelect }: LabSelectorProps) {
  return (
    <section className="scroll-mt-24 space-y-4" id="lab-selector">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>Choose A Lab</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Run one exhibit at a time.</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Selecting a lab replaces the current exhibit, keeping the page focused and the simulations isolated.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {labs.map((lab) => {
          const active = lab.id === activeLabId;

          return (
            <button
              key={lab.id}
              type="button"
              onClick={() => onSelect(lab.id)}
              className={`rounded-3xl border p-4 text-left shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-primary/50 ${
                active
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border/70 bg-card/65 text-muted-foreground dark:bg-background/50"
              }`}
            >
              <span className="text-sm font-semibold text-foreground">{lab.label}</span>
              <span className="mt-2 block text-xs leading-5">{lab.summary}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
