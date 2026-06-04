"use client";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import AppIcon from "./icon";

type Dir = "left" | "right" | "up" | "down";
const SIZE = 4;
const BEST_KEY = "terminusos.2048.best";

const emptyBoard = () => new Array<number>(SIZE * SIZE).fill(0);

function addTile(board: number[]) {
  const free = board.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0);
  if (free.length === 0) return board;
  const cell = free[Math.floor(Math.random() * free.length)];
  const next = board.slice();
  next[cell] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function newBoard() {
  return addTile(addTile(emptyBoard()));
}

function slide(line: number[]) {
  const nums = line.filter((n) => n !== 0);
  let gained = 0;
  for (let i = 0; i < nums.length - 1; i += 1) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2;
      gained += nums[i];
      nums.splice(i + 1, 1);
    }
  }
  while (nums.length < SIZE) nums.push(0);
  return { line: nums, gained };
}

function move(board: number[], dir: Dir) {
  const next = board.slice();
  let gained = 0;
  const read = (i: number, j: number) => {
    if (dir === "left") return board[i * SIZE + j];
    if (dir === "right") return board[i * SIZE + (SIZE - 1 - j)];
    if (dir === "up") return board[j * SIZE + i];
    return board[(SIZE - 1 - j) * SIZE + i];
  };
  const write = (i: number, j: number, v: number) => {
    if (dir === "left") next[i * SIZE + j] = v;
    else if (dir === "right") next[i * SIZE + (SIZE - 1 - j)] = v;
    else if (dir === "up") next[j * SIZE + i] = v;
    else next[(SIZE - 1 - j) * SIZE + i] = v;
  };
  for (let i = 0; i < SIZE; i += 1) {
    const line = Array.from({ length: SIZE }, (_, j) => read(i, j));
    const result = slide(line);
    gained += result.gained;
    for (let j = 0; j < SIZE; j += 1) write(i, j, result.line[j]);
  }
  const moved = next.some((v, k) => v !== board[k]);
  return { board: next, gained, moved };
}

function canMove(board: number[]) {
  if (board.some((v) => v === 0)) return true;
  for (let i = 0; i < SIZE; i += 1) {
    for (let j = 0; j < SIZE; j += 1) {
      const v = board[i * SIZE + j];
      if (j < SIZE - 1 && v === board[i * SIZE + j + 1]) return true;
      if (i < SIZE - 1 && v === board[(i + 1) * SIZE + j]) return true;
    }
  }
  return false;
}

function tileStyle(v: number): CSSProperties {
  const exp = Math.log2(v);
  if (v >= 128) {
    const pct = Math.min(78, 34 + exp * 5);
    return {
      background: `color-mix(in oklch, var(--gold) ${pct}%, var(--card))`,
      color: "var(--background)",
    };
  }
  const pct = Math.min(62, 10 + exp * 9);
  return {
    background: `color-mix(in oklch, var(--primary) ${pct}%, var(--card))`,
    color: exp >= 4 ? "var(--background)" : "var(--foreground)",
  };
}

const fontFor = (v: number) =>
  v >= 1024 ? "text-base @sm:text-lg" : v >= 128 ? "text-lg @sm:text-xl" : "text-xl @sm:text-2xl";

export default function Game2048App() {
  const [board, setBoard] = useState<number[]>(newBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(window.localStorage.getItem(BEST_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  });
  const [status, setStatus] = useState<"playing" | "won" | "over">("playing");
  const keepGoing = useRef(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    boardRef.current?.focus({ preventScroll: true });
  }, []);

  const apply = (dir: Dir) => {
    if (status === "over") return;
    const result = move(board, dir);
    if (!result.moved) return;
    const next = addTile(result.board);
    const newScore = score + result.gained;
    setBoard(next);
    setScore(newScore);
    if (newScore > best) {
      setBest(newScore);
      window.localStorage.setItem(BEST_KEY, String(newScore));
    }
    if (!keepGoing.current && next.includes(2048)) setStatus("won");
    else if (!canMove(next)) setStatus("over");
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    const map: Record<string, Dir> = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      a: "left",
      d: "right",
      w: "up",
      s: "down",
    };
    const dir = map[event.key];
    if (!dir) return;
    event.preventDefault();
    apply(dir);
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) apply(dx > 0 ? "right" : "left");
    else apply(dy > 0 ? "down" : "up");
  };

  const restart = () => {
    setBoard(newBoard());
    setScore(0);
    setStatus("playing");
    keepGoing.current = false;
    boardRef.current?.focus({ preventScroll: true });
  };

  return (
    <div className="space-y-5 p-4 @lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <AppIcon className="size-3.5" />
            trantor // tech tiers
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            Trantor 2048
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Merge equal tiers to climb toward 2048. Arrow keys or swipe.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <div className="rounded-md border border-border/70 bg-card/50 px-3 py-1.5 text-center">
            <div className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">
              Score
            </div>
            <div className="font-mono text-sm font-bold tabular-nums text-foreground">{score}</div>
          </div>
          <div className="rounded-md border border-border/70 bg-card/50 px-3 py-1.5 text-center">
            <div className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">
              Best
            </div>
            <div className="font-mono text-sm font-bold tabular-nums text-gold">{best}</div>
          </div>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-[26rem]">
        <div
          ref={boardRef}
          role="application"
          aria-label="2048 board — arrow keys or swipe to move"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="grid aspect-square w-full touch-none grid-cols-4 gap-2 rounded-md border border-border/70 bg-card/40 p-2 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          {board.map((v, i) => (
            <div
              key={i}
              className="grid place-items-center rounded-sm bg-background/40"
              style={v ? tileStyle(v) : undefined}
            >
              {v ? (
                <span className={`font-display font-bold tabular-nums ${fontFor(v)}`}>{v}</span>
              ) : null}
            </div>
          ))}
        </div>

        {status !== "playing" ? (
          <div className="absolute inset-0 grid place-items-center rounded-md bg-background/70 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {status === "won" ? "2048 reached" : "No moves left"}
              </p>
              <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
                score {score} · best {best}
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {status === "won" ? (
                  <button
                    type="button"
                    onClick={() => {
                      keepGoing.current = true;
                      setStatus("playing");
                      boardRef.current?.focus({ preventScroll: true });
                    }}
                    className="border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                  >
                    Keep going
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={restart}
                  className="border border-border/70 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  New run
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={restart}
          className="border border-border/70 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          New run
        </button>
      </div>
    </div>
  );
}
