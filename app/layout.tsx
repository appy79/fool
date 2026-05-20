import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header, HeaderBrand, HeaderNav } from "@/components/ui/header";
import ThemeToggle from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Fool | Portfolio",
  description: "A modern portfolio landing page showcasing projects, skills, and contact details."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header>
            <HeaderBrand>
              <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">Fool</span>
              <span className="hidden text-sm text-muted-foreground sm:inline">portfolio experience</span>
            </HeaderBrand>
            <HeaderNav>
              <nav className="hidden items-center gap-4 md:flex">
                <a href="#skills" className="text-sm text-muted-foreground transition hover:text-foreground">Skills</a>
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
