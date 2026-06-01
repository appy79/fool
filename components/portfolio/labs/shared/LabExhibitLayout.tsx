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

const foundationTraces: Record<string, { label: string; detail: string }> = {
  turing: {
    label: "vault.trace: psychohistorian.prime",
    detail: "A single tape, a finite rulebook, and a civilization-scale question: can the next state be known before the crisis arrives?",
  },
  telecom: {
    label: "terminus.relay: outer.kingdoms",
    detail: "Signals cross the edge like Foundation trade routes, turning distant local requests into stable central records.",
  },
  distributed: {
    label: "council.vote: first.foundation",
    detail: "Consensus holds when no single mayor of Terminus can carry the plan alone; the quorum is the civilization.",
  },
  database: {
    label: "encyclopedia.index: galactica",
    detail: "Every record needs a home, every query needs a path, and the archive only survives if retrieval stays cheap.",
  },
  concurrency: {
    label: "crisis.window: seldon.lock",
    detail: "Parallel actors rush the same future; the smallest race can bend the plan unless the critical section is guarded.",
  },
  network: {
    label: "jump.route: imperial.edge",
    detail: "Latency is the distance between sectors; routing decides whether the message reaches Terminus before the empire reacts.",
  },
  complexity: {
    label: "plan.boundary: mule.event",
    detail: "Some problems look predictable until a single outlier breaks the model and forces the plan to show its limits.",
  },
  patterns: {
    label: "pattern.archive: second.foundation",
    detail: "Reusable forms hide in plain sight, steering local decisions without announcing the hand behind the system.",
  },
};

export default function LabExhibitLayout({
  id,
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
  const foundationTrace = foundationTraces[id.replace(/-lab$/, "")];

  return (
    <section id={id} className="scroll-mt-24 text-foreground">
      <div className="min-w-0 space-y-6">
        <header className="grid min-w-0 gap-5 border-b border-border/70 pb-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] md:items-start">
          <div className="min-w-0 font-mono">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 text-[0.65rem] uppercase tracking-[0.22em]">
              {programManifest ?? (
                <span className="min-w-0 break-words text-primary [overflow-wrap:anywhere]">
                  &gt; vault.program:{id}
                </span>
              )}
            </div>
            <h1 className="mt-3 min-w-0 break-words text-2xl font-semibold tracking-[-0.03em] text-foreground [overflow-wrap:anywhere] sm:text-3xl">
              {programTitle}
            </h1>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{programDescription}</p>
          </div>

          <div className="min-w-0 border-t border-border/70 pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            {moduleSelector}
            <div className="mt-3 space-y-1 text-sm leading-6 text-muted-foreground">
              <p className="break-words font-medium text-foreground">loaded module: {moduleTitle}</p>
              <p className="break-words">{moduleDescription}</p>
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
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">radiant.signals</p>
                <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{moduleSignalsDescription}</p>
                <div className="mt-4">
                  <MetricGrid metrics={signals} />
                </div>
              </section>
            ) : null
          )}

          <div className="min-w-0 space-y-5">
            <section className="min-w-0 border-y border-border/70 py-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">seldon.assertion</p>
              <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{proof}</p>
              {proofDetail ? <div className="mt-4 min-w-0 break-words">{proofDetail}</div> : null}
            </section>
            {foundationTrace ? (
              <section className="min-w-0 border-y border-border/70 py-4">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">{foundationTrace.label}</p>
                <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{foundationTrace.detail}</p>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
