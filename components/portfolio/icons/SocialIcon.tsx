import { siLeetcode } from "simple-icons";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.98c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.98H3.68V20h3.26V8.98ZM5.31 4C4.25 4 3.6 4.7 3.6 5.62c0 .9.63 1.62 1.67 1.62h.02c1.09 0 1.72-.72 1.72-1.62C6.99 4.7 6.38 4 5.31 4ZM20.4 13.68c0-3.37-1.8-4.94-4.21-4.94-1.94 0-2.81 1.07-3.29 1.82V8.98H9.64c.04 1.03 0 11.02 0 11.02h3.26v-6.15c0-.33.02-.66.12-.89.26-.66.85-1.34 1.84-1.34 1.3 0 1.82 1.01 1.82 2.49V20h3.26l.46-6.32Z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d={siLeetcode.path} />
    </svg>
  );
}

/**
 * Resolves a social link label (e.g. "GitHub", "LinkedIn", "LeetCode") to its glyph. Returns
 * `null` for unrecognized labels so the caller can render text alone.
 */
export default function SocialIcon({ label }: { label: string }) {
  const normalizedLabel = label.toLowerCase();

  if (normalizedLabel.includes("github")) {
    return <GitHubIcon />;
  }

  if (normalizedLabel.includes("linkedin")) {
    return <LinkedInIcon />;
  }

  if (normalizedLabel.includes("leetcode")) {
    return <LeetCodeIcon />;
  }

  return null;
}
