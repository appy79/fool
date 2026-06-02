"use client";

import Link from "next/link";
import { useEffect } from "react";
import PageShell from "@/components/portfolio/shared/PageShell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell innerClassName="max-w-[82rem] gap-10">
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
          error 500 · anomaly
        </p>
        <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.05em] text-foreground">
          A variable Seldon didn&apos;t predict.
        </h1>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          Psychohistory forecasts the flow of the masses, never the lone anomaly — a Mule — that
          just disrupted this sector. Recompute, and the Plan should converge again.
        </p>
        <p className="rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
          &gt; seldon.plan // deviation detected{error.digest ? ` · anomaly ${error.digest}` : ""}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
          <button
            type="button"
            onClick={reset}
            className="border-b border-foreground px-1 py-2 text-foreground transition hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Recompute the Plan
          </button>
          <Link
            href="/"
            className="border-b border-primary/60 px-1 py-2 text-primary transition hover:border-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Return to Terminus
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
