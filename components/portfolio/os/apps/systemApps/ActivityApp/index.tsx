"use client";

import { type KeyboardEvent, useRef, useState } from "react";
import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "../../../../icons/BrandTechnologyIcon";
import { copy } from "./data";

const sections = resume.skills;

export default function ActivityApp() {
  const componentCount = sections.reduce((total, section) => total + section.items.length, 0);
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const section = sections[active];

  // Arrow-key navigation across the tab strip (roving tabindex).
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = sections.length - 1;
    let next = active;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="space-y-6 p-6 @lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            {copy.eyebrow}
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            {copy.title}
          </h1>
        </div>
        <span className="shrink-0 rounded-full border border-border/70 px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.16em] text-muted-foreground">
          {sections.length} {copy.subsystemsLabel} · {componentCount} {copy.componentsLabel}
        </span>
      </header>

      <div
        role="tablist"
        aria-label={copy.title}
        className="flex flex-wrap gap-1 border-b border-border/60"
      >
        {sections.map((entry, index) => {
          const selected = index === active;
          return (
            <button
              key={entry.title}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`activity-tab-${index}`}
              aria-selected={selected}
              aria-controls={`activity-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={onTabKeyDown}
              className={`relative shrink-0 px-3 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {entry.short ?? entry.title}
              {selected ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-primary"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <article
        key={section.title}
        id={`activity-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`activity-tab-${active}`}
        tabIndex={0}
        className="os-fade-in instrument-panel flex flex-col gap-3 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.layerPrefix} {String(active + 1).padStart(2, "0")}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-primary">
            <span className="status-dot" aria-hidden="true" />
            {copy.status}
          </span>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="font-semibold tracking-[-0.01em] text-foreground">{section.title}</h2>
            <span className="shrink-0 font-mono text-[0.6rem] tabular-nums text-muted-foreground/70">
              {String(section.items.length).padStart(2, "0")} {copy.componentsLabel}
            </span>
          </div>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.summary}</p>
        </div>
        <ul className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
          {section.items.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 border border-border/70 bg-card/50 py-1 pl-1 pr-2.5 text-xs font-medium text-foreground"
            >
              <BrandTechnologyIcon name={item} />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
