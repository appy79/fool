"use client";

import { useNotifications } from "../../../notifications";
import { type AppDefinition, useOS } from "../../../osStore";
import { useOSSettings } from "../../../osSettings";
import { copy } from "./data";
import { SystemModuleRow } from "./SystemModuleRow";
import { UserModuleRow } from "./UserModuleRow";

export default function AppStoreApp() {
  const { apps, appsById, openApp } = useOS();
  const { installedApps, installApp, uninstallApp, resetApps } = useOSSettings();
  const { notify } = useNotifications();

  const userApps = apps.filter((app) => app.kind === "user" && !app.hidden);
  const systemApps = apps.filter((app) => app.kind === "system" && !app.hidden);
  const installedCount = userApps.filter((app) => installedApps.includes(app.id)).length;

  const titleFor = (id: string) => appsById.get(id)?.title ?? id;

  const install = (id: string) => {
    installApp(id);
    notify(`${titleFor(id)} installed — added to dock`, { tone: "success" });
  };

  const uninstall = (id: string) => {
    uninstallApp(id);
    notify(`${titleFor(id)} removed`, { tone: "warn" });
  };

  const launch = (app: AppDefinition) => {
    if (app.href) {
      window.open(app.href, app.external ? "_blank" : "_self", "noopener,noreferrer");
      return;
    }
    openApp(app.id);
  };

  return (
    <div className="space-y-6 p-4 @lg:p-7">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="status-dot" aria-hidden="true" />
            {copy.eyebrow}
          </span>
          <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
            {copy.title}
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{copy.intro}</p>
        </div>
        <span className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted-foreground">
          {installedCount}/{userApps.length} user · {systemApps.length} system
        </span>
      </header>

      <section className="space-y-3" aria-label="User modules">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            {copy.userHeading}
          </h2>
          <button
            type="button"
            onClick={resetApps}
            className="font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            {copy.restoreLabel}
          </button>
        </div>

        <ul className="grid grid-cols-[minmax(0,1fr)] gap-2.5">
          {userApps.map((app) => (
            <UserModuleRow
              key={app.id}
              app={app}
              installed={installedApps.includes(app.id)}
              onOpen={openApp}
              onInstall={install}
              onUninstall={uninstall}
            />
          ))}
        </ul>
      </section>

      <section className="space-y-3" aria-label="System modules">
        <h2 className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-foreground">
          {copy.systemHeading}
        </h2>
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 @md:grid-cols-[repeat(2,minmax(0,1fr))]">
          {systemApps.map((app) => (
            <SystemModuleRow key={app.id} app={app} onOpen={launch} />
          ))}
        </ul>
      </section>
    </div>
  );
}
