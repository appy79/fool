"use client";

import { Badge } from "@/components/ui/badge";
import type { LabExhibit } from "../types";
import type { LabId } from "./labRegistry";

type LabSelectorProps = {
  labs: readonly LabExhibit<LabId>[];
  activeLabId: LabId;
  onSelect: (labId: LabId) => void;
};

const labOpcodes: Record<LabId, string> = {
  turing: "TM",
  telecom: "5GC",
  distributed: "RAFT",
  performance: "P99",
  concurrency: "LOCK",
  network: "EDGE",
  complexity: "NP",
  patterns: "GOF",
};

export default function LabSelector({ labs, activeLabId, onSelect }: LabSelectorProps) {
  return (
    <aside className="top-4 min-w-0 space-y-3 xl:sticky" id="lab-selector">
      <div className="min-w-0 rounded-[1.5rem] border border-border/70 bg-card/85 p-4 text-foreground shadow-inner shadow-slate-900/10 dark:bg-background/80 dark:shadow-slate-950/30">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <Badge className="border-primary/30 bg-primary/10 font-mono text-primary">Lab Index</Badge>
          <span className="break-words font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            /modules
          </span>
        </div>

        <p className="mt-3 font-mono text-xs leading-5 text-muted-foreground">
          mount one exhibit, inspect the trace, switch context without losing the control room.
        </p>

        <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-1">
          {labs.map((lab, index) => {
            const active = lab.id === activeLabId;

            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => onSelect(lab.id)}
                className={`group min-w-0 rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-sm shadow-primary/10"
                    : "border-border/70 bg-background/55 text-muted-foreground hover:border-primary/35 hover:text-foreground dark:bg-card/40"
                }`}
              >
                <span className="flex min-w-0 flex-wrap items-center justify-between gap-2 font-mono text-[0.66rem] uppercase tracking-[0.2em]">
                  <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                    {String(index + 1).padStart(2, "0")}::{labOpcodes[lab.id]}
                  </span>
                  <span className={active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}>
                    {active ? "RUN" : "LOAD"}
                  </span>
                </span>
                <span className="mt-2 block break-words text-sm font-semibold text-foreground">{lab.label}</span>
                <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">{lab.summary}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
