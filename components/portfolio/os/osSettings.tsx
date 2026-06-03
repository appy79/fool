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
    description: "Aurora, starfield, and the rotating schematic.",
  },
  { id: "deepfield", label: "Deep Field", description: "A quiet, star-dense void." },
  {
    id: "starchart",
    label: "Star Chart",
    description: "Foreground deck grid with a faint radiant.",
  },
  { id: "aurora", label: "Aurora", description: "Colour-forward nebula wash." },
  { id: "void", label: "Void", description: "Minimal gradient — no motion." },
] as const;

export type WallpaperId = (typeof WALLPAPERS)[number]["id"];

const WALLPAPER_IDS = WALLPAPERS.map((wallpaper) => wallpaper.id);

/** User-app modules installed by default on a first visit. */
export const DEFAULT_INSTALLED_APPS = ["terminal"] as const;

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
  // Skip writing on the very first render so we never overwrite stored preferences with the
  // defaults before hydration has had a chance to restore them.
  const skipFirstPersist = useRef(true);

  // Hydrate from localStorage after mount. setState is deferred to rAF so it never runs
  // synchronously in the effect body (avoids cascading-render warnings and SSR mismatch).
  // `hydrated` flips once we've read storage (or confirmed there's none) so the boot screen
  // knows the installed-app set is final and can warm those modules.
  useEffect(() => {
    let parsed: Partial<Settings> = {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) parsed = sanitize(JSON.parse(stored));
    } catch {
      parsed = {};
    }

    const frame = requestAnimationFrame(() => {
      if (Object.keys(parsed).length > 0) {
        setSettings((current) => ({ ...current, ...parsed }));
      }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Persist on every change (after the initial mount).
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false;
      return;
    }
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
      setWallpaper: (wallpaper) => setSettings((current) => ({ ...current, wallpaper })),
      setReduceMotion: (reduceMotion) => setSettings((current) => ({ ...current, reduceMotion })),
      setClock24h: (clock24h) => setSettings((current) => ({ ...current, clock24h })),
      installApp: (id) =>
        setSettings((current) =>
          current.installedApps.includes(id)
            ? current
            : { ...current, installedApps: [...current.installedApps, id] },
        ),
      uninstallApp: (id) =>
        setSettings((current) => ({
          ...current,
          installedApps: current.installedApps.filter((value) => value !== id),
        })),
      resetApps: () =>
        setSettings((current) => ({ ...current, installedApps: [...DEFAULT_INSTALLED_APPS] })),
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
