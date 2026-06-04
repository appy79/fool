import type { SVGProps } from "react";

type MotifProps = SVGProps<SVGSVGElement> & {
  className?: string;
};

const baseProps = (className?: string): SVGProps<SVGSVGElement> => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: className ?? "size-4",
});

/** Faceted crystalline polyhedron of psychohistory. */
export function PrimeRadiantGlyph({ className, ...props }: MotifProps) {
  return (
    <svg {...baseProps(className)} {...props}>
      <path d="M12 2.5 19.5 6.75v10.5L12 21.5 4.5 17.25V6.75Z" />
      <path d="M12 2.5V21.5M4.5 6.75 19.5 17.25M19.5 6.75 4.5 17.25" opacity={0.55} />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

/** Orbital ring with a transiting body. */
export function OrbitalRing({ className, ...props }: MotifProps) {
  return (
    <svg {...baseProps(className)} {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <ellipse cx="12" cy="12" rx="9" ry="4.1" transform="rotate(-24 12 12)" opacity={0.7} />
      <circle cx="20" cy="8.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
