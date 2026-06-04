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
      <rect x="5.25" y="4.25" width="13.5" height="15.5" rx="1.8" />
      <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
      <path d="M9 4.25V6M15 4.25V6" opacity={0.7} />
    </svg>
  );
}
