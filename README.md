# fool

The portfolio of Amandeep Yadav, reimagined as **TerminusOS** — a no-scroll, spatial "operating system" you navigate instead of scroll. Built with the Next.js App Router, TypeScript, Tailwind CSS, and shadcn-style UI primitives, with an Asimov's _Foundation_ theme throughout.

Instead of the usual hero → work → skills → footer page, visitors land on a boot/lock screen, then "enter the system" into a windowed desktop (or a mobile home screen on small viewports). Each piece of the portfolio — profile, case files, skills, résumé — is an app you open, move, resize, and arrange.

## The Experience

- **Boot / lock screen** shows the essentials (contact, focus, proof) while it warms the OS shell and installed-app chunks in the background. "Enter System" stays disabled until the systems check completes.
- **Desktop shell** (≥ 820px): a window manager with a magnifying dock, menu bar, right-click context menus, window snapping, and session restore.
- **Mobile shell** (< 820px): a home screen of app icons with full-screen app frames. App state is preserved when resizing across the breakpoint.
- **System apps** (always present): Operator (profile), Case Files (projects), Activity (skills), System Log, Résumé, Settings, App Store.
- **User apps** (installable from the App Store): Terminal, Notes, Colophon, Psychohistory, Labs (interactive engineering-systems exhibits), plus games — Psychohistory Sim (Game of Life), Trantor 2048, Hyperwave (Snake), Seldon's Grid (Lights Out), Codebreaker, and Cipher.
- **Personalization** persists in the browser: theme, wallpaper, accent color, UI density, dock position, installed apps, reduced motion, and horizontal-scroll behavior.

## Getting Started

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Fill in the contact and social fields in `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
CONTACT_EMAIL=you@example.com
CONTACT_PHONE="+91 00000 00000"
SOCIAL_GITHUB=https://github.com/your-handle
SOCIAL_LINKEDIN=https://www.linkedin.com/in/your-handle
SOCIAL_LEETCODE=https://leetcode.com/your-handle
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` to view the site.

## Project Structure

- `app/` — Next.js App Router entrypoints.
  - `layout.tsx` wires fonts, metadata/SEO, theme providers, and the cosmic background.
  - `page.tsx` resolves the contact block and renders `TerminusOS`.
  - `providers.tsx` sets up `next-themes`.
  - `not-found.tsx` and `error.tsx` render branded 404 and 500 screens via `PageShell`.
  - `robots.ts` and `sitemap.ts` generate SEO crawler metadata.
- `components/portfolio/os/` — the TerminusOS shell.
  - `TerminusOS.tsx` is the root: it boots settings, shows the lock screen, and lazily loads the desktop/mobile shells.
  - `LockScreen.tsx` is the boot/login screen that preloads shell and app chunks.
  - `osStore.tsx` is the window-manager state (open/close/focus/move/resize, snapping, session restore).
  - `osSettings.tsx` holds persisted user settings and applies them (theme, accent, density, dock, etc.).
  - `notifications.tsx` is the system toast layer; `AppRuntime.tsx` keeps app state alive across the desktop/mobile reflow.
  - `desktop/` (`DesktopOS`, `WindowManager`, `Window`, `Dock`, `MenuBar`, `ContextMenu`) and `mobile/` (`MobileOS`, `HomeScreen`, `AppFrame`, `StatusBar`) are the two shells.
  - `wallpaper/` holds the Foundation-themed wallpapers (with dark/light variants).
  - `apps/systemApps/` and `apps/userApps/` hold the apps, one folder each (see below).
  - `appRegistry.tsx`, `apps/appManifest.ts`, and the generated `apps/registry.generated.ts` assemble the app list automatically.
- `components/portfolio/icons/` — shared icon and motif components (Foundation motifs, tech/brand badges, social glyphs).
- `components/portfolio/shared/` — the `PageShell` frame (used by 404/500) and the cosmic background.
- `components/ui/` — shadcn-style UI primitives.
- `lib/resume.ts` — single source of truth for profile, summary, skills, education, experience, and featured work.
- `lib/resume-files.ts` — metadata for the single downloadable résumé PDF used by the Résumé app.
- `lib/contact.ts` — resolves the contact/social block from environment variables at request time.
- `scripts/generate-app-registry.mjs` — scans the app folders and writes `apps/registry.generated.ts`.
- `scripts/generate-resume.tsx` — renders the downloadable ATS PDF from `lib/resume.ts` (runs before `dev`/`build`).
- `public/` — static assets used by metadata and browsers.

## Editing Content

Most portfolio copy and structured content lives in `lib/resume.ts`. Update that file first when changing:

- Name, title, focus, professional summary, and highlights
- Skills and education
- Experience history and project descriptions
- Featured project cards
- Contact environment variable keys

App-specific copy lives in a `data.ts` file inside the relevant app folder under `components/portfolio/os/apps/`.

## Adding a New App

Each feature of the OS is a self-contained app under `components/portfolio/os/apps/`:

- `userApps/` — optional modules a visitor can install/uninstall from the App Store.
- `systemApps/` — built-in apps that are always present and cannot be removed.

The registry is generated automatically from the folder structure, so **you never edit a central list** to add an app. Just create a folder with an `index.tsx` entry point:

```
components/portfolio/os/apps/userApps/StopwatchApp/
  index.tsx     # required — default-exports the app component
  icon.tsx      # optional — default-exports the dock icon (falls back to a generic one)
  manifest.ts   # optional — id, title, size, etc. (defaults derived from the folder name)
```

**1. The component** (`index.tsx`) is the only required file. Default-export a React component. It optionally receives `AppComponentProps` (`payload`, `windowKey`):

```tsx
// index.tsx
export default function StopwatchApp() {
  return <div className="p-4">Hello from a new app.</div>;
}
```

**2. The icon** (`icon.tsx`) is co-located so the app stays self-contained. Default-export an SVG component that accepts `className`:

```tsx
// icon.tsx
export default function Icon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
      className={className ?? "size-4"}
    >
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13V9M10 2h4" />
    </svg>
  );
}
```

**3. The manifest** (`manifest.ts`) customises how the app appears. Without it, the `id` and `title` are derived from the folder name and a generic icon is used.

```ts
// manifest.ts
import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "stopwatch", // stable, persisted in user storage — don't change casually
  title: "Stopwatch",
  shortLabel: "Watch", // optional — used where space is tight
  description: "A tiny timer.", // shown in the App Store
  Icon,
  defaultSize: { w: 420, h: 360 }, // optional default window size
  order: 200, // optional — lower sorts earlier in the dock/store
};
```

That's it. The `kind` (system vs user) is inferred from which folder the app lives in. The registry is regenerated on `npm run dev` and `npm run build`; to regenerate it manually after adding a folder while the dev server is running, run:

```bash
npm run gen:apps
```

This writes `components/portfolio/os/apps/registry.generated.ts` — a generated file you should not edit by hand.

## Architecture Notes

- **Code splitting:** the OS shells and every app body are separate chunks loaded on demand. The initial bundle only carries lightweight metadata and icons; the lock screen warms what it needs while the visitor reads, and installing an app fetches its chunk.
- **Two shells, one state:** desktop and mobile are distinct UIs, but `AppRuntime` reparents live app DOM via portals so state survives crossing the breakpoint.
- **Persistence:** user settings and the open-window session are stored in `localStorage` and re-validated against the current build (stale or unknown app ids are dropped).
- **Accessibility:** the OS honors `prefers-reduced-motion`, and interactive surfaces support keyboard navigation.
- **Résumé, one source:** `lib/resume.ts` feeds both a fully styled in-OS résumé (the Résumé app renders summary, highlights, experience, skills, and education in-window) and a single ATS-friendly PDF generated at build time (`scripts/generate-resume.tsx` → `public/Amandeep_Yadav_Resume.pdf`), which the app offers as a download. Contact details come from env, so the app and the PDF always match.

## Available Scripts

- `npm run gen:apps` regenerates the app registry from the `apps/` folder structure (runs automatically before `dev` and `build`).
- `npm run gen:resume` regenerates the downloadable ATS résumé PDF from `lib/resume.ts` (also runs automatically before `dev` and `build`).
- `npm run dev` starts the local development server.
- `npm run build` creates a production build.
- `npm run start` starts the built app.
- `npm run lint` runs ESLint.
- `npm run typecheck` runs the TypeScript compiler with no emit.
- `npm run format` formats the codebase with Prettier (`npm run format:check` verifies formatting).

## Validation

Before publishing changes, run:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deployment

This project is ready for a standard Vercel deployment. Configure the same environment variables from `.env.example` in the hosting provider before publishing.
