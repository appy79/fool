import { Button } from "@/components/ui/button";
import { resume, type ResolvedContactInfo } from "@/lib/resume";
import { siLeetcode } from "simple-icons";
import HeroPortraitCard from "./HeroPortraitCard";

type HeroSectionProps = {
  contact: ResolvedContactInfo;
};

function FormattedLocation({ location }: { location: string }) {
  const indiaIndex = location.indexOf("India");

  if (indiaIndex === -1) {
    return location;
  }

  return (
    <>
      {location.slice(0, indiaIndex)}
      <span className="text-orange-500">In</span>
      <span className="text-foreground">d</span>
      <span className="text-green-600">ia</span>
      {location.slice(indiaIndex + "India".length)}
    </>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.98c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.98H3.68V20h3.26V8.98ZM5.31 4C4.25 4 3.6 4.7 3.6 5.62c0 .9.63 1.62 1.67 1.62h.02c1.09 0 1.72-.72 1.72-1.62C6.99 4.7 6.38 4 5.31 4ZM20.4 13.68c0-3.37-1.8-4.94-4.21-4.94-1.94 0-2.81 1.07-3.29 1.82V8.98H9.64c.04 1.03 0 11.02 0 11.02h3.26v-6.15c0-.33.02-.66.12-.89.26-.66.85-1.34 1.84-1.34 1.3 0 1.82 1.01 1.82 2.49V20h3.26l.46-6.32Z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d={siLeetcode.path} />
    </svg>
  );
}

export default function HeroSection({ contact }: HeroSectionProps) {
  const hasSocials = Boolean(contact.socials?.length);
  const foundationTimeline = [
    { era: "0 F.E.",  detail: "predictive model bootstraps the roadmap" },
    { era: "1 F.E.", detail: "edge node caches civilization state" },
    { era: "50 F.E.", detail: "protocol negotiation beats brute force" },
    { era: "300 F.E.", detail: "control plane patches drift silently" },
  ];
  const getSocialIcon = (label: string) => {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.includes("github")) {
      return <GitHubIcon />;
    }

    if (normalizedLabel.includes("linkedin")) {
      return <LinkedInIcon />;
    }

    if (normalizedLabel.includes("leetcode")) {
      return <LeetCodeIcon />;
    }

    return null;
  };

  return (
    <section className="scroll-mt-24 text-foreground" id="home">
      <div className="space-y-5 border-y border-primary/25 py-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.36fr)] lg:items-start">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.86rem] uppercase tracking-[0.24em] text-primary">
              <span title="For Foundation readers: the plan is still running.">&gt; portfolio.boot</span>
              <span className="text-muted-foreground">archive.entry</span>
            </div>
            <div className="max-w-4xl space-y-4">
              <h1 className="max-w-5xl break-words text-4xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
                Full-stack systems for telecom-scale platforms.
              </h1>
            </div>
            <div className="grid gap-3 pt-1 md:grid-cols-3">
              {resume.proofPoints.map((point) => (
                <div key={point.label} className="border border-primary/20 bg-primary/5 px-4 py-3">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">{point.label}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{point.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="min-w-0 border-t border-border/70 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <HeroPortraitCard />
          </aside>
        </div>

        <div className="grid gap-5 border-t border-border/70 pt-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.36fr)] lg:items-start">
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">terminus.channel</p>
            <div className="mt-3 grid gap-px overflow-hidden border border-border/70 bg-border/70 text-sm leading-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
              <div className="flex min-w-0 items-center bg-card/55 px-4 py-3 dark:bg-background/35">
                {contact.locationHref ? (
                  <a
                    href={contact.locationHref}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-base font-semibold uppercase tracking-[0.12em] text-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <FormattedLocation location={contact.location} />
                  </a>
                ) : (
                  <p className="text-base font-semibold uppercase tracking-[0.12em] text-foreground" aria-label={contact.location}>
                    <FormattedLocation location={contact.location} />
                  </p>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-center bg-card/55 px-4 py-3 dark:bg-background/35">
                {contact.email ? (
                  <span className="block break-words font-mono text-sm text-foreground">
                    {contact.email}
                  </span>
                ) : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="mt-1 block font-mono text-sm text-muted-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                    {contact.phone}
                  </a>
                ) : null}
              </div>

              {hasSocials ? (
                <div className="flex flex-wrap items-center gap-2 bg-card/55 p-3 sm:justify-end dark:bg-background/35">
                  {contact.socials?.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${social.label}, opens in a new tab`}
                      className="inline-flex size-10 items-center justify-center border border-border/70 text-primary transition hover:border-primary/60 hover:bg-primary/10 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {getSocialIcon(social.label) ?? (
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em]">{social.label}</span>
                      )}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="mt-4 border border-primary/25 bg-card/70 px-3 py-3 dark:bg-background/50">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-primary">Decode Key: Asimov&apos;s Foundation</p>
              <ol
                className="mt-3 grid gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground sm:grid-cols-4"
                aria-label="Decode Key: Asimov's Foundation"
              >
                {foundationTimeline.map((milestone) => (
                  <li key={milestone.era} className="relative border-l border-primary/30 pb-1 pl-4 sm:border-l-0 sm:border-t sm:pl-0 sm:pt-4">
                    <span className="absolute -left-[0.3125rem] top-0 size-2.5 bg-primary shadow-[0_0_0_4px_hsl(var(--card))] dark:shadow-[0_0_0_4px_hsl(var(--background))] sm:-top-[0.3125rem] sm:left-0" />
                    <span className="block text-primary">{milestone.era}</span>
                    <span className="mt-1 block leading-5 normal-case tracking-normal">{milestone.detail}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="min-w-0 border-t border-border/70 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
            <div className="space-y-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">prime.radiant.signal</p>
              <div className="relative min-h-32 overflow-hidden py-2">
                <svg viewBox="0 0 320 132" className="h-32 w-full" role="img" aria-label="Animated systems lab preview">
                  <path
                    d="M38 72 C92 18 145 24 177 62 S244 113 286 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-primary/40"
                  />
                  <path
                    d="M38 72 C112 112 158 108 196 72 S252 32 286 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="4 7"
                    className="text-primary/30"
                  />
                  <circle r="4" fill="currentColor" className="text-primary motion-reduce:hidden">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M38 72 C92 18 145 24 177 62 S244 113 286 50" />
                  </circle>
                  <circle r="3" fill="currentColor" className="text-primary/80 motion-reduce:hidden">
                    <animateMotion dur="5.5s" repeatCount="indefinite" path="M38 72 C112 112 158 108 196 72 S252 32 286 50" />
                  </circle>
                  <circle cx="177" cy="62" r="4" fill="currentColor" className="hidden text-primary motion-reduce:block" />
                  <circle cx="196" cy="72" r="3" fill="currentColor" className="hidden text-primary/80 motion-reduce:block" />
                  {[
                    { x: 38, y: 72, label: "5GC" },
                    { x: 177, y: 62, label: "RAFT" },
                    { x: 286, y: 50, label: "DB" },
                  ].map((node) => (
                    <g key={node.label}>
                      <circle cx={node.x} cy={node.y} r="18" fill="currentColor" className="text-primary/10" />
                      <circle cx={node.x} cy={node.y} r="7" fill="currentColor" className="text-primary" />
                      <text
                        x={node.x}
                        y={node.y + 33}
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-[0.62rem] font-semibold tracking-[0.18em] text-primary"
                      >
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
                <p className="absolute bottom-1 right-0 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                  crisis simulations online
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild className="font-mono uppercase tracking-[0.16em]">
                  <a href="/labs">Open Labs</a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
