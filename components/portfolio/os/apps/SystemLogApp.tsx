"use client";

import { resume } from "@/lib/resume";

export default function SystemLogApp() {
  return (
    <div className="space-y-8 p-5 sm:p-7">
      <header>
        <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          system log // provenance
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          Service record
        </h1>
      </header>

      <section aria-label="Experience">
        <p className="mb-3 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          deployments
        </p>
        <ol className="ml-2 border-l border-border/60 pl-5">
          {resume.experience.map((item) => (
            <li key={`${item.company}-${item.period}`} className="relative pb-6 last:pb-0">
              <span
                className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-primary bg-background"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h2 className="font-semibold tracking-[-0.01em] text-foreground">
                  {item.role} · {item.company}
                </h2>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {item.period}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.location}</p>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {item.projects.map((project) => (
                  <li key={project.title} className="text-foreground/80">
                    {project.title}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Education">
        <p className="mb-3 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          origin
        </p>
        <ol className="ml-2 border-l border-border/60 pl-5">
          {resume.education.map((item) => (
            <li key={item.degree} className="relative pb-6 last:pb-0">
              <span
                className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border border-gold bg-background"
                aria-hidden="true"
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h2 className="font-semibold tracking-[-0.01em] text-foreground">{item.degree}</h2>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {item.period}
                </span>
              </div>
              <a
                href={item.schoolHref}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 inline-block text-sm text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {item.school} · {item.location}
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
