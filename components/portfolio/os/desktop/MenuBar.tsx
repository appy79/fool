"use client";

import { useEffect, useId, useRef, useState } from "react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { PrimeRadiantGlyph } from "../../icons/FoundationMotifs";
import Clock from "../Clock";
import { useOS } from "../osStore";

export default function MenuBar() {
  const { windows, focusedKey, appsById } = useOS();
  const focused = windows.find((win) => win.key === focusedKey);
  const activeApp = focused ? appsById.get(focused.appId) : undefined;

  return (
    <header className="absolute inset-x-0 top-0 z-[9000] flex h-10 items-center justify-between gap-3 border-b border-border/60 bg-card/70 px-3 backdrop-blur-md">
      <div className="flex items-center gap-1">
        <SystemMenu />
        <span className="hidden font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          {activeApp?.title ?? "Desktop"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-primary sm:inline-flex">
          <span className="status-dot" aria-hidden="true" />
          nominal
        </span>
        <Clock className="font-mono text-[0.62rem] font-semibold tabular-nums tracking-[0.1em] text-foreground" />
        <ThemeToggle className="size-7" />
      </div>
    </header>
  );
}

function SystemMenu() {
  const { openApp, closeAllWindows, lock, windows } = useOS();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const hasWindows = windows.length > 0;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Capture-phase + stopPropagation so closing the menu doesn't also trip
        // the window manager's Escape-to-close handler.
        event.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  const run = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-foreground transition hover:bg-primary/12 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none ${
          open ? "bg-primary/15" : ""
        }`}
      >
        <PrimeRadiantGlyph className="size-3.5 text-primary" />
        TerminusOS
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="TerminusOS"
          className="os-window-in absolute left-0 top-[calc(100%+0.4rem)] z-[9100] w-56 overflow-hidden rounded-xl border border-border/70 bg-card/95 p-1 shadow-2xl ring-1 ring-primary/10 backdrop-blur-md dark:ring-primary/20"
        >
          <MenuItem onSelect={() => run(() => openApp("operator"))}>About the operator</MenuItem>
          <MenuItem onSelect={() => run(() => openApp("settings"))}>Settings…</MenuItem>
          <div className="my-1 h-px bg-border/60" role="separator" />
          <MenuItem disabled={!hasWindows} onSelect={() => run(closeAllWindows)}>
            Close all windows
          </MenuItem>
          <MenuItem onSelect={() => run(lock)}>Lock screen</MenuItem>
        </div>
      ) : null}
    </div>
  );
}

function MenuItem({
  children,
  onSelect,
  disabled,
}: {
  children: React.ReactNode;
  onSelect: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onSelect}
      className="flex w-full items-center rounded-lg px-3 py-1.5 text-left text-[0.78rem] text-foreground transition hover:bg-primary/15 focus-visible:bg-primary/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-muted-foreground/50 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
