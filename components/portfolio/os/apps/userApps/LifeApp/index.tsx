"use client";

import { type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from "react";
import AppIcon from "./icon";

const COLS = 50;
const ROWS = 30;
const CELL = 11;
const W = COLS * CELL;
const H = ROWS * CELL;

const SPEEDS = [
  { id: "slow", label: "Slow", ms: 220 },
  { id: "med", label: "Med", ms: 105 },
  { id: "fast", label: "Fast", ms: 45 },
] as const;

const idx = (x: number, y: number) => y * COLS + x;
const empty = () => new Uint8Array(COLS * ROWS);

function randomGrid(p = 0.27) {
  const g = empty();
  for (let i = 0; i < g.length; i += 1) g[i] = Math.random() < p ? 1 : 0;
  return g;
}

function step(g: Uint8Array) {
  const next = empty();
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue;
          n += g[idx((x + dx + COLS) % COLS, (y + dy + ROWS) % ROWS)];
        }
      }
      const alive = g[idx(x, y)] === 1;
      next[idx(x, y)] = alive ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
    }
  }
  return next;
}

const PATTERNS: Record<string, { cells: number[][]; ox: number; oy: number }> = {
  Glider: {
    cells: [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    ox: 3,
    oy: 3,
  },
  "R-pentomino": {
    cells: [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    ox: 24,
    oy: 14,
  },
  Gun: {
    ox: 4,
    oy: 4,
    cells: [
      [0, 4],
      [0, 5],
      [1, 4],
      [1, 5],
      [10, 4],
      [10, 5],
      [10, 6],
      [11, 3],
      [11, 7],
      [12, 2],
      [12, 8],
      [13, 2],
      [13, 8],
      [14, 5],
      [15, 3],
      [15, 7],
      [16, 4],
      [16, 5],
      [16, 6],
      [17, 5],
      [20, 2],
      [20, 3],
      [20, 4],
      [21, 2],
      [21, 3],
      [21, 4],
      [22, 1],
      [22, 5],
      [24, 0],
      [24, 1],
      [24, 5],
      [24, 6],
      [34, 2],
      [34, 3],
      [35, 2],
      [35, 3],
    ],
  },
};

function stamp(name: keyof typeof PATTERNS) {
  const g = empty();
  const { cells, ox, oy } = PATTERNS[name];
  for (const [x, y] of cells) g[idx((x + ox) % COLS, (y + oy) % ROWS)] = 1;
  return g;
}

const countAlive = (g: Uint8Array) => g.reduce((sum, v) => sum + v, 0);

export default function LifeApp() {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [seed] = useState(() => randomGrid());
  const [running, setRunning] = useState(!prefersReduced);
  const [speedId, setSpeedId] = useState<(typeof SPEEDS)[number]["id"]>("med");
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(() => countAlive(seed));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gridRef = useRef<Uint8Array>(seed);
  const runningRef = useRef(running);
  const speedRef = useRef(105);
  const paintRef = useRef<number | null>(null);
  const colorRef = useRef("#5cc8ff");

  useEffect(() => {
    runningRef.current = running;
  }, [running]);
  useEffect(() => {
    speedRef.current = SPEEDS.find((s) => s.id === speedId)?.ms ?? 105;
  }, [speedId]);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let frame = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      if (frame % 24 === 0) colorRef.current = getComputedStyle(canvas).color || colorRef.current;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = colorRef.current;
      const g = gridRef.current;
      for (let y = 0; y < ROWS; y += 1) {
        for (let x = 0; x < COLS; x += 1) {
          if (g[idx(x, y)]) ctx.fillRect(x * CELL + 0.5, y * CELL + 0.5, CELL - 1, CELL - 1);
        }
      }
    };
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      frame += 1;
      draw();
      if (!runningRef.current || t - last < speedRef.current) return;
      last = t;
      gridRef.current = step(gridRef.current);
      setGeneration((g) => g + 1);
      setPopulation(countAlive(gridRef.current));
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cellFrom = (event: ReactPointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * COLS);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * ROWS);
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return null;
    return { x, y };
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    const c = cellFrom(event);
    if (!c) return;
    event.preventDefault();
    paintRef.current = gridRef.current[idx(c.x, c.y)] ? 0 : 1;
    gridRef.current[idx(c.x, c.y)] = paintRef.current;
    setPopulation(countAlive(gridRef.current));
    canvasRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent) => {
    if (paintRef.current === null) return;
    const c = cellFrom(event);
    if (!c) return;
    gridRef.current[idx(c.x, c.y)] = paintRef.current;
    setPopulation(countAlive(gridRef.current));
  };

  const endPaint = () => {
    paintRef.current = null;
  };

  const reseed = (grid: Uint8Array, run = false) => {
    gridRef.current = grid;
    setGeneration(0);
    setPopulation(countAlive(grid));
    setRunning(run);
  };

  return (
    <div className="space-y-5 p-4 @lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <AppIcon className="size-3.5" />
            psychohistory // emergence
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            Psychohistory Sim
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Conway&apos;s Game of Life on a wrapping field. Paint cells, then watch civilizations
            bloom, collapse, and persist. Three rules; infinite histories.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
          <span>
            gen <span className="text-gold">{generation}</span>
          </span>
          <span>
            pop <span className="text-gold">{population}</span>
          </span>
        </div>
      </header>

      <div className="overflow-hidden rounded-md border border-border/70 bg-card/40 p-2">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPaint}
          onPointerCancel={endPaint}
          className="block h-auto w-full touch-none rounded-sm text-primary [image-rendering:pixelated]"
          aria-label="Game of Life field — click or drag to toggle cells"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          {running ? "Pause" : "Run"}
        </button>
        <button
          type="button"
          onClick={() => {
            gridRef.current = step(gridRef.current);
            setGeneration((g) => g + 1);
            setPopulation(countAlive(gridRef.current));
            setRunning(false);
          }}
          className="border border-border/70 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          Step
        </button>
        <button
          type="button"
          onClick={() => reseed(randomGrid(), !prefersReduced)}
          className="border border-border/70 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          Random
        </button>
        <button
          type="button"
          onClick={() => reseed(empty())}
          className="border border-border/70 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          Clear
        </button>

        <span className="mx-1 hidden h-5 w-px bg-border/70 @sm:block" />

        <div className="inline-flex overflow-hidden rounded-md border border-border/70">
          {SPEEDS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSpeedId(s.id)}
              className={`px-2.5 py-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.12em] transition focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none ${
                speedId === s.id
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(Object.keys(PATTERNS) as (keyof typeof PATTERNS)[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => reseed(stamp(name), !prefersReduced)}
            className="rounded-full border border-border/70 px-3 py-1 font-mono text-[0.54rem] uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
