import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { GENERATED_APPS } from "./apps/registry.generated";
import type { AppComponentProps, AppDefinition } from "./osStore";

/**
 * The registry is assembled automatically from the app folders. Every directory
 * under `apps/systemApps` and `apps/userApps` with an `index.tsx` is discovered
 * by `scripts/generate-app-registry.mjs` (run via `npm run gen:apps`, which also
 * fires on dev/build) and listed in `registry.generated.ts`. To add an app, just
 * create a folder — nothing in this file needs to change.
 *
 * Each app body is a separate chunk loaded on demand: opening an app (or
 * installing it, via `preloadApp`) fetches its JS. Only this lightweight
 * metadata + icons load up front.
 */

function AppLoading() {
  return (
    <div className="grid h-full w-full place-items-center bg-background/40 p-6">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
        loading module…
      </span>
    </div>
  );
}

/** id -> lazy chunk loader, used to warm a module ahead of first open. */
const loaders = new Map<string, () => Promise<unknown>>(
  GENERATED_APPS.map((mod) => [mod.manifest.id, mod.load]),
);

/** Warm a module's chunk ahead of first open (e.g. the moment it is installed). */
export function preloadApp(id: string): Promise<unknown> | undefined {
  return loaders.get(id)?.();
}

const orderOf = (value: number | undefined) => value ?? Number.MAX_SAFE_INTEGER;

export const APPS: AppDefinition[] = [...GENERATED_APPS]
  .sort(
    (a, b) =>
      orderOf(a.manifest.order) - orderOf(b.manifest.order) ||
      a.manifest.title.localeCompare(b.manifest.title),
  )
  .map((mod) => {
    const { manifest } = mod;
    const component: ComponentType<AppComponentProps> = dynamic(mod.load, {
      loading: AppLoading,
    });
    return {
      id: manifest.id,
      title: manifest.title,
      shortLabel: manifest.shortLabel,
      description: manifest.description,
      kind: mod.kind,
      Icon: manifest.Icon,
      defaultSize: manifest.defaultSize,
      component: manifest.href ? undefined : component,
      href: manifest.href,
      external: manifest.external,
      dividerBefore: manifest.dividerBefore,
      hidden: manifest.hidden,
    } satisfies AppDefinition;
  });

/** Every app id known to this build — used to discard stale entries from user storage. */
export const KNOWN_APP_IDS: ReadonlySet<string> = new Set(APPS.map((app) => app.id));

/**
 * Ids of installable (user) modules. These are the only ids that may legitimately
 * appear in a persisted `installedApps` list; anything else is stale and dropped.
 */
export const USER_APP_IDS: ReadonlySet<string> = new Set(
  APPS.filter((app) => app.kind === "user").map((app) => app.id),
);
