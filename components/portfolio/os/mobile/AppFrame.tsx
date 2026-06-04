"use client";

import { useEffect, useRef } from "react";
import { useAppSlot } from "../AppRuntime";
import { useOSSettings } from "../osSettings";
import { type AppDefinition, useOS, type WindowState } from "../osStore";

export default function AppFrame({ win, app }: { win: WindowState; app: AppDefinition }) {
  const { closeWindow } = useOS();
  const { allowHorizontalScroll } = useOSSettings();
  const frameRef = useRef<HTMLElement>(null);
  // The app body is mounted once by the persistent process layer and reparented here.
  const slotRef = useAppSlot(win.key);

  useEffect(() => {
    frameRef.current?.focus();
  }, [win.key]);

  return (
    <section
      ref={frameRef}
      aria-label={win.title}
      tabIndex={-1}
      className="os-app-in absolute inset-0 flex flex-col bg-background/80 focus-visible:outline-none"
    >
      <header className="z-20 flex h-11 shrink-0 items-center gap-2 border-b border-border/60 bg-card/80 px-2 backdrop-blur-md">
        <button
          type="button"
          onClick={() => closeWindow(win.key)}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary transition hover:bg-accent/30 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M14.5 5 8 12l6.5 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Home
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <app.Icon className="size-3.5 shrink-0 text-primary" />
          <span className="truncate font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground">
            {win.title}
          </span>
        </div>
        <span className="w-[4.5rem]" aria-hidden="true" />
      </header>
      <div
        ref={slotRef}
        className={`@container min-h-0 flex-1 overflow-y-auto ${
          allowHorizontalScroll ? "overflow-x-auto" : "overflow-x-hidden"
        }`}
      />
    </section>
  );
}
