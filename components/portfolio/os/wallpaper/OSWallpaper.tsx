"use client";

import { type ReactElement } from "react";
import { useOSSettings, type WallpaperId } from "../osSettings";
import styles from "./osWallpaper.module.css";

// Round to a fixed precision so server- and client-rendered coordinate strings match
// exactly (raw trig differs in its trailing float digits across engines, which would
// otherwise trip a hydration mismatch on these generated path/point strings).
const round = (value: number) => (Math.round(value * 100) / 100).toFixed(2);

/* -------------------------------------------------------------------------- */
/* Prime Radiant — Seldon's psychohistory device: dials, spokes, equations.   */
/* -------------------------------------------------------------------------- */

function radialTicks(count: number, rInner: number, rOuter: number, longEvery: number) {
  return Array.from({ length: count }).map((_, index) => {
    const angle = (index / count) * Math.PI * 2;
    const long = index % longEvery === 0;
    const inner = long ? rInner - 12 : rInner;
    return {
      x1: round(400 + Math.cos(angle) * inner),
      y1: round(400 + Math.sin(angle) * inner),
      x2: round(400 + Math.cos(angle) * rOuter),
      y2: round(400 + Math.sin(angle) * rOuter),
      long,
    };
  });
}

const RADIANT_OUTER_TICKS = radialTicks(72, 346, 362, 6);
const RADIANT_MID_TICKS = radialTicks(48, 250, 262, 4);

const RADIANT_SPOKES = Array.from({ length: 12 }).map((_, index) => {
  const angle = (index / 12) * Math.PI * 2;
  return {
    x1: round(400 + Math.cos(angle) * 174),
    y1: round(400 + Math.sin(angle) * 174),
    x2: round(400 + Math.cos(angle) * 268),
    y2: round(400 + Math.sin(angle) * 268),
  };
});

const RADIANT_HEX = `M ${Array.from({ length: 6 })
  .map((_, index) => {
    const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
    return `${round(400 + Math.cos(angle) * 318)} ${round(400 + Math.sin(angle) * 318)}`;
  })
  .join(" L ")} Z`;

const RADIANT_GLYPHS = [
  { t: "Ψ(t)", a: -78 },
  { t: "∂P/∂t", a: -22 },
  { t: "Σ λ", a: 34 },
  { t: "∮ E·dΩ", a: 92 },
  { t: "∇·Φ", a: 148 },
  { t: "e^iθ", a: 200 },
  { t: "ΔS ≥ 0", a: 246 },
  { t: "∫ dτ", a: 300 },
].map((glyph) => {
  const rad = (glyph.a * Math.PI) / 180;
  return {
    ...glyph,
    x: round(400 + Math.cos(rad) * 308),
    y: round(400 + Math.sin(rad) * 308),
  };
});

function PrimeRadiant() {
  return (
    <>
      <div className={styles.radiantGlow} />
      <svg
        className={styles.radiantSvg}
        viewBox="0 0 800 800"
        fill="none"
        stroke="currentColor"
        preserveAspectRatio="xMidYMid meet"
      >
        <g className={styles.spinSlow}>
          <circle cx="400" cy="400" r="362" strokeWidth="1.1" opacity="0.55" />
          <circle cx="400" cy="400" r="344" strokeWidth="0.6" opacity="0.3" />
          <path d={RADIANT_HEX} strokeWidth="1" opacity="0.4" />
          {RADIANT_OUTER_TICKS.map((tick, index) => (
            <line
              key={index}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              strokeWidth={tick.long ? 1.4 : 0.7}
              opacity={tick.long ? 0.6 : 0.32}
            />
          ))}
        </g>

        <g className={styles.spinReverse}>
          <circle cx="400" cy="400" r="264" strokeWidth="1" opacity="0.45" />
          {RADIANT_MID_TICKS.map((tick, index) => (
            <line
              key={index}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              strokeWidth={tick.long ? 1.2 : 0.6}
              opacity={tick.long ? 0.5 : 0.26}
            />
          ))}
          {RADIANT_SPOKES.map((spoke, index) => (
            <line
              key={index}
              x1={spoke.x1}
              y1={spoke.y1}
              x2={spoke.x2}
              y2={spoke.y2}
              strokeWidth="0.7"
              opacity="0.3"
            />
          ))}
        </g>

        <circle cx="400" cy="400" r="172" strokeWidth="1" opacity="0.4" />

        {RADIANT_GLYPHS.map((glyph, index) => (
          <text
            key={index}
            x={glyph.x}
            y={glyph.y}
            className={styles.glyph}
            textAnchor="middle"
            dominantBaseline="middle"
            stroke="none"
            fill="currentColor"
          >
            {glyph.t}
          </text>
        ))}

        <g className={styles.accent} stroke="none" fill="currentColor">
          <circle cx="400" cy="400" r="26" opacity="0.7" />
        </g>
        <g className={styles.accent}>
          <circle cx="400" cy="400" r="46" strokeWidth="1.4" opacity="0.65" />
          <circle cx="400" cy="400" r="64" strokeWidth="0.8" opacity="0.35" />
        </g>
      </svg>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Galactic Spiral — a tilted barred spiral, the stage of the Seldon Plan.    */
/* -------------------------------------------------------------------------- */

const TILT = 0.6;

function spiralArm(offset: number) {
  const a = 8;
  const b = 0.36;
  const turns = 10.5;
  const steps = 130;
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * turns;
    const r = a * Math.exp(b * t);
    const x = 400 + Math.cos(t + offset) * r;
    const y = 400 + Math.sin(t + offset) * r * TILT;
    d += `${i === 0 ? "M" : "L"}${round(x)} ${round(y)} `;
  }
  return d.trim();
}

const GALAXY_ARMS = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((offset) => spiralArm(offset));
const GALAXY_DUST = [0.35, (Math.PI * 2) / 3 + 0.35, (Math.PI * 4) / 3 + 0.35].map((offset) =>
  spiralArm(offset),
);

const GALAXY_STARS = (() => {
  let seed = 1337 >>> 0;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: 90 }).map(() => {
    const angle = rnd() * Math.PI * 2;
    const r = Math.pow(rnd(), 0.62) * 372;
    return {
      x: round(400 + Math.cos(angle) * r),
      y: round(400 + Math.sin(angle) * r * TILT),
      r: round(0.5 + rnd() * 1.7),
    };
  });
})();

function GalacticSpiral() {
  return (
    <>
      <div className={styles.galaxyCore} />
      <svg
        className={styles.galaxySvg}
        viewBox="0 0 800 800"
        fill="none"
        stroke="currentColor"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className={styles.spinSlow}>
          {[140, 240, 340].map((r) => (
            <ellipse
              key={r}
              cx="400"
              cy="400"
              rx={r}
              ry={round(r * TILT)}
              strokeWidth="0.6"
              opacity="0.14"
            />
          ))}
          {GALAXY_DUST.map((d, index) => (
            <path
              key={`dust-${index}`}
              d={d}
              className={styles.dust}
              strokeWidth="9"
              strokeLinecap="round"
              opacity="0.16"
            />
          ))}
          {GALAXY_ARMS.map((d, index) => (
            <path
              key={`arm-${index}`}
              d={d}
              className={styles.arm}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
          <g className={styles.star} stroke="none" fill="currentColor">
            {GALAXY_STARS.map((s, index) => (
              <circle key={index} cx={s.x} cy={s.y} r={s.r} />
            ))}
          </g>
          <g className={styles.accent} stroke="none" fill="currentColor">
            <ellipse cx="400" cy="400" rx="64" ry={round(64 * TILT)} opacity="0.5" />
            <circle cx="400" cy="400" r="16" opacity="0.85" />
          </g>
        </g>
      </svg>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Trantor — the limb of the galaxy's world-city, plated and lit (CSS-built). */
/* -------------------------------------------------------------------------- */

function Trantor() {
  return (
    <>
      <div className={styles.trantorGlow} />
      <div className={styles.trantorPlanet} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Terminus — the lone star at the edge, a planet limb, and the galaxy band.  */
/* -------------------------------------------------------------------------- */

function Terminus() {
  return (
    <>
      <div className={styles.terminusBand} />
      <div className={styles.terminusPlanet} />
      <div className={styles.terminusGlow} />
      <svg
        className={styles.terminusStar}
        viewBox="0 0 200 200"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <g stroke="currentColor" strokeLinecap="round">
          <path d="M100 24V176" strokeWidth="1.1" opacity="0.5" />
          <path d="M24 100H176" strokeWidth="1.1" opacity="0.5" />
          <path d="M52 52 148 148" strokeWidth="0.6" opacity="0.28" />
          <path d="M148 52 52 148" strokeWidth="0.6" opacity="0.28" />
        </g>
        <circle cx="100" cy="100" r="6" fill="currentColor" />
        <circle cx="100" cy="100" r="13" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      </svg>
    </>
  );
}

const SCENES: Record<Exclude<WallpaperId, "void">, () => ReactElement> = {
  radiant: PrimeRadiant,
  spiral: GalacticSpiral,
  trantor: Trantor,
  terminus: Terminus,
};

/**
 * The TerminusOS desktop wallpaper. Each variant is a Foundation-themed scene with a
 * deliberate design for both themes: dark renders glowing, holographic deep space, while
 * light renders the same geometry as a printed "Encyclopedia Galactica" blueprint on
 * parchment. Purely decorative and pointer-transparent; all motion respects reduced-motion.
 * The active variant comes from OS settings; pass `variant` to render a fixed preview.
 */
export default function OSWallpaper({ variant }: { variant?: WallpaperId }) {
  const { wallpaper } = useOSSettings();
  const active = variant ?? wallpaper;
  const Scene = active === "void" ? null : SCENES[active];

  return (
    <div className={styles.wallpaper} data-variant={active} aria-hidden="true">
      <div className={styles.base} />
      {active !== "void" ? <div className={styles.stars} /> : null}
      {Scene ? <Scene /> : null}
      <div className={styles.vignette} />
    </div>
  );
}
