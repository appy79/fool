"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { LabExhibit } from "../types";
import type { LabId } from "./labRegistry";

type LabsHeroProps = {
  labs: readonly LabExhibit<LabId>[];
  activeLabId: LabId;
  onSelectLab: (labId: LabId) => void;
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

export default function LabsHero({ labs, activeLabId, onSelectLab }: LabsHeroProps) {
  const [isManifestOpen, setIsManifestOpen] = useState(false);
  const activeLab = labs.find((lab) => lab.id === activeLabId);

  return (
    <section
      id="lab"
      className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/85 px-5 py-4 text-foreground shadow-inner shadow-slate-900/10 dark:bg-background/80 dark:shadow-slate-950/30"
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(28rem,0.85fr)] xl:items-center">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-primary/30 bg-primary/10 text-primary">Engineering Systems Lab</Badge>
            <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary">
              status: interactive
            </span>
          </div>

          <div className="min-w-0 rounded-2xl border border-border/70 bg-background/70 p-3 font-mono shadow-sm shadow-slate-900/5 dark:bg-card/45 dark:shadow-slate-950/30">
            <p className="text-xs text-primary/75">yadavam@portfolio:~$</p>
            <h1 className="mt-1 max-w-full break-words text-2xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-3xl lg:text-4xl">
              ./run-labs --mode=interactive --trace=systems
            </h1>
          </div>

          <p className="max-w-4xl break-words text-sm leading-6 text-muted-foreground">
            A compact control room for automata, telecom flows, consensus, memory races, edge routing,
            performance tradeoffs, complexity, and design patterns.
          </p>

        </div>

        <div className="min-w-0 rounded-2xl border border-border/70 bg-background/65 p-3 font-mono dark:bg-card/45">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                exhibits.manifest
              </span>
              <span className="mt-1 block break-words text-xs text-muted-foreground md:hidden">
                mounted: {activeLab?.label ?? "unknown"}
              </span>
            </div>
            <button
              type="button"
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-primary md:hidden"
              aria-expanded={isManifestOpen}
              onClick={() => setIsManifestOpen((open) => !open)}
            >
              {isManifestOpen ? "hide" : `${labs.length} modules`}
            </button>
            <span className="hidden text-[0.65rem] uppercase tracking-[0.22em] text-primary md:inline">
              {labs.length} modules
            </span>
          </div>

          <div className={`mt-3 min-w-0 gap-2 sm:grid-cols-2 md:grid ${isManifestOpen ? "grid" : "hidden"}`}>
            {labs.map((lab, index) => {
              const active = lab.id === activeLabId;

              return (
                <button
                  key={lab.id}
                  type="button"
                  onClick={() => onSelectLab(lab.id)}
                  className={`min-w-0 rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-primary/50 bg-primary/10 text-foreground shadow-sm shadow-primary/10"
                      : "border-border/70 bg-card/70 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                  }`}
                >
                  <span className="flex min-w-0 flex-wrap items-center justify-between gap-2 text-[0.62rem] uppercase tracking-[0.18em]">
                    <span className="break-words [overflow-wrap:anywhere]">
                      {String(index + 1).padStart(2, "0")}::{labOpcodes[lab.id]}
                    </span>
                    <span className={active ? "text-primary" : "text-muted-foreground"}>
                      {active ? "mounted" : "load"}
                    </span>
                  </span>
                  <span className="mt-2 block break-words text-sm font-semibold text-foreground">
                    {lab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <p className={`mt-3 text-[0.68rem] leading-5 text-muted-foreground md:block ${isManifestOpen ? "block" : "hidden"}`}>
            Pick any module here; the active exhibit mounts below with its own scenario controls.
          </p>
        </div>
      </div>
    </section>
  );
}
