"use client";

import { type FormEvent, useState } from "react";
import { ForecastIcon } from "../../../AppIcons";
import { copy, DEFAULT_SEED, SUGGESTIONS } from "./data";
import { project, type Projection } from "./projection";

export default function PsychohistoryApp() {
  const [seed, setSeed] = useState("");
  const [idCounter, setIdCounter] = useState(1);
  const [projections, setProjections] = useState<Projection[]>([project(DEFAULT_SEED, 0)]);

  const compute = (value: string) => {
    setProjections((current) => [project(value, idCounter), ...current].slice(0, 6));
    setIdCounter((count) => count + 1);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    compute(seed);
    setSeed("");
  };

  return (
    <div className="space-y-6 p-5 sm:p-7">
      <header>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <ForecastIcon className="size-3.5" />
          {copy.eyebrow}
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
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
            className="min-w-0 flex-1 border border-border/70 bg-card/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-primary/50 bg-primary/10 px-4 py-2.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {copy.submitLabel}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => compute(suggestion)}
              className="rounded-full border border-border/70 px-3 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </form>

      <ul className="space-y-3" aria-live="polite">
        {projections.map((projection) => (
          <li key={projection.id} className="instrument-panel">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.18em] text-primary">
                projection // {projection.seed}
              </span>
              <span className="font-mono text-[0.6rem] font-bold tabular-nums text-gold">
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
