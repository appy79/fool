import { resume, type ResolvedContactInfo } from "./resume";

type ResolvedSocial = { label: string; href: string };

const absoluteHrefPattern = /^(?:https?:|mailto:|tel:)/i;
const domainHrefPattern = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#]|$)/i;

/**
 * Strips leading "@" handles and surrounding slashes so a bare username can be slotted
 * into a profile URL template.
 */
const normalizeSocialParameter = (value: string) =>
  value
    .trim()
    .replace(/^@+/, "")
    .replace(/^\/+|\/+$/g, "");

/**
 * Turns a configured social value into an href. Accepts already-absolute URLs, bare domains
 * (prefixed with https), or a username that is interpolated into the provided href template.
 */
const resolveSocialHref = (value: string, hrefTemplate?: string) => {
  const trimmedValue = value.trim();

  if (absoluteHrefPattern.test(trimmedValue)) {
    return trimmedValue;
  }

  if (domainHrefPattern.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  if (hrefTemplate) {
    return hrefTemplate.replace(
      "{value}",
      encodeURIComponent(normalizeSocialParameter(trimmedValue)),
    );
  }

  return trimmedValue;
};

// Nicer display labels for well-known networks whose auto-derived title-case would look off.
const SOCIAL_LABEL_OVERRIDES: Record<string, string> = {
  GITHUB: "GitHub",
  GITLAB: "GitLab",
  LINKEDIN: "LinkedIn",
  LEETCODE: "LeetCode",
  PORTFOLIO: "Portfolio",
  WEBSITE: "Website",
  YOUTUBE: "YouTube",
  STACKOVERFLOW: "Stack Overflow",
  TWITTER: "Twitter",
  X: "X",
};

/** Derives a display label from a SOCIAL_* env key, e.g. `SOCIAL_DEV_TO` -> "Dev To". */
const labelForSocialKey = (envKey: string): string => {
  const suffix = envKey.replace(/^SOCIAL_/, "");
  return (
    SOCIAL_LABEL_OVERRIDES[suffix] ??
    suffix
      .toLowerCase()
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
};

/**
 * Resolves the contact block from the environment. Email and phone come from their configured
 * CONTACT_* vars. Socials are fully env-driven: EVERY `SOCIAL_*` variable is included — the ones
 * declared in `resume.contact.socialsFromEnv` first (for curated labels, order, and username
 * templates), then any remaining `SOCIAL_*` vars (alphabetical, label derived from the key). So a
 * new profile only needs an env var, no code change. Unset variables are skipped. Runs server-side.
 */
export function getResolvedContact(): ResolvedContactInfo {
  const contact: ResolvedContactInfo = resume.contact;

  const curated = contact.socialsFromEnv ?? [];
  const curatedKeys = new Set(curated.map((social) => social.envKey));

  const socials: ResolvedSocial[] = [];

  // Curated networks first, in their declared order (keeps nice labels + username templates).
  for (const social of curated) {
    const envValue = process.env[social.envKey]?.trim();
    if (envValue) {
      socials.push({ label: social.label, href: resolveSocialHref(envValue, social.hrefTemplate) });
    }
  }

  // Then any other SOCIAL_* variable, alphabetically, with a label derived from the key.
  const extraKeys = Object.keys(process.env)
    .filter((key) => key.startsWith("SOCIAL_") && !curatedKeys.has(key))
    .sort();
  for (const key of extraKeys) {
    const envValue = process.env[key]?.trim();
    if (envValue)
      socials.push({ label: labelForSocialKey(key), href: resolveSocialHref(envValue) });
  }

  return {
    ...contact,
    email: contact.emailFromEnv ? process.env[contact.emailFromEnv] : contact.email,
    phone: contact.phoneFromEnv ? process.env[contact.phoneFromEnv] : contact.phone,
    socials: socials.length > 0 ? socials : (contact.socials ?? []),
  };
}
