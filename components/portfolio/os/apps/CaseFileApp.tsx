"use client";

import { resume } from "@/lib/resume";
import ProjectVisual from "../../home/projects/ProjectVisual";
import BrandTechnologyIcon from "../../icons/BrandTechnologyIcon";
import { type AppComponentProps, useOS } from "../osStore";

export default function CaseFileApp({ payload }: AppComponentProps) {
  const { openApp } = useOS();
  const project = resume.projects.find((item) => item.title === payload?.projectTitle);

  if (!project) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground">No case file selected.</p>
        <button
          type="button"
          onClick={() => openApp("cases")}
          className="border border-border/70 px-3 py-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          Open case files
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-5 sm:p-7">
      <header>
        <span className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-primary">
          case file // {project.category}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          {project.title}
        </h1>
        <p className="mt-3 border-l-2 border-primary/50 pl-3 text-sm font-medium leading-7 text-foreground">
          {project.impact}
        </p>
      </header>

      <p className="text-sm leading-7 text-muted-foreground">{project.description}</p>

      <div>
        <p className="mb-2 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          stack
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
