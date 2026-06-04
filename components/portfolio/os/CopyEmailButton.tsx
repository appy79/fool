"use client";

import { useClipboard } from "./useClipboard";

function CopyGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12.5 9 17.5 20 6.5" />
    </svg>
  );
}

type CopyEmailButtonProps = {
  email: string;
  /** Eyebrow label shown above the address in the card variant. */
  label?: string;
  variant?: "inline" | "card";
  /** Extra classes merged onto the root (e.g. grid span for the card variant). */
  className?: string;
};

/**
 * Renders an email address that copies to the clipboard on click (no `mailto:`, so
 * scrapers get nothing actionable) and confirms with an inline "copied" affordance.
 */
export default function CopyEmailButton({
  email,
  label,
  variant = "inline",
  className = "",
}: CopyEmailButtonProps) {
  const { copied, copy } = useClipboard();
  const onClick = () => void copy(email);
  const a11yLabel = copied ? "Email address copied to clipboard" : `Copy email address ${email}`;

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={a11yLabel}
        className={`group flex w-full items-center justify-between gap-3 border border-border/70 bg-card/50 p-4 text-left transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${className}`}
      >
        <span className="min-w-0">
          {label ? (
            <span className="block font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
              {label}
            </span>
          ) : null}
          <span className="mt-1 block break-all font-medium text-foreground">{email}</span>
        </span>
        <span
          aria-live="polite"
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-primary"
        >
          {copied ? <CheckGlyph className="size-3.5" /> : <CopyGlyph className="size-3.5" />}
          {copied ? "copied" : "copy"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={a11yLabel}
      className={`group inline-flex items-center gap-1.5 font-mono underline-offset-4 transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${className}`}
    >
      <span className="group-hover:underline">{email}</span>
      <span aria-live="polite" className="inline-flex items-center gap-1 text-primary">
        {copied ? (
          <CheckGlyph className="size-3" />
        ) : (
          <CopyGlyph className="size-3 opacity-60 transition group-hover:opacity-100" />
        )}
        {copied ? <span className="text-[0.85em] uppercase tracking-[0.14em]">copied</span> : null}
      </span>
    </button>
  );
}
