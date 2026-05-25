import Link from "next/link";
import { resume } from "@/lib/resume";

type PortfolioFooterProps = {
  activeSurface?: "home" | "labs";
};

const footerSignals = [
  "The plan survives contact with production.",
  "Filed under: Encyclopedia Galactica, Engineering Appendix.",
  "Minor deviations absorbed by the model.",
  "Crisis contained. Next simulation queued.",
];

export default function PortfolioFooter({ activeSurface = "home" }: PortfolioFooterProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  const footerSignal = footerSignals[dayOfYear % footerSignals.length];
  const linkHref = activeSurface === "labs" ? "/" : "/labs";
  const linkLabel = activeSurface === "labs" ? "Portfolio archive" : "Crisis simulations";

  return (
    <footer className="grid gap-3 border-t border-primary/25 pt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
      <p className="text-primary">&gt; seldon.signal.persisted</p>
      <p className="min-w-0">{footerSignal}</p>
      <div className="flex flex-wrap gap-3">
        <Link href={linkHref} className="transition hover:text-primary">
          {linkLabel}
        </Link>
        <span>© {currentYear} {resume.name}</span>
      </div>
    </footer>
  );
}
