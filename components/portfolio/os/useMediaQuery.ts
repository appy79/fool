"use client";

import { useSyncExternalStore } from "react";

/**
 * Reactively reports whether a media query matches. Returns `false` during SSR and the first
 * client paint, then updates after mount (so the OS can pick desktop vs mobile after entry).
 */
export default function useMediaQuery(query: string) {
  const subscribe = (onChange: () => void) => {
    if (typeof window === "undefined") {
      return () => {};
    }
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };

  const getSnapshot = () => typeof window !== "undefined" && window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
