"use client";

import { useState } from "react";
import { resume } from "@/lib/resume";
import SystemTopology from "../../home/console/SystemTopology";
import { getServiceProject, nodeById, SERVICE_NODES, stageById } from "../../home/console/topology";
import { PrimeRadiantGlyph } from "../../icons/FoundationMotifs";
import { useOS } from "../osStore";

export default function SystemApp() {
  const { openApp } = useOS();
  const [selectedId, setSelectedId] = useState(SERVICE_NODES[0].id);

  const node = nodeById.get(selectedId) ?? SERVICE_NODES[0];
  const project = getServiceProject(node);
  const stage = stageById.get(node.stageId);

  const openCaseFile = (id: string) => {
    const target = nodeById.get(id);
    if (target) {
      openApp("casefile", { projectTitle: target.projectTitle });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <PrimeRadiantGlyph className="size-3.5" />
          system // distributed topology
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          The operations map
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A request path from edge to delivery — each node is a real system. Select one, then open
          its case file.
        </p>
      </header>

      <SystemTopology onActivate={openCaseFile} onSelect={setSelectedId} selectedId={selectedId} />

      <div
        className="instrument-panel flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        aria-live="polite"
      >
        <div className="min-w-0">
          <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
            {`${stage?.label ?? "Service"} // ${node.metric}`}
          </span>
          <p className="mt-1 font-semibold tracking-[-0.01em] text-foreground">{project.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{project.impact}</p>
        </div>
        <button
          type="button"
          onClick={() => openCaseFile(node.id)}
          className="shrink-0 self-start border border-primary/50 bg-primary/10 px-4 py-2.5 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none sm:self-center"
        >
          Open case file
        </button>
      </div>

      <div>
        <p className="mb-2 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          telemetry // career peaks
        </p>
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {resume.telemetry.map((reading) => (
            <div key={reading.label} className="border border-border/60 bg-card/40 p-3">
              <dt className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-muted-foreground">
                {reading.label}
              </dt>
              <dd className="mt-1 font-mono text-lg font-black tabular-nums tracking-[-0.02em] text-primary">
                {reading.value}
              </dd>
              <dd className="mt-0.5 text-[0.66rem] leading-4 text-muted-foreground">
                {reading.note}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="border-t border-border/60 pt-4 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
        phase 2 // this map becomes a live, operable simulation
      </p>
    </div>
  );
}
