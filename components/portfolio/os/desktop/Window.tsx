"use client";

import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
} from "react";
import { type AppDefinition, useOS, type WindowState } from "../osStore";

const MENU_H = 40;
const DOCK_H = 92;
const MIN_W = 360;
const MIN_H = 260;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

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
  const Body = app.component;
  const focused = focusedKey === win.key;
  const frameRef = useRef<HTMLElement>(null);

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

  const startResize = (event: ReactPointerEvent) => {
    if (win.maximized) return;
    event.stopPropagation();
    focusWindow(win.key);
    const startX = event.clientX;
    const startY = event.clientY;
    const origW = win.w;
    const origH = win.h;
    const onMove = (ev: PointerEvent) => {
      const nw = clamp(origW + (ev.clientX - startX), MIN_W, window.innerWidth - win.x - 12);
      const nh = clamp(
        origH + (ev.clientY - startY),
        MIN_H,
        window.innerHeight - win.y - DOCK_H - 8,
      );
      resizeWindow(win.key, nw, nh);
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
          className={`flex items-center gap-2 transition-opacity ${focused ? "" : "opacity-55"}`}
        >
          <button
            type="button"
            aria-label={`Close ${app.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWindow(win.key)}
            className="grid size-3 place-items-center rounded-full bg-destructive/85 text-[7px] font-black leading-none text-black/55 transition hover:bg-destructive focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity group-hover/title:opacity-100">✕</span>
          </button>
          <button
            type="button"
            aria-label={`Minimize ${app.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimizeWindow(win.key)}
            className="grid size-3 place-items-center rounded-full bg-gold/85 text-[8px] font-black leading-none text-black/55 transition hover:bg-gold focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            <span className="opacity-0 transition-opacity group-hover/title:opacity-100">–</span>
          </button>
          <button
            type="button"
            aria-label={`${win.maximized ? "Restore" : "Maximize"} ${app.title}`}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximize(win.key)}
            className="grid size-3 place-items-center rounded-full bg-primary/80 text-[7px] font-black leading-none text-black/55 transition hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
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

      <div className="min-h-0 flex-1 overflow-auto bg-background/40">
        {Body ? <Body payload={win.payload} windowKey={win.key} /> : null}
      </div>

      {!win.maximized ? (
        <button
          type="button"
          aria-label={`Resize ${app.title}`}
          onPointerDown={startResize}
          className="absolute bottom-0 right-0 size-5 cursor-nwse-resize touch-none rounded-tl focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <span className="absolute bottom-1 right-1 size-2.5 border-b-2 border-r-2 border-muted-foreground/50" />
        </button>
      ) : null}
    </section>
  );
}
