"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { resume, type ResolvedContactInfo } from "@/lib/resume";
import { OrbitalRing, PrimeRadiantGlyph } from "../icons/FoundationMotifs";
import AvailabilityBadge from "./AvailabilityBadge";
import CopyEmailButton from "./CopyEmailButton";
import SocialLinks from "./SocialLinks";
import { APPS, preloadApp } from "./appRegistry";
import { useOSSettings } from "./osSettings";
import { writeDeepLink } from "./urlState";

type LockScreenProps = {
  contact: ResolvedContactInfo;
  onEnter: () => void;
  /** Warms both OS shell chunks (desktop + mobile) so resizing across the breakpoint is seamless. */
  preloadShells: () => Promise<unknown>;
};

export default function LockScreen({ contact, onEnter, preloadShells }: LockScreenProps) {
  const { installedApps, hydrated } = useOSSettings();

  // Modules that should be present on entry: the auto-opened operator profile plus the
  // visitor's installed user modules (defaults for a first-timer, or their stored set).
  const bootIds = useMemo(() => ["operator", ...installedApps], [installedApps]);
  const moduleTotal = bootIds.length;

  const [shellReady, setShellReady] = useState(false);
  const [modulesReady, setModulesReady] = useState(false);
  const [moduleLoaded, setModuleLoaded] = useState(0);
  const enterRef = useRef<HTMLButtonElement>(null);

  // The system check is the loading bar; Enter unlocks only once every step passes.
  const ready = hydrated && shellReady && modulesReady;

  // Keyboard entry is gated on the same readiness as the button.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Enter" && ready) {
        event.preventDefault();
        onEnter();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onEnter, ready]);

  // Move focus to the CTA the moment the system check completes. `preventScroll` keeps the
  // scroll position at the top — the button sits near the bottom, so a scrolling focus would
  // strand a tall (mobile) lock screen scrolled past its header.
  useEffect(() => {
    if (ready) enterRef.current?.focus({ preventScroll: true });
  }, [ready]);

  // Spend the time on the boot screen fetching the shells and the modules that should be
  // present, so entering is instant. Runs once stored preferences are hydrated, so a
  // returning visitor warms their saved module set rather than just the defaults. Both
  // shells are fetched so resizing across the desktop/mobile breakpoint never stalls.
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;

    preloadShells().then(() => {
      if (!cancelled) setShellReady(true);
    });

    let done = 0;
    Promise.allSettled(
      bootIds.map((id) =>
        Promise.resolve(preloadApp(id))
          .catch(() => {})
          .finally(() => {
            if (cancelled) return;
            done += 1;
            setModuleLoaded(done);
          }),
      ),
    ).then(() => {
      if (!cancelled) setModulesReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [hydrated, bootIds, preloadShells]);

  // Fast path for recruiters: enter straight into the condensed Dossier via a deep link.
  const quickGlance = () => {
    trackEvent("quick_glance");
    writeDeepLink("dossier");
    onEnter();
  };

  const systemCount = APPS.filter((app) => app.kind === "system" && !app.hidden).length;
  const userInstalled = APPS.filter(
    (app) => app.kind === "user" && installedApps.includes(app.id),
  ).length;

  const checks = [
    { k: "kernel", v: "TerminusOS", done: true },
    { k: "renderer", v: "canvas + react", done: true },
    { k: "preferences", v: hydrated ? "restored" : "reading…", done: hydrated },
    { k: "interface", v: shellReady ? "desktop + mobile" : "loading…", done: shellReady },
    {
      k: "modules",
      v: modulesReady
        ? `${systemCount} system · ${userInstalled} user`
        : `warming ${moduleLoaded}/${moduleTotal}`,
      done: modulesReady,
    },
  ];
  const checksPassed = checks.filter((check) => check.done).length;

  return (
    <div className="os-fade-in h-full w-full overflow-y-auto">
      <div className="flex min-h-full w-full items-center justify-center px-4 py-8 sm:py-10">
        <div className="glass-panel w-full max-w-4xl rounded-2xl p-6 shadow-[0_30px_90px_-30px_color-mix(in_oklch,var(--primary)_45%,transparent)] ring-1 ring-primary/10 sm:p-9 dark:ring-primary/20">
          <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
            <span className="inline-flex items-center gap-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <PrimeRadiantGlyph className="size-3.5 text-primary" />
              TerminusOS <span className="text-primary/70">v1.2</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="status-dot" aria-hidden="true" />
              online
            </span>
          </div>

          <div className="mt-7 grid gap-8 md:grid-cols-[1.5fr_1fr]">
            {/* Identity — contact channels anchored to the bottom so the column fills its height */}
            <div className="flex flex-col">
              <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-primary">
                {resume.title}
              </p>
              <h1 className="mt-2 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-foreground sm:text-6xl dark:[text-shadow:0_0_36px_color-mix(in_oklch,var(--primary)_30%,transparent)]">
                {resume.name}
              </h1>
              <div
                className="mt-4 h-px w-40 bg-gradient-to-r from-primary via-gold to-transparent"
                aria-hidden="true"
              />
              <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
                {resume.focus}.
              </p>

              <AvailabilityBadge className="mt-5" />

              <div className="mt-auto pt-7">
                <p className="font-mono text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
                  channels
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
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
                  {contact.email ? (
                    <CopyEmailButton email={contact.email} variant="inline" />
                  ) : null}
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                      className="break-words font-mono underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {contact.phone}
                    </a>
                  ) : null}
                </div>
                <SocialLinks socials={contact.socials} className="mt-3.5" />
              </div>
            </div>

            {/* System check — a self-contained instrument that also acts as the loader */}
            <div className="flex flex-col rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  system check
                </p>
                <span className="inline-flex items-center gap-1.5 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-primary">
                  {ready ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <span
                      className="inline-block size-2.5 animate-spin rounded-full border border-muted-foreground/40 border-t-primary"
                      aria-hidden="true"
                    />
                  )}
                  {ready ? "ready" : "checking"}
                </span>
              </div>
              <ul
                className="mt-3 space-y-2 font-mono text-[0.66rem]"
                aria-live="polite"
                aria-busy={!ready}
              >
                {checks.map((check, index) => (
                  <li
                    key={check.k}
                    className="os-fade-in flex items-center justify-between gap-3"
                    style={{ animationDelay: `${120 + index * 90}ms` } as CSSProperties}
                  >
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      {check.done ? (
                        <span className="text-primary" aria-hidden="true">
                          ✓
                        </span>
                      ) : (
                        <span
                          className="inline-block size-2.5 animate-spin rounded-full border border-muted-foreground/40 border-t-primary"
                          aria-hidden="true"
                        />
                      )}
                      {check.k}
                    </span>
                    <span className="text-right tabular-nums text-foreground">{check.v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/50 pt-3 font-mono text-[0.54rem] uppercase tracking-[0.16em] text-muted-foreground">
                <span>{ready ? "all systems nominal" : "warming modules"}</span>
                <span className="tabular-nums text-foreground">
                  {checksPassed}/{checks.length}
                </span>
              </div>
            </div>
          </div>

          {/* Highlights — promoted to a full-width band so the cards have room to breathe */}
          <ul className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Highlights">
            {resume.proofPoints.map((point) => (
              <li
                key={point.label}
                className="rounded-lg border border-border/60 bg-card/40 p-3.5 backdrop-blur-sm"
              >
                <span className="flex items-center gap-1.5 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-primary">
                  <OrbitalRing className="size-3 text-gold" />
                  {point.label}
                </span>
                <span className="mt-1.5 block text-base font-semibold tracking-[-0.01em] text-foreground">
                  {point.value}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            ref={enterRef}
            disabled={!ready}
            aria-disabled={!ready}
            onClick={onEnter}
            className={`group mt-8 inline-flex w-full items-center justify-between gap-4 rounded-lg border px-5 py-4 text-left transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
              ready
                ? "border-primary/50 bg-primary/10 hover:border-primary hover:bg-primary/15"
                : "cursor-not-allowed border-border/60 bg-card/30 opacity-60"
            }`}
          >
            <span className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-foreground">
              {ready ? "Enter the system" : "Running system check…"}
            </span>
            {ready ? (
              <span
                aria-hidden="true"
                className="font-mono text-primary transition-transform group-hover:translate-x-1"
              >
                {">_"}
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="inline-block size-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
              />
            )}
          </button>
          <p className="mt-3 text-center font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
            {ready
              ? "press enter or click to launch"
              : `preparing ${systemCount + userInstalled} modules…`}
          </p>

          <div className="mt-4 flex justify-center border-t border-border/50 pt-4">
            <button
              type="button"
              onClick={quickGlance}
              disabled={!ready}
              className="group inline-flex items-center gap-2 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              Short on time? Open the 30-second brief
              <span
                aria-hidden="true"
                className="text-primary transition-transform group-hover:translate-x-0.5"
              >
                {">_"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
