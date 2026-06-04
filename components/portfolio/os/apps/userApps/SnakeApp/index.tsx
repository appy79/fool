"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import AppIcon from "./icon";

const COLS = 24;
const ROWS = 16;
const CELL = 18;
const W = COLS * CELL;
const H = ROWS * CELL;
const BEST_KEY = "terminusos.snake.best";

type Pt = { x: number; y: number };
type Status = "idle" | "running" | "paused" | "over";

const START_MS = 130;
const MIN_MS = 60;

const eq = (a: Pt, b: Pt) => a.x === b.x && a.y === b.y;

function spawnFood(snake: Pt[]): Pt {
  let f: Pt;
  do {
    f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => eq(s, f)));
  return f;
}

function initialSnake(): Pt[] {
  const cy = Math.floor(ROWS / 2);
  const cx = Math.floor(COLS / 2);
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
}

export default function SnakeApp() {
  const [boot] = useState(() => {
    const snake = initialSnake();
    return { snake, food: spawnFood(snake) };
  });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = Number(window.localStorage.getItem(BEST_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
  });
  const [status, setStatus] = useState<Status>("idle");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const snakeRef = useRef<Pt[]>(boot.snake);
  const dirRef = useRef<Pt>({ x: 1, y: 0 });
  const queueRef = useRef<Pt[]>([]);
  const foodRef = useRef<Pt>(boot.food);
  const statusRef = useRef<Status>("idle");
  const speedRef = useRef(START_MS);
  const colors = useRef({ primary: "#5cc8ff", gold: "#d4a017", grid: "rgba(120,140,170,0.12)" });
  const swipe = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    let frame = 0;

    const refreshColors = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cs = getComputedStyle(canvas);
      colors.current.primary = cs.color || colors.current.primary;
      const gold = cs.getPropertyValue("--gold").trim();
      if (gold) colors.current.gold = gold;
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      if (frame % 24 === 0) refreshColors();
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = colors.current.grid;
      ctx.lineWidth = 1;
      for (let x = 1; x < COLS; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, H);
        ctx.stroke();
      }
      for (let y = 1; y < ROWS; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(W, y * CELL);
        ctx.stroke();
      }
      const food = foodRef.current;
      ctx.fillStyle = colors.current.gold;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      const snake = snakeRef.current;
      for (let i = snake.length - 1; i >= 0; i -= 1) {
        ctx.fillStyle = i === 0 ? colors.current.gold : colors.current.primary;
        ctx.globalAlpha = i === 0 ? 1 : Math.max(0.4, 1 - i * 0.03);
        ctx.fillRect(snake[i].x * CELL + 1, snake[i].y * CELL + 1, CELL - 2, CELL - 2);
      }
      ctx.globalAlpha = 1;
    };

    const die = () => {
      const finalScore = snakeRef.current.length - 3;
      setStatus("over");
      setBest((b) => {
        const nb = Math.max(b, finalScore);
        window.localStorage.setItem(BEST_KEY, String(nb));
        return nb;
      });
    };

    const tick = () => {
      const queued = queueRef.current.shift();
      if (queued) dirRef.current = queued;
      const dir = dirRef.current;
      const snake = snakeRef.current;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS) {
        die();
        return;
      }
      if (snake.some((s, i) => i < snake.length - 1 && eq(s, head))) {
        die();
        return;
      }
      const ate = eq(head, foodRef.current);
      const next = [head, ...snake];
      if (!ate) next.pop();
      snakeRef.current = next;
      if (ate) {
        foodRef.current = spawnFood(next);
        setScore((s) => {
          const ns = s + 1;
          speedRef.current = Math.max(MIN_MS, START_MS - ns * 4);
          return ns;
        });
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      frame += 1;
      draw();
      if (statusRef.current !== "running") return;
      if (t - last < speedRef.current) return;
      last = t;
      tick();
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const turn = (dir: Pt) => {
    const current = queueRef.current.at(-1) ?? dirRef.current;
    if (dir.x === -current.x && dir.y === -current.y) return;
    if (dir.x === current.x && dir.y === current.y) return;
    queueRef.current.push(dir);
    if (statusRef.current === "idle" || statusRef.current === "paused") setStatus("running");
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    const map: Record<string, Pt> = {
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
    };
    const dir = map[event.key];
    if (!dir || status === "over") return;
    event.preventDefault();
    turn(dir);
  };

  const reset = () => {
    snakeRef.current = initialSnake();
    dirRef.current = { x: 1, y: 0 };
    queueRef.current = [];
    foodRef.current = spawnFood(snakeRef.current);
    speedRef.current = START_MS;
    setScore(0);
    setStatus("idle");
    boardRef.current?.focus({ preventScroll: true });
  };

  const onPointerDown = (event: ReactPointerEvent) => {
    boardRef.current?.focus({ preventScroll: true });
    swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || status === "over") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) {
      setStatus((s) => (s === "running" ? "paused" : "running"));
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) turn({ x: dx > 0 ? 1 : -1, y: 0 });
    else turn({ x: 0, y: dy > 0 ? 1 : -1 });
  };

  return (
    <div className="space-y-5 p-4 @lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <AppIcon className="size-3.5" />
            hyperwave // relay
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            Hyperwave
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Route the relay, collect the packets, don&apos;t cross your own signal. Click the board,
            then arrow keys or swipe; tap to pause.
          </p>
        </div>
        <div className="flex shrink-0 gap-3 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
          <span>
            score <span className="text-gold">{score}</span>
          </span>
          <span>
            best <span className="text-gold">{best}</span>
          </span>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-[34rem]">
        <div
          ref={boardRef}
          role="application"
          aria-label="Snake board — arrow keys or swipe to steer"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          className="overflow-hidden rounded-md border border-border/70 bg-card/40 p-2 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="block h-auto w-full touch-none rounded-sm text-primary"
            aria-hidden="true"
          />
        </div>

        {status !== "running" ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center rounded-md bg-background/65 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-display text-xl font-semibold text-foreground @sm:text-2xl">
                {status === "over" ? "Signal lost" : status === "paused" ? "Paused" : "Hyperwave"}
              </p>
              <p className="mt-1 max-w-[18rem] px-4 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground">
                {status === "over"
                  ? `final ${score} · best ${best}`
                  : "click board · arrow keys or swipe to begin"}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (status === "over") reset();
            else {
              setStatus((s) => (s === "running" ? "paused" : "running"));
              boardRef.current?.focus({ preventScroll: true });
            }
          }}
          className="border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          {status === "over" ? "New relay" : status === "running" ? "Pause" : "Start"}
        </button>
        <button
          type="button"
          onClick={reset}
          className="border border-border/70 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
