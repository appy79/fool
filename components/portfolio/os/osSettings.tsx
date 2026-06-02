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

type Settings = {
  wallpaper: WallpaperId;
  reduceMotion: boolean;
  clock24h: boolean;
};

const DEFAULTS: Settings = {
  wallpaper: "radiant",
  reduceMotion: false,
  clock24h: false,
};

const STORAGE_KEY = "terminusos.settings.v1";

type OSSettingsValue = Settings & {
  setWallpaper: (id: WallpaperId) => void;
  setReduceMotion: (value: boolean) => void;
  setClock24h: (value: boolean) => void;
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
  return next;
}

export function OSSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  // Skip writing on the very first render so we never overwrite stored preferences with the
  // defaults before hydration has had a chance to restore them.
  const skipFirstPersist = useRef(true);

  // Hydrate from localStorage after mount. setState is deferred to rAF so it never runs
  // synchronously in the effect body (avoids cascading-render warnings and SSR mismatch).
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (!stored) return;

    let parsed: Partial<Settings> = {};
    try {
      parsed = sanitize(JSON.parse(stored));
    } catch {
      parsed = {};
    }
    if (Object.keys(parsed).length === 0) return;

    const frame = requestAnimationFrame(() =>
      setSettings((current) => ({ ...current, ...parsed })),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // Persist on every change (after the initial mount).
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
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
      setWallpaper: (wallpaper) => setSettings((current) => ({ ...current, wallpaper })),
      setReduceMotion: (reduceMotion) => setSettings((current) => ({ ...current, reduceMotion })),
      setClock24h: (clock24h) => setSettings((current) => ({ ...current, clock24h })),
    }),
    [settings],
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
