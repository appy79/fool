import { track } from "@vercel/analytics";

/**
 * Named visitor events worth measuring on the portfolio: how people enter, what they
 * open, and whether they take the actions that matter (resume, contact). Keeping the
 * set small and typed makes the analytics dashboard legible.
 */
export type AnalyticsEvent =
  | "enter_system"
  | "open_app"
  | "open_project"
  | "open_resume"
  | "copy_email"
  | "quick_glance";

/**
 * Fire-and-forget analytics event. Safe to call anywhere — it no-ops when no analytics
 * backend is wired up (e.g. local dev, or a deploy target other than Vercel), so feature
 * code never has to care whether tracking is active.
 */
export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string | number | boolean | null>,
): void {
  try {
    track(name, props);
  } catch {
    // Analytics unavailable — ignore so the UI is never affected.
  }
}
