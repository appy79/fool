import type { ComponentType } from "react";
import type { AppComponentProps } from "../osStore";

/**
 * An app's self-describing metadata.
 *
 * Drop a folder into `apps/userApps/` with an `index.tsx` (the default-exported
 * app component) and the OS will pick it up automatically — no central files to
 * edit. Add a `manifest.ts` next to `index.tsx` to customise how the app shows
 * up; without one, the id/title are derived from the folder name and a generic
 * icon is used. Keep the app self-contained: put its icon in a co-located
 * `icon.tsx` (a default-exported svg component) rather than a shared icon file.
 *
 *   // apps/userApps/MyApp/icon.tsx
 *   export default function Icon({ className }: { className?: string }) {
 *     return <svg className={className}>…</svg>;
 *   }
 *
 *   // apps/userApps/MyApp/manifest.ts
 *   import Icon from "./icon";
 *   import type { AppManifest } from "../../appManifest";
 *
 *   export const manifest: AppManifest = {
 *     id: "my-app",
 *     title: "My App",
 *     description: "Does a useful thing.",
 *     Icon,
 *     defaultSize: { w: 640, h: 480 },
 *   };
 *
 * `kind` (system vs user) is inferred from which folder the app lives in, so it
 * is intentionally not part of the manifest.
 */
export type AppManifest = {
  /** Stable unique id. Persisted in user storage, so don't change it casually. */
  id: string;
  title: string;
  /** Shorter label used where space is tight (dock tooltips, tabs). */
  shortLabel?: string;
  description?: string;
  Icon: ComponentType<{ className?: string }>;
  /** Default desktop window size. */
  defaultSize?: { w: number; h: number };
  /** Lower sorts earlier in the dock / app store. Unset apps sort last. */
  order?: number;
  /** Draw a separator before this item in the dock (groups utilities). */
  dividerBefore?: boolean;
  /** Hidden apps are reachable via payload (e.g. a Case File), not the dock. */
  hidden?: boolean;
  /** When set, launching navigates here instead of opening a window. */
  href?: string;
  /** External hrefs open in a new tab rather than replacing the OS. */
  external?: boolean;
};

/**
 * One entry in the generated registry: the inferred `kind`, the app's manifest,
 * and a lazy loader for its component chunk. Produced by
 * `scripts/generate-app-registry.mjs` — see `registry.generated.ts`.
 */
export type GeneratedApp = {
  kind: "system" | "user";
  manifest: AppManifest;
  load: () => Promise<{ default: ComponentType<AppComponentProps> }>;
};
