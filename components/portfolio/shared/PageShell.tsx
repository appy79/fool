import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./portfolioTheme.module.css";

type PageShellProps = {
  children: ReactNode;
  /** Tailwind classes for the centered content column (max width + vertical gap). */
  innerClassName?: string;
};

/**
 * Shared page frame for the portfolio. Applies the scoped theme, page padding, and a centered
 * content column so the home page and the labs page stay visually in lockstep.
 */
export default function PageShell({ children, innerClassName }: PageShellProps) {
  return (
    <main
      id="main-content"
      className={`${styles.theme} min-h-screen px-4 py-8 text-foreground sm:px-8 sm:py-12 lg:px-10`}
    >
      <div className={cn("mx-auto flex flex-col", innerClassName)}>{children}</div>
    </main>
  );
}
