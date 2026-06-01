"use client";

import { type ReactNode } from "react";
import MetricGrid from "./MetricGrid";
import { useLabProgramManifest } from "./LabProgramManifestContext";
import type { LabMetric } from "../types";
import styles from "./labShared.module.css";

type LabExhibitLayoutProps = {
  id: string;
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
  programTitle,
  moduleSelector,
  moduleTitle,
  scene,
  controls,
  stepPanel,
  signals,
  proof,
  gridClassName = "xl:grid-cols-[1.35fr_0.85fr]",
  sidebar,
}: LabExhibitLayoutProps) {
  const programManifest = useLabProgramManifest();

  return (
    <section id={id} className="scroll-mt-24 text-foreground">
      <div className="min-w-0 space-y-6">
        <header className="grid min-w-0 gap-5 border-b border-border/70 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] md:items-start">
          <div className="min-w-0 font-mono">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.22em]">
              {programManifest ?? (
                <span className="min-w-0 break-words text-primary [overflow-wrap:anywhere]">
                  &gt; lab:{id}
                </span>
              )}
            </div>
            <h1 className="mt-3 min-w-0 break-words text-2xl font-semibold tracking-[-0.03em] text-foreground [overflow-wrap:anywhere] sm:text-3xl">
              {programTitle}
            </h1>
          </div>

          <div className="min-w-0 border-t border-border/70 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            {moduleSelector}
            <div className="mt-3 space-y-1 text-sm leading-6 text-muted-foreground">
              <p className="break-words font-medium text-foreground">loaded module: {moduleTitle}</p>
            </div>
          </div>
        </header>

        <div className={`grid min-w-0 items-start gap-6 ${gridClassName}`}>
          <div className={styles.sceneStage}>
            <div className={styles.sceneVisual}>
              <div className={styles.sceneNode}>{scene}</div>
            </div>
            <div className={styles.sceneControlItem}>{controls}</div>
          </div>

          <aside className="min-w-0 space-y-5">
            <div className="min-w-0">{stepPanel}</div>
          </aside>
        </div>

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-2">
          {sidebar ?? (
            signals ? (
              <section className="min-w-0 border-y border-border/70 py-4">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">metrics</p>
                <div className="mt-3">
                  <MetricGrid metrics={signals} />
                </div>
              </section>
            ) : null
          )}

          <div className="min-w-0 space-y-5">
            <section className="min-w-0 border-y border-border/70 py-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">takeaway</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{proof}</p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
