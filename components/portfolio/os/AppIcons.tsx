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

export function CommsIcon({ className }: IconProps) {
  return (
    <svg {...base(className)}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M8.4 8.4a5 5 0 0 0 0 7.2M15.6 8.4a5 5 0 0 1 0 7.2" />
      <path d="M6 6a8 8 0 0 0 0 12M18 6a8 8 0 0 1 0 12" opacity={0.6} />
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
