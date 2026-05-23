"use client";

import { type ReactNode } from "react";
import MetricGrid from "./MetricGrid";
import { useLabProgramManifest } from "./LabProgramManifestContext";
import type { LabMetric } from "../types";

type LabExhibitLayoutProps = {
  id: string;
  badge: ReactNode;
  programTitle: ReactNode;
  programDescription: ReactNode;
  moduleSelector: ReactNode;
  moduleTitle: ReactNode;
  moduleDescription: ReactNode;
  scene: ReactNode;
  controls: ReactNode;
  stepPanel: ReactNode;
  signals?: readonly LabMetric[];
  moduleSignalsDescription?: ReactNode;
  proof: ReactNode;
  proofDetail?: ReactNode;
  gridClassName?: string;
  sidebar?: ReactNode;
};

export default function LabExhibitLayout({
  id,
  badge,
  programTitle,
  programDescription,
  moduleSelector,
  moduleTitle,
  moduleDescription,
  scene,
  controls,
  stepPanel,
  signals,
  moduleSignalsDescription = "Static characteristics of the loaded module.",
  proof,
  proofDetail,
  gridClassName = "xl:grid-cols-[1.35fr_0.85fr]",
  sidebar,
}: LabExhibitLayoutProps) {
  const programManifest = useLabProgramManifest();

  return (
    <section id={id} className="scroll-mt-24 text-foreground">
      <div className="min-w-0 space-y-4">
        <header className="grid min-w-0 gap-4 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] md:items-start">
          <div className="min-w-0 font-mono">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.22em]">
              {programManifest ?? (
                <span className="min-w-0 break-words text-primary [overflow-wrap:anywhere]">
                  &gt; program:{id}
                </span>
              )}
            </div>
            <h1 className="mt-2 min-w-0 break-words text-xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-2xl">
              {programTitle}
            </h1>
            <p className="mt-1 max-w-4xl break-words text-sm leading-6 text-muted-foreground">{programDescription}</p>
          </div>

          <div className="min-w-0 border-t border-border/70 pt-3 md:border-l md:border-t-0 md:pl-4 md:pt-0">
            {moduleSelector}
            <div className="mt-3 space-y-1 text-sm leading-6 text-muted-foreground">
              <p className="break-words font-medium text-foreground">loaded module: {moduleTitle}</p>
              <p className="break-words">{moduleDescription}</p>
            </div>
          </div>
        </header>

        <div className={`grid min-w-0 items-start gap-5 ${gridClassName}`}>
          <div className="lab-scene-stage min-w-0">
            <div className="lab-scene-visual">
              <div className="lab-scene-node">{scene}</div>
            </div>
            <div className="lab-scene-control-item">{controls}</div>
          </div>

          <aside className="min-w-0 space-y-5">
            <div className="min-w-0">{stepPanel}</div>

            {sidebar ?? (
              signals ? (
                <section className="min-w-0 border-y border-border/70 py-4">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">module.signals</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{moduleSignalsDescription}</p>
                  <div className="mt-4">
                    <MetricGrid metrics={signals} />
                  </div>
                </section>
              ) : null
            )}

            <section className="min-w-0 border-y border-border/70 py-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">assertion.output</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{proof}</p>
              {proofDetail ? <div className="mt-4 min-w-0 break-words">{proofDetail}</div> : null}
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
