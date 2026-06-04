"use client";

import { type FormEvent, useReducer, useState } from "react";
import AppIcon from "./icon";
import { copy, DEFAULT_SEED, EASTER_EGG, OUTCOMES, SUGGESTIONS } from "./data";
import { buildProjection, type Projection, shuffledQueue } from "./projection";

const TOTAL = OUTCOMES.length;
const FEED_LIMIT = 8;

type State = {
  queue: number[];
  projections: Projection[];
  idCounter: number;
  served: number;
  exhausted: boolean;
};

type Action = { type: "draw"; seed: string } | { type: "reset" };

function init(): State {
  const [first, ...rest] = shuffledQueue(TOTAL);
  return {
    queue: rest,
    projections: [buildProjection(DEFAULT_SEED, first, 0)],
    idCounter: 1,
    served: 1,
    exhausted: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "reset":
      return init();
    case "draw": {
      if (state.queue.length === 0) return { ...state, exhausted: true };
      const [next, ...rest] = state.queue;
      const projection = buildProjection(action.seed, next, state.idCounter);
      return {
        ...state,
        queue: rest,
        projections: [projection, ...state.projections].slice(0, FEED_LIMIT),
        idCounter: state.idCounter + 1,
        served: state.served + 1,
        exhausted: rest.length === 0,
      };
    }
    default:
      return state;
  }
}

export default function PsychohistoryApp() {
  const [seed, setSeed] = useState("");
  const [state, dispatch] = useReducer(reducer, undefined, init);
  const { projections, served, exhausted } = state;
  const remaining = Math.max(0, TOTAL - served);

  const run = (value: string) => {
    if (exhausted) {
      dispatch({ type: "reset" });
    } else {
      dispatch({ type: "draw", seed: value });
    }
    setSeed("");
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    run(seed);
  };

  return (
    <div className="space-y-6 p-4 @lg:p-7">
      <header>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <AppIcon className="size-3.5" />
          {copy.eyebrow}
        </span>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
          {copy.title}
        </h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{copy.intro}</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            placeholder={copy.placeholder}
            aria-label="Projection variable"
            disabled={exhausted}
            className="min-w-0 flex-1 border border-border/70 bg-card/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            className="shrink-0 border border-primary/50 bg-primary/10 px-4 py-2.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {exhausted ? EASTER_EGG.resetLabel : copy.submitLabel}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => run(suggestion)}
                disabled={exhausted}
                className="rounded-full border border-border/70 px-3 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none disabled:opacity-40"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <span className="shrink-0 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
            {exhausted ? "vault depleted" : `${remaining}/${TOTAL} in vault`}
          </span>
        </div>
      </form>

      {exhausted ? (
        <section className="relative overflow-hidden rounded-md border border-primary/50 bg-gradient-to-b from-primary/12 to-background/40 p-4 shadow-[0_24px_60px_-30px_color-mix(in_oklch,var(--primary)_60%,transparent)] @lg:p-5">
          <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-gold">
            {EASTER_EGG.badge}
          </span>
          <p className="mt-2.5 font-display text-base font-semibold tracking-[-0.01em] text-foreground">
            {EASTER_EGG.opener}
          </p>
          <div className="mt-3 space-y-2.5 text-sm leading-6 text-muted-foreground">
            {EASTER_EGG.lines.map((line, index) => (
              <p
                key={index}
                className={index === EASTER_EGG.lines.length - 1 ? "text-foreground italic" : ""}
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-3 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-primary">
            {EASTER_EGG.signature}
          </p>
        </section>
      ) : null}

      <ul className="space-y-3" aria-live="polite">
        {projections.map((projection) => (
          <li key={projection.id} className="instrument-panel">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate font-mono text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-primary">
                projection // {projection.seed}
              </span>
              <span className="shrink-0 font-mono text-[0.6rem] font-bold tabular-nums text-gold">
                {projection.confidence}% · {projection.horizon} cyc
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground">
              {projection.opener} {projection.outcome}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
