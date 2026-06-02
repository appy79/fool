"use client";

import { useEffect } from "react";
import { resume, type ResolvedContactInfo } from "@/lib/resume";
import { PrimeRadiantGlyph, OrbitalRing } from "../icons/FoundationMotifs";
import SocialIcon from "../icons/SocialIcon";

type LockScreenProps = {
  contact: ResolvedContactInfo;
  onEnter: () => void;
};

export default function LockScreen({ contact, onEnter }: LockScreenProps) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onEnter();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter]);

  const contactLinks = [
    contact.email ? { label: contact.email, href: `mailto:${contact.email}` } : null,
    contact.phone
      ? { label: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` }
      : null,
  ].filter((item): item is { label: string; href: string } => Boolean(item));

  return (
    <div className="os-fade-in flex h-full w-full items-center justify-center overflow-y-auto px-4 py-10">
      <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 shadow-[0_30px_90px_-30px_color-mix(in_oklch,var(--primary)_45%,transparent)] ring-1 ring-primary/10 sm:p-9 dark:ring-primary/20">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <PrimeRadiantGlyph className="size-3.5 text-primary" />
            Terminus // access
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="status-dot" aria-hidden="true" />
            online
          </span>
        </div>

        <p className="mt-7 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
          {resume.title} / {resume.focus}
        </p>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl dark:[text-shadow:0_0_36px_color-mix(in_oklch,var(--primary)_30%,transparent)]">
          {resume.name}
        </h1>
        <div
          className="mt-5 h-px w-40 bg-gradient-to-r from-primary via-gold to-transparent"
          aria-hidden="true"
        />

        <ul className="mt-7 grid gap-3 sm:grid-cols-3" aria-label="Highlights">
          {resume.proofPoints.map((point) => (
            <li
              key={point.label}
              className="border border-border/60 bg-card/40 p-3 backdrop-blur-sm"
            >
              <span className="flex items-center gap-1.5 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-primary">
                <OrbitalRing className="size-3 text-gold" />
                {point.label}
              </span>
              <span className="mt-1.5 block text-sm font-semibold tracking-[-0.01em] text-foreground">
                {point.value}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
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
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="break-words font-mono underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {item.label}
            </a>
          ))}
          {contact.socials?.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.label}, opens in a new tab`}
              className="inline-flex items-center gap-2 underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <SocialIcon label={social.label} />
              <span>{social.label}</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          autoFocus
          onClick={onEnter}
          className="group mt-9 inline-flex w-full items-center justify-between gap-4 border border-primary/50 bg-primary/10 px-5 py-4 text-left transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none sm:w-auto"
        >
          <span className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
            Enter the system
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-primary transition-transform group-hover:translate-x-1"
          >
            &gt;_
          </span>
        </button>
        <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
          press enter
        </p>
      </div>
    </div>
  );
}
