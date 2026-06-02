"use client";

import { useMemo, useState } from "react";
import { resume } from "@/lib/resume";
import TechnologyIcon from "../icons/TechnologyIcon";
import ProjectVisual from "./projects/ProjectVisual";

type Experience = (typeof resume.experience)[number];

const getProjectRole = (source: string) => source.split("/").at(-1)?.trim() ?? source;
const getExperienceKey = (experience: Experience) => `${experience.role}-${experience.company}-${experience.period}`;

const getProjectsForExperience = (role: string) =>
  resume.projects.filter((project) => getProjectRole(project.source) === role);

export default function ProjectsSection() {
  const [activeProjectTitle, setActiveProjectTitle] = useState(resume.projects[0]?.title ?? "");
  const [openExperienceKey, setOpenExperienceKey] = useState(
    resume.experience[0] ? getExperienceKey(resume.experience[0]) : ""
  );
  const activeProject = useMemo(
    () => resume.projects.find((project) => project.title === activeProjectTitle) ?? resume.projects[0],
    [activeProjectTitle]
  );
  const projectGroups = resume.experience.map((experience) => ({
    experience,
    projects: getProjectsForExperience(experience.role),
  }));

  return (
    <section id="work" className="scroll-mt-24 space-y-10">
      <header className="section-header-motion grid gap-4 border-b border-border/70 pb-7 md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">work</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-foreground">Project reel.</h2>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.36fr)_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 lg:sticky lg:top-24">
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">case index</p>
          <div className="mt-4 space-y-6">
            {projectGroups.map(({ experience, projects }) => {
              const groupKey = getExperienceKey(experience);
              const groupOpen = openExperienceKey === groupKey;
              const groupPanelId = `project-group-${groupKey.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

              return (
                <section key={groupKey} className="border-t border-border/70 pt-4">
                  <button
                    type="button"
                    aria-expanded={groupOpen}
                    aria-controls={groupPanelId}
                    className="grid w-full min-w-0 gap-1 text-left transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    onClick={() => setOpenExperienceKey(groupOpen ? "" : groupKey)}
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">{experience.role}</span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">{experience.period}</span>
                    </span>
                    <span className="flex min-w-0 items-center justify-between gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{experience.company}</span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">
                        {groupOpen ? "collapse" : "expand"}
                      </span>
                    </span>
                  </button>
                  {groupOpen ? (
                    <div id={groupPanelId} className="mt-3 grid gap-1">
                      {projects.map((project) => {
                        const active = activeProject.title === project.title;

                        return (
                          <button
                            key={project.title}
                            type="button"
                            aria-current={active ? "true" : undefined}
                            className={`group min-w-0 px-0 py-2 text-left transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => {
                              setActiveProjectTitle(project.title);
                              setOpenExperienceKey(groupKey);
                            }}
                          >
                            <span className="flex min-w-0 items-start gap-3">
                              <span className={`mt-2 h-px shrink-0 transition-all duration-300 ${active ? "w-8 bg-primary" : "w-5 bg-border group-hover:w-7 group-hover:bg-primary/70"}`} aria-hidden="true" />
                              <span className="min-w-0">
                                <span className="block break-words text-sm font-medium [overflow-wrap:anywhere]">{project.title}</span>
                                <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-[0.14em] text-primary">{project.category}</span>
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </aside>

        <article className="min-w-0">
          <ProjectVisual key={activeProject.title} project={activeProject} />

          <div aria-live="polite" className="mt-7">
            <div key={`copy-${activeProject.title}`} className="content-reveal">
              <div className="min-w-0">
                <h3 className="break-words text-3xl font-semibold tracking-[-0.045em] text-foreground [overflow-wrap:anywhere]">
                  {activeProject.title}
                </h3>
                <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-foreground">{activeProject.impact}</p>

                <details className="mt-6 border-t border-border/70 pt-4">
                  <summary className="cursor-pointer font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary marker:text-muted-foreground">
                    Open project note
                  </summary>
                  <div className="mt-5 space-y-5">
                    <p className="text-sm leading-7 text-muted-foreground">{activeProject.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.tags.map((tag) => (
                        <span key={tag} className="inline-flex shrink-0 items-center gap-1.5 bg-muted/55 px-3 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground dark:bg-accent/20">
                          <TechnologyIcon name={tag} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
