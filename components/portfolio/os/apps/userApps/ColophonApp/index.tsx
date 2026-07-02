"use client";

import { resume } from "@/lib/resume";
import { PrimeRadiantGlyph } from "../../../../icons/FoundationMotifs";
import { copy, notes, stack } from "./data";

export default function ColophonApp() {
  return (
    <div className="space-y-6 p-6 @lg:p-8">
      <header>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <PrimeRadiantGlyph className="size-3.5" />
          {copy.eyebrow}
        </span>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
          {copy.title}
        </h1>
        <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
          {copy.introLead} {resume.name}.
        </p>
      </header>

      <div className="space-y-3">
        {notes.map((note) => (
          <p key={note} className="text-sm leading-7 text-muted-foreground">
            {note}
          </p>
        ))}
      </div>

      <dl className="grid gap-2 @md:grid-cols-2">
        {stack.map((row) => (
          <div key={row.label} className="border border-border/60 bg-card/40 p-3">
            <dt className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-muted-foreground">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="border-t border-border/60 pt-4 font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
        {copy.footerLead} {resume.name} · {new Date().getFullYear()}
      </p>
    </div>
  );
}
