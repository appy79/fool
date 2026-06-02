import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/portfolio/shared/PageShell";

export const metadata: Metadata = {
  title: "404 — Off the star charts",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageShell innerClassName="max-w-[82rem] gap-10">
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <p className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">
          error 404 · uncharted
        </p>
        <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.05em] text-foreground">
          Off the star charts.
        </h1>
        <p className="max-w-md text-sm leading-7 text-muted-foreground">
          The Terminus archives hold no record of this route. The Encyclopedia Galactica can only
          map paths the Foundation has already charted — this one runs past the edge of the Galaxy.
        </p>
        <p className="rounded-full border border-primary/30 bg-background/70 px-4 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
          &gt; encyclopedia.galactica // no entry for this sector
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
          <Link
            href="/"
            className="border-b border-foreground px-1 py-2 text-foreground transition hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Return to Terminus
          </Link>
          <Link
            href="/labs"
            className="border-b border-primary/60 px-1 py-2 text-primary transition hover:border-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Open the labs
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
