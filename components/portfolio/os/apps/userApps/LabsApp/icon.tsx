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
      <path d="M9.5 3.75v5.2L5.6 16.5a2 2 0 0 0 1.75 3h9.3a2 2 0 0 0 1.75-3L14.5 8.95v-5.2" />
      <path d="M8.5 3.75h7M7.8 14.25h8.4" />
    </svg>
  );
}
