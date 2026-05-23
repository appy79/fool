"use client";

import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import type { LabInsight } from "../types";

type LiveStepPanelProps = {
  label: string;
  title: ReactNode;
  description?: ReactNode;
  insight: LabInsight;
  activeStepIndex: number;
  onStepSelect: (stepIndex: number) => void;
};

export default function LiveStepPanel({
  label = "Current Step",
  title,
  description,
  insight,
  activeStepIndex,
  onStepSelect,
}: LiveStepPanelProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isStepListOpen, setIsStepListOpen] = useState(false);
  const [isConceptsOpen, setIsConceptsOpen] = useState(false);
  const activeStep = insight.steps[activeStepIndex] ?? insight.steps[0];

  return (
    <div className="min-w-0 rounded-2xl border border-border/70 bg-background/70 p-4 text-foreground dark:bg-card/35">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsDetailsOpen((open) => !open)}
          aria-expanded={isDetailsOpen}
          className="min-w-0 flex-1 text-left"
        >
          <div className="min-w-0">
            <p className="break-words font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary [overflow-wrap:anywhere]">{label}</p>
            <div className="mt-2 break-words text-xl font-semibold text-foreground">{title}</div>
            {description ? <div className="mt-2 break-words text-sm leading-6 text-muted-foreground">{description}</div> : null}
          </div>
        </button>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => setIsConceptsOpen(true)}>
            Explain Concepts
          </Button>
          <button
            type="button"
            onClick={() => setIsDetailsOpen((open) => !open)}
            className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary"
          >
            {isDetailsOpen ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </div>

      {isDetailsOpen ? (
        <div className="mt-4 space-y-4">
          <div className="min-w-0 rounded-2xl border border-border/70 bg-card/70 p-4 dark:bg-background/45">
            <p className="break-words font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Step {activeStepIndex + 1} of {insight.steps.length}
            </p>
            <h3 className="mt-2 break-words text-base font-semibold text-foreground">{activeStep.title}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{activeStep.description}</p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsStepListOpen((open) => !open)}
          >
            {isStepListOpen ? "Hide All Steps" : "Show All Steps"}
          </Button>

          {isStepListOpen ? (
            <div className="grid min-w-0 gap-2">
              {insight.steps.map((step, index) => {
                const active = index === activeStepIndex;

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => onStepSelect(index)}
                    className={`min-w-0 rounded-2xl border p-3 text-left transition ${
                      active
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border/70 bg-card/60 text-muted-foreground hover:border-primary/35 hover:text-foreground dark:bg-background/40"
                    }`}
                  >
                    <span className="break-words text-xs font-semibold uppercase tracking-[0.22em]">
                      Step {index + 1}
                    </span>
                    <span className="mt-1 block break-words text-sm font-semibold">{step.title}</span>
                    <span className="mt-1 block break-words text-sm leading-6">{step.description}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {isConceptsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lab-concepts-title"
        >
          <div className="max-h-[85vh] min-w-0 w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-border/70 bg-card p-6 text-foreground shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/20">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="break-words font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Concept Deep Dive
                </p>
                <h3 id="lab-concepts-title" className="mt-2 break-words text-2xl font-semibold text-foreground">
                  What this lab is teaching
                </h3>
              </div>
              <Button type="button" variant="outline" onClick={() => setIsConceptsOpen(false)}>
                Close
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              {insight.concepts.map((concept) => (
                <section key={concept.title} className="min-w-0 rounded-3xl border border-border/70 bg-secondary/35 p-4">
                  <h4 className="break-words text-lg font-semibold text-foreground">{concept.title}</h4>
                  <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{concept.description}</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                    {concept.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
