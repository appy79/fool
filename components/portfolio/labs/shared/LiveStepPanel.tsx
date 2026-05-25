"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const portalContainer = typeof document === "undefined" ? null : document.body;
  const detailsId = useId();
  const stepListId = useId();
  const conceptsDescriptionId = useId();
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeStep = insight.steps[activeStepIndex] ?? insight.steps[0];

  useEffect(() => {
    if (!isConceptsOpen) {
      return;
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overlay = overlayRef.current;
    const inertSiblings = Array.from(document.body.children)
      .filter((element): element is HTMLElement => element instanceof HTMLElement)
      .filter((element) => element !== overlay);
    const siblingStates = inertSiblings.map((element) => ({
      element,
      ariaHidden: element.getAttribute("aria-hidden"),
      inert: element.inert,
    }));

    inertSiblings.forEach((element) => {
      element.setAttribute("aria-hidden", "true");
      element.inert = true;
    });

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsConceptsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      siblingStates.forEach(({ element, ariaHidden, inert }) => {
        if (ariaHidden === null) {
          element.removeAttribute("aria-hidden");
        } else {
          element.setAttribute("aria-hidden", ariaHidden);
        }

        element.inert = inert;
      });

      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isConceptsOpen]);

  return (
    <div className="min-w-0 border-y border-border/70 py-4 text-foreground">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setIsDetailsOpen((open) => !open)}
          aria-expanded={isDetailsOpen}
          aria-controls={isDetailsOpen ? detailsId : undefined}
          aria-label={`${isDetailsOpen ? "Hide" : "Show"} step details`}
          className="min-w-0 flex-1 text-left focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <div className="min-w-0">
            <p className="break-words font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary [overflow-wrap:anywhere]">{label}</p>
            <div className="mt-2 break-words text-xl font-semibold text-foreground">{title}</div>
            {description ? <div className="mt-2 break-words text-sm leading-6 text-muted-foreground">{description}</div> : null}
          </div>
        </button>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Button
            type="button"
            className="border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            size="sm"
            onClick={() => setIsConceptsOpen(true)}
          >
            Explain Concepts
          </Button>
          <button
            type="button"
            onClick={() => setIsDetailsOpen((open) => !open)}
            aria-expanded={isDetailsOpen}
            aria-controls={isDetailsOpen ? detailsId : undefined}
            className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {isDetailsOpen ? "Hide Details" : "Show Details"}
          </button>
        </div>
      </div>

      {isDetailsOpen ? (
          <div id={detailsId} className="mt-4 space-y-4">
          <div className="min-w-0 border-l border-primary/35 pl-4" aria-live="polite">
            <p className="break-words font-mono text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Step {activeStepIndex + 1} of {insight.steps.length}
            </p>
            <h3 className="mt-2 break-words text-base font-semibold text-foreground">{activeStep.title}</h3>
            <p className="mt-2 break-words text-sm leading-6 text-muted-foreground">{activeStep.description}</p>
          </div>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-expanded={isStepListOpen}
            aria-controls={isStepListOpen ? stepListId : undefined}
            onClick={() => setIsStepListOpen((open) => !open)}
          >
            {isStepListOpen ? "Hide All Steps" : "Show All Steps"}
          </Button>

          {isStepListOpen ? (
            <div id={stepListId} className="grid min-w-0 gap-2">
              {insight.steps.map((step, index) => {
                const active = index === activeStepIndex;

                return (
                  <button
                    key={step.title}
                    type="button"
                    aria-current={active ? "step" : undefined}
                    onClick={() => onStepSelect(index)}
                    className={`min-w-0 border-l px-3 py-2 text-left transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                      active
                        ? "border-primary text-foreground"
                        : "border-border/70 text-muted-foreground hover:border-primary/35 hover:text-foreground"
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

      {isConceptsOpen && portalContainer ? createPortal(
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsConceptsOpen(false);
            }
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-concepts-title"
            aria-describedby={conceptsDescriptionId}
            tabIndex={-1}
            className="max-h-[85vh] min-w-0 w-full max-w-3xl overflow-y-auto border border-border/70 bg-card p-6 text-foreground shadow-2xl shadow-slate-900/10 dark:shadow-slate-950/20"
          >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="break-words font-mono text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Concept Deep Dive
                </p>
                <h3 id="lab-concepts-title" className="mt-2 break-words text-2xl font-semibold text-foreground">
                  What this lab is teaching
                </h3>
                <p id={conceptsDescriptionId} className="sr-only">
                  Concept explanations for the current lab step.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-8 shrink-0 items-center justify-center border border-border/70 bg-card/70 px-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                onClick={() => setIsConceptsOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {insight.concepts.map((concept) => (
                <section key={concept.title} className="min-w-0 border-l border-primary/35 pl-4">
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
        </div>,
        portalContainer
      ) : null}
    </div>
  );
}
