import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import {
  ActivityIcon,
  CasesIcon,
  ColophonIcon,
  ForecastIcon,
  LabsAppIcon,
  LogIcon,
  OperatorIcon,
  ResumeIcon,
  SettingsIcon,
  StoreIcon,
  TerminalIcon,
} from "./AppIcons";
import type { AppComponentProps, AppDefinition } from "./osStore";

/**
 * Each app body is a separate chunk loaded on demand — opening an app (or installing
 * it, via `preloadApp`) fetches its JS. Nothing here pulls an app body into the
 * initial bundle; only this lightweight metadata + icons load up front.
 */
const loaders = {
  operator: () => import("./apps/systemApps/OperatorApp"),
  cases: () => import("./apps/systemApps/CaseFilesApp"),
  activity: () => import("./apps/systemApps/ActivityApp"),
  log: () => import("./apps/systemApps/SystemLogApp"),
  terminal: () => import("./apps/userApps/TerminalApp"),
  colophon: () => import("./apps/userApps/ColophonApp"),
  forecast: () => import("./apps/userApps/PsychohistoryApp"),
  labs: () => import("./apps/userApps/LabsApp"),
  resume: () => import("./apps/systemApps/ResumeApp"),
  settings: () => import("./apps/systemApps/SettingsApp"),
  appstore: () => import("./apps/systemApps/AppStoreApp"),
  casefile: () => import("./apps/systemApps/CaseFileApp"),
};

function AppLoading() {
  return (
    <div className="grid h-full w-full place-items-center bg-background/40 p-6">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
        loading module…
      </span>
    </div>
  );
}

const appComponent = (id: keyof typeof loaders): ComponentType<AppComponentProps> =>
  dynamic(loaders[id], { loading: AppLoading });

/** Warm a module's chunk ahead of first open (e.g. the moment it is installed). */
export function preloadApp(id: string): Promise<unknown> | undefined {
  return (loaders as Record<string, () => Promise<unknown>>)[id]?.();
}

export const APPS: AppDefinition[] = [
  {
    id: "operator",
    title: "Operator",
    kind: "system",
    Icon: OperatorIcon,
    component: appComponent("operator"),
    defaultSize: { w: 720, h: 560 },
  },
  {
    id: "cases",
    title: "Case Files",
    shortLabel: "Cases",
    kind: "system",
    Icon: CasesIcon,
    component: appComponent("cases"),
    defaultSize: { w: 780, h: 600 },
  },
  {
    id: "activity",
    title: "Activity",
    kind: "system",
    Icon: ActivityIcon,
    component: appComponent("activity"),
    defaultSize: { w: 740, h: 580 },
  },
  {
    id: "log",
    title: "System Log",
    shortLabel: "Log",
    kind: "system",
    Icon: LogIcon,
    component: appComponent("log"),
    defaultSize: { w: 760, h: 600 },
  },
  {
    id: "terminal",
    title: "Terminal",
    kind: "user",
    description: "Interactive command console for the OS.",
    Icon: TerminalIcon,
    component: appComponent("terminal"),
    defaultSize: { w: 720, h: 480 },
  },
  {
    id: "colophon",
    title: "Colophon",
    kind: "user",
    description: "How TerminusOS is built.",
    Icon: ColophonIcon,
    component: appComponent("colophon"),
    defaultSize: { w: 620, h: 560 },
  },
  {
    id: "forecast",
    title: "Psychohistory",
    shortLabel: "Forecast",
    kind: "user",
    description: "A playful Foundation-style projection toy.",
    Icon: ForecastIcon,
    component: appComponent("forecast"),
    defaultSize: { w: 560, h: 540 },
  },
  {
    id: "resume",
    title: "Resume",
    kind: "system",
    Icon: ResumeIcon,
    component: appComponent("resume"),
    defaultSize: { w: 560, h: 440 },
    dividerBefore: true,
  },
  {
    id: "settings",
    title: "Settings",
    kind: "system",
    Icon: SettingsIcon,
    component: appComponent("settings"),
    defaultSize: { w: 580, h: 480 },
  },
  {
    id: "appstore",
    title: "App Store",
    shortLabel: "Store",
    kind: "system",
    description: "Install and remove user modules.",
    Icon: StoreIcon,
    component: appComponent("appstore"),
    defaultSize: { w: 640, h: 600 },
  },
  {
    id: "labs",
    title: "Labs",
    kind: "user",
    description: "Interactive engineering-systems exhibits.",
    Icon: LabsAppIcon,
    component: appComponent("labs"),
    defaultSize: { w: 1000, h: 700 },
  },
  {
    id: "casefile",
    title: "Case File",
    kind: "system",
    Icon: CasesIcon,
    component: appComponent("casefile"),
    defaultSize: { w: 800, h: 640 },
    hidden: true,
  },
];

/** Every app id known to this build — used to discard stale entries from user storage. */
export const KNOWN_APP_IDS: ReadonlySet<string> = new Set(APPS.map((app) => app.id));

/**
 * Ids of installable (user) modules. These are the only ids that may legitimately
 * appear in a persisted `installedApps` list; anything else is stale and dropped.
 */
export const USER_APP_IDS: ReadonlySet<string> = new Set(
  APPS.filter((app) => app.kind === "user").map((app) => app.id),
);
