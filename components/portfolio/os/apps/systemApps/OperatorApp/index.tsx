"use client";

import { resume } from "@/lib/resume";
import HeroPortraitCard from "../../../../home/HeroPortraitCard";
import { OrbitalRing, PrimeRadiantGlyph } from "../../../../icons/FoundationMotifs";
import SocialIcon from "../../../../icons/SocialIcon";
import { useOS } from "../../../osStore";
import { copy } from "./data";

export default function OperatorApp() {
  const { contact, openApp } = useOS();

  const channels = [
    contact.email
      ? { label: copy.emailLabel, value: contact.email, href: `mailto:${contact.email}` }
      : null,
    contact.phone
      ? {
          label: copy.phoneLabel,
          value: contact.phone,
          href: `tel:${contact.phone.replace(/\s+/g, "")}`,
        }
      : null,
  ].filter((item): item is { label: string; value: string; href: string } => Boolean(item));

  return (
    <div className="p-5 sm:p-7">
      <div className="grid gap-7 lg:grid-cols-[1fr_17rem] lg:items-start">
        <div className="space-y-7">
          <header>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <PrimeRadiantGlyph className="size-3.5" />
              {copy.eyebrow}
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

          <section className="border-t border-border/60 pt-6">
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="status-dot" aria-hidden="true" />
              {copy.channelsEyebrow}
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
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

            {channels.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {channels.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="flex items-center justify-between gap-3 border border-border/70 bg-card/50 p-4 transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
                          {item.label}
                        </span>
                        <span className="mt-1 block break-all font-medium text-foreground">
                          {item.value}
                        </span>
                      </span>
                      <span aria-hidden="true" className="shrink-0 font-mono text-primary">
                        &gt;
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">{copy.emptyChannels}</p>
            )}

            {contact.socials && contact.socials.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {contact.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label}, opens in a new tab`}
                    className="inline-flex items-center gap-2 border border-border/70 px-3 py-2 text-sm text-foreground transition hover:border-primary/55 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
                  >
                    <SocialIcon label={social.label} />
                    {social.label}
                  </a>
                ))}
              </div>
            ) : null}
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openApp("resume")}
              className="border border-border/70 px-4 py-2.5 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {copy.resumeLabel}
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
