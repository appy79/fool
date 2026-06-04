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
      <path d="M5 7h6a3 3 0 0 1 0 6H8a3 3 0 0 0 0 6h8" />
      <circle cx="17" cy="19" r="1.1" fill="currentColor" stroke="none" />
      <rect
        x="3.5"
        y="5.6"
        width="3"
        height="3"
        rx="0.6"
        fill="currentColor"
        stroke="none"
        opacity={0.7}
      />
    </svg>
  );
}
