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

export default function ResumeDownloadMenu({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "icon";
}) {
  const [open, setOpen] = React.useState(false);
  const menuId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const fallbackFocus = buttonRef.current;
    requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])")?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", closeOnOutsidePointer);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus();
      } else {
        fallbackFocus?.focus();
      }
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", variant === "default" ? "w-full md:w-auto" : "shrink-0", className)}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          variant === "icon"
            ? "relative inline-flex size-9 items-center justify-center border border-transparent text-foreground transition hover:border-primary/50 hover:bg-accent/30 hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            : "relative block w-full border border-transparent px-4 py-3 pr-10 text-left text-sm text-muted-foreground transition hover:border-primary/50 hover:bg-accent/30 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none md:inline-flex md:w-auto md:items-center md:gap-2 md:px-2 md:py-1 md:pr-2"
        )}
        aria-controls={menuId}
        aria-expanded={open}
        aria-label={variant === "icon" ? "Open resume download menu" : undefined}
        title={variant === "icon" ? "Resume" : undefined}
        onClick={() => setOpen((current) => !current)}
      >
        {variant === "icon" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
            <path d="M7 3.75h6.25L17 7.5v12.75H7V3.75Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 3.75V8h4M9.25 12h5.5M9.25 15h5.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <>
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
          </>
        )}
      </button>

      {open && (
        <div
          id={menuId}
          ref={panelRef}
          role="group"
          aria-label="Résumé downloads"
          tabIndex={-1}
          className={cn(
            "z-50 mt-2 border border-border/70 bg-card/95 p-2 backdrop-blur dark:bg-background/95",
            variant === "icon"
              ? "absolute left-1/2 top-full w-72 -translate-x-1/2"
              : "static w-full md:absolute md:left-auto md:right-0 md:top-full md:w-80"
          )}
        >
          {resumeOptions.map((option) => (
            <a
              key={option.href}
              href={option.href}
              target={option.target}
              rel={option.target ? "noreferrer" : undefined}
              className="block border border-transparent px-3 py-3 transition hover:border-primary/50 hover:bg-accent/25 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              onClick={() => setOpen(false)}
            >
              <span className="block text-sm font-medium text-foreground">{option.label}</span>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{option.detail}</span>
              {option.target ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
