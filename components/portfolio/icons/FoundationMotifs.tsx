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

/** Galactic spiral seen from Terminus, at the edge of the galaxy. */
export function GalacticSpiral({ className, ...props }: MotifProps) {
  return (
    <svg {...baseProps(className)} {...props}>
      <path d="M12 12c0-2.2 2.2-3 3.4-1.4 1.4 1.8.2 4.6-2.4 5-3.2.5-5.6-2.4-5.2-5.6.5-3.9 4.4-6.2 8.2-5 2.3.7 4 2.7 4.5 5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
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

/** The Time Vault door on Terminus. */
export function VaultGlyph({ className, ...props }: MotifProps) {
  return (
    <svg {...baseProps(className)} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3" />
      <path
        d="M12 3.5V7M12 17v3.5M3.5 12H7M17 12h3.5M6 6l2.3 2.3M18 6l-2.3 2.3M6 18l2.3-2.3M18 18l-2.3-2.3"
        opacity={0.7}
      />
    </svg>
  );
}

/** Encyclopedia Galactica: the open compendium of all knowledge. */
export function EncyclopediaMark({ className, ...props }: MotifProps) {
  return (
    <svg {...baseProps(className)} {...props}>
      <path d="M12 6.6C10.5 5.4 8.1 5 6 5H3.6v12.6H6c2.1 0 4.5.4 6 1.6 1.5-1.2 3.9-1.6 6-1.6h2.4V5H18c-2.1 0-4.5.4-6 1.6Z" />
      <path d="M12 6.6v12.6" />
    </svg>
  );
}
