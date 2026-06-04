"use client";

import { trackEvent } from "@/lib/analytics";
import { resumeFiles } from "@/lib/resume-files";
import { copy } from "./data";

export default function ResumeApp() {
  return (
    <div className="space-y-5 p-4 @lg:p-7">
      <header>
        <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {copy.eyebrow}
        </span>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
          {copy.title}
        </h1>
      </header>

      <ul className="grid gap-3">
        {resumeFiles.map((file) => (
          <li key={file.href}>
            <a
              href={file.href}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("open_resume", { file: file.label })}
              className="block border border-border/70 bg-card/50 p-4 transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <span className="block font-semibold text-foreground">{file.label}</span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {file.detail}
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
