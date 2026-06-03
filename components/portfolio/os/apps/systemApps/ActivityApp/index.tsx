"use client";

import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "../../../../icons/BrandTechnologyIcon";
import { copy } from "./data";

export default function ActivityApp() {
  const componentCount = resume.skills.reduce((total, section) => total + section.items.length, 0);

  return (
    <div className="space-y-6 p-4 @lg:p-7">
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
          {resume.skills.length} {copy.subsystemsLabel} · {componentCount} {copy.componentsLabel}
        </span>
      </header>

      <div className="grid gap-3 @md:grid-cols-2">
        {resume.skills.map((section, index) => (
          <article key={section.title} className="instrument-panel flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {copy.layerPrefix} {String(index + 1).padStart(2, "0")}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-primary">
                <span className="status-dot" aria-hidden="true" />
                {copy.status}
              </span>
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold tracking-[-0.01em] text-foreground">
                  {section.title}
                </h2>
                <span className="shrink-0 font-mono text-[0.6rem] tabular-nums text-muted-foreground/70">
                  {String(section.items.length).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.summary}</p>
            </div>
            <ul className="mt-auto flex flex-wrap gap-2 border-t border-border/50 pt-3">
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
        ))}
      </div>
    </div>
  );
}
