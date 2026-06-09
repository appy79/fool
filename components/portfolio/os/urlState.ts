import { resume } from "@/lib/resume";

const APP_PARAM = "app";
const PROJECT_PARAM = "project";

/** URL-safe slug from arbitrary text (used for project titles in deep links). */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const titleBySlug = new Map(
  resume.projects.map((project) => [slugify(project.title), project.title]),
);

export type DeepLink = { appId: string; projectTitle?: string };

/**
 * Reads the foreground app (and optional project) from the URL query, resolving a project
 * slug back to its exact title so it matches the window payload. Returns null when there is
 * no `app` param. The caller validates the id against the registry / installed modules.
 */
export function readDeepLink(): DeepLink | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const appId = params.get(APP_PARAM);
  if (!appId) return null;
  const slug = params.get(PROJECT_PARAM);
  const projectTitle = slug ? titleBySlug.get(slug) : undefined;
  return { appId, projectTitle };
}

/**
 * Writes (or clears) the foreground app/project into the URL with replaceState — no history
 * entry and no navigation — so the address bar always reflects what's open and the link is
 * shareable. Other query params and the hash are preserved.
 */
export function writeDeepLink(appId: string | null, projectTitle?: string): void {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const { searchParams } = url;
  if (!appId) {
    searchParams.delete(APP_PARAM);
    searchParams.delete(PROJECT_PARAM);
  } else {
    searchParams.set(APP_PARAM, appId);
    if (projectTitle) searchParams.set(PROJECT_PARAM, slugify(projectTitle));
    else searchParams.delete(PROJECT_PARAM);
  }
  const query = searchParams.toString();
  const next = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
  try {
    window.history.replaceState(window.history.state, "", next);
  } catch {
    // Browsers (notably WebKit) rate-limit history changes and throw once the limit is hit.
    // The shareable URL is a nicety, not core to the OS, so swallow it rather than crash.
  }
}
