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
      <rect x="3.75" y="6" width="5" height="5" rx="1" />
      <rect
        x="9.5"
        y="6"
        width="5"
        height="5"
        rx="1"
        fill="currentColor"
        stroke="none"
        opacity={0.85}
      />
      <rect x="15.25" y="6" width="5" height="5" rx="1" />
      <path d="M5 15.5h14M5 18.5h9" opacity={0.55} />
    </svg>
  );
}
