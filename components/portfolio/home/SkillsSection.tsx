"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "./BrandTechnologyIcon";

function SkillCategoryIcon({ title }: { title: string }) {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("data")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v6c0 1.66 3.13 3 7 3s7-1.34 7-3V6" />
        <path d="M5 12v6c0 1.66 3.13 3 7 3s7-1.34 7-3v-6" />
      </svg>
    );
  }

  if (normalizedTitle.includes("cloud")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M7 18h10a4 4 0 0 0 .6-7.96A6.5 6.5 0 0 0 5.2 8.5 4.8 4.8 0 0 0 7 18Z" />
        <path d="M9 14h6M12 11v6" />
      </svg>
    );
  }

  if (normalizedTitle.includes("frontend")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="4" y="5" width="16" height="11" rx="2" />
        <path d="M8 20h8M12 16v4M9 9l-2 2 2 2M15 9l2 2-2 2" />
      </svg>
    );
  }

  if (normalizedTitle.includes("supporting")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="m14.7 6.3 3 3M4 20l5.6-1.4L19 9.2a2.1 2.1 0 0 0-3-3L6.6 15.6 4 20Z" />
        <path d="M13 8 16 11" />
      </svg>
    );
  }

  if (normalizedTitle.includes("fundamentals")) {
    return (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <rect x="8" y="8" width="8" height="8" rx="1.5" />
        <path d="M4 10h4M4 14h4M16 10h4M16 14h4M10 4v4M14 4v4M10 16v4M14 16v4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
    </svg>
  );
}

const skillCategoryDetails: Record<string, { headline: string; detail: string; archiveNote: string }> = {
  "Core backend": {
    headline: "Services, APIs, and testable business logic.",
    detail:
      "This is the layer I use to build production service boundaries: Java and Spring Boot for enterprise APIs, Python and Flask for smaller workflow services, and testing tools to keep changes reliable.",
    archiveNote: "Infrastructure of empire: typed boundaries, durable APIs, and controlled change.",
  },
  "Distributed data": {
    headline: "Event streams, caches, and persistent data paths.",
    detail:
      "These tools support high-volume systems where ordering, latency, and data access patterns matter. Kafka moves events, Redis handles hot paths, and the databases cover durable records and read models.",
    archiveNote: "Psychohistory substrate: events, memory, and records moving through time.",
  },
  "Cloud delivery": {
    headline: "Repeatable deployment and operational handoff.",
    detail:
      "This stack keeps services shippable: containers, Kubernetes workloads, CI/CD movement, Jenkins/GitLab automation, and Vault-backed secret handling across environments.",
    archiveNote: "Terminus network: repeatable deployments across shifting environments.",
  },
  Frontend: {
    headline: "Operator-facing interfaces for system state.",
    detail:
      "Frontend work is mostly about making backend and platform state understandable: dashboards, controls, comparison views, and interactive systems labs.",
    archiveNote: "Encyclopedia interface: making hidden system state readable to the operator.",
  },
  "Supporting stack": {
    headline: "Cloud, API, and validation tools around delivery.",
    detail:
      "These tools support the surrounding workflow: cloud deployment targets, API inspection, and test execution for integration-heavy systems.",
    archiveNote: "Vault utilities: the tools around the plan that keep the work observable.",
  },
  "Engineering fundamentals": {
    headline: "The reasoning layer behind the tools.",
    detail:
      "Algorithms, object modeling, databases, operating systems, and networks shape the tradeoffs behind service design, concurrency, storage, and delivery decisions.",
    archiveNote: "Prime Radiant layer: models, constraints, and the math behind the choices.",
  },
};

const shortSkillLabels: Record<string, string> = {
  "Cloud delivery": "Cloud",
  "Core backend": "Backend",
  "Distributed data": "Data",
  "Engineering fundamentals": "Fundamentals",
  Frontend: "UI",
  "Supporting stack": "Tools",
};

export default function SkillsSection() {
  const [activeSkillTitle, setActiveSkillTitle] = useState(resume.skills[0]?.title ?? "");
  const activeSkill = useMemo(
    () => resume.skills.find((section) => section.title === activeSkillTitle) ?? resume.skills[0],
    [activeSkillTitle]
  );
  const activeSkillDetails = skillCategoryDetails[activeSkill.title];

  return (
    <section id="skills" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">&gt; section:skills</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Core stack for backend and platform delivery.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          Focused around the tools I use most for Java services, distributed data flows, Kubernetes delivery, and internal developer tooling.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.35fr)_minmax(16rem,0.95fr)]">
        <div
          className="grid grid-cols-2 gap-2 border-y border-border/70 py-3 sm:grid-cols-3 lg:flex lg:flex-col lg:border-y-0"
          role="group"
          aria-label="Skill categories"
        >
          {resume.skills.map((section) => {
            const active = section.title === activeSkill.title;

            return (
              <button
                key={section.title}
                type="button"
                aria-current={active ? "true" : undefined}
                title={skillCategoryDetails[section.title]?.archiveNote}
                className={`inline-flex min-w-0 items-center gap-2 border px-2.5 py-2 text-left transition lg:w-full lg:px-3 ${
                  active
                    ? "border-primary/70 bg-primary/10 text-foreground"
                    : "border-border/70 bg-card/45 text-muted-foreground hover:border-primary/45 hover:text-foreground dark:bg-background/35"
                }`}
                onClick={() => setActiveSkillTitle(section.title)}
              >
                <span className="grid size-8 place-items-center border border-primary/30 bg-primary/10 text-primary">
                  <SkillCategoryIcon title={section.title} />
                </span>
                <span className="min-w-0 truncate font-mono text-[0.64rem] font-semibold uppercase tracking-[0.1em] sm:text-[0.68rem] lg:tracking-[0.13em]">
                  {shortSkillLabels[section.title] ?? section.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="min-w-0 border border-primary/25 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
          <div className="flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">psychohistory.substrate</p>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">{activeSkill.title}</h3>
            </div>
            <span className="grid size-12 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
              <SkillCategoryIcon title={activeSkill.title} />
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {activeSkill.items.map((item) => (
              <Badge key={item} variant="outline" className="gap-2 rounded-none px-3.5 py-2.5 font-mono text-[0.78rem] uppercase tracking-[0.12em]">
                <BrandTechnologyIcon name={item} />
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="min-w-0 border border-primary/25 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">archive.annotation</p>
          <p className="mt-2 text-sm font-medium leading-6 text-foreground">
            {activeSkillDetails.headline}
          </p>
          <p className="mt-4 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">
            {activeSkillDetails.detail}
          </p>
          <p className="mt-4 border-t border-primary/25 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-primary">
            {activeSkillDetails.archiveNote}
          </p>
        </div>
      </div>
    </section>
  );
}
