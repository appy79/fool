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
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9.3 4v16M14.6 4v16M4 9.3h16M4 14.6h16" opacity={0.45} />
      <rect x="4" y="4" width="5.3" height="5.3" fill="currentColor" stroke="none" opacity={0.85} />
      <rect
        x="14.7"
        y="9.3"
        width="5.3"
        height="5.3"
        fill="currentColor"
        stroke="none"
        opacity={0.85}
      />
      <rect
        x="9.3"
        y="14.7"
        width="5.3"
        height="5.3"
        fill="currentColor"
        stroke="none"
        opacity={0.85}
      />
    </svg>
  );
}
