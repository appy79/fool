"use client";

import { useOSSettings, type WallpaperId } from "../osSettings";
import styles from "./osWallpaper.module.css";

/**
 * The TerminusOS desktop wallpaper: an opaque, layered Foundation backdrop (aurora wash, starfield,
 * deck grid, and an oversized Prime-Radiant schematic) that the lock screen and OS chrome sit on.
 * The active variant comes from OS settings; pass `variant` to render a fixed preview (Settings).
 * Purely decorative and pointer-transparent; all motion is disabled under reduced-motion.
 */
export default function OSWallpaper({ variant }: { variant?: WallpaperId }) {
  const { wallpaper } = useOSSettings();
  const active = variant ?? wallpaper;

  return (
    <div className={styles.wallpaper} data-variant={active} aria-hidden="true">
      <div className={styles.base} />
      <div className={styles.aurora} />
      <div className={styles.stars} />
      <div className={styles.grid} />
      <svg className={styles.radiant} viewBox="0 0 600 600" fill="none" stroke="currentColor">
        <circle cx="300" cy="300" r="80" strokeWidth="1" opacity="0.9" />
        <circle cx="300" cy="300" r="150" strokeWidth="1" opacity="0.7" />
        <circle cx="300" cy="300" r="220" strokeWidth="1" opacity="0.5" />
        <circle cx="300" cy="300" r="285" strokeWidth="1" opacity="0.35" />
        <path d="M300 15v570M15 300h570" strokeWidth="0.75" opacity="0.5" />
        <path d="M97 97 503 503M503 97 97 503" strokeWidth="0.75" opacity="0.3" />
        <path d="M300 80 489 191v218L300 520 111 409V191Z" strokeWidth="1" opacity="0.6" />
        {Array.from({ length: 24 }).map((_, index) => {
          const angle = (index / 24) * Math.PI * 2;
          const inner = 285;
          const outer = 300;
          // Round to a fixed precision so the SSR and client strings match exactly: raw
          // Math.sin/cos results differ in their final float digits across JS engines and
          // would otherwise trip a hydration mismatch.
          const round = (value: number) => (Math.round(value * 100) / 100).toFixed(2);
          return (
            <line
              key={index}
              x1={round(300 + Math.cos(angle) * inner)}
              y1={round(300 + Math.sin(angle) * inner)}
              x2={round(300 + Math.cos(angle) * outer)}
              y2={round(300 + Math.sin(angle) * outer)}
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
      </svg>
      <div className={styles.sheen} />
      <div className={styles.vignette} />
    </div>
  );
}
