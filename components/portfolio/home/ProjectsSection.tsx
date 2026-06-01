"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { resume } from "@/lib/resume";
import TechnologyIcon from "./TechnologyIcon";

const defaultExperienceRole = resume.experience[0]?.role ?? "";

const getProjectRole = (source: string) => source.split("/").at(-1)?.trim() ?? source;

const getProjectsForExperience = (role: string) =>
  resume.projects.filter((project) => getProjectRole(project.source) === role);

const toDomId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ProjectsSection() {
  const detailRegionRef = useRef<HTMLDivElement>(null);
  const [activeExperienceRole, setActiveExperienceRole] = useState(defaultExperienceRole);
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(
    getProjectsForExperience(defaultExperienceRole)[0]?.title ?? resume.projects[0]?.title ?? null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const activeExperience = useMemo(
    () => resume.experience.find((item) => item.role === activeExperienceRole) ?? resume.experience[0],
    [activeExperienceRole]
  );
  const activeExperienceProjects = useMemo(
    () => getProjectsForExperience(activeExperience.role),
    [activeExperience.role]
  );
  const activeProject = useMemo(
    () => activeExperienceProjects.find((project) => project.title === activeProjectTitle) ?? activeExperienceProjects[0],
    [activeExperienceProjects, activeProjectTitle]
  );
  const activeProjectDetailsOpen = Boolean(activeProject && isDetailOpen);
  const activeProjectRegionId = activeProject ? `project-details-${toDomId(activeProject.title)}` : undefined;

  useEffect(() => {
    if (!activeProjectDetailsOpen) {
      return;
    }

    requestAnimationFrame(() => detailRegionRef.current?.focus());
  }, [activeProjectDetailsOpen, activeProjectRegionId]);

  return (
    <section id="work" className="scroll-mt-24 space-y-10">
      <header className="border-b border-primary/25 pb-8">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Project archive</h2>
      </header>

      <div className="grid gap-5 lg:grid-cols-3" role="tablist" aria-label="Experience roles">
        {resume.experience.map((item) => {
          const active = item.role === activeExperience.role;

          return (
            <button
              key={`${item.role}-${item.company}-${item.period}`}
              type="button"
              role="tab"
              aria-selected={active}
              className={`border p-5 text-left transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                active
                  ? "border-primary/70 bg-background text-foreground"
                  : "border-border/70 bg-card text-muted-foreground hover:border-primary/45 hover:text-foreground dark:bg-background"
              }`}
              onClick={() => {
                const projects = getProjectsForExperience(item.role);
                setActiveExperienceRole(item.role);
                setActiveProjectTitle(projects[0]?.title ?? null);
                setIsDetailOpen(false);
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span className="min-w-0 text-sm font-semibold text-foreground">{item.role}</span>
                <span className="shrink-0 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-primary">{item.period}</span>
              </div>
              <p className="mt-2 text-sm leading-6">{item.company} / {item.location}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)]">
        <div
          className="grid content-start gap-3"
          role="tablist"
          aria-label={`Projects for ${activeExperience.role}`}
        >
          {activeExperienceProjects.map((project) => {
            const active = activeProject?.title === project.title;

            return (
              <button
                key={project.title}
                type="button"
                role="tab"
                aria-selected={active}
                className={`border p-5 text-left transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  active
                    ? "border-primary/70 bg-background text-foreground"
                    : "border-border/70 bg-card text-muted-foreground hover:border-primary/45 hover:text-foreground dark:bg-background"
                }`}
                onClick={() => {
                  setActiveProjectTitle(project.title);
                  setIsDetailOpen(false);
                }}
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">{project.category}</p>
                <p className="mt-2 text-base font-semibold leading-6 text-foreground [overflow-wrap:anywhere]">{project.title}</p>
              </button>
            );
          })}
        </div>

        {activeProject ? (
          <article className="min-w-0 border border-primary/25 bg-card p-7 dark:bg-background" aria-live="polite">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">{activeProject.category}</p>
            <h3 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-foreground">{activeProject.title}</h3>
            <p className="mt-5 max-w-3xl text-base font-medium leading-7 text-foreground">{activeProject.impact}</p>

            <div className="mt-8 grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex min-w-0 items-center justify-between gap-3 border border-primary/35 bg-background px-4 py-3 text-left font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary transition hover:border-primary/70 hover:bg-card hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  aria-expanded={activeProjectDetailsOpen}
                  aria-controls={activeProjectDetailsOpen ? activeProjectRegionId : undefined}
                  onClick={() => setIsDetailOpen((open) => !open)}
                >
                  <span>{activeProjectDetailsOpen ? "Hide details" : "Read details"}</span>
                  <span aria-hidden="true">{activeProjectDetailsOpen ? "^" : "v"}</span>
                </button>
                <Link
                  href={activeProject.labHref}
                  className="min-w-0 border border-border/70 px-4 py-3 text-left font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary transition hover:border-primary/70 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:text-right"
                >
                  {activeProject.labLabel} -&gt;
                </Link>
              </div>

              {activeProjectDetailsOpen ? (
                <div
                  id={activeProjectRegionId}
                  ref={detailRegionRef}
                  tabIndex={-1}
                  className="mt-6 space-y-6 border border-primary/25 bg-background p-5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <p className="text-sm leading-6 text-muted-foreground">{activeProject.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span key={tag} className="inline-flex shrink-0 items-center gap-1.5 border border-border/70 bg-card px-3 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        <TechnologyIcon name={tag} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="border-t border-border/70 pt-5 text-sm leading-6 text-muted-foreground">{activeProject.evidence}</p>
                </div>
              ) : null}
          </article>
        ) : null}
      </div>
    </section>
  );
}
