"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

const highlightedProjectTitles = new Set([
  "Production Deployment Tool",
  "AT&T Openet Microservices",
  "NorthStar Ordering Modernization",
]);

export default function ProjectsSection() {
  const categories = useMemo(
    () => ["Highlighted", ...Array.from(new Set(resume.projects.map((project) => project.category)))],
    []
  );
  const [activeCategory, setActiveCategory] = useState("Highlighted");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "Highlighted"
        ? resume.projects.filter((project) => highlightedProjectTitles.has(project.title))
        : resume.projects.filter((project) => project.category === activeCategory),
    [activeCategory]
  );
  const activeCategoryDescription =
    activeCategory === "Highlighted"
      ? "Highest-signal projects across internal tooling, charging, and distributed modernization."
      : `Projects mapped to ${activeCategory.toLowerCase()} work.`;

  return (
    <section id="work" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-b border-primary/25 pb-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">&gt; section:work</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Work experience and proof.</h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          One consolidated view of where I have worked and the major projects delivered across those roles.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-3">
        {resume.experience.map((item, index) => (
          <article key={`${item.role}-${item.company}-${item.period}`} className="border border-border/70 bg-card/35 p-4 backdrop-blur dark:bg-background/30">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
              role.{String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">{item.role}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.company} / {item.location}
            </p>
            <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">{item.period}</p>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 border-y border-border/70 py-3">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "secondary" : "outline"}
            size="sm"
            className="font-mono uppercase tracking-[0.14em]"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
        {activeCategoryDescription}
      </p>

      <div className="group/projects grid gap-4 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
            <article key={project.title} className="flex min-w-0 flex-col border border-border/70 bg-card/45 p-4 backdrop-blur sm:p-5 dark:bg-background/35">
              <div className="min-w-0 space-y-2">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                    project.{String(index + 1).padStart(2, "0")}
                  </p>
                  <Badge variant="outline" className="w-fit shrink-0 rounded-none font-mono text-[0.68rem] uppercase tracking-[0.1em]">
                    {project.category}
                  </Badge>
                </div>
                <h3 className="max-w-full text-balance text-lg font-semibold leading-6 text-foreground [overflow-wrap:anywhere]">
                  {project.title}
                </h3>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {project.source}
                </p>
              </div>
              <p className="mt-4 border-y border-primary/20 py-3 text-sm font-medium leading-6 text-foreground">
                {project.impact}
              </p>
              <p className="mt-4 text-sm leading-6 text-muted-foreground lg:max-h-[4.5rem] lg:min-h-[4.5rem] lg:overflow-hidden lg:transition-[max-height] lg:duration-300 lg:group-hover/projects:max-h-[32rem] lg:group-focus-within/projects:max-h-[32rem]">
                {project.description}
              </p>
              <div className="mt-auto pt-5">
                <div className="mb-5 flex flex-wrap gap-2 lg:max-h-7 lg:overflow-hidden lg:transition-[max-height] lg:duration-300 lg:group-hover/projects:max-h-[16rem] lg:group-focus-within/projects:max-h-[16rem]">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="shrink-0 rounded-none font-mono text-[0.68rem] uppercase tracking-[0.12em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link
                  href={project.labHref}
                  className="block border border-border/70 bg-card/40 p-3 transition hover:border-primary/60 hover:bg-primary/10 dark:bg-background/30"
                >
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary">
                    {project.labLabel} -&gt;
                  </p>
                </Link>
              </div>
            </article>
        ))}
      </div>
    </section>
  );
}
