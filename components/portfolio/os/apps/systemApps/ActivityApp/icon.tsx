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
      <path d="M3.5 12h3l2.5-6 4 13 2.5-7h5" />
    </svg>
  );
}
