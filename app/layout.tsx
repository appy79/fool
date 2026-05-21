import "./globals.css";
import type { Metadata } from "next";
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
              <span className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Amandeep Yadav</span>
              <span className="hidden text-sm text-muted-foreground sm:inline">Portfolio Experience</span>
            </HeaderBrand>
            <HeaderNav>
              <nav className="hidden items-center gap-4 md:flex">
                <a href="#skills" className="text-sm text-muted-foreground transition hover:text-foreground">Skills</a>
                <a href="#education" className="text-sm text-muted-foreground transition hover:text-foreground">Education</a>
                <a href="#work" className="text-sm text-muted-foreground transition hover:text-foreground">Work</a>
                <a href="#experience" className="text-sm text-muted-foreground transition hover:text-foreground">Experience</a>
                <a href="#contact" className="text-sm text-muted-foreground transition hover:text-foreground">Contact</a>
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
