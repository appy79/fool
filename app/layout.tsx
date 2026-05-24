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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: `${resume.name} Portfolio`,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "Amandeep Yadav software developer portfolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header>
            <HeaderBrand>
              <Link href="/" className="block truncate text-sm font-semibold uppercase tracking-[0.24em] text-primary transition hover:text-foreground">
                {resume.name}
              </Link>
            </HeaderBrand>
            <HeaderNav>
              <nav className="hidden items-center gap-4 md:flex">
                <ResumeDownloadMenu />
                <Link href="/labs" className="text-sm text-muted-foreground transition hover:text-foreground">Labs</Link>
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
