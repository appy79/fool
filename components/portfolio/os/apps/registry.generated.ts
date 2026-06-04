// AUTO-GENERATED FILE — do not edit by hand.
// Regenerate with: npm run gen:apps  (runs automatically on dev/build)
//
// Every folder under apps/systemApps and apps/userApps that contains an
// index.tsx is registered here. Add a manifest.ts beside index.tsx to customise
// id / title / icon / size; otherwise sensible defaults are derived.

import type { GeneratedApp } from "./appManifest";
import { manifest as systemApps_ActivityAppManifest } from "./systemApps/ActivityApp/manifest";
import { manifest as systemApps_AppStoreAppManifest } from "./systemApps/AppStoreApp/manifest";
import { manifest as systemApps_CaseFilesAppManifest } from "./systemApps/CaseFilesApp/manifest";
import { manifest as systemApps_OperatorAppManifest } from "./systemApps/OperatorApp/manifest";
import { manifest as systemApps_ResumeAppManifest } from "./systemApps/ResumeApp/manifest";
import { manifest as systemApps_SettingsAppManifest } from "./systemApps/SettingsApp/manifest";
import { manifest as systemApps_SystemLogAppManifest } from "./systemApps/SystemLogApp/manifest";
import { manifest as userApps_CipherAppManifest } from "./userApps/CipherApp/manifest";
import { manifest as userApps_CodebreakerAppManifest } from "./userApps/CodebreakerApp/manifest";
import { manifest as userApps_ColophonAppManifest } from "./userApps/ColophonApp/manifest";
import { manifest as userApps_Game2048AppManifest } from "./userApps/Game2048App/manifest";
import { manifest as userApps_LabsAppManifest } from "./userApps/LabsApp/manifest";
import { manifest as userApps_LifeAppManifest } from "./userApps/LifeApp/manifest";
import { manifest as userApps_LightsOutAppManifest } from "./userApps/LightsOutApp/manifest";
import { manifest as userApps_NotesAppManifest } from "./userApps/NotesApp/manifest";
import { manifest as userApps_PsychohistoryAppManifest } from "./userApps/PsychohistoryApp/manifest";
import { manifest as userApps_SnakeAppManifest } from "./userApps/SnakeApp/manifest";
import { manifest as userApps_TerminalAppManifest } from "./userApps/TerminalApp/manifest";

export const GENERATED_APPS: GeneratedApp[] = [
  { kind: "system", manifest: systemApps_ActivityAppManifest, load: () => import("./systemApps/ActivityApp") },
  { kind: "system", manifest: systemApps_AppStoreAppManifest, load: () => import("./systemApps/AppStoreApp") },
  { kind: "system", manifest: systemApps_CaseFilesAppManifest, load: () => import("./systemApps/CaseFilesApp") },
  { kind: "system", manifest: systemApps_OperatorAppManifest, load: () => import("./systemApps/OperatorApp") },
  { kind: "system", manifest: systemApps_ResumeAppManifest, load: () => import("./systemApps/ResumeApp") },
  { kind: "system", manifest: systemApps_SettingsAppManifest, load: () => import("./systemApps/SettingsApp") },
  { kind: "system", manifest: systemApps_SystemLogAppManifest, load: () => import("./systemApps/SystemLogApp") },
  { kind: "user", manifest: userApps_CipherAppManifest, load: () => import("./userApps/CipherApp") },
  { kind: "user", manifest: userApps_CodebreakerAppManifest, load: () => import("./userApps/CodebreakerApp") },
  { kind: "user", manifest: userApps_ColophonAppManifest, load: () => import("./userApps/ColophonApp") },
  { kind: "user", manifest: userApps_Game2048AppManifest, load: () => import("./userApps/Game2048App") },
  { kind: "user", manifest: userApps_LabsAppManifest, load: () => import("./userApps/LabsApp") },
  { kind: "user", manifest: userApps_LifeAppManifest, load: () => import("./userApps/LifeApp") },
  { kind: "user", manifest: userApps_LightsOutAppManifest, load: () => import("./userApps/LightsOutApp") },
  { kind: "user", manifest: userApps_NotesAppManifest, load: () => import("./userApps/NotesApp") },
  { kind: "user", manifest: userApps_PsychohistoryAppManifest, load: () => import("./userApps/PsychohistoryApp") },
  { kind: "user", manifest: userApps_SnakeAppManifest, load: () => import("./userApps/SnakeApp") },
  { kind: "user", manifest: userApps_TerminalAppManifest, load: () => import("./userApps/TerminalApp") },
];
