"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useOS } from "../osStore";

export default function Dock() {
  const { apps, windows, openApp } = useOS();
  const hasWindow = (appId: string) => windows.some((win) => win.appId === appId);
  const visibleApps = apps.filter((app) => !app.hidden);

  return (
    <nav
      aria-label="Dock"
      className="absolute inset-x-0 bottom-3 z-[9000] mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-end gap-1.5 overflow-x-auto rounded-2xl border border-border/60 bg-card/70 px-2.5 py-2 shadow-2xl backdrop-blur-md"
    >
      {visibleApps.map((app) => {
        const external = Boolean(app.href && app.external);
        const tooltip = external ? `${app.title} ↗` : app.title;
        const content = (
          <>
            <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-card/95 px-2 py-1 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-foreground opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
              {tooltip}
            </span>
            <span className="grid size-11 place-items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card/85 to-background/40 text-primary shadow-sm transition group-hover:border-primary/60 group-hover:from-primary/15 group-hover:to-card/60 group-focus-visible:ring-3 group-focus-visible:ring-ring/60">
              <app.Icon className="size-5" />
            </span>
            <span
              className={`mt-1 size-1 rounded-full transition ${
                hasWindow(app.id) ? "bg-primary" : "bg-transparent"
              }`}
              aria-hidden="true"
            />
          </>
        );

        const baseClass =
          "os-dock-item group relative flex flex-col items-center rounded-2xl px-0.5 focus-visible:outline-none";

        return (
          <Fragment key={app.id}>
            {app.dividerBefore ? (
              <span
                aria-hidden="true"
                className="mx-0.5 mb-3 h-9 w-px self-center bg-border/70"
              />
            ) : null}
            {app.href ? (
              <Link
                href={app.href}
                aria-label={external ? `${app.title}, opens in a new tab` : app.title}
                title={app.title}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={baseClass}
              >
                {content}
              </Link>
            ) : (
              <button
                type="button"
                aria-label={`Open ${app.title}`}
                title={app.title}
                onClick={() => openApp(app.id)}
                className={baseClass}
              >
                {content}
              </button>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
