import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Header, HeaderBrand, HeaderNav } from "@/components/ui/header";
import ThemeToggle from "@/components/ui/theme-toggle";

export const metadata: Metadata = {
  title: "Fool",
  description: "A simple Next.js landing page"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Header>
            <HeaderBrand>
              <span className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">Fool</span>
              <span className="hidden text-sm text-muted-foreground sm:inline">glass UI landing</span>
            </HeaderBrand>
            <HeaderNav>
              <ThemeToggle />
            </HeaderNav>
          </Header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
