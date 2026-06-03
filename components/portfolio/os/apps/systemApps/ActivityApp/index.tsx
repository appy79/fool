"use client";

import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "../../../../icons/BrandTechnologyIcon";
import { copy } from "./data";

export default function ActivityApp() {
  return (
    <div className="space-y-5 p-5 sm:p-7">
      <header>
        <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {copy.eyebrow}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          {copy.title}
        </h1>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {resume.skills.map((section, index) => (
          <article key={section.title} className="glass-panel flex flex-col gap-3 p-4">
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
              <h2 className="font-semibold tracking-[-0.01em] text-foreground">{section.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.summary}</p>
            </div>
            <ul className="mt-auto flex flex-wrap gap-2">
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
