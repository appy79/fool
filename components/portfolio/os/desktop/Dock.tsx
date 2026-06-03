"use client";

import {
  Fragment,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useOSSettings } from "../osSettings";
import { useOS } from "../osStore";

// macOS-style dock magnification tuning.
const ICON_BASE = 44; // px — matches the resting icon size (size-11)
const MAX_SCALE = 1.7; // peak magnification directly under the cursor
const RADIUS = 120; // px of influence on either side of the cursor

// Smooth cosine bump: 1 directly under the cursor, easing to 0 at the radius edge.
function magnify(distance: number) {
  const d = Math.abs(distance);
  if (d >= RADIUS) return 1;
  return 1 + (MAX_SCALE - 1) * Math.cos((d / RADIUS) * (Math.PI / 2));
}

export default function Dock() {
  const { apps, windows, openApp } = useOS();
  const { installedApps, reduceMotion } = useOSSettings();
  const hasWindow = (appId: string) => windows.some((win) => win.appId === appId);
  const visibleApps = apps.filter(
    (app) => !app.hidden && (app.kind !== "user" || installedApps.includes(app.id)),
  );

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  // Cursor position relative to the dock's left edge (null when not hovering).
  const [pointer, setPointer] = useState<number | null>(null);
  // Each icon's resting center, so magnification never feeds back into itself.
  const [centers, setCenters] = useState<number[]>([]);

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const navLeft = nav.getBoundingClientRect().left;
    setCenters(
      itemRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.left - navLeft + rect.width / 2;
      }),
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, reduceMotion, visibleApps.length]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const handleMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const nav = navRef.current;
    if (!nav) return;
    const x = event.clientX - nav.getBoundingClientRect().left;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPointer(x));
  };

  const handleLeave = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setPointer(null);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Dock"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      className="absolute inset-x-0 bottom-3 z-[9000] mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-end gap-1.5 rounded-2xl border border-border/60 bg-card/70 px-2.5 py-2 shadow-2xl backdrop-blur-md"
    >
      {visibleApps.map((app, index) => {
        const external = Boolean(app.href && app.external);
        const tooltip = external ? `${app.title} ↗` : app.title;

        const scale =
          pointer == null || reduceMotion ? 1 : magnify(pointer - (centers[index] ?? 0));
        const lift = (scale - 1) * ICON_BASE; // how far the icon overflows upward
        const spread = lift / 2; // margin that pushes neighbours apart symmetrically

        const content = (
          <>
            <span
              className="pointer-events-none absolute -top-9 left-1/2 z-10 whitespace-nowrap rounded-md border border-border/60 bg-card/95 px-2 py-1 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-foreground opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{ transform: `translate(-50%, ${-lift}px)` }}
            >
              {tooltip}
            </span>
            <span
              className="grid size-11 origin-bottom place-items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card/85 to-background/40 text-primary shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-150 ease-out group-hover:border-primary/60 group-hover:from-primary/15 group-hover:to-card/60 group-focus-visible:ring-3 group-focus-visible:ring-ring/60"
              style={{ transform: `scale(${scale})` }}
            >
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
          "os-dock-item group relative flex flex-col items-center rounded-2xl px-0.5 transition-[margin] duration-150 ease-out focus-visible:outline-none";
        const itemStyle = { marginLeft: spread, marginRight: spread } as const;

        return (
          <Fragment key={app.id}>
            {app.dividerBefore ? (
              <span aria-hidden="true" className="mx-0.5 mb-3 h-9 w-px self-center bg-border/70" />
            ) : null}
            {app.href ? (
              <Link
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                href={app.href}
                aria-label={external ? `${app.title}, opens in a new tab` : app.title}
                title={app.title}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={baseClass}
                style={itemStyle}
              >
                {content}
              </Link>
            ) : (
              <button
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                aria-label={`Open ${app.title}`}
                title={app.title}
                onClick={() => openApp(app.id)}
                className={baseClass}
                style={itemStyle}
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
