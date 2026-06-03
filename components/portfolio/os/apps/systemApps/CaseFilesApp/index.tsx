"use client";

import { useState } from "react";
import { resume } from "@/lib/resume";
import CaseFileIcon from "./CaseFileIcon";
import ProjectVisual from "./projects/ProjectVisual";
import BrandTechnologyIcon from "../../../../icons/BrandTechnologyIcon";
import type { AppComponentProps } from "../../../osStore";
import { copy } from "./data";

type Project = (typeof resume.projects)[number];

export default function CaseFilesApp({ payload }: AppComponentProps) {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(payload?.projectTitle ?? null);

  const selected = selectedTitle
    ? (resume.projects.find((item) => item.title === selectedTitle) ?? null)
    : null;

  if (selected) {
    return <CaseFileDetail project={selected} onBack={() => setSelectedTitle(null)} />;
  }

  return <CaseFilesList onSelect={setSelectedTitle} />;
}

function CaseFilesList({ onSelect }: { onSelect: (title: string) => void }) {
  return (
    <div className="space-y-6 p-4 @lg:p-7">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            {copy.eyebrowLead} {copy.eyebrowTrail}
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            {copy.title}
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{copy.intro}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border/70 px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.16em] text-muted-foreground">
          {String(resume.projects.length).padStart(2, "0")} {copy.eyebrowTrail}
        </span>
      </header>

      <ul className="grid gap-3 @3xl:grid-cols-2">
        {resume.projects.map((project, index) => (
          <li key={project.title}>
            <button
              type="button"
              onClick={() => onSelect(project.title)}
              className="group flex h-full w-full flex-col gap-3 border border-border/70 bg-card/50 p-4 text-left transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border/60 bg-background/50 text-primary transition group-hover:border-primary/55 group-hover:bg-primary/10">
                    <CaseFileIcon kind={project.visualKind} className="size-4" />
                  </span>
                  <span className="truncate font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    {project.category}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[0.52rem] tabular-nums text-muted-foreground/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="min-w-0">
                <span className="block font-semibold tracking-[-0.01em] text-foreground">
                  {project.title}
                </span>
                <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                  {project.impact}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-3">
                <span className="min-w-0 truncate font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                  {project.source}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-primary transition-transform group-hover:translate-x-0.5"
                >
                  &gt;
                </span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CaseFileDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <div className="space-y-6 p-4 @lg:p-7">
      <button
        type="button"
        onClick={onBack}
        className="group inline-flex items-center gap-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">
          &lt;
        </span>
        {copy.backLabel}
      </button>

      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <CaseFileIcon kind={project.visualKind} className="size-3.5" />
            {copy.detailEyebrowLead} {project.category}
          </span>
          <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground/70">
            {project.source}
          </span>
        </div>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
          {project.title}
        </h1>
        <p className="mt-3 border-l-2 border-primary/50 pl-3 text-sm font-medium leading-7 text-foreground">
          {project.impact}
        </p>
      </header>

      <p className="text-sm leading-7 text-muted-foreground">{project.description}</p>

      <div>
        <p className="mb-2 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {copy.stackLabel}
        </p>
        <ul className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-2 border border-border/70 bg-card/50 py-1 pl-1 pr-2.5 text-xs font-medium text-foreground"
            >
              <BrandTechnologyIcon name={tag} />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/70">
        <ProjectVisual project={project} />
      </div>
    </div>
  );
}
