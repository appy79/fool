"use client";

import Link from "next/link";
import { resume } from "@/lib/resume";
import { PrimeRadiantGlyph } from "../../icons/FoundationMotifs";
import { useOSSettings } from "../osSettings";
import { useOS } from "../osStore";

export default function HomeScreen() {
  const { apps, openApp } = useOS();
  const { installedApps } = useOSSettings();

  return (
    <div className="os-fade-in flex h-full flex-col gap-6 overflow-y-auto px-5 py-6">
      <section className="glass-panel rounded-2xl p-4 shadow-xl ring-1 ring-primary/10 dark:ring-primary/20">
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <span className="status-dot" aria-hidden="true" />
          operator // online
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          {resume.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{resume.title}</p>
      </section>

      <section aria-label="Apps" className="grid grid-cols-4 gap-x-3 gap-y-5">
        {apps
          .filter((app) => !app.hidden && (app.kind !== "user" || installedApps.includes(app.id)))
          .map((app) => {
            const tile = (
              <>
                <span className="grid size-14 place-items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card/85 to-background/40 text-primary shadow-lg backdrop-blur-sm transition active:scale-95">
                  <app.Icon className="size-6" />
                </span>
                <span className="mt-1.5 block max-w-[4.5rem] truncate text-center text-[0.62rem] font-medium text-foreground">
                  {app.shortLabel ?? app.title}
                </span>
              </>
            );
            const baseClass =
              "flex flex-col items-center focus-visible:outline-none focus-visible:[&>span:first-child]:ring-3 focus-visible:[&>span:first-child]:ring-ring/60";

            return app.href ? (
              <Link
                key={app.id}
                href={app.href}
                aria-label={app.external ? `${app.title}, opens in a new tab` : app.title}
                target={app.external ? "_blank" : undefined}
                rel={app.external ? "noreferrer" : undefined}
                className={baseClass}
              >
                {tile}
              </Link>
            ) : (
              <button
                key={app.id}
                type="button"
                aria-label={`Open ${app.title}`}
                onClick={() => openApp(app.id)}
                className={baseClass}
              >
                {tile}
              </button>
            );
          })}
      </section>

      <p className="mt-auto flex items-center justify-center gap-1.5 pt-4 font-mono text-[0.54rem] uppercase tracking-[0.2em] text-muted-foreground">
        <PrimeRadiantGlyph className="size-3 text-primary" />
        TerminusOS
      </p>
    </div>
  );
}
