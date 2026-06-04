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
      <path d="M6.5 3.75h7L18 8.25v12H6.5Z" />
      <path d="M13 3.75V8.5h4.5" opacity={0.7} />
      <path d="M9 12.5h6M9 15.5h6M9 9.5h2.5" />
    </svg>
  );
}
