"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
} from "react";
import { useAppSlot } from "../AppRuntime";
import {
  type AppDefinition,
  DOCK_H,
  EDGE_GAP,
  MENU_H,
  MIN_H,
  MIN_W,
  useOS,
  type WindowState,
} from "../osStore";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

// Eight drag zones: thin edge strips plus larger corner squares. Corners sit above the
// edges (z-10) so they win where they overlap. Rendered as divs (not buttons) so the
// global `button { cursor: pointer }` reset doesn't override the resize cursors.
const RESIZE_HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: "n", className: "inset-x-0 top-0 h-2 cursor-ns-resize" },
  { dir: "s", className: "inset-x-0 bottom-0 h-2 cursor-ns-resize" },
  { dir: "w", className: "inset-y-0 left-0 w-2 cursor-ew-resize" },
  { dir: "e", className: "inset-y-0 right-0 w-2 cursor-ew-resize" },
  { dir: "nw", className: "left-0 top-0 z-10 size-4 cursor-nwse-resize" },
  { dir: "ne", className: "right-0 top-0 z-10 size-4 cursor-nesw-resize" },
  { dir: "sw", className: "bottom-0 left-0 z-10 size-4 cursor-nesw-resize" },
  { dir: "se", className: "bottom-0 right-0 z-10 size-4 cursor-nwse-resize" },
];

export default function Window({ win, app }: { win: WindowState; app: AppDefinition }) {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
    focusedKey,
  } = useOS();
  const focused = focusedKey === win.key;
  const frameRef = useRef<HTMLElement>(null);
  // The app body is mounted once by the persistent process layer and reparented here.
  const slotRef = useAppSlot(win.key);

  // Move keyboard focus into a freshly opened window so it's immediately operable.
  useEffect(() => {
    frameRef.current?.focus();
  }, []);

  const startDrag = (event: ReactPointerEvent) => {
    if (win.maximized) return;
    focusWindow(win.key);
    const startX = event.clientX;
    const startY = event.clientY;
    const origX = win.x;
    const origY = win.y;
    const onMove = (ev: PointerEvent) => {
      const nx = clamp(origX + (ev.clientX - startX), 0, window.innerWidth - 120);
      const ny = clamp(origY + (ev.clientY - startY), MENU_H, window.innerHeight - DOCK_H - 16);
      moveWindow(win.key, nx, ny);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const startResize = (dir: ResizeDir) => (event: ReactPointerEvent) => {
    if (win.maximized) return;
    event.stopPropagation();
    event.preventDefault();
    focusWindow(win.key);
    const startX = event.clientX;
    const startY = event.clientY;
    const origX = win.x;
    const origY = win.y;
    const origW = win.w;
    const origH = win.h;
    // Edges opposite the dragged handle stay anchored.
    const right = origX + origW;
    const bottom = origY + origH;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let x = origX;
      let y = origY;
      let w = origW;
      let h = origH;

      if (dir.includes("e")) {
        w = clamp(origW + dx, MIN_W, window.innerWidth - origX - EDGE_GAP);
      }
      if (dir.includes("s")) {
        h = clamp(origH + dy, MIN_H, window.innerHeight - origY - DOCK_H - EDGE_GAP);
      }
      if (dir.includes("w")) {
        x = clamp(origX + dx, 0, right - MIN_W);
        w = right - x;
      }
      if (dir.includes("n")) {
        y = clamp(origY + dy, MENU_H, bottom - MIN_H);
        h = bottom - y;
      }
      resizeWindow(win.key, w, h, x, y);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const style: CSSProperties = win.maximized
    ? {
        left: 8,
        top: MENU_H + 6,
        width: "calc(100vw - 16px)",
        height: `calc(100vh - ${MENU_H + DOCK_H + 10}px)`,
        zIndex: win.z,
      }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <section
      ref={frameRef}
      aria-label={win.title}
      tabIndex={-1}
      className={`os-window-in absolute flex flex-col overflow-hidden rounded-xl border bg-card/95 shadow-2xl backdrop-blur-md focus-visible:outline-none ${
        focused
          ? "border-primary/55 shadow-[0_24px_70px_-20px_color-mix(in_oklch,var(--primary)_45%,transparent)]"
          : "border-border/70"
      }`}
      style={style}
      onPointerDown={() => focusWindow(win.key)}
    >
      <header
        className={`group/title flex shrink-0 cursor-grab items-center gap-3 border-b px-3 py-2 transition-colors active:cursor-grabbing ${
          focused ? "border-border/60 bg-card/85" : "border-border/40 bg-card/60"
        }`}
        onPointerDown={startDrag}
        onDoubleClick={() => toggleMaximize(win.key)}
      >
        <div
          className={`relative z-20 flex origin-left items-center gap-2.5 transition duration-150 ease-out group-hover/title:scale-[1.18] ${
            focused ? "" : "opacity-55"
          }`}
        >
          <button
            type="button"
            aria-label={`Close ${app.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWindow(win.key)}
            className="relative grid size-3.5 place-items-center rounded-full bg-destructive/85 text-[7px] font-black leading-none text-black/55 transition before:absolute before:-inset-x-1 before:-inset-y-2 before:content-[''] hover:bg-destructive focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity group-hover/title:opacity-100">✕</span>
          </button>
          <button
            type="button"
            aria-label={`Minimize ${app.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimizeWindow(win.key)}
            className="relative grid size-3.5 place-items-center rounded-full bg-gold/85 text-[8px] font-black leading-none text-black/55 transition before:absolute before:-inset-x-1 before:-inset-y-2 before:content-[''] hover:bg-gold focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity group-hover/title:opacity-100">–</span>
          </button>
          <button
            type="button"
            aria-label={`${win.maximized ? "Restore" : "Maximize"} ${app.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximize(win.key)}
            className="relative grid size-3.5 place-items-center rounded-full bg-primary/80 text-[7px] font-black leading-none text-black/55 transition before:absolute before:-inset-x-1 before:-inset-y-2 before:content-[''] hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity group-hover/title:opacity-100">
              {win.maximized ? "❐" : "＋"}
            </span>
          </button>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <app.Icon
            className={`size-3.5 shrink-0 ${focused ? "text-primary" : "text-muted-foreground"}`}
          />
          <span
            className={`truncate font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] ${
              focused ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {win.title}
          </span>
        </div>
      </header>

      <div ref={slotRef} className="@container min-h-0 flex-1 overflow-auto bg-background/40" />

      {!win.maximized ? (
        <>
          {RESIZE_HANDLES.map((handle) => (
            <div
              key={handle.dir}
              aria-hidden="true"
              onPointerDown={startResize(handle.dir)}
              className={`absolute touch-none ${handle.className}`}
            />
          ))}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-1 right-1 size-2.5 border-b-2 border-r-2 border-muted-foreground/50"
          />
        </>
      ) : null}
    </section>
  );
}
