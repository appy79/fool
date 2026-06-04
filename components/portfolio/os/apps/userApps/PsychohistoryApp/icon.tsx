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
      <ellipse cx="12" cy="12" rx="8" ry="3.4" />
      <ellipse cx="12" cy="12" rx="3.4" ry="8" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
