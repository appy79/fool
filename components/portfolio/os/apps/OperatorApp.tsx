"use client";

import { resume } from "@/lib/resume";
import HeroPortraitCard from "../../home/HeroPortraitCard";
import { OrbitalRing, PrimeRadiantGlyph } from "../../icons/FoundationMotifs";
import { useOS } from "../osStore";

export default function OperatorApp() {
  const { contact, openApp } = useOS();

  return (
    <div className="p-5 sm:p-7">
      <div className="grid gap-7 lg:grid-cols-[1fr_17rem] lg:items-start">
        <div className="space-y-7">
          <header>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <PrimeRadiantGlyph className="size-3.5" />
              operator // profile
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              {resume.name}
            </h1>
            <p className="mt-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {resume.title}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">{resume.focus}.</p>
          </header>

          <ul className="grid gap-3 sm:grid-cols-3" aria-label="Profile highlights">
            {resume.proofPoints.map((point) => (
              <li key={point.label} className="instrument-panel">
                <span className="flex items-center gap-1.5 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-primary">
                  <OrbitalRing className="size-3 text-gold" />
                  {point.label}
                </span>
                <span className="mt-1.5 block text-sm font-semibold tracking-[-0.01em] text-foreground">
                  {point.value}
                </span>
              </li>
            ))}
          </ul>

          <p className="border-t border-border/60 pt-5 text-sm text-muted-foreground">
            Based in{" "}
            {contact.locationHref ? (
              <a
                href={contact.locationHref}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {contact.location}
              </a>
            ) : (
              <span className="font-semibold text-foreground">{contact.location}</span>
            )}
            . Channels and socials live in Comms.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openApp("comms")}
              className="border border-primary/50 bg-primary/10 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              Open comms
            </button>
            <button
              type="button"
              onClick={() => openApp("resume")}
              className="border border-border/70 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              Résumé
            </button>
          </div>
        </div>

        <aside className="hidden lg:block">
          <HeroPortraitCard />
        </aside>
      </div>
    </div>
  );
}
