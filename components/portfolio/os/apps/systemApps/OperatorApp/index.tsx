"use client";

import { resume } from "@/lib/resume";
import HeroPortraitCard from "./HeroPortraitCard";
import { OrbitalRing, PrimeRadiantGlyph } from "../../../../icons/FoundationMotifs";
import AvailabilityBadge from "../../../AvailabilityBadge";
import CopyEmailButton from "../../../CopyEmailButton";
import SocialLinks from "../../../SocialLinks";
import { useOS } from "../../../osStore";
import { copy } from "./data";

export default function OperatorApp() {
  const { contact, openApp } = useOS();

  return (
    <div className="p-4 @lg:p-6">
      <div className="mx-auto w-full max-w-5xl space-y-5">
        {/* Identity banner — portrait + name, status, quick facts, and the primary action */}
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/40">
          <div className="grid @2xl:grid-cols-[20rem_1fr]">
            <div className="border-b border-border/60 p-4 @2xl:border-b-0 @2xl:border-r @2xl:p-5">
              <div className="mx-auto w-full max-w-[20rem]">
                <HeroPortraitCard />
              </div>
            </div>

            <div className="min-w-0 p-5 @lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
                  <PrimeRadiantGlyph className="size-3.5" />
                  {copy.eyebrow}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 font-mono text-[0.52rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  <span className="status-dot" aria-hidden="true" />
                  {copy.statusLabel}
                </span>
              </div>

              <h1 className="mt-3 font-display text-2xl font-semibold tracking-[-0.04em] text-foreground @sm:text-3xl @xl:text-4xl">
                {resume.name}
              </h1>
              <div
                className="mt-3 h-px w-28 bg-gradient-to-r from-primary via-gold to-transparent"
                aria-hidden="true"
              />
              <p className="mt-3 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {resume.title}
              </p>
              <p className="mt-2.5 max-w-xl text-sm leading-7 text-muted-foreground">
                {resume.focus}.
              </p>

              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Profile highlights">
                {resume.proofPoints.map((point) => (
                  <li
                    key={point.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-2.5 py-1"
                  >
                    <span className="font-mono text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-primary">
                      {point.label}
                    </span>
                    <span className="text-xs font-medium text-foreground">{point.value}</span>
                  </li>
                ))}
              </ul>

              <AvailabilityBadge className="mt-4" />

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => openApp("resume")}
                  className="group inline-flex items-center gap-2 rounded-lg border border-primary/45 bg-primary/10 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  {copy.resumeLabel}
                  <span
                    aria-hidden="true"
                    className="text-primary transition-transform group-hover:translate-x-0.5"
                  >
                    &gt;
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Channels — copy-to-clipboard email, phone, and social profiles */}
        <section className="rounded-2xl border border-border/70 bg-card/40 p-5 @lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="status-dot" aria-hidden="true" />
              {copy.channelsEyebrow}
            </span>
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted-foreground/70">
              {copy.channelsHint}
            </span>
          </div>
          <p className="mt-2.5 text-sm text-muted-foreground">
            {copy.basedLead}{" "}
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
            {copy.basedTrail}
          </p>

          {contact.email || contact.phone ? (
            <div className="mt-4 grid gap-3 @md:grid-cols-2">
              {contact.email ? (
                <CopyEmailButton
                  email={contact.email}
                  label={copy.emailLabel}
                  variant="card"
                  className="@md:col-span-2"
                />
              ) : null}
              {contact.phone ? (
                <a
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="group flex items-center justify-between gap-3 border border-border/70 bg-card/50 p-4 transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
                      {copy.phoneLabel}
                    </span>
                    <span className="mt-1 block break-all font-medium text-foreground">
                      {contact.phone}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-mono text-primary transition-transform group-hover:translate-x-0.5"
                  >
                    &gt;
                  </span>
                </a>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{copy.emptyChannels}</p>
          )}

          <SocialLinks socials={contact.socials} className="mt-4" />
        </section>

        {/* Telemetry board — career-peak readouts presented as an instrument cluster */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <OrbitalRing className="size-3 text-gold" />
              {copy.telemetryEyebrow}
            </span>
            <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-muted-foreground/70">
              {copy.telemetryNote}
            </span>
          </div>
          <div className="mt-3 grid gap-3 @sm:grid-cols-2 @3xl:grid-cols-4">
            {resume.telemetry.map((reading) => (
              <div key={reading.label} className="instrument-panel">
                <span className="block font-mono text-[0.52rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {reading.label}
                </span>
                <span className="mt-2 block font-display text-2xl font-semibold tracking-[-0.03em] tabular-nums text-foreground">
                  {reading.value}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{reading.note}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
