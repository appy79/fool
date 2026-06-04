"use client";

import { useState } from "react";
import AppIcon from "./icon";

const COLORS = [
  { hex: "#5cc8ff", name: "cyan" },
  { hex: "#d4a017", name: "gold" },
  { hex: "#34d399", name: "emerald" },
  { hex: "#a78bfa", name: "violet" },
  { hex: "#fb7185", name: "rose" },
  { hex: "#fbbf24", name: "amber" },
] as const;

const SLOTS = 4;
const MAX = 10;

type Row = { guess: number[]; exact: number; partial: number };

const randomCode = () =>
  Array.from({ length: SLOTS }, () => Math.floor(Math.random() * COLORS.length));

function score(guess: number[], secret: number[]) {
  let exact = 0;
  const sCount = new Array(COLORS.length).fill(0);
  const gCount = new Array(COLORS.length).fill(0);
  for (let i = 0; i < SLOTS; i += 1) {
    if (guess[i] === secret[i]) exact += 1;
    else {
      sCount[secret[i]] += 1;
      gCount[guess[i]] += 1;
    }
  }
  let partial = 0;
  for (let c = 0; c < COLORS.length; c += 1) partial += Math.min(sCount[c], gCount[c]);
  return { exact, partial };
}

function Dot({ color, size = "size-7" }: { color: number | null; size?: string }) {
  if (color === null) {
    return (
      <span
        className={`${size} rounded-full border border-dashed border-border/70 bg-background/40`}
      />
    );
  }
  return (
    <span
      className={`${size} rounded-full border border-black/10 shadow-inner`}
      style={{ background: COLORS[color].hex }}
    />
  );
}

function Feedback({ exact, partial }: { exact: number; partial: number }) {
  const pegs: ("exact" | "partial" | "none")[] = [];
  for (let i = 0; i < exact; i += 1) pegs.push("exact");
  for (let i = 0; i < partial; i += 1) pegs.push("partial");
  while (pegs.length < SLOTS) pegs.push("none");
  return (
    <span className="grid grid-cols-2 gap-1">
      {pegs.map((p, i) => (
        <span
          key={i}
          className={`size-2 rounded-full ${
            p === "exact"
              ? "bg-gold"
              : p === "partial"
                ? "bg-foreground/45"
                : "border border-border/60 bg-transparent"
          }`}
        />
      ))}
    </span>
  );
}

export default function CodebreakerApp() {
  const [secret, setSecret] = useState<number[]>(randomCode);
  const [rows, setRows] = useState<Row[]>([]);
  const [current, setCurrent] = useState<(number | null)[]>(Array(SLOTS).fill(null));
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");

  const ready = current.every((c) => c !== null);

  const place = (color: number) => {
    if (status !== "playing") return;
    setCurrent((cur) => {
      const slot = cur.findIndex((c) => c === null);
      if (slot === -1) return cur;
      const next = cur.slice();
      next[slot] = color;
      return next;
    });
  };

  const clearSlot = (slot: number) => {
    if (status !== "playing") return;
    setCurrent((cur) => {
      const next = cur.slice();
      next[slot] = null;
      return next;
    });
  };

  const submit = () => {
    if (!ready || status !== "playing") return;
    const guess = current as number[];
    const result = score(guess, secret);
    const nextRows = [...rows, { guess, exact: result.exact, partial: result.partial }];
    setRows(nextRows);
    setCurrent(Array(SLOTS).fill(null));
    if (result.exact === SLOTS) setStatus("won");
    else if (nextRows.length >= MAX) setStatus("lost");
  };

  const reset = () => {
    setSecret(randomCode());
    setRows([]);
    setCurrent(Array(SLOTS).fill(null));
    setStatus("playing");
  };

  const attemptsLeft = MAX - rows.length;

  return (
    <div className="space-y-5 p-4 @lg:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <AppIcon className="size-3.5" />
            codebreaker // vault cipher
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            Codebreaker
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            Crack the 4-glyph vault code. Gold peg = right glyph, right slot. Grey peg = right
            glyph, wrong slot.
          </p>
        </div>
        <span className="shrink-0 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
          {status === "playing" ? `${attemptsLeft} tries left` : `code in ${rows.length}`}
        </span>
      </header>

      <ul className="space-y-1.5">
        {rows.map((row, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-card/40 px-3 py-2"
          >
            <span className="font-mono text-[0.5rem] text-muted-foreground tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex gap-1.5">
              {row.guess.map((c, j) => (
                <Dot key={j} color={c} size="size-6" />
              ))}
            </span>
            <Feedback exact={row.exact} partial={row.partial} />
          </li>
        ))}
        {rows.length === 0 ? (
          <li className="rounded-md border border-dashed border-border/50 px-3 py-3 text-center font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground">
            no transmissions yet
          </li>
        ) : null}
      </ul>

      {status === "playing" ? (
        <div className="space-y-3 rounded-md border border-primary/30 bg-primary/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex gap-1.5">
              {current.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => clearSlot(i)}
                  aria-label={`slot ${i + 1}${c === null ? " empty" : ""}`}
                  className="rounded-full focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                >
                  <Dot color={c} />
                </button>
              ))}
            </span>
            <button
              type="button"
              onClick={submit}
              disabled={!ready}
              className="border border-primary/50 bg-primary/10 px-4 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none disabled:opacity-40"
            >
              Transmit
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color, i) => (
              <button
                key={color.name}
                type="button"
                onClick={() => place(i)}
                aria-label={color.name}
                className="size-8 rounded-full border border-black/10 transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
                style={{ background: color.hex }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-md border border-primary/40 bg-gradient-to-b from-primary/10 to-background/40 p-4 text-center">
          <p className="font-display text-xl font-semibold text-foreground">
            {status === "won" ? "Vault open" : "Lockout"}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground">
              code
            </span>
            {secret.map((c, i) => (
              <Dot key={i} color={c} size="size-6" />
            ))}
          </div>
          <button
            type="button"
            onClick={reset}
            className="border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            New code
          </button>
        </div>
      )}
    </div>
  );
}
