"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);

  return () => mediaQuery.removeEventListener("change", onChange);
};

const getSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia(QUERY).matches;

const getServerSnapshot = () => false;

/**
 * Reactively reports whether the user has requested reduced motion. Returns `false`
 * during server rendering and the first client paint to keep hydration stable.
 */
export default function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
