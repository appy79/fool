import { resume, type ResolvedContactInfo } from "./resume";

type ResolvedSocial = { label: string; href: string };

const absoluteHrefPattern = /^(?:https?:|mailto:|tel:)/i;
const domainHrefPattern = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#]|$)/i;

/**
 * Strips leading "@" handles and surrounding slashes so a bare username can be slotted
 * into a profile URL template.
 */
const normalizeSocialParameter = (value: string) =>
  value.trim().replace(/^@+/, "").replace(/^\/+|\/+$/g, "");

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
    return hrefTemplate.replace("{value}", encodeURIComponent(normalizeSocialParameter(trimmedValue)));
  }

  return trimmedValue;
};

/**
 * Resolves the contact block by reading the configured environment variables for email, phone,
 * and socials, falling back to any static values declared in `resume.contact`. Runs server-side.
 */
export function getResolvedContact(): ResolvedContactInfo {
  const contact: ResolvedContactInfo = resume.contact;

  const socials: ResolvedSocial[] = contact.socialsFromEnv
    ? contact.socialsFromEnv
        .map((social) => {
          const envValue = process.env[social.envKey]?.trim();

          return envValue ? { label: social.label, href: resolveSocialHref(envValue, social.hrefTemplate) } : null;
        })
        .filter((social): social is ResolvedSocial => Boolean(social?.href))
    : contact.socials ?? [];

  return {
    ...contact,
    email: contact.emailFromEnv ? process.env[contact.emailFromEnv] : contact.email,
    phone: contact.phoneFromEnv ? process.env[contact.phoneFromEnv] : contact.phone,
    socials,
  };
}
