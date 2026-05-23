"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

export default function ProjectsSection() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(resume.projects.map((project) => project.category)))],
    []
  );
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? resume.projects
        : resume.projects.filter((project) => project.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="work" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">&gt; section:work</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Selected engineering work.</h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          A focused look at internal tooling, telecom-scale microservices, and platform integrations I have helped deliver.
        </p>
      </header>

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

      <div className="grid gap-4 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <article key={project.title} className="flex min-w-0 flex-col border border-border/70 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                  project.{String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="break-words text-lg font-semibold text-foreground">{project.title}</h3>
              </div>
              <Badge variant="outline" className="shrink-0 rounded-none font-mono uppercase tracking-[0.12em]">
                {project.category}
              </Badge>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{project.description}</p>
            <div className="mt-auto pt-5">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-none font-mono text-[0.68rem] uppercase tracking-[0.12em]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <Button asChild className="font-mono uppercase tracking-[0.16em]">
                  <a href={project.link}>Discuss this work</a>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
