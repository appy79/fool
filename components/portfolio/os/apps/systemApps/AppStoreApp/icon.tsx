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
      <path d="M6 7.5h12l-.9 11.2a1.5 1.5 0 0 1-1.5 1.3H8.4a1.5 1.5 0 0 1-1.5-1.3L6 7.5Z" />
      <path d="M9 7.5a3 3 0 0 1 6 0" />
      <path d="M12 11.5v4.5M9.75 13.75h4.5" opacity={0.7} />
    </svg>
  );
}
