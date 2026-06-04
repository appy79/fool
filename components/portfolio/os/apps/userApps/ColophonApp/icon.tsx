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
      <path d="M12 5.5C10.5 4.4 8.6 4 6.5 4H5v15h1.5c2.1 0 4 .4 5.5 1.5" />
      <path d="M12 5.5C13.5 4.4 15.4 4 17.5 4H19v15h-1.5c-2.1 0-4 .4-5.5 1.5" />
      <path d="M12 5.5v15" opacity={0.6} />
    </svg>
  );
}
