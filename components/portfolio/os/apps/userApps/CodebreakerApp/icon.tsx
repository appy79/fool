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
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" fill="currentColor" stroke="none" opacity={0.85} />
      <circle cx="8" cy="16" r="2.5" fill="currentColor" stroke="none" opacity={0.85} />
      <circle cx="16" cy="16" r="2.5" />
    </svg>
  );
}
