"use client";

import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useAppSlot } from "../AppRuntime";
import { useOSSettings } from "../osSettings";
import {
  type AppDefinition,
  type DockSide,
  MENU_H,
  MIN_H,
  MIN_W,
  type Rect,
  useOS,
  type Viewport,
  type WindowState,
  workArea,
} from "../osStore";
import { type MenuItem, useContextMenu } from "./ContextMenu";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

const viewportNow = (): Viewport => ({ w: window.innerWidth, h: window.innerHeight });

type SnapZone = "left" | "right" | "max";
const SNAP_EDGE = 30; // px from a screen edge that arms a snap

function detectSnap(clientX: number, clientY: number): SnapZone | null {
  if (clientY <= MENU_H + SNAP_EDGE) return "max";
  if (clientX <= SNAP_EDGE) return "left";
  if (clientX >= window.innerWidth - SNAP_EDGE) return "right";
  return null;
}

/** Target rectangle for a snap zone, derived from the live work area. */
function snapRect(zone: SnapZone, dock: DockSide): Rect {
  const area = workArea(viewportNow(), dock);
  if (zone === "max") return area;
  const w = Math.floor(area.w / 2);
  return zone === "left"
    ? { x: area.x, y: area.y, w, h: area.h }
    : { x: area.x + area.w - w, y: area.y, w, h: area.h };
}

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

// Eight drag zones: thin edge strips plus larger corner squares. Corners sit above the
// edges (z-10) so they win where they overlap. Rendered as divs (not buttons) so the
// global `button { cursor: pointer }` reset doesn't override the resize cursors.
// The os-resize-* marker classes let touch devices grow these (invisible) hit areas via a
// coarse-pointer media query in globals.css, without affecting mouse precision/visuals.
const RESIZE_HANDLES: { dir: ResizeDir; className: string }[] = [
  { dir: "n", className: "os-resize-edge-h inset-x-0 top-0 h-2 cursor-ns-resize" },
  { dir: "s", className: "os-resize-edge-h inset-x-0 bottom-0 h-2 cursor-ns-resize" },
  { dir: "w", className: "os-resize-edge-v inset-y-0 left-0 w-2 cursor-ew-resize" },
  { dir: "e", className: "os-resize-edge-v inset-y-0 right-0 w-2 cursor-ew-resize" },
  { dir: "nw", className: "os-resize-corner left-0 top-0 z-10 size-4 cursor-nwse-resize" },
  { dir: "ne", className: "os-resize-corner right-0 top-0 z-10 size-4 cursor-nesw-resize" },
  { dir: "sw", className: "os-resize-corner bottom-0 left-0 z-10 size-4 cursor-nesw-resize" },
  { dir: "se", className: "os-resize-corner bottom-0 right-0 z-10 size-4 cursor-nwse-resize" },
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
  const { dockPosition, allowHorizontalScroll } = useOSSettings();
  const { openMenu } = useContextMenu();
  const focused = focusedKey === win.key;
  const frameRef = useRef<HTMLElement>(null);
  // The app body is mounted once by the persistent process layer and reparented here.
  const slotRef = useAppSlot(win.key);

  // Snap preview rectangle shown while a drag is armed near a screen edge.
  const [snapPreview, setSnapPreview] = useState<Rect | null>(null);

  // Move keyboard focus into a freshly opened window so it's immediately operable.
  useEffect(() => {
    frameRef.current?.focus();
  }, []);

  const applySnap = (zone: SnapZone) => {
    if (zone === "max") {
      if (!win.maximized) toggleMaximize(win.key);
      return;
    }
    const rect = snapRect(zone, dockPosition);
    resizeWindow(win.key, rect.w, rect.h, rect.x, rect.y);
  };

  const startDrag = (event: ReactPointerEvent) => {
    if (win.maximized) return;
    // Touch/pen report button 0 on first contact; ignore secondary mouse buttons only.
    if (event.pointerType === "mouse" && event.button !== 0) return;
    focusWindow(win.key);
    // Capture so the drag follows the finger/cursor even past the window or viewport edge,
    // and so a touch gesture isn't reinterpreted as a scroll midway.
    const target = event.currentTarget as HTMLElement;
    const { pointerId } = event;
    try {
      target.setPointerCapture(pointerId);
    } catch {
      // Capture is best-effort; dragging still works via the window listeners below.
    }
    const startX = event.clientX;
    const startY = event.clientY;
    const origX = win.x;
    const origY = win.y;
    let zone: SnapZone | null = null;

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      const area = workArea(viewportNow(), dockPosition);
      const nx = clamp(origX + (ev.clientX - startX), area.x, area.x + area.w - win.w);
      const ny = clamp(origY + (ev.clientY - startY), area.y, area.y + area.h - win.h);
      moveWindow(win.key, nx, ny);

      const next = detectSnap(ev.clientX, ev.clientY);
      if (next !== zone) {
        zone = next;
        setSnapPreview(next ? snapRect(next, dockPosition) : null);
      }
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      try {
        target.releasePointerCapture(pointerId);
      } catch {
        // Already released (e.g. on cancel) — nothing to do.
      }
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      cleanup();
      setSnapPreview(null);
      if (zone) applySnap(zone);
    };
    const onCancel = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      cleanup();
      setSnapPreview(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  const startResize = (dir: ResizeDir) => (event: ReactPointerEvent) => {
    if (win.maximized) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.stopPropagation();
    event.preventDefault();
    focusWindow(win.key);
    const target = event.currentTarget as HTMLElement;
    const { pointerId } = event;
    try {
      target.setPointerCapture(pointerId);
    } catch {
      // Best-effort capture; window listeners below still drive the resize.
    }
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
      if (ev.pointerId !== pointerId) return;
      const area = workArea(viewportNow(), dockPosition);
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      let x = origX;
      let y = origY;
      let w = origW;
      let h = origH;

      if (dir.includes("e")) {
        w = clamp(origW + dx, MIN_W, area.x + area.w - origX);
      }
      if (dir.includes("s")) {
        h = clamp(origH + dy, MIN_H, area.y + area.h - origY);
      }
      if (dir.includes("w")) {
        x = clamp(origX + dx, area.x, right - MIN_W);
        w = right - x;
      }
      if (dir.includes("n")) {
        y = clamp(origY + dy, area.y, bottom - MIN_H);
        h = bottom - y;
      }
      resizeWindow(win.key, w, h, x, y);
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      try {
        target.releasePointerCapture(pointerId);
      } catch {
        // Already released — nothing to do.
      }
    };
    const onUp = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      cleanup();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  const onTitleContextMenu = (event: ReactMouseEvent) => {
    const items: MenuItem[] = [
      { label: "Minimize", onSelect: () => minimizeWindow(win.key) },
      {
        label: win.maximized ? "Restore" : "Maximize",
        onSelect: () => toggleMaximize(win.key),
      },
      { label: "Snap left", onSelect: () => applySnap("left"), disabled: win.maximized },
      { label: "Snap right", onSelect: () => applySnap("right"), disabled: win.maximized },
      { label: "Close", onSelect: () => closeWindow(win.key), danger: true, separatorBefore: true },
    ];
    openMenu(event, items);
  };

  const style: CSSProperties = win.maximized
    ? (() => {
        const area = workArea(viewportNow(), dockPosition);
        return { left: area.x, top: area.y, width: area.w, height: area.h, zIndex: win.z };
      })()
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <>
      {snapPreview && typeof document !== "undefined"
        ? createPortal(
            <div
              aria-hidden="true"
              className="os-snap-preview pointer-events-none fixed z-[8500] rounded-xl border-2 border-primary/70 bg-primary/12 backdrop-blur-sm"
              style={{
                left: snapPreview.x,
                top: snapPreview.y,
                width: snapPreview.w,
                height: snapPreview.h,
              }}
            />,
            document.body,
          )
        : null}

      <section
        ref={frameRef}
        data-window={win.key}
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
          className={`group/title flex shrink-0 touch-none cursor-grab items-center gap-3 border-b px-3 py-2 transition-colors active:cursor-grabbing ${
            focused ? "border-border/60 bg-card/85" : "border-border/40 bg-card/60"
          }`}
          onPointerDown={startDrag}
          onDoubleClick={() => toggleMaximize(win.key)}
          onContextMenu={onTitleContextMenu}
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

        <div
          ref={slotRef}
          className={`@container min-h-0 flex-1 overflow-y-auto bg-background/40 ${
            allowHorizontalScroll ? "overflow-x-auto" : "overflow-x-hidden"
          }`}
        />

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
    </>
  );
}
