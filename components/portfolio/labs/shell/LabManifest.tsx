"use client";

import { useState } from "react";
import type { LabExhibit } from "../types";
import type { LabId } from "./labRegistry";

type LabManifestProps = {
  labs: readonly LabExhibit<LabId>[];
  activeLabId: LabId;
  onSelectLab: (labId: LabId) => void;
};

const programOpcodes: Record<LabId, string> = {
  turing: "TM",
  telecom: "5GC",
  distributed: "RAFT",
  performance: "P99",
  concurrency: "LOCK",
  network: "EDGE",
  complexity: "NP",
  patterns: "GOF",
};

export default function LabManifest({ labs, activeLabId, onSelectLab }: LabManifestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeLab = labs.find((lab) => lab.id === activeLabId) ?? labs[0];

  return (
    <div className="min-w-0 flex-1 font-mono text-sm text-foreground">
      <button
        type="button"
        className="flex w-full min-w-0 items-center justify-between gap-3 text-left transition"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 break-words text-primary [overflow-wrap:anywhere]">
          &gt; programs.manifest [{labs.length.toString().padStart(2, "0")}] running: {activeLab.label}
        </span>
        <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
          {isOpen ? "close" : "open"}
        </span>
      </button>

      {isOpen ? (
        <div className="mt-3 border-y border-primary/20 py-2">
          {labs.map((lab, index) => {
            const active = lab.id === activeLabId;

            return (
              <button
                key={lab.id}
                type="button"
                className={`grid w-full min-w-0 grid-cols-[3.5rem_4.5rem_minmax(0,1fr)_4.5rem] items-center gap-3 py-2 text-left transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => {
                  onSelectLab(lab.id);
                  setIsOpen(false);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{programOpcodes[lab.id]}</span>
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">{lab.label}</span>
                <span className="text-right text-[0.65rem] uppercase tracking-[0.18em]">
                  {active ? "run" : "load"}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
