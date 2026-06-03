import { type ReactNode } from "react";
import type { ProjectVisualKind } from "@/lib/resume";

/** Context glyph per project domain, keyed off the project's visual kind. */
const GLYPHS: Record<ProjectVisualKind, ReactNode> = {
  // Release / deploy — an artifact pushed upward onto a line.
  deployment: (
    <>
      <path d="M12 4v10" />
      <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
      <path d="M5 19h14" />
    </>
  ),
  // Charging — a lightning bolt.
  charging: <path d="M13 3 5 13h6l-1 8 9-11h-6l1-7Z" />,
  // Telecom — a broadcast antenna with signal arcs.
  telecom: (
    <>
      <path d="M12 13v8" />
      <circle cx="12" cy="10.5" r="1.6" />
      <path d="M8 6.5a6 6 0 0 1 8 0" />
      <path d="M5.5 4a9.5 9.5 0 0 1 13 0" />
    </>
  ),
  // Billing — a receipt with a torn edge.
  billing: (
    <>
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" />
      <path d="M9.5 8h5" />
      <path d="M9.5 12h5" />
    </>
  ),
  // Ordering — a checked queue.
  ordering: (
    <>
      <path d="M10 6h10" />
      <path d="M10 12h10" />
      <path d="M10 18h10" />
      <path d="m3.5 6 1.2 1.2L7.5 4.5" />
      <path d="m3.5 12 1.2 1.2 2.8-2.7" />
      <circle cx="5" cy="18" r="1.1" />
    </>
  ),
  // Media — a play marker inside a frame.
  media: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10.5 9 4.5 3-4.5 3z" />
    </>
  ),
  // Pipeline — connected processing nodes.
  pipeline: (
    <>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h3" />
      <path d="M14 12h3" />
    </>
  ),
  // Monetization — a currency disc.
  monetization: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M14.7 9.2c-.6-.8-1.6-1.2-2.7-1.2-1.5 0-2.6.8-2.6 1.9 0 1 .8 1.6 2.3 1.9l.8.2c1.5.3 2.3.9 2.3 1.9 0 1.1-1.1 1.9-2.6 1.9-1.1 0-2.1-.4-2.7-1.2" />
    </>
  ),
  // System — a processor / chip.
  system: (
    <>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
      <rect x="10" y="10" width="4" height="4" rx="0.5" />
      <path d="M9 3v3.5M15 3v3.5M9 17.5V21M15 17.5V21M3 9h3.5M3 15h3.5M17.5 9H21M17.5 15H21" />
    </>
  ),
};

export default function CaseFileIcon({
  kind,
  className,
}: {
  kind: ProjectVisualKind;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {GLYPHS[kind] ?? GLYPHS.system}
    </svg>
  );
}
