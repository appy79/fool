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
  | { type: "open"; app: AppDefinition; payload?: AppPayload; viewport?: { w: number; h: number } }
  | { type: "close"; key: string }
  | { type: "focus"; key: string }
  | { type: "move"; key: string; x: number; y: number }
  | { type: "resize"; key: string; w: number; h: number; x?: number; y?: number }
  | { type: "minimize"; key: string }
  | { type: "toggleMax"; key: string }
  | { type: "closeAll" };

const keyFor = (appId: string, payload?: AppPayload) =>
  payload?.projectTitle ? `${appId}:${payload.projectTitle}` : appId;

// Desktop window geometry. Shared with the Window chrome so open/drag/resize all agree
// on the usable region (below the menu bar, above the dock).
export const MENU_H = 40; // menu bar reserved at the top
export const DOCK_H = 92; // dock reserved at the bottom
export const EDGE_GAP = 8; // gap kept from the viewport edges
export const MIN_W = 360;
export const MIN_H = 260;

/**
 * Clamps a freshly opened window so it always fits within the usable desktop area —
 * never opening underneath the dock or above the menu bar, regardless of its default
 * size or the current viewport. Falls back to the raw desired box when no viewport is
 * known (e.g. server/first paint).
 */
function fitWindow(
  base: { w: number; h: number },
  viewport: { w: number; h: number } | undefined,
  offset: number,
): { x: number; y: number; w: number; h: number } {
  const desiredX = 90 + offset;
  const desiredY = 70 + offset;
  if (!viewport) {
    return { x: desiredX, y: desiredY, w: base.w, h: base.h };
  }

  const usableW = viewport.w - 2 * EDGE_GAP;
  const usableH = viewport.h - MENU_H - DOCK_H - 2 * EDGE_GAP;
  const w = Math.max(Math.min(base.w, usableW), Math.min(MIN_W, usableW));
  const h = Math.max(Math.min(base.h, usableH), Math.min(MIN_H, usableH));

  const minX = EDGE_GAP;
  const minY = MENU_H + EDGE_GAP;
  const maxX = viewport.w - EDGE_GAP - w;
  const maxY = viewport.h - DOCK_H - EDGE_GAP - h;
  const x = Math.min(Math.max(desiredX, minX), Math.max(minX, maxX));
  const y = Math.min(Math.max(desiredY, minY), Math.max(minY, maxY));
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
      const geom = fitWindow(base, action.viewport, offset);
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
  preloadApp,
  onLock,
  children,
}: {
  apps: AppDefinition[];
  contact: ResolvedContactInfo;
  /** Ids of installed user modules; drives lazy preload + teardown of windows. */
  installedApps?: string[];
  /** Warm a module's chunk (called when a user app is installed). */
  preloadApp?: (id: string) => void;
  onLock?: () => void;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { windows: [], topZ: 10, spawnCount: 0 });

  const appsById = useMemo(() => new Map(apps.map((app) => [app.id, app])), [apps]);

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
      dispatch({ type: "open", app, payload, viewport });
    },
    [appsById],
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
