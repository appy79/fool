"use client";

import {
  createContext,
  type ComponentType,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useReducer,
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
  | { type: "open"; app: AppDefinition; payload?: AppPayload }
  | { type: "close"; key: string }
  | { type: "focus"; key: string }
  | { type: "move"; key: string; x: number; y: number }
  | { type: "resize"; key: string; w: number; h: number; x?: number; y?: number }
  | { type: "minimize"; key: string }
  | { type: "toggleMax"; key: string }
  | { type: "closeAll" };

const keyFor = (appId: string, payload?: AppPayload) =>
  payload?.projectTitle ? `${appId}:${payload.projectTitle}` : appId;

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
      const size = action.app.defaultSize ?? { w: 760, h: 540 };
      const offset = (state.spawnCount % 6) * 30;
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
            x: 90 + offset,
            y: 70 + offset,
            w: size.w,
            h: size.h,
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
  onLock,
  children,
}: {
  apps: AppDefinition[];
  contact: ResolvedContactInfo;
  onLock?: () => void;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, { windows: [], topZ: 10, spawnCount: 0 });

  const appsById = useMemo(() => new Map(apps.map((app) => [app.id, app])), [apps]);

  const openApp = useCallback(
    (appId: string, payload?: AppPayload) => {
      const app = appsById.get(appId);
      if (!app) return;
      dispatch({ type: "open", app, payload });
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
