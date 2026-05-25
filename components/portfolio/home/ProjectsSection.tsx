"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";
import TechnologyIcon from "./TechnologyIcon";

const highlightedProjectTitles = new Set([
  "Production Deployment Tool",
  "AT&T Openet Microservices",
]);

const defaultProjectTitle =
  resume.projects.find((project) => highlightedProjectTitles.has(project.title))?.title ?? resume.projects[0]?.title ?? null;

const getProjectsForCategory = (category: string) =>
  category === "Highlighted"
    ? resume.projects.filter((project) => highlightedProjectTitles.has(project.title))
    : resume.projects.filter((project) => project.category === category);

function ProjectCategoryIcon({ category }: { category: string }) {
  const normalizedCategory = category.toLowerCase();

  if (normalizedCategory.includes("highlight")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="m12 3 2.4 5.2 5.6.7-4.1 3.8 1 5.5L12 15.5 7.1 18.2l1-5.5L4 8.9l5.6-.7L12 3Z" />
      </svg>
    );
  }

  if (normalizedCategory.includes("tooling")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M14.5 6.5 17 4l3 3-2.5 2.5M4 20l6.5-1.5L19 10l-5-5-8.5 8.5L4 20Z" />
        <path d="m12 7 5 5" />
      </svg>
    );
  }

  if (normalizedCategory.includes("charging")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M14.5 8.5h-3a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-3M12 6.5v11" />
      </svg>
    );
  }

  if (normalizedCategory.includes("telecom")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 20v-7M8 20h8M7 9a7 7 0 0 1 10 0M4 6a11 11 0 0 1 16 0" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }

  if (normalizedCategory.includes("performance")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M4 18h16M6 15a6 6 0 0 1 12 0" />
        <path d="m12 15 4-5M8 11l-2-2M16 11l2-2M12 9V6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 7h14v10H5zM8 7V5h8v2M8 17v2h8v-2" />
    </svg>
  );
}

const projectCrisisMemos: Record<string, { code: string; confidence: string; note: string }> = {
  "Production Deployment Tool": {
    code: "crisis.01",
    confidence: "Prediction confidence: 91%",
    note: "Local friction reduced before it could become delivery entropy.",
  },
  "AT&T Openet Microservices": {
    code: "crisis.02",
    confidence: "Prediction confidence: 94%",
    note: "High-volume charging paths stayed legible under empire-scale traffic.",
  },
  "Metro By T-Mobile Platform": {
    code: "crisis.03",
    confidence: "Prediction confidence: 86%",
    note: "Migration pressure absorbed through service access and event handoffs.",
  },
  "TMO Digital Billing Aggregation": {
    code: "crisis.04",
    confidence: "Prediction confidence: 89%",
    note: "Legacy and modern billing records brought into a cleaner historical stream.",
  },
  "NorthStar Ordering Modernization": {
    code: "crisis.05",
    confidence: "Prediction confidence: 93%",
    note: "Ordering throughput improved by making long-running state explicit.",
  },
  "Media Multiprocessing Service": {
    code: "crisis.06",
    confidence: "Prediction confidence: 88%",
    note: "Compute pressure split across workers before the queue could collapse.",
  },
  "ML Training Data Pipeline": {
    code: "crisis.07",
    confidence: "Prediction confidence: 84%",
    note: "Raw records turned into repeatable training input for the next model cycle.",
  },
  "Usage-Based Monetization Service": {
    code: "crisis.08",
    confidence: "Prediction confidence: 82%",
    note: "Usage events became billable records without slowing the launch window.",
  },
};

const describeTechnologyRole = (project: (typeof resume.projects)[number], technology: string) => {
  const normalizedTechnology = technology.toLowerCase();

  if (normalizedTechnology.includes("java") || normalizedTechnology.includes("spring")) {
    return `${technology} carried the service layer for ${project.title}, keeping the business flow typed, testable, and ready for enterprise deployment.`;
  }

  if (normalizedTechnology.includes("react") || normalizedTechnology.includes("angular")) {
    return `${technology} shaped the operator-facing surface so users could inspect state, compare outcomes, and act without dropping into backend tooling.`;
  }

  if (normalizedTechnology.includes("kafka")) {
    return `${technology} decoupled high-volume events in this project, letting producers and downstream services move independently without blocking the core flow.`;
  }

  if (normalizedTechnology.includes("kubernetes") || normalizedTechnology.includes("docker")) {
    return `${technology} made the project deployable and repeatable across environments, which mattered for reliability, rollout safety, and operational handoff.`;
  }

  if (normalizedTechnology.includes("redis")) {
    return `${technology} helped absorb hot reads and short-lived state, improving response paths without forcing every request through durable storage.`;
  }

  if (normalizedTechnology.includes("cassandra") || normalizedTechnology.includes("couchbase") || normalizedTechnology.includes("postgres") || normalizedTechnology.includes("s3") || normalizedTechnology.includes("ec2")) {
    return `${technology} handled the persistence or infrastructure side of the workflow, supporting the data volume, lookup pattern, and recovery needs behind the project.`;
  }

  if (normalizedTechnology.includes("vault")) {
    return `${technology} protected environment and secret access so automation could run safely across delivery workflows.`;
  }

  if (normalizedTechnology.includes("gitlab") || normalizedTechnology.includes("jenkins") || normalizedTechnology === "git") {
    return `${technology} connected the project to delivery automation, version control, and repeatable release movement.`;
  }

  if (normalizedTechnology.includes("python") || normalizedTechnology.includes("flask")) {
    return `${technology} kept the service lightweight enough for fast data or media-processing workflows while still exposing a clear backend boundary.`;
  }

  if (normalizedTechnology.includes("ffmpeg") || normalizedTechnology.includes("multiprocessing")) {
    return `${technology} directly supported the throughput improvement by splitting CPU-heavy media work into parallel execution paths.`;
  }

  if (normalizedTechnology.includes("google api")) {
    return `${technology} fed external source data into the pipeline so the training workflow could start from automated ingestion instead of manual prep.`;
  }

  if (normalizedTechnology.includes("camunda")) {
    return `${technology} helped model long-running ordering steps, making workflow state and handoffs explicit.`;
  }

  if (normalizedTechnology.includes("aws")) {
    return `${technology} supplied the cloud runtime and managed infrastructure pieces needed to ship the project beyond local development.`;
  }

  if (normalizedTechnology.includes("er/uml")) {
    return `${technology} clarified the data model and service boundaries before monetization logic reached implementation.`;
  }

  return `${technology} was part of the project stack for ${project.title}, supporting the ${project.category.toLowerCase()} work behind: ${project.impact}`;
};

export default function ProjectsSection() {
  const categories = useMemo(
    () => ["Highlighted", ...Array.from(new Set(resume.projects.map((project) => project.category)))],
    []
  );
  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((category) => [category, getProjectsForCategory(category).length])
      ) as Record<string, number>,
    [categories]
  );
  const [activeCategory, setActiveCategory] = useState("Highlighted");
  const [activeProjectTitle, setActiveProjectTitle] = useState<string | null>(defaultProjectTitle);
  const [expandedProjectTitle, setExpandedProjectTitle] = useState<string | null>(null);
  const [activeTechnology, setActiveTechnology] = useState<{ projectTitle: string; technology: string } | null>(null);

  const filteredProjects = useMemo(
    () => getProjectsForCategory(activeCategory),
    [activeCategory]
  );
  const activeProject = useMemo(
    () => filteredProjects.find((project) => project.title === activeProjectTitle) ?? filteredProjects[0],
    [activeProjectTitle, filteredProjects]
  );
  const activeProjectTechnology =
    activeTechnology?.projectTitle === activeProject?.title ? activeTechnology.technology : null;
  const activeProjectCrisisMemo = activeProject ? projectCrisisMemos[activeProject.title] : null;
  const activeProjectDetailsOpen = Boolean(activeProject && expandedProjectTitle === activeProject.title);

  return (
    <section id="work" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-b border-primary/25 pb-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.36fr)] lg:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.86rem] uppercase tracking-[0.24em] text-primary">&gt; section:work</p>
          <h2 className="sr-only">Work experience and proof.</h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
          Roles, projects, and connected labs.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-3">
        {resume.experience.map((item, index) => (
          <article key={`${item.role}-${item.company}-${item.period}`} className="border border-border/70 bg-card/35 p-4 backdrop-blur dark:bg-background/30">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
              {index === 0 ? "current.role" : "previous.role"}
            </p>
            <div className="mt-2 flex items-start justify-between gap-4">
              <h3 className="min-w-0 text-sm font-semibold text-foreground">{item.role}</h3>
              <p className="shrink-0 text-right font-mono text-[0.68rem] uppercase tracking-[0.16em] text-primary">{item.period}</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.company} / {item.location}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,0.9fr)_minmax(18rem,1.4fr)]">
        <div
          className="grid grid-cols-2 gap-2 border-y border-border/70 py-3 sm:grid-cols-3 lg:flex lg:flex-col lg:border-y-0"
          role="group"
          aria-label="Project categories"
        >
          {categories.map((category) => {
            const active = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                aria-current={active ? "true" : undefined}
                className={`inline-flex min-w-0 items-center gap-2 border px-2.5 py-2 text-left transition lg:w-full lg:px-3 ${
                  active
                    ? "border-primary/70 bg-primary/10 text-foreground"
                    : "border-border/70 bg-card/45 text-muted-foreground hover:border-primary/45 hover:text-foreground dark:bg-background/35"
                }`}
                onClick={() => {
                  const nextProjects = getProjectsForCategory(category);
                  const nextProjectTitle = nextProjects[0]?.title ?? null;

                  setActiveCategory(category);
                  setActiveProjectTitle(nextProjectTitle);
                  setExpandedProjectTitle(null);
                  setActiveTechnology(null);
                }}
              >
                <span className="grid size-8 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
                  <ProjectCategoryIcon category={category} />
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-[0.64rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.68rem] lg:tracking-[0.13em]">
                  {category}
                </span>
                <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-primary">
                  {categoryCounts[category]}
                </span>
              </button>
            );
          })}
        </div>

        {activeProject ? (
          <>
            <div className="min-w-0 border border-primary/25 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">archive.records</p>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">{activeCategory}</h3>
                </div>
                <span className="grid size-12 shrink-0 place-items-center border border-primary/30 bg-primary/10 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-primary">
                  {filteredProjects.length}
                </span>
              </div>

              <div className="mt-4 grid gap-2">
                {filteredProjects.map((project) => {
                  const active = project.title === activeProject.title;
                  const crisisMemo = projectCrisisMemos[project.title];

                  return (
                    <button
                      key={project.title}
                      type="button"
                      className={`min-w-0 border p-3 text-left transition ${
                        active
                          ? "border-primary/70 bg-primary/10 text-foreground"
                          : "border-border/70 bg-card/50 text-muted-foreground hover:border-primary/45 hover:text-foreground dark:bg-background/35"
                      }`}
                      onClick={() => {
                        setActiveProjectTitle(project.title);
                        setExpandedProjectTitle(null);
                        setActiveTechnology(null);
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {activeCategory === "Highlighted" ? (
                          <Badge variant="outline" className="w-fit rounded-none font-mono text-[0.62rem] uppercase tracking-[0.1em]">
                            {project.category}
                          </Badge>
                        ) : null}
                        {crisisMemo ? (
                          <span className="border border-primary/25 bg-primary/10 px-2 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-primary">
                            {crisisMemo.code}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-5 text-foreground [overflow-wrap:anywhere]">{project.title}</p>
                      <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">{project.source}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 border border-primary/25 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">historical.record</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{activeProject.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-foreground">{activeProject.impact}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeProject.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={activeProjectTechnology === tag}
                    className={`inline-flex shrink-0 items-center gap-1.5 border px-3 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition ${
                      activeProjectTechnology === tag
                        ? "border-primary/70 bg-primary/10 text-primary"
                        : "border-border/70 bg-card/50 text-muted-foreground hover:border-primary/50 hover:text-primary"
                    }`}
                    onClick={() => {
                      setActiveProjectTitle(activeProject.title);
                      setExpandedProjectTitle(null);
                      setActiveTechnology({ projectTitle: activeProject.title, technology: tag });
                    }}
                  >
                    <TechnologyIcon name={tag} />
                    {tag}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-2 border-t border-border/70 pt-4 sm:grid-cols-2">
                <button
                  type="button"
                  className="flex min-w-0 items-center justify-between gap-3 border border-primary/35 bg-primary/10 px-3 py-2 text-left font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary transition hover:border-primary/70 hover:bg-primary/15 hover:text-foreground"
                  aria-expanded={activeProjectDetailsOpen}
                  onClick={() => setExpandedProjectTitle(activeProjectDetailsOpen ? null : activeProject.title)}
                >
                  <span>{activeProjectDetailsOpen ? "Seal archive" : "Open archive"}</span>
                  <span aria-hidden="true">{activeProjectDetailsOpen ? "^" : "v"}</span>
                </button>
                <Link
                  href={activeProject.labHref}
                  className="min-w-0 border border-border/70 px-3 py-2 text-left font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary transition hover:border-primary/70 hover:text-foreground sm:text-right"
                >
                  {activeProject.labLabel} -&gt;
                </Link>
              </div>
            </div>

            {activeProjectDetailsOpen ? (
              <div className="grid gap-4 border border-primary/25 bg-background/20 p-4 md:grid-cols-2 lg:col-span-3">
                <section>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">field.report</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeProject.description}</p>
                </section>

                <section className="border-t border-primary/25 pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">stack.vector</p>
                  {activeProjectTechnology ? (
                    <div className="mt-3 flex min-w-0 gap-3 border border-primary/25 bg-primary/5 p-4">
                      <span className="grid size-10 shrink-0 place-items-center border border-primary/35 bg-primary/10 text-primary">
                        <TechnologyIcon name={activeProjectTechnology} className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-foreground">{activeProjectTechnology}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {describeTechnologyRole(activeProject, activeProjectTechnology)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Select any stack badge in this project to see how that technology contributed.
                    </p>
                  )}
                </section>

                <section className="border-t border-primary/25 pt-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">radiant.mapping</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeProject.evidence}</p>
                </section>

                {activeProjectCrisisMemo ? (
                  <section className="border-t border-primary/25 pt-4 md:border-l md:pl-4">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">seldon.note</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeProjectCrisisMemo.note}</p>
                  </section>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
