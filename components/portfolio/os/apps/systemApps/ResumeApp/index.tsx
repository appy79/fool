"use client";

import { trackEvent } from "@/lib/analytics";
import { resume } from "@/lib/resume";
import { primaryResumeFile } from "@/lib/resume-files";
import BrandTechnologyIcon from "../../../../icons/BrandTechnologyIcon";
import { PrimeRadiantGlyph } from "../../../../icons/FoundationMotifs";
import CopyEmailButton from "../../../CopyEmailButton";
import SocialLinks from "../../../SocialLinks";
import { useOS } from "../../../osStore";
import { copy } from "./data";

function OpenGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
    </svg>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
      {children}
    </span>
  );
}

export default function ResumeApp() {
  const { contact } = useOS();

  return (
    <div className="p-6 @lg:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        {/* Header — the formal résumé masthead: identity, summary, and the document download */}
        <header className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
                <PrimeRadiantGlyph className="size-3.5" />
                {copy.eyebrow}
              </span>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground @sm:text-3xl">
                {resume.name}
              </h1>
              <p className="mt-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {resume.title} · {resume.focus}
              </p>
            </div>

            <a
              href={primaryResumeFile.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("open_resume", { file: primaryResumeFile.label })}
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary/45 bg-primary/10 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <OpenGlyph className="size-3.5 text-primary" />
              {copy.downloadLabel}
              <span className="sr-only"> (opens the PDF in a new tab)</span>
            </a>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{resume.summary}</p>

          {/* Contact — a light résumé contact line, not the Operator "channels" panel */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/50 pt-4 text-sm text-muted-foreground">
            <span>
              {contact.locationHref ? (
                <a
                  href={contact.locationHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {contact.location}
                </a>
              ) : (
                <span className="font-medium text-foreground">{contact.location}</span>
              )}
            </span>
            {contact.email ? (
              <CopyEmailButton email={contact.email} variant="inline" className="text-sm" />
            ) : null}
          </div>
          <SocialLinks socials={contact.socials} />
        </header>

        {/* Experience — the core of the résumé: roles with project bullets */}
        <section>
          <SectionEyebrow>{copy.experienceEyebrow}</SectionEyebrow>
          <div className="mt-4 space-y-6">
            {resume.experience.map((item) => (
              <article
                key={`${item.company}-${item.role}-${item.period}`}
                className="rounded-lg border border-border/70 bg-card/40 p-5 @lg:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h2 className="font-semibold tracking-[-0.01em] text-foreground">{item.role}</h2>
                  <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                    {item.period}
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary">
                  {item.company} · {item.location}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {item.projects.map((project) => (
                    <li key={project.title} className="flex gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70"
                      />
                      <p className="text-[0.82rem] leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">{project.title}.</span>{" "}
                        {project.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Skills — grouped categories with brand-icon chips */}
        <section>
          <SectionEyebrow>{copy.skillsEyebrow}</SectionEyebrow>
          <div className="mt-4 grid gap-4 @xl:grid-cols-2">
            {resume.skills.map((group) => (
              <div key={group.title} className="rounded-lg border border-border/70 bg-card/40 p-5">
                <h3 className="font-semibold tracking-[-0.01em] text-foreground">{group.title}</h3>
                <p className="mt-1 text-[0.78rem] leading-6 text-muted-foreground">
                  {group.summary}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="inline-flex items-center gap-2 border border-border/70 bg-card/50 py-1 pl-1 pr-2.5 text-xs font-medium text-foreground"
                    >
                      <BrandTechnologyIcon name={item} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education — degrees and institutions */}
        <section>
          <SectionEyebrow>{copy.educationEyebrow}</SectionEyebrow>
          <ul className="mt-4 space-y-2.5">
            {resume.education.map((entry) => (
              <li
                key={`${entry.degree}-${entry.school}`}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 rounded-lg border border-border/70 bg-card/40 px-4 py-3"
              >
                <span className="min-w-0">
                  <span className="font-semibold text-foreground">{entry.degree}</span>
                  <span className="text-muted-foreground">
                    {" — "}
                    {entry.schoolHref ? (
                      <a
                        href={entry.schoolHref}
                        target="_blank"
                        rel="noreferrer"
                        className="underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                      >
                        {entry.school}
                      </a>
                    ) : (
                      entry.school
                    )}
                    {" · "}
                    {entry.location}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                  {entry.period}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
