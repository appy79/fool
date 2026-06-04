import { resume } from "@/lib/resume";

/**
 * Recruiter-facing "open to roles" signal. Reads `resume.availability`; renders nothing
 * when the operator has marked themselves unavailable, so toggling one flag hides it
 * everywhere it appears (lock screen, Operator, Dossier).
 */
export default function AvailabilityBadge({ className = "" }: { className?: string }) {
  const availability = resume.availability;
  if (!availability.open) return null;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 ${className}`}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-primary">
        <span className="status-dot" aria-hidden="true" />
        {availability.label}
      </span>
      <span className="text-[0.72rem] leading-5 text-muted-foreground">{availability.detail}</span>
    </div>
  );
}
