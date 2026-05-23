"use client";

import { type ReactNode, useState } from "react";

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
  const activeModule = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className="min-w-0 font-mono">
      <button
        type="button"
        className="flex w-full min-w-0 items-center justify-between gap-3 border-b border-primary/25 pb-2 text-left text-[0.68rem] uppercase tracking-[0.18em] transition hover:border-primary/55"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="min-w-0 break-words text-primary [overflow-wrap:anywhere]">
          load module: {activeModule?.name}
        </span>
        <span className="shrink-0 text-muted-foreground">{isOpen ? "close" : "select"}</span>
      </button>

      {isOpen ? (
        <div className="min-w-0 divide-y divide-border/70 border-b border-border/70">
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
