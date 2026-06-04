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
      <rect x="4" y="3.5" width="16" height="17" rx="2.4" />
      <circle cx="9" cy="9" r="2" />
      <path d="M13 8h4" />
      <path d="M13 11h4" />
      <path d="M7 15h10" opacity={0.7} />
      <path d="M7 17.5h7" opacity={0.7} />
    </svg>
  );
}
