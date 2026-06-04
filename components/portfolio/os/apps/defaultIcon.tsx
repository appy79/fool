type IconProps = { className?: string };

/** Fallback icon used by the registry for apps that ship without their own icon. */
export default function DefaultAppIcon({ className }: IconProps) {
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
      <rect x="4" y="4" width="16" height="16" rx="3.2" />
      <path d="M9 9h6v6H9z" opacity={0.6} />
    </svg>
  );
}
