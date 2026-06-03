import { resume, type ResolvedContactInfo } from "@/lib/resume";
import type { AppDefinition } from "../../../osStore";
import { HELP_LINES, PROMPT } from "./data";
import type { LineTone } from "./types";

/** Everything a command needs from the host terminal, decoupled from React. */
export type TerminalContext = {
  apps: AppDefinition[];
  launchableApps: AppDefinition[];
  contact: ResolvedContactInfo;
  resolvedTheme?: string;
  push: (text: string, tone?: LineTone) => void;
  pushMany: (texts: string[], tone?: LineTone) => void;
  clearLines: () => void;
  openApp: (id: string) => void;
  installApp: (id: string) => void;
  uninstallApp: (id: string) => void;
  isInstalled: (id: string) => boolean;
  setTheme: (theme: string) => void;
  lock: () => void;
};

function findApp(apps: AppDefinition[], arg: string): AppDefinition | undefined {
  const q = arg.trim().toLowerCase();
  return apps.find(
    (app) =>
      !app.hidden &&
      (app.id.toLowerCase() === q ||
        app.title.toLowerCase() === q ||
        app.shortLabel?.toLowerCase() === q),
  );
}

/** Parse and execute a single command line against the supplied context. */
export function runCommand(raw: string, ctx: TerminalContext) {
  const {
    apps,
    launchableApps,
    contact,
    resolvedTheme,
    push,
    pushMany,
    clearLines,
    openApp,
    installApp,
    uninstallApp,
    isInstalled,
    setTheme,
    lock,
  } = ctx;

  const trimmed = raw.trim();
  push(`${PROMPT}:~$ ${trimmed}`, "in");
  if (!trimmed) return;

  const [cmd, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(" ");

  switch (cmd.toLowerCase()) {
    case "help":
      pushMany(HELP_LINES);
      break;
    case "ls":
    case "apps":
      pushMany(
        apps
          .filter((app) => !app.hidden)
          .map((app) => {
            const installed = app.kind !== "user" || isInstalled(app.id);
            const tag =
              app.kind === "user" ? (installed ? "user" : "user · not installed") : "system";
            return `  ${app.id.padEnd(12)} ${app.title.padEnd(14)} [${tag}]`;
          }),
      );
      break;
    case "open": {
      if (!arg) {
        push("open: usage: open <app>", "warn");
        break;
      }
      const app = findApp(apps, arg);
      if (!app) {
        push(`open: no such module: ${arg}`, "warn");
        break;
      }
      if (app.kind === "user" && !isInstalled(app.id)) {
        push(`open: '${app.title}' is not installed — try: install ${app.id}`, "warn");
        break;
      }
      if (app.href) {
        window.open(app.href, app.external ? "_blank" : "_self", "noopener,noreferrer");
      } else {
        openApp(app.id);
      }
      push(`launching ${app.title}…`, "muted");
      break;
    }
    case "install": {
      const app = findApp(apps, arg);
      if (!app || app.kind !== "user") {
        push(`install: unknown user module: ${arg}`, "warn");
        break;
      }
      if (isInstalled(app.id)) push(`${app.title} is already installed`, "muted");
      else {
        installApp(app.id);
        push(`installed ${app.title} · added to dock`, "out");
      }
      break;
    }
    case "uninstall": {
      const app = findApp(apps, arg);
      if (!app || app.kind !== "user") {
        push(`uninstall: unknown user module: ${arg}`, "warn");
        break;
      }
      if (!isInstalled(app.id)) push(`${app.title} is not installed`, "muted");
      else {
        uninstallApp(app.id);
        push(`removed ${app.title}`, "out");
      }
      break;
    }
    case "whoami":
      push(`${resume.name} — ${resume.title}`);
      break;
    case "about":
      push(`${resume.focus}.`);
      break;
    case "skills":
      pushMany(resume.skills.map((group) => `  ${group.title}: ${group.items.join(", ")}`));
      break;
    case "projects":
      pushMany(resume.projects.map((project) => `  ${project.title} — ${project.impact}`));
      break;
    case "experience":
      pushMany(
        resume.experience.map((item) => `  ${item.role} @ ${item.company} (${item.period})`),
      );
      break;
    case "contact":
      pushMany(
        [
          contact.email ? `  email   ${contact.email}` : null,
          contact.phone ? `  phone   ${contact.phone}` : null,
          `  based   ${contact.location}`,
          ...(contact.socials ?? []).map(
            (social) => `  ${social.label.toLowerCase().padEnd(7)} ${social.href}`,
          ),
        ].filter((value): value is string => Boolean(value)),
      );
      break;
    case "resume":
      openApp("resume");
      push("opening résumé module…", "muted");
      break;
    case "neofetch":
      pushMany([
        `   ◇   ${resume.name}`,
        `  ◇◇◇  os        TerminusOS`,
        `   ◇   stack     ${resume.proofPoints[2]?.value ?? "Java + React"}`,
        `         modules   ${launchableApps.length} mounted`,
        `         renderer  canvas + react`,
        `         theme     ${resolvedTheme ?? "system"}`,
      ]);
      break;
    case "theme": {
      const next = arg || (resolvedTheme === "dark" ? "light" : "dark");
      if (next !== "dark" && next !== "light") {
        push("theme: usage: theme [dark|light]", "warn");
        break;
      }
      setTheme(next);
      push(`theme set to ${next}`, "muted");
      break;
    }
    case "date":
      push(new Date().toString());
      break;
    case "echo":
      push(arg);
      break;
    case "sudo":
      push("nice try — this operator runs least-privilege ;)", "warn");
      break;
    case "lock":
    case "exit":
      push("locking…", "muted");
      lock();
      break;
    case "clear":
      clearLines();
      break;
    default:
      push(`command not found: ${cmd} — type \`help\``, "warn");
  }
}
