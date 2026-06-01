import Link from "next/link";
import type { ResolvedContactInfo } from "@/lib/resume";
import { resumeFiles } from "@/lib/resume-files";

type PortfolioFooterProps = {
  activeSurface?: "home" | "labs";
  contact?: ResolvedContactInfo;
};

const footerSignals = [
  "The plan survives contact with production.",
  "Filed under: Encyclopedia Galactica, Engineering Appendix.",
  "Minor deviations absorbed by the model.",
  "Crisis contained. Next simulation queued.",
];

export default function PortfolioFooter({ activeSurface = "home", contact }: PortfolioFooterProps) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86_400_000);
  const footerSignal = footerSignals[dayOfYear % footerSignals.length];
  const linkHref = activeSurface === "labs" ? "/" : "/labs";
  const linkLabel = activeSurface === "labs" ? "Portfolio archive" : "Engineering labs";

  return (
    <footer className="border-t border-border/70 py-10">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(16rem,0.42fr)] md:items-start">
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-primary">&gt; contact.close</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-foreground">Let&apos;s build the reliable part.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{footerSignal}</p>
        </div>

        <div className="grid gap-5 text-sm leading-6 text-muted-foreground">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href={linkHref} className="font-semibold text-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              {linkLabel}
            </Link>
            {resumeFiles.map((file) => (
              <a
                key={file.href}
                href={file.href}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {file.label}
              </a>
            ))}
          </div>

          {contact ? (
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <span>{contact.location}</span>
              {contact.email ? <a href={`mailto:${contact.email}`} className="underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">{contact.email}</a> : null}
              {contact.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">{contact.phone}</a> : null}
              {contact.socials?.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {social.label}
                </a>
              ))}
            </div>
          ) : null}

          <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em]">
            © {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
