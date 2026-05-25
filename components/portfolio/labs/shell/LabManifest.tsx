"use client";

import { useState } from "react";
import { useLabFirstLoadPulse } from "../shared/LabProgramManifestContext";
import type { LabExhibit } from "../types";
import type { LabId } from "./labRegistry";
import styles from "../shared/labShared.module.css";

type LabManifestProps = {
  labs: readonly LabExhibit<LabId>[];
  activeLabId: LabId;
  onSelectLab: (labId: LabId) => void;
};

const programOpcodes: Record<LabId, string> = {
  turing: "TM",
  telecom: "5GC",
  distributed: "RAFT",
  database: "DB",
  concurrency: "LOCK",
  network: "EDGE",
  complexity: "NP",
  patterns: "GOF",
};

export default function LabManifest({ labs, activeLabId, onSelectLab }: LabManifestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldPulseSelectors = useLabFirstLoadPulse();
  const activeLab = labs.find((lab) => lab.id === activeLabId) ?? labs[0];

  return (
    <div className="min-w-0 flex-1 font-mono text-sm text-foreground">
      <button
        type="button"
        className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-primary/35 bg-primary/5 px-3 py-2 text-left transition hover:border-primary/65 hover:bg-primary/10 ${
          shouldPulseSelectors ? styles.firstLoadPulse : ""
        }`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 text-[0.72rem] uppercase tracking-[0.16em]">
          <span className="text-muted-foreground">&gt; open vault: </span>
          <span className="break-words text-primary [overflow-wrap:anywhere]">
            {activeLab.label}
          </span>
          <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
            {labs.length} crisis simulations available
          </span>
        </span>
        <span className="shrink-0 text-lg text-primary" aria-hidden="true">
          {isOpen ? "^" : "v"}
        </span>
      </button>

      {isOpen ? (
        <div className="mt-2 border-y border-primary/20 py-2">
          <p className="px-3 pb-2 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
            prime.radiant.manifest
          </p>
          {labs.map((lab, index) => {
            const active = lab.id === activeLabId;

            return (
              <button
                key={lab.id}
                type="button"
                aria-current={active ? "true" : undefined}
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
                  {active ? "observe" : "load"}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
