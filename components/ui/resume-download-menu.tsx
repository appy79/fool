"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { resumeFiles } from "@/lib/resume-files";

type ResumeOption = {
  label: string;
  detail: string;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
};

const resumeOptions: ResumeOption[] = [
  ...resumeFiles.map((resumeFile) => ({
    label: resumeFile.label,
    detail: resumeFile.detail,
    href: resumeFile.href,
    target: "_blank" as const,
  })),
];

export default function ResumeDownloadMenu({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative w-full md:w-auto", className)}>
      <button
        type="button"
        className="relative block w-full border border-transparent px-4 py-3 pr-10 text-left text-sm text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:inline-flex md:w-auto md:items-center md:gap-2 md:px-0 md:py-0 md:pr-0 md:hover:border-transparent md:hover:bg-transparent"
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>Resume</span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={cn(
            "absolute right-4 top-1/2 size-3 -translate-y-1/2 transition-transform md:static md:translate-y-0",
            open && "rotate-180"
          )}
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="static z-50 mt-2 w-full border border-border/70 bg-card/95 p-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:absolute md:left-auto md:right-0 md:top-full md:w-80 dark:bg-background/95 dark:shadow-slate-950/10"
        >
          {resumeOptions.map((option) => (
            <a
              key={option.href}
              role="menuitem"
              href={option.href}
              target={option.target}
              rel={option.target ? "noreferrer" : undefined}
              className="block border border-transparent px-3 py-3 transition hover:border-primary/60 hover:bg-primary/10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() => setOpen(false)}
            >
              <span className="block text-sm font-medium text-foreground">{option.label}</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.detail}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
