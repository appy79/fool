"use client";

import { type ReactNode, useState } from "react";
import { useLabFirstLoadPulse } from "./LabProgramManifestContext";

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
  const shouldPulseSelectors = useLabFirstLoadPulse();
  const activeModule = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className="min-w-0 font-mono">
      <button
        type="button"
        className={`grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-primary/35 bg-primary/5 px-3 py-2 text-left transition hover:border-primary/65 hover:bg-primary/10 ${
          shouldPulseSelectors ? "lab-first-load-pulse" : ""
        }`}
        aria-expanded={isOpen}
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
        <div className="mt-2 min-w-0 divide-y divide-border/70 border-y border-border/70">
          <p className="py-2 text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
            modules.manifest
          </p>
          {items.map((item, index) => {
            const active = item.id === activeId;

            return (
              <button
                key={item.id}
                type="button"
                className={`grid w-full min-w-0 grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] items-center gap-3 py-2 text-left text-xs uppercase tracking-[0.16em] transition ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
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
