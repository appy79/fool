"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { type AppDefinition, useOS, type WindowState } from "./osStore";

type SlotApi = { setSlot: (key: string, node: HTMLElement | null) => void };

const AppSlotContext = createContext<SlotApi | null>(null);

/**
 * Returns a ref callback for a window frame's content area. Registering the node
 * tells the persistent process layer where to mount (reparent) that app's body.
 */
export function useAppSlot(key: string) {
  const ctx = useContext(AppSlotContext);
  return useCallback((node: HTMLElement | null) => ctx?.setSlot(key, node), [ctx, key]);
}

/**
 * Keeps every open app mounted exactly once, independent of which shell (desktop
 * window manager vs. mobile frame) is currently rendering. The body is portalled
 * into a stable per-app container whose identity never changes; that container is
 * physically reparented (appendChild) into the active frame. Because the React
 * portal target is stable, the body never remounts — so internal state survives
 * resizing across the desktop/mobile breakpoint, minimizing, and refocusing.
 */
export function AppRuntimeProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<Record<string, HTMLElement | null>>({});

  const setSlot = useCallback((key: string, node: HTMLElement | null) => {
    setSlots((prev) => {
      if (node) {
        if (prev[key] === node) return prev;
        return { ...prev, [key]: node };
      }
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const api = useMemo<SlotApi>(() => ({ setSlot }), [setSlot]);

  return (
    <AppSlotContext.Provider value={api}>
      {children}
      <AppProcessLayer slots={slots} />
    </AppSlotContext.Provider>
  );
}

function AppProcessLayer({ slots }: { slots: Record<string, HTMLElement | null> }) {
  const { windows, appsById } = useOS();
  return (
    <>
      {windows.map((win) => {
        const app = appsById.get(win.appId);
        if (!app?.component) return null;
        return <AppProcess key={win.key} app={app} win={win} target={slots[win.key] ?? null} />;
      })}
    </>
  );
}

function AppProcess({
  app,
  win,
  target,
}: {
  app: AppDefinition;
  win: WindowState;
  target: HTMLElement | null;
}) {
  const Body = app.component!;

  // A stable, transparent wrapper. `display: contents` means it adds no box of its
  // own, so the body lays out exactly as a direct child of the active frame.
  const [container] = useState(() => {
    const el = document.createElement("div");
    el.style.display = "contents";
    return el;
  });

  useEffect(() => {
    if (!target) return;
    target.appendChild(container);
    return () => {
      if (container.parentNode === target) target.removeChild(container);
    };
  }, [target, container]);

  return createPortal(<Body payload={win.payload} windowKey={win.key} />, container);
}
