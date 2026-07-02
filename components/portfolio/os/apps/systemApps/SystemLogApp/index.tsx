"use client";

import { resume } from "@/lib/resume";
import { copy } from "./data";

export default function SystemLogApp() {
  const deploymentCount = resume.experience.reduce(
    (total, item) => total + item.projects.length,
    0,
  );

  return (
    <div className="space-y-7 p-6 @lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            {copy.eyebrow}
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            {copy.title}
          </h1>
        </div>
        <span className="shrink-0 rounded-full border border-border/70 px-2.5 py-1 font-mono text-[0.54rem] uppercase tracking-[0.16em] text-muted-foreground">
          {resume.experience.length} {copy.rolesLabel} · {deploymentCount} {copy.experienceLabel}
        </span>
      </header>

      <div className="grid gap-7 @4xl:grid-cols-[1.7fr_1fr] @4xl:gap-10 @4xl:items-start">
        <section aria-label="Experience">
          <p className="mb-4 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {copy.experienceLabel}
          </p>
          <ol className="ml-2 border-l border-border/60 pl-5">
            {resume.experience.map((item) => (
              <li key={`${item.company}-${item.period}`} className="relative pb-7 last:pb-0">
                <span
                  className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-primary bg-background"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-semibold tracking-[-0.01em] text-foreground">
                    {item.company}
                  </h2>
                  <span className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.period}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary">
                  {item.role}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.location}</p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {item.projects.map((project) => (
                    <li
                      key={project.title}
                      className="border border-border/60 bg-card/40 px-2 py-1 font-mono text-[0.62rem] tracking-[0.01em] text-foreground/85"
                    >
                      {project.title}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Education">
          <p className="mb-4 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {copy.educationLabel}
          </p>
          <ol className="ml-2 border-l border-border/60 pl-5">
            {resume.education.map((item) => (
              <li key={item.degree} className="relative pb-7 last:pb-0">
                <span
                  className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-gold bg-background"
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-semibold tracking-[-0.01em] text-foreground">
                    {item.degree}
                  </h2>
                  <span className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {item.period}
                  </span>
                </div>
                <a
                  href={item.schoolHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {item.school} · {item.location}
                </a>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
