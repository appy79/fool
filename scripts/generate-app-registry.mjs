#!/usr/bin/env node
/**
 * Generates `components/portfolio/os/apps/registry.generated.ts` by scanning the
 * app folders. Every directory under `apps/systemApps` and `apps/userApps` that
 * contains an `index.tsx` (the app entry point) is registered automatically.
 *
 * Why codegen instead of `require.context` / runtime globbing?
 *   - Turbopack (the Next.js bundler) does not support `require.context`.
 *   - The browser cannot read the filesystem, and the registry is consumed
 *     synchronously at import time.
 *   - Emitting literal `import()` calls keeps each app body in its own lazily
 *     loaded chunk, exactly like a hand-written registry would.
 *
 * Forker workflow: drop a folder in `apps/userApps/` with an `index.tsx` (and an
 * optional `manifest.ts`). This runs automatically on `npm run dev` / `npm run
 * build`; run it manually with `npm run gen:apps`.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const appsDir = path.join(root, "components/portfolio/os/apps");
const outFile = path.join(appsDir, "registry.generated.ts");

/** [folder under apps/, inferred app kind] */
const KIND_DIRS = [
  ["systemApps", "system"],
  ["userApps", "user"],
];
const INDEX_FILES = ["index.tsx", "index.ts"];
const MANIFEST_FILES = ["manifest.ts", "manifest.tsx"];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function hasAny(dir, names) {
  for (const name of names) {
    if (await exists(path.join(dir, name))) return true;
  }
  return false;
}

/** "Game2048App" -> "Game 2048", "MyCoolApp" -> "My Cool" */
function toWords(folder) {
  return folder
    .replace(/App$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim();
}

function deriveId(folder) {
  const words = toWords(folder).toLowerCase().replace(/\s+/g, "-");
  return words || folder.toLowerCase();
}

function deriveTitle(folder) {
  return toWords(folder) || folder;
}

function importVar(kindDir, folder) {
  return `${kindDir}_${folder}`.replace(/[^A-Za-z0-9_$]/g, "_") + "Manifest";
}

async function collect() {
  const apps = [];
  for (const [kindDir, kind] of KIND_DIRS) {
    const dir = path.join(appsDir, kindDir);
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
    for (const folder of folders) {
      const folderPath = path.join(dir, folder);
      if (!(await hasAny(folderPath, INDEX_FILES))) continue; // not an app
      apps.push({
        kindDir,
        kind,
        folder,
        hasManifest: await hasAny(folderPath, MANIFEST_FILES),
      });
    }
  }
  return apps;
}

function render(apps) {
  const usesDefaultIcon = apps.some((app) => !app.hasManifest);

  const imports = ['import type { GeneratedApp } from "./appManifest";'];
  if (usesDefaultIcon) imports.push('import DefaultAppIcon from "./defaultIcon";');
  for (const app of apps) {
    if (app.hasManifest) {
      imports.push(
        `import { manifest as ${importVar(app.kindDir, app.folder)} } from "./${app.kindDir}/${app.folder}/manifest";`,
      );
    }
  }

  const entries = apps.map((app) => {
    const load = `() => import("./${app.kindDir}/${app.folder}")`;
    if (app.hasManifest) {
      return `  { kind: "${app.kind}", manifest: ${importVar(app.kindDir, app.folder)}, load: ${load} },`;
    }
    const fallback = `{ id: ${JSON.stringify(deriveId(app.folder))}, title: ${JSON.stringify(
      deriveTitle(app.folder),
    )}, Icon: DefaultAppIcon }`;
    return `  { kind: "${app.kind}", manifest: ${fallback}, load: ${load} },`;
  });

  return `// AUTO-GENERATED FILE — do not edit by hand.
// Regenerate with: npm run gen:apps  (runs automatically on dev/build)
//
// Every folder under apps/systemApps and apps/userApps that contains an
// index.tsx is registered here. Add a manifest.ts beside index.tsx to customise
// id / title / icon / size; otherwise sensible defaults are derived.

${imports.join("\n")}

export const GENERATED_APPS: GeneratedApp[] = [
${entries.join("\n")}
];
`;
}

const apps = await collect();
await fs.writeFile(outFile, render(apps), "utf8");
console.log(
  `gen:apps — registered ${apps.length} apps (${apps.filter((a) => a.kind === "system").length} system, ${
    apps.filter((a) => a.kind === "user").length
  } user).`,
);
