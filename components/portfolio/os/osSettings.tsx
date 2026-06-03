"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { USER_APP_IDS } from "./appRegistry";

export const WALLPAPERS = [
  {
    id: "radiant",
    label: "Prime Radiant",
    description: "Seldon's turning psychohistory dial.",
  },
  {
    id: "spiral",
    label: "Galactic Spiral",
    description: "The tilted disc of the Seldon Plan.",
  },
  {
    id: "trantor",
    label: "Trantor",
    description: "The lit limb of the world-city.",
  },
  {
    id: "terminus",
    label: "Terminus",
    description: "The lone star at the galaxy's edge.",
  },
  { id: "void", label: "Void", description: "Deep space — pure focus, no motion." },
] as const;

export type WallpaperId = (typeof WALLPAPERS)[number]["id"];

const WALLPAPER_IDS = WALLPAPERS.map((wallpaper) => wallpaper.id);

/** User-app modules installed by default on a first visit. */
export const DEFAULT_INSTALLED_APPS = [] as const;

type Settings = {
  wallpaper: WallpaperId;
  reduceMotion: boolean;
  clock24h: boolean;
  /** Ids of installed user-app modules (system apps are always present). */
  installedApps: string[];
};

const DEFAULTS: Settings = {
  wallpaper: "radiant",
  reduceMotion: false,
  clock24h: false,
  installedApps: [...DEFAULT_INSTALLED_APPS],
};

/**
 * Seeds settings from the host system for visitors who haven't chosen otherwise: honor the
 * OS "reduce motion" preference and the locale's clock format. A stored choice always wins,
 * and nothing is persisted until the visitor explicitly changes a setting, so until then the
 * OS keeps tracking the device.
 */
function systemDefaults(): Partial<Settings> {
  if (typeof window === "undefined") return {};
  const next: Partial<Settings> = {};
  try {
    next.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    // matchMedia unavailable — keep the static default.
  }
  try {
    const resolved = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions();
    next.clock24h = resolved.hourCycle
      ? resolved.hourCycle === "h23" || resolved.hourCycle === "h24"
      : resolved.hour12 === false;
  } catch {
    // Intl unavailable — keep the static default.
  }
  return next;
}

const STORAGE_KEY = "terminusos.settings.v1";
/** Bumped when the persisted shape changes; stamped on write so future builds can migrate. */
const SETTINGS_VERSION = 1;

type OSSettingsValue = Settings & {
  /** True once stored preferences (incl. installed apps) have been read from localStorage. */
  hydrated: boolean;
  setWallpaper: (id: WallpaperId) => void;
  setReduceMotion: (value: boolean) => void;
  setClock24h: (value: boolean) => void;
  installApp: (id: string) => void;
  uninstallApp: (id: string) => void;
  resetApps: () => void;
  isInstalled: (id: string) => boolean;
};

const OSSettingsContext = createContext<OSSettingsValue | null>(null);

function sanitize(raw: unknown): Partial<Settings> {
  if (!raw || typeof raw !== "object") return {};
  const value = raw as Record<string, unknown>;
  const next: Partial<Settings> = {};
  if (
    typeof value.wallpaper === "string" &&
    WALLPAPER_IDS.includes(value.wallpaper as WallpaperId)
  ) {
    next.wallpaper = value.wallpaper as WallpaperId;
  }
  if (typeof value.reduceMotion === "boolean") next.reduceMotion = value.reduceMotion;
  if (typeof value.clock24h === "boolean") next.clock24h = value.clock24h;
  if (Array.isArray(value.installedApps)) {
    // Keep only ids that still exist as installable modules in this build. This self-heals
    // storage left by an older/newer build where a module was renamed or removed, and
    // discards any non-user ids that should never have been persisted.
    next.installedApps = Array.from(
      new Set(
        value.installedApps.filter(
          (id): id is string => typeof id === "string" && USER_APP_IDS.has(id),
        ),
      ),
    );
  }
  return next;
}

export function OSSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);
  // Stays false until the visitor explicitly changes a setting. Until then we never persist,
  // so a first-time visitor keeps tracking the system defaults across reloads rather than
  // freezing a snapshot of them.
  const dirty = useRef(false);

  // Hydrate after mount: system preferences seed anything the visitor hasn't stored, and a
  // stored choice overrides that. setState is deferred to rAF so it never runs synchronously
  // in the effect body (avoids cascading-render warnings and SSR mismatch). `hydrated` flips
  // once storage has been read so the boot screen knows the installed-app set is final.
  useEffect(() => {
    let parsed: Partial<Settings> = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) parsed = sanitize(JSON.parse(stored));
    } catch {
      parsed = {};
    }

    const sys = systemDefaults();

    const frame = requestAnimationFrame(() => {
      setSettings((current) => ({ ...current, ...sys, ...parsed }));
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Persist only once the visitor has explicitly changed a setting; hydration and cross-tab
  // syncs intentionally don't mark the store dirty.
  useEffect(() => {
    if (!dirty.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SETTINGS_VERSION, ...settings }));
    } catch {
      // Storage may be unavailable (private mode); settings still work for the session.
    }
  }, [settings]);

  // Keep preferences consistent across tabs/windows.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      let parsed: Partial<Settings> = {};
      try {
        parsed = sanitize(JSON.parse(event.newValue));
      } catch {
        parsed = {};
      }
      if (Object.keys(parsed).length === 0) return;
      setSettings((current) => ({ ...current, ...parsed }));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<OSSettingsValue>(
    () => ({
      ...settings,
      hydrated,
      setWallpaper: (wallpaper) => {
        dirty.current = true;
        setSettings((current) => ({ ...current, wallpaper }));
      },
      setReduceMotion: (reduceMotion) => {
        dirty.current = true;
        setSettings((current) => ({ ...current, reduceMotion }));
      },
      setClock24h: (clock24h) => {
        dirty.current = true;
        setSettings((current) => ({ ...current, clock24h }));
      },
      installApp: (id) => {
        dirty.current = true;
        setSettings((current) =>
          current.installedApps.includes(id)
            ? current
            : { ...current, installedApps: [...current.installedApps, id] },
        );
      },
      uninstallApp: (id) => {
        dirty.current = true;
        setSettings((current) => ({
          ...current,
          installedApps: current.installedApps.filter((value) => value !== id),
        }));
      },
      resetApps: () => {
        dirty.current = true;
        setSettings((current) => ({ ...current, installedApps: [...DEFAULT_INSTALLED_APPS] }));
      },
      isInstalled: (id) => settings.installedApps.includes(id),
    }),
    [settings, hydrated],
  );

  return <OSSettingsContext.Provider value={value}>{children}</OSSettingsContext.Provider>;
}

export function useOSSettings() {
  const ctx = useContext(OSSettingsContext);
  if (!ctx) {
    throw new Error("useOSSettings must be used within an OSSettingsProvider");
  }
  return ctx;
}
