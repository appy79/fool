import Link from "next/link";
import { HomeGlyph, LabsGlyph } from "@/components/portfolio/icons/NavIcon";
import { Header, HeaderBrand, HeaderNav } from "@/components/ui/header";
import ResumeDownloadMenu from "@/components/ui/resume-download-menu";
import ThemeToggle from "@/components/ui/theme-toggle";
import { resume } from "@/lib/resume";

/**
 * Chrome for the document-style routes (labs). The home route renders TerminusOS full-viewport
 * with its own menu bar/dock, so the global header lives here instead of the root layout.
 */
export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:border focus:border-primary/70 focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:uppercase focus:tracking-[0.16em] focus:text-primary"
      >
        Skip to main content
      </a>
      <Header
        compactActions={
          <>
            <Link
              href="/"
              aria-label="Home"
              title="Home"
              className="inline-flex size-9 items-center justify-center border border-transparent text-foreground transition hover:border-primary/50 hover:bg-accent/30 hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <HomeGlyph />
            </Link>
            <ResumeDownloadMenu variant="icon" />
            <Link
              href="/labs"
              aria-label="Labs"
              title="Labs"
              className="inline-flex size-9 items-center justify-center border border-transparent text-foreground transition hover:border-primary/50 hover:bg-accent/30 hover:text-primary focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <LabsGlyph />
            </Link>
            <ThemeToggle />
          </>
        }
      >
        <HeaderBrand>
          <Link
            href="/"
            className="block truncate text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {resume.name}
          </Link>
        </HeaderBrand>
        <HeaderNav>
          <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
            <ResumeDownloadMenu />
            <Link
              href="/labs"
              className="border border-transparent px-2 py-1 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-accent/25 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              Labs
            </Link>
          </nav>
          <ThemeToggle />
        </HeaderNav>
      </Header>
      {children}
    </>
  );
}
