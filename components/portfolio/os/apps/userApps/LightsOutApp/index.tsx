"use client";

import { useState } from "react";
import AppIcon from "./icon";

const N = 5;
const TOTAL = N * N;

const LEVELS = [
  { id: "easy", label: "Easy", scrambles: 4 },
  { id: "med", label: "Med", scrambles: 7 },
  { id: "hard", label: "Hard", scrambles: 12 },
] as const;
type LevelId = (typeof LEVELS)[number]["id"];

const neighbors = (i: number) => {
  const r = Math.floor(i / N);
  const c = i % N;
  const out = [i];
  if (r > 0) out.push(i - N);
  if (r < N - 1) out.push(i + N);
  if (c > 0) out.push(i - 1);
  if (c < N - 1) out.push(i + 1);
  return out;
};

function press(grid: boolean[], i: number) {
  const next = grid.slice();
  for (const j of neighbors(i)) next[j] = !next[j];
  return next;
}

function scramble(scrambles: number) {
  let grid = new Array<boolean>(TOTAL).fill(false);
  for (let k = 0; k < scrambles; k += 1) {
    grid = press(grid, Math.floor(Math.random() * TOTAL));
  }
  // Guarantee the board isn't already solved.
  if (grid.every((on) => !on)) grid = press(grid, Math.floor(Math.random() * TOTAL));
  return grid;
}

export default function LightsOutApp() {
  const [level, setLevel] = useState<LevelId>("med");
  const [grid, setGrid] = useState<boolean[]>(() => scramble(7));
  const [moves, setMoves] = useState(0);

  const newPuzzle = (levelId: LevelId = level) => {
    const config = LEVELS.find((l) => l.id === levelId) ?? LEVELS[1];
    setGrid(scramble(config.scrambles));
    setMoves(0);
  };

  const litCount = grid.filter(Boolean).length;
  const solved = litCount === 0;

  const click = (i: number) => {
    if (solved) return;
    setGrid((current) => press(current, i));
    setMoves((m) => m + 1);
  };

  return (
    <div className="space-y-5 p-4 @lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <AppIcon className="size-3.5" />
            seldon&apos;s grid // null state
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            Seldon&apos;s Grid
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Every node you toggle flips its neighbors too. Bring the entire lattice dark to
            stabilize the sector.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
          <span>
            moves <span className="text-gold">{moves}</span>
          </span>
          <span>
            lit <span className="text-gold">{litCount}</span>
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-md border border-border/70">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setLevel(l.id);
                newPuzzle(l.id);
              }}
              className={`px-2.5 py-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.12em] transition focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none ${
                level === l.id
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => newPuzzle()}
          className="border border-border/70 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          New puzzle
        </button>
      </div>

      <div className="relative mx-auto w-full max-w-[24rem]">
        <div className="grid aspect-square w-full grid-cols-5 gap-2 rounded-md border border-border/70 bg-card/40 p-2">
          {grid.map((on, i) => (
            <button
              key={i}
              type="button"
              onClick={() => click(i)}
              aria-label={`node ${i + 1} ${on ? "lit" : "dark"}`}
              className={`rounded-sm border transition focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none ${
                on
                  ? "border-primary/60 bg-primary/70 shadow-[0_0_18px_-2px_color-mix(in_oklch,var(--primary)_70%,transparent)]"
                  : "border-border/50 bg-background/50 hover:border-primary/40"
              }`}
            />
          ))}
        </div>

        {solved ? (
          <div className="absolute inset-0 grid place-items-center rounded-md bg-background/70 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                Sector stabilized
              </p>
              <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
                cleared in {moves} {moves === 1 ? "move" : "moves"}
              </p>
              <button
                type="button"
                onClick={() => newPuzzle()}
                className="mt-4 border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                Next puzzle
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
