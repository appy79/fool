import type { SVGProps } from "react";

type IconProps = { className?: string };

const base = (className?: string): SVGProps<SVGSVGElement> => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: className ?? "size-4",
});

export function OperatorIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function CasesIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3.75 7.25a1.5 1.5 0 0 1 1.5-1.5h3.1l1.7 2h7.2a1.5 1.5 0 0 1 1.5 1.5v7.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M3.75 10.75h16.5" opacity={0.6} />
    </svg>
  );
}

export function ActivityIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M3.5 12h3l2.5-6 4 13 2.5-7h5" />
    </svg>
  );
}

export function LogIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="6" cy="7" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="6" cy="17" r="1.2" fill="currentColor" stroke="none" />
      <path d="M10 7h10M10 12h10M10 17h6" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M4 7h9M17 7h3" />
      <path d="M4 12h3M11 12h9" />
      <path d="M4 17h13M19.5 17H20" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="12" r="2" />
      <circle cx="18.5" cy="17" r="2" />
    </svg>
  );
}

export function ResumeIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M6.5 3.75h7L18 8.25v12H6.5Z" />
      <path d="M13 3.75V8.5h4.5" opacity={0.7} />
      <path d="M9 12.5h6M9 15.5h6M9 9.5h2.5" />
    </svg>
  );
}

export function LabsAppIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M9.5 3.75v5.2L5.6 16.5a2 2 0 0 0 1.75 3h9.3a2 2 0 0 0 1.75-3L14.5 8.95v-5.2" />
      <path d="M8.5 3.75h7M7.8 14.25h8.4" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M6 7.5h12l-.9 11.2a1.5 1.5 0 0 1-1.5 1.3H8.4a1.5 1.5 0 0 1-1.5-1.3L6 7.5Z" />
      <path d="M9 7.5a3 3 0 0 1 6 0" />
      <path d="M12 11.5v4.5M9.75 13.75h4.5" opacity={0.7} />
    </svg>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M7 9.75 10 12.25 7 14.75" />
      <path d="M12.5 15h4.5" opacity={0.8} />
    </svg>
  );
}

export function ColophonIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <path d="M12 5.5C10.5 4.4 8.6 4 6.5 4H5v15h1.5c2.1 0 4 .4 5.5 1.5" />
      <path d="M12 5.5C13.5 4.4 15.4 4 17.5 4H19v15h-1.5c-2.1 0-4 .4-5.5 1.5" />
      <path d="M12 5.5v15" opacity={0.6} />
    </svg>
  );
}

export function ForecastIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <ellipse cx="12" cy="12" rx="8" ry="3.4" />
      <ellipse cx="12" cy="12" rx="3.4" ry="8" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
