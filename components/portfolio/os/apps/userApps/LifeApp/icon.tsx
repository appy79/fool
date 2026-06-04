type IconProps = { className?: string };

export default function Icon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className ?? "size-4"}
    >
      <rect x="9.4" y="4.4" width="4" height="4" rx="0.7" fill="currentColor" stroke="none" />
      <rect x="4.4" y="9.6" width="4" height="4" rx="0.7" fill="currentColor" stroke="none" />
      <rect x="9.4" y="9.6" width="4" height="4" rx="0.7" fill="currentColor" stroke="none" />
      <rect x="14.4" y="9.6" width="4" height="4" rx="0.7" fill="currentColor" stroke="none" />
      <rect
        x="9.4"
        y="14.8"
        width="4"
        height="4"
        rx="0.7"
        fill="currentColor"
        stroke="none"
        opacity={0.55}
      />
    </svg>
  );
}
