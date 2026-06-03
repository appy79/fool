"use client";

import { resume } from "@/lib/resume";
import { useOS } from "../../../osStore";
import { copy } from "./data";

export default function CaseFilesApp() {
  const { openApp } = useOS();

  return (
    <div className="space-y-5 p-5 sm:p-7">
      <header>
        <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {copy.eyebrowLead} {resume.projects.length} {copy.eyebrowTrail}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          {copy.title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.intro}</p>
      </header>

      <ul className="grid gap-3">
        {resume.projects.map((project) => (
          <li key={project.title}>
            <button
              type="button"
              onClick={() => openApp("casefile", { projectTitle: project.title })}
              className="group flex w-full items-start justify-between gap-4 border border-border/70 bg-card/50 p-4 text-left transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <span className="min-w-0">
                <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  {project.category}
                </span>
                <span className="mt-1 block font-semibold tracking-[-0.01em] text-foreground">
                  {project.title}
                </span>
                <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                  {project.impact}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="mt-1 shrink-0 font-mono text-primary transition-transform group-hover:translate-x-0.5"
              >
                &gt;
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
