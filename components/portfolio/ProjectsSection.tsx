"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section id="work" className="space-y-8">
      <div className="space-y-3">
        <Badge>Work</Badge>
        <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">Recent projects and product work.</h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">Explore a selection of product launches, portfolio experiences, and reusable UI systems.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "secondary" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.title} className="p-6">
            <CardHeader>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild>
                  <a href={project.link}>Discuss this project</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
