# fool

A modern portfolio site for Amandeep Yadav, built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn-style UI primitives.

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
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` to view the site.

## Project Structure

- `app/` contains the Next.js App Router entrypoints, metadata, providers, and global styles.
- `app/not-found.tsx` and `app/error.tsx` render branded 404 and 500 screens.
- `app/robots.ts` and `app/sitemap.ts` generate SEO crawler metadata.
- `components/portfolio/home/` contains the home page sections: hero, projects/experience, skills, and education.
- `components/portfolio/home/projects/` holds the animated "Project reel" flow scene (data, scene, motifs, and its phase hook).
- `components/portfolio/labs/` contains the interactive engineering systems lab shell, registry, shared UI, and exhibits.
- `components/portfolio/icons/` contains shared icon components (tech badges, social links, nav glyphs).
- `components/portfolio/hooks/` contains shared client hooks such as `usePrefersReducedMotion`.
- `components/portfolio/shared/` contains the shared page frame (`PageShell`), footer, and theme module.
- `components/ui/` contains reusable shadcn-style UI primitives currently used by the app.
- `lib/resume.ts` is the single source of truth for resume content, featured work, education, and contact configuration.
- `lib/contact.ts` resolves the contact block from environment variables at request time.
- `public/` contains static assets used by metadata and browsers.

## Editing Content

Most portfolio copy and structured content lives in `lib/resume.ts`. Update that file first when changing:

- Name, title, intro, and highlights
- Skills and education
- Experience history and project descriptions
- Featured project cards
- Contact environment variable keys

Section-level marketing copy lives in the matching component under `components/portfolio/`.

## Available Scripts

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
