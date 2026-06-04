"use client";

import {
  createContext,
  type ComponentType,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { ResolvedContactInfo } from "@/lib/resume";

export type AppPayload = { projectTitle?: string };

export type AppComponentProps = {
  payload?: AppPayload;
  /** Provided to window apps so they can size internal layout if needed. */
  windowKey?: string;
};

export type AppDefinition = {
  id: string;
  title: string;
  shortLabel?: string;
  description?: string;
  /**
   * `system` apps are part of the operator's record and cannot be uninstalled.
   * `user` apps are optional modules installed/removed from the App Store.
   */
  kind: "system" | "user";
  Icon: ComponentType<{ className?: string }>;
  /** Default window size (desktop). */
  defaultSize?: { w: number; h: number };
  /** Window apps render a component; link apps navigate instead. */
  component?: ComponentType<AppComponentProps>;
  /** When set, launching the app navigates here instead of opening a window. */
  href?: string;
  /** External hrefs open in a new tab rather than replacing the OS. */
  external?: boolean;
  /** Render a visual separator before this item in the dock (groups utilities). */
  dividerBefore?: boolean;
  /** Payload-driven apps (e.g. a Case File) are reachable from other apps, not the dock/home grid. */
  hidden?: boolean;
};

export type WindowState = {
  key: string;
  appId: string;
  title: string;
  payload?: AppPayload;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
};

type State = {
  windows: WindowState[];
  topZ: number;
  spawnCount: number;
};

type Action =
  | {
      type: "open";
      app: AppDefinition;
      payload?: AppPayload;
      viewport?: Viewport;
      dock: DockSide;
    }
  | { type: "close"; key: string }
  | { type: "focus"; key: string }
  | { type: "move"; key: string; x: number; y: number }
  | { type: "resize"; key: string; w: number; h: number; x?: number; y?: number }
  | { type: "minimize"; key: string }
  | { type: "toggleMax"; key: string }
  | { type: "closeAll" };

const keyFor = (appId: string, payload?: AppPayload) =>
  payload?.projectTitle ? `${appId}:${payload.projectTitle}` : appId;

export type DockSide = "bottom" | "left";
export type Viewport = { w: number; h: number };
export type Rect = { x: number; y: number; w: number; h: number };

// Desktop window geometry. Shared with the Window chrome so open/drag/resize all agree
// on the usable region (below the menu bar, clear of the dock).
export const MENU_H = 40; // menu bar reserved at the top
export const DOCK_H = 92; // dock reserved at the bottom (when docked bottom)
export const DOCK_W = 78; // dock reserved at the left (when docked left)
export const EDGE_GAP = 8; // gap kept from the viewport edges
export const MIN_W = 360;
export const MIN_H = 260;

const clampN = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

/**
 * The usable desktop region: below the menu bar, inside the edge gaps, and clear of the
 * dock on whichever edge it lives. Every open/drag/resize/snap path derives bounds from
 * here so windows can never end up under the dock or menu bar.
 */
export function workArea(viewport: Viewport, dock: DockSide): Rect {
  const left = EDGE_GAP + (dock === "left" ? DOCK_W : 0);
  const top = MENU_H + EDGE_GAP;
  const bottom = EDGE_GAP + (dock === "bottom" ? DOCK_H : 0);
  return {
    x: left,
    y: top,
    w: Math.max(MIN_W, viewport.w - left - EDGE_GAP),
    h: Math.max(MIN_H, viewport.h - top - bottom),
  };
}

/** Clamp an arbitrary box (e.g. a restored window) into the current work area. */
export function clampRect(rect: Rect, viewport: Viewport, dock: DockSide): Rect {
  const area = workArea(viewport, dock);
  const w = clampN(rect.w, MIN_W, area.w);
  const h = clampN(rect.h, MIN_H, area.h);
  const x = clampN(rect.x, area.x, area.x + area.w - w);
  const y = clampN(rect.y, area.y, area.y + area.h - h);
  return { x, y, w, h };
}

/**
 * Clamps a freshly opened window so it always fits within the usable desktop area. Falls
 * back to the raw desired box when no viewport is known (e.g. server/first paint).
 */
function fitWindow(
  base: { w: number; h: number },
  viewport: Viewport | undefined,
  offset: number,
  dock: DockSide,
): Rect {
  if (!viewport) {
    return { x: 90 + offset, y: 70 + offset, w: base.w, h: base.h };
  }
  const area = workArea(viewport, dock);
  const w = Math.min(base.w, area.w);
  const h = Math.min(base.h, area.h);
  const x = clampN(area.x + 74 + offset, area.x, area.x + area.w - w);
  const y = clampN(area.y + 24 + offset, area.y, area.y + area.h - h);
  return { x, y, w, h };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "open": {
      const key = keyFor(action.app.id, action.payload);
      const nextZ = state.topZ + 1;
      const existing = state.windows.find((w) => w.key === key);
      if (existing) {
        return {
          ...state,
          topZ: nextZ,
          windows: state.windows.map((w) =>
            w.key === key ? { ...w, z: nextZ, minimized: false } : w,
          ),
        };
      }
      const base = action.app.defaultSize ?? { w: 760, h: 540 };
      const offset = (state.spawnCount % 6) * 30;
      const geom = fitWindow(base, action.viewport, offset, action.dock);
      return {
        ...state,
        topZ: nextZ,
        spawnCount: state.spawnCount + 1,
        windows: [
          ...state.windows,
          {
            key,
            appId: action.app.id,
            title: action.payload?.projectTitle ?? action.app.title,
            payload: action.payload,
            x: geom.x,
            y: geom.y,
            w: geom.w,
            h: geom.h,
            z: nextZ,
            minimized: false,
            maximized: false,
          },
        ],
      };
    }
    case "close":
      return { ...state, windows: state.windows.filter((w) => w.key !== action.key) };
    case "closeAll":
      return { ...state, windows: [] };
    case "focus": {
      const nextZ = state.topZ + 1;
      return {
        ...state,
        topZ: nextZ,
        windows: state.windows.map((w) =>
          w.key === action.key ? { ...w, z: nextZ, minimized: false } : w,
        ),
      };
    }
    case "move":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.key === action.key ? { ...w, x: action.x, y: action.y } : w,
        ),
      };
    case "resize":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.key === action.key
            ? { ...w, w: action.w, h: action.h, x: action.x ?? w.x, y: action.y ?? w.y }
            : w,
        ),
      };
    case "minimize":
      return {
        ...state,
        windows: state.windows.map((w) => (w.key === action.key ? { ...w, minimized: true } : w)),
      };
    case "toggleMax": {
      const nextZ = state.topZ + 1;
      return {
        ...state,
        topZ: nextZ,
        windows: state.windows.map((w) =>
          w.key === action.key ? { ...w, maximized: !w.maximized, z: nextZ, minimized: false } : w,
        ),
      };
    }
    default:
      return state;
  }
}

const SESSION_KEY = "terminusos.session.v1";

function currentViewport(): Viewport {
  if (typeof window === "undefined") return { w: 1280, h: 800 };
  return { w: window.innerWidth, h: window.innerHeight };
}

/**
 * Rebuilds the window list a visitor left behind, dropping anything stale: unknown apps,
 * user modules that are no longer installed, and duplicate keys. Each window is re-clamped
 * into the current work area so a smaller viewport (or moved dock) never strands one.
 */
function loadSession(
  appsById: Map<string, AppDefinition>,
  installed: Set<string>,
  dock: DockSide,
): State {
  const empty: State = { windows: [], topZ: 10, spawnCount: 0 };
  if (typeof window === "undefined") return empty;
  let raw: unknown;
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return empty;
    raw = JSON.parse(stored);
  } catch {
    return empty;
  }
  if (!raw || typeof raw !== "object") return empty;
  const data = raw as Record<string, unknown>;
  if (!Array.isArray(data.windows)) return empty;

  const viewport = currentViewport();
  const seen = new Set<string>();
  const windows: WindowState[] = [];
  let maxZ = 10;

  for (const item of data.windows) {
    if (!item || typeof item !== "object") continue;
    const w = item as Record<string, unknown>;
    const appId = typeof w.appId === "string" ? w.appId : null;
    if (!appId) continue;
    const app = appsById.get(appId);
    if (!app) continue;
    if (app.kind === "user" && !installed.has(appId)) continue;

    const rawPayload = w.payload as Record<string, unknown> | undefined;
    const payload =
      rawPayload && typeof rawPayload.projectTitle === "string"
        ? { projectTitle: rawPayload.projectTitle }
        : undefined;
    const key = keyFor(appId, payload);
    if (seen.has(key)) continue;
    seen.add(key);

    const rect = clampRect(
      {
        x: Number(w.x) || 0,
        y: Number(w.y) || 0,
        w: Number(w.w) || app.defaultSize?.w || 760,
        h: Number(w.h) || app.defaultSize?.h || 540,
      },
      viewport,
      dock,
    );
    const z = Number.isFinite(Number(w.z)) ? Number(w.z) : maxZ + 1;
    maxZ = Math.max(maxZ, z);

    windows.push({
      key,
      appId,
      title: payload?.projectTitle ?? app.title,
      payload,
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h,
      z,
      minimized: Boolean(w.minimized),
      maximized: Boolean(w.maximized),
    });
  }

  return {
    windows,
    topZ: maxZ,
    spawnCount: typeof data.spawnCount === "number" ? data.spawnCount : windows.length,
  };
}

function saveSession(state: State) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ windows: state.windows, topZ: state.topZ, spawnCount: state.spawnCount }),
    );
  } catch {
    // Storage unavailable (private mode) — the session simply won't persist.
  }
}

type OSContextValue = {
  apps: AppDefinition[];
  appsById: Map<string, AppDefinition>;
  contact: ResolvedContactInfo;
  windows: WindowState[];
  focusedKey: string | null;
  openApp: (appId: string, payload?: AppPayload) => void;
  closeWindow: (key: string) => void;
  closeAllWindows: () => void;
  focusWindow: (key: string) => void;
  moveWindow: (key: string, x: number, y: number) => void;
  resizeWindow: (key: string, w: number, h: number, x?: number, y?: number) => void;
  minimizeWindow: (key: string) => void;
  toggleMaximize: (key: string) => void;
  /** Return to the lock screen. No-op if the host did not provide a handler. */
  lock: () => void;
};

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({
  apps,
  contact,
  installedApps = [],
  dockPosition = "bottom",
  preloadApp,
  onLock,
  children,
}: {
  apps: AppDefinition[];
  contact: ResolvedContactInfo;
  /** Ids of installed user modules; drives lazy preload + teardown of windows. */
  installedApps?: string[];
  /** Which edge the dock occupies; reserved when placing/clamping windows. */
  dockPosition?: DockSide;
  /** Warm a module's chunk (called when a user app is installed). */
  preloadApp?: (id: string) => void;
  onLock?: () => void;
  children: ReactNode;
}) {
  // Restore the windows the visitor left open (entry/unlock), validated against the apps
  // and modules available right now. Reads localStorage once, at mount.
  const [state, dispatch] = useReducer(reducer, null, () =>
    loadSession(new Map(apps.map((app) => [app.id, app])), new Set(installedApps), dockPosition),
  );

  const appsById = useMemo(() => new Map(apps.map((app) => [app.id, app])), [apps]);

  // Persist the live window layout so it can be restored on the next entry/unlock.
  useEffect(() => {
    saveSession(state);
  }, [state]);

  // Moving the dock changes the work area; pull any open window back inside the new bounds
  // so none is stranded under the relocated dock.
  const prevDockRef = useRef(dockPosition);
  useEffect(() => {
    if (prevDockRef.current === dockPosition) return;
    prevDockRef.current = dockPosition;
    if (typeof window === "undefined") return;
    const viewport = currentViewport();
    for (const win of state.windows) {
      if (win.maximized) continue;
      const rect = clampRect({ x: win.x, y: win.y, w: win.w, h: win.h }, viewport, dockPosition);
      if (rect.x !== win.x || rect.y !== win.y || rect.w !== win.w || rect.h !== win.h) {
        dispatch({ type: "resize", key: win.key, w: rect.w, h: rect.h, x: rect.x, y: rect.y });
      }
    }
  }, [dockPosition, state.windows]);

  // Fetch a user module's chunk the moment it is installed, so it is ready to open.
  const prevInstalledRef = useRef(installedApps);
  useEffect(() => {
    const prev = prevInstalledRef.current;
    prevInstalledRef.current = installedApps;
    if (!preloadApp) return;
    for (const id of installedApps) {
      if (!prev.includes(id)) preloadApp(id);
    }
  }, [installedApps, preloadApp]);

  // When a user module is uninstalled, tear down its open windows so its UI/state clears.
  useEffect(() => {
    const installed = new Set(installedApps);
    for (const win of state.windows) {
      const app = appsById.get(win.appId);
      if (app && app.kind === "user" && !installed.has(app.id)) {
        dispatch({ type: "close", key: win.key });
      }
    }
  }, [installedApps, state.windows, appsById]);

  const openApp = useCallback(
    (appId: string, payload?: AppPayload) => {
      const app = appsById.get(appId);
      if (!app) return;
      const viewport =
        typeof window !== "undefined" ? { w: window.innerWidth, h: window.innerHeight } : undefined;
      dispatch({ type: "open", app, payload, viewport, dock: dockPosition });
    },
    [appsById, dockPosition],
  );

  const focusedKey = useMemo(() => {
    const visible = state.windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((top, w) => (w.z > top.z ? w : top)).key;
  }, [state.windows]);

  const value = useMemo<OSContextValue>(
    () => ({
      apps,
      appsById,
      contact,
      windows: state.windows,
      focusedKey,
      openApp,
      closeWindow: (key) => dispatch({ type: "close", key }),
      closeAllWindows: () => dispatch({ type: "closeAll" }),
      focusWindow: (key) => dispatch({ type: "focus", key }),
      moveWindow: (key, x, y) => dispatch({ type: "move", key, x, y }),
      resizeWindow: (key, w, h, x, y) => dispatch({ type: "resize", key, w, h, x, y }),
      minimizeWindow: (key) => dispatch({ type: "minimize", key }),
      toggleMaximize: (key) => dispatch({ type: "toggleMax", key }),
      lock: () => onLock?.(),
    }),
    [apps, appsById, contact, state.windows, focusedKey, openApp, onLock],
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) {
    throw new Error("useOS must be used within an OSProvider");
  }
  return ctx;
}
