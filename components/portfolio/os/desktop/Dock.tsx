"use client";

import {
  Fragment,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useNotifications } from "../notifications";
import { useOSSettings } from "../osSettings";
import { type AppDefinition, useOS } from "../osStore";
import { type MenuItem, useContextMenu } from "./ContextMenu";

// macOS-style dock magnification tuning.
const ICON_BASE = 44; // px — resting icon size when there is room to spare
const ICON_MIN = 30; // px — smallest the icons shrink to before the dock scrolls
const MAX_SCALE = 1.7; // peak magnification directly under the cursor
const RADIUS = 120; // px of influence on either side of the cursor
const DOCK_GUTTER = 28; // px reserved on the sides so the pill never touches the edge
const MENU_BAR = 40; // px — height of the fixed top status bar (h-10) the left dock must clear

// Magnification pushes neighbours outward, growing the dock along its main axis by a bounded
// amount — the area under the cosine bump, which is independent of icon count. Reserving that
// much headroom when fitting keeps a fully-magnified dock inside its pill instead of spilling
// the end icons out past its rounded edge. (4·RADIUS/π is the integral of the bump.)
const MAGNIFY_HEADROOM = Math.round((MAX_SCALE - 1) * ((4 * RADIUS) / Math.PI)); // ≈ 107px

// Smooth cosine bump: 1 directly under the cursor, easing to 0 at the radius edge.
function magnify(distance: number) {
  const d = Math.abs(distance);
  if (d >= RADIUS) return 1;
  return 1 + (MAX_SCALE - 1) * Math.cos((d / RADIUS) * (Math.PI / 2));
}

export default function Dock() {
  const { apps, windows, openApp, closeWindow } = useOS();
  const { installedApps, reduceMotion, dockPosition, uninstallApp } = useOSSettings();
  const { notify } = useNotifications();
  const { openMenu } = useContextMenu();
  const vertical = dockPosition === "left";

  const hasWindow = (appId: string) => windows.some((win) => win.appId === appId);
  const visibleApps = apps.filter(
    (app) => !app.hidden && (app.kind !== "user" || installedApps.includes(app.id)),
  );

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  // Cursor position along the dock's main axis (null when not hovering).
  const [pointer, setPointer] = useState<number | null>(null);
  // Each icon's resting center along the main axis, so magnification never feeds back.
  const [centers, setCenters] = useState<number[]>([]);
  // Resting icon size, shrunk so every installed app fits on one row/column.
  const [iconSize, setIconSize] = useState(ICON_BASE);
  const iconSizeRef = useRef(ICON_BASE);
  // Last-resort scroll when even the smallest icons overflow.
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    iconSizeRef.current = iconSize;
  }, [iconSize]);

  // Fit the resting dock to the available extent along its main axis. The non-icon size
  // (gaps, padding, dividers) is invariant of icon size, so one measurement solves it.
  const fit = useCallback(() => {
    const nav = navRef.current;
    const count = itemRefs.current.filter(Boolean).length;
    if (!nav || count === 0) return;
    const parent = nav.parentElement;
    const extent = vertical
      ? (parent?.clientHeight ?? window.innerHeight)
      : (parent?.clientWidth ?? window.innerWidth);
    // Reserve the side gutter, room for the magnification bump (unless motion is reduced), and —
    // for the left dock — the top status bar it must sit below.
    const headroom = reduceMotion ? 0 : MAGNIFY_HEADROOM;
    const available = extent - DOCK_GUTTER - headroom - (vertical ? MENU_BAR : 0);
    const content = vertical ? nav.scrollHeight : nav.scrollWidth;
    const overhead = content - count * iconSizeRef.current;
    const fitted = (available - overhead) / count;
    const needsScroll = fitted < ICON_MIN;
    const next = needsScroll ? ICON_MIN : Math.min(ICON_BASE, Math.floor(fitted));
    setScrollable(needsScroll);
    setIconSize((prev) => (Math.abs(prev - next) >= 1 ? next : prev));
  }, [vertical, reduceMotion]);

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const origin = vertical ? navRect.top : navRect.left;
    setCenters(
      itemRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return vertical ? rect.top - origin + rect.height / 2 : rect.left - origin + rect.width / 2;
      }),
    );
  }, [vertical]);

  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit, visibleApps.length]);

  // Re-cache icon centers whenever the resting layout changes.
  useEffect(() => {
    measure();
  }, [measure, iconSize, visibleApps.length]);

  useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const magnifyOff = reduceMotion || scrollable;

  const handleMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (magnifyOff || event.pointerType !== "mouse") return;
    const nav = navRef.current;
    if (!nav) return;
    const rect = nav.getBoundingClientRect();
    const value = vertical ? event.clientY - rect.top : event.clientX - rect.left;
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setPointer(value));
  };

  const handleLeave = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setPointer(null);
  };

  const launch = (app: AppDefinition) => {
    if (app.href) {
      window.open(app.href, app.external ? "_blank" : "_self", "noopener,noreferrer");
    } else {
      openApp(app.id);
    }
  };

  const openItemMenu = (event: ReactMouseEvent, app: AppDefinition) => {
    const running = hasWindow(app.id);
    const items: MenuItem[] = [
      { label: app.external ? `${app.title} ↗` : "Open", onSelect: () => launch(app) },
    ];
    if (running) {
      items.push({
        label: "Close",
        onSelect: () =>
          windows.filter((w) => w.appId === app.id).forEach((w) => closeWindow(w.key)),
      });
    }
    if (app.kind === "user") {
      items.push({
        label: "Reveal in App Store",
        onSelect: () => openApp("appstore"),
        separatorBefore: true,
      });
      items.push({
        label: "Uninstall",
        danger: true,
        onSelect: () => {
          uninstallApp(app.id);
          notify(`${app.title} removed`, { tone: "warn" });
        },
      });
    }
    openMenu(event, items);
  };

  const navClass = vertical
    ? // top-10 clears the fixed menu bar; my-auto then centres the dock in the space beneath it.
      `os-dock-scroll absolute left-3 top-10 bottom-3 z-[9000] my-auto flex h-fit max-h-[calc(100vh-3.25rem)] flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-card/70 px-2 py-2.5 shadow-2xl backdrop-blur-md ${
        scrollable ? "overflow-y-auto" : ""
      }`
    : `os-dock-scroll absolute inset-x-0 bottom-3 z-[9000] mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-end gap-1.5 rounded-2xl border border-border/60 bg-card/70 px-2.5 py-2 shadow-2xl backdrop-blur-md ${
        scrollable ? "overflow-x-auto" : ""
      }`;

  return (
    <nav
      ref={navRef}
      aria-label="Dock"
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      className={navClass}
    >
      {visibleApps.map((app, index) => {
        const external = Boolean(app.href && app.external);
        const tooltip = external ? `${app.title} ↗` : app.title;

        const scale = pointer == null || magnifyOff ? 1 : magnify(pointer - (centers[index] ?? 0));
        const lift = (scale - 1) * iconSize; // how far the icon overflows past the dock edge
        const spread = lift / 2; // margin that pushes neighbours apart symmetrically

        const dot = (
          <span
            className={`size-1 rounded-full transition ${vertical ? "mr-1" : "mt-1"} ${
              hasWindow(app.id) ? "bg-primary" : "bg-transparent"
            }`}
            aria-hidden="true"
          />
        );

        const content = (
          <>
            <span
              className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-md border border-border/60 bg-card/95 px-2 py-1 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-foreground opacity-0 shadow-lg backdrop-blur transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                vertical ? "left-full top-1/2" : "-top-9 left-1/2"
              }`}
              style={{
                transform: vertical ? `translate(${lift}px, -50%)` : `translate(-50%, ${-lift}px)`,
              }}
            >
              {tooltip}
            </span>
            {vertical ? dot : null}
            <span
              className={`grid shrink-0 place-items-center rounded-2xl border border-border/60 bg-gradient-to-b from-card/85 to-background/40 text-primary shadow-sm transition-[border-color,background-color,box-shadow,transform] duration-150 ease-out group-hover:border-primary/60 group-hover:from-primary/15 group-hover:to-card/60 group-focus-visible:ring-3 group-focus-visible:ring-ring/60 ${
                vertical ? "origin-left" : "origin-bottom"
              }`}
              style={{ width: iconSize, height: iconSize, transform: `scale(${scale})` }}
            >
              <app.Icon className="size-5" />
            </span>
            {vertical ? null : dot}
          </>
        );

        const baseClass = `os-dock-item group relative flex items-center rounded-2xl px-0.5 transition-[margin] duration-150 ease-out focus-visible:outline-none ${
          vertical ? "flex-row" : "flex-col"
        }`;
        const itemStyle = vertical
          ? ({ marginTop: spread, marginBottom: spread } as const)
          : ({ marginLeft: spread, marginRight: spread } as const);

        return (
          <Fragment key={app.id}>
            {app.dividerBefore ? (
              <span
                aria-hidden="true"
                className={
                  vertical
                    ? "my-0.5 h-px w-9 self-center bg-border/70"
                    : "mx-0.5 mb-3 h-9 w-px self-center bg-border/70"
                }
              />
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
                onContextMenu={(event) => openItemMenu(event, app)}
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
                onContextMenu={(event) => openItemMenu(event, app)}
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
