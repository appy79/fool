"use client";

import { resume } from "@/lib/resume";
import { OrbitalRing, PrimeRadiantGlyph } from "../../../../icons/FoundationMotifs";
import AvailabilityBadge from "../../../AvailabilityBadge";
import CopyEmailButton from "../../../CopyEmailButton";
import SocialLinks from "../../../SocialLinks";
import { useOS } from "../../../osStore";

/** Top items per skill group — enough to signal range without becoming a wall of tags. */
const focusAreas = resume.skills.map((group) => ({
  title: group.title,
  summary: group.items.slice(0, 5).join(" · "),
}));

const actions = [
  { id: "resume", label: "Open résumé", hint: "PDF" },
  { id: "cases", label: "See projects", hint: "case files" },
  { id: "operator", label: "Full profile", hint: "everything" },
] as const;

export default function DossierApp() {
  const { contact, openApp } = useOS();

  return (
    <div className="p-4 @lg:p-6">
      <div className="mx-auto w-full max-w-3xl space-y-5">
        {/* Identity — the one-line answer to "who is this?" */}
        <section>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <PrimeRadiantGlyph className="size-3.5" />
            Quick brief
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground @sm:text-3xl">
            {resume.name}
          </h1>
          <p className="mt-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {resume.title}
          </p>
          <p className="mt-2.5 max-w-xl text-sm leading-7 text-muted-foreground">{resume.focus}.</p>
          <AvailabilityBadge className="mt-4" />
        </section>

        {/* Primary actions — the things a recruiter actually wants to do */}
        <div className="grid gap-2 @sm:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => openApp(action.id)}
              className="group flex items-center justify-between gap-2 rounded-lg border border-primary/40 bg-primary/10 px-3.5 py-2.5 text-left transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <span className="min-w-0">
                <span className="block font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-foreground">
                  {action.label}
                </span>
                <span className="block font-mono text-[0.5rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {action.hint}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 font-mono text-primary transition-transform group-hover:translate-x-0.5"
              >
                &gt;
              </span>
            </button>
          ))}
        </div>

        {/* By the numbers — career-peak readouts */}
        <section>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <OrbitalRing className="size-3 text-gold" />
            By the numbers
          </span>
          <div className="mt-3 grid gap-2 @sm:grid-cols-2 @2xl:grid-cols-4">
            {resume.telemetry.map((reading) => (
              <div key={reading.label} className="instrument-panel">
                <span className="block font-mono text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {reading.label}
                </span>
                <span className="mt-1.5 block font-display text-xl font-semibold tracking-[-0.03em] tabular-nums text-foreground">
                  {reading.value}
                </span>
                <span className="mt-1 block text-[0.7rem] text-muted-foreground">
                  {reading.note}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Focus areas — the shape of the toolkit */}
        <section>
          <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Focus areas
          </span>
          <ul className="mt-3 grid gap-2 @xl:grid-cols-2">
            {focusAreas.map((area) => (
              <li key={area.title} className="rounded-lg border border-border/70 bg-card/40 p-3">
                <span className="block font-semibold tracking-[-0.01em] text-foreground">
                  {area.title}
                </span>
                <span className="mt-1 block text-[0.78rem] leading-6 text-muted-foreground">
                  {area.summary}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Reach me — copy email + socials, no scraping-friendly mailto */}
        <section>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="status-dot" aria-hidden="true" />
            Reach me
          </span>
          <p className="mt-2 text-sm text-muted-foreground">
            Based in <span className="font-semibold text-foreground">{contact.location}</span>.
          </p>
          {contact.email ? (
            <CopyEmailButton email={contact.email} label="Email" variant="card" className="mt-3" />
          ) : null}
          <SocialLinks socials={contact.socials} className="mt-3" />
        </section>
      </div>
    </div>
  );
}
