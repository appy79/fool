import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";
import { Header, HeaderBrand, HeaderNav } from "@/components/ui/header";
import ThemeToggle from "@/components/ui/theme-toggle";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Amandeep Yadav | Software Developer",
  description: "Portfolio of Amandeep Yadav, a software developer focused on backend services, platform tooling, and distributed systems.",
  icons: {
    icon: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Amandeep Yadav | Software Developer",
    description: "Backend services, platform tooling, and distributed systems portfolio.",
    url: siteUrl,
    siteName: "Amandeep Yadav Portfolio",
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
    title: "Amandeep Yadav | Software Developer",
    description: "Backend services, platform tooling, and distributed systems portfolio.",
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
              <Link href="/" className="text-sm font-semibold uppercase tracking-[0.24em] text-primary transition hover:text-foreground">
                Amandeep Yadav
              </Link>
            </HeaderBrand>
            <HeaderNav>
              <nav className="hidden items-center gap-4 md:flex">
                <Link href="/" className="text-sm text-muted-foreground transition hover:text-foreground">Resume</Link>
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
