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
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M7 9.75 10 12.25 7 14.75" />
      <path d="M12.5 15h4.5" opacity={0.8} />
    </svg>
  );
}
