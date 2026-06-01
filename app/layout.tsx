import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";
import { Header, HeaderBrand, HeaderNav } from "@/components/ui/header";
import ResumeDownloadMenu from "@/components/ui/resume-download-menu";
import ThemeToggle from "@/components/ui/theme-toggle";
import { resume } from "@/lib/resume";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteTitle = `${resume.name} | ${resume.title}`;
const siteDescription = `Portfolio of ${resume.name}: ${resume.focus}.`;
const ogImage = {
  url: "/og.svg",
  width: 1200,
  height: 630,
  alt: `${resume.name} software developer portfolio preview`,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: `${resume.name} Portfolio`,
  authors: [{ name: resume.name, url: siteUrl }],
  creator: resume.name,
  publisher: resume.name,
  keywords: [
    resume.name,
    "software developer",
    "backend engineer",
    "full-stack developer",
    "distributed systems",
    "telecom systems",
    "platform tooling",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: `${resume.name} Portfolio`,
    images: [ogImage],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:border focus:border-primary/70 focus:bg-background focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:uppercase focus:tracking-[0.16em] focus:text-primary"
          >
            Skip to main content
          </a>
          <Header>
            <HeaderBrand>
              <Link href="/" className="block truncate text-sm font-semibold uppercase tracking-[0.22em] text-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                {resume.name}
              </Link>
            </HeaderBrand>
            <HeaderNav>
              <nav className="hidden items-center gap-4 md:flex" aria-label="Main navigation">
                <ResumeDownloadMenu />
                <Link href="/labs" className="border border-transparent px-2 py-1 text-sm text-muted-foreground transition hover:border-primary/40 hover:bg-accent/25 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">Labs</Link>
              </nav>
              <ThemeToggle />
            </HeaderNav>
          </Header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
