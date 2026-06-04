"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { useLabFirstLoadPulse } from "./LabProgramManifestContext";
import styles from "./labShared.module.css";

type LabModuleSelectorItem = {
  id: string;
  name: ReactNode;
};

type LabModuleSelectorProps<TItem extends LabModuleSelectorItem> = {
  items: readonly TItem[];
  activeId: string;
  onSelect: (moduleId: string) => void;
};

export default function LabModuleSelector<TItem extends LabModuleSelectorItem>({
  items,
  activeId,
  onSelect,
}: LabModuleSelectorProps<TItem>) {
  const [isOpen, setIsOpen] = useState(false);
  const moduleListId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const shouldPulseSelectors = useLabFirstLoadPulse();
  const activeModule = items.find((item) => item.id === activeId) ?? items[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const fallbackFocus = buttonRef.current;
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button:not([disabled])")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        fallbackFocus?.focus();
      }
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="min-w-0 font-mono">
      <button
        ref={buttonRef}
        type="button"
        className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-border/70 bg-transparent px-3 py-2 text-left transition hover:border-primary/55 hover:bg-accent/30 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
          shouldPulseSelectors ? styles.firstLoadPulse : ""
        }`}
        aria-expanded={isOpen}
        aria-controls={moduleListId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 text-[0.72rem] uppercase tracking-[0.16em]">
          <span className="text-muted-foreground">module: </span>
          <span className="break-words text-primary [overflow-wrap:anywhere]">
            {activeModule?.name}
          </span>
          <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
            {items.length} modules available
          </span>
        </span>
        <span className="shrink-0 text-lg text-primary" aria-hidden="true">
          {isOpen ? "^" : "v"}
        </span>
      </button>

      {isOpen ? (
        <div
          id={moduleListId}
          ref={panelRef}
          tabIndex={-1}
          className="mt-2 min-w-0 divide-y divide-border/70 border-y border-border/70"
        >
          <p className="py-2 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
            modules.manifest
          </p>
          {items.map((item, index) => {
            const active = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "true" : undefined}
                className={`grid w-full min-w-0 grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] items-center gap-3 px-2 py-2 text-left text-xs uppercase tracking-[0.16em] transition focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  active
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-accent/25 hover:text-foreground"
                }`}
                onClick={() => {
                  onSelect(item.id);
                  setIsOpen(false);
                }}
              >
                <span>module {String(index + 1).padStart(2, "0")}</span>
                <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item.name}</span>
                <span className="text-right">{active ? "loaded" : "load"}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
