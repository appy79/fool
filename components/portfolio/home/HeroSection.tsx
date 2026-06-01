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
      <div className="border-b border-border/70 pb-14 pt-4 sm:pb-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.32fr)] lg:items-start">
          <div className="flex min-w-0 flex-col gap-9">
            <div className="max-w-4xl space-y-5">
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
                backend / distributed systems / platform tooling
              </p>
              <h1 className="max-w-5xl break-words text-4xl font-semibold tracking-[-0.045em] text-foreground [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
                Full-stack systems for telecom-scale platforms.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                Backend, platform tooling, and readable interfaces for systems that need to stay reliable at scale.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="font-mono uppercase tracking-[0.16em]">
                <a href="#work">View Work</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-mono uppercase tracking-[0.16em]">
                <a href="/labs">Open Labs</a>
              </Button>
            </div>

            <div className="grid gap-5 border-t border-border/70 pt-7 md:grid-cols-3" aria-label="Portfolio highlights">
              {resume.proofPoints.map((point) => (
                <div key={point.label} className="border-l border-border/70 pl-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary">{point.label}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">{point.value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="min-w-0 space-y-6">
            <HeroPortraitCard />
            <div className="space-y-4 border-t border-border/70 pt-5">
              <div className="min-w-0 text-sm leading-6 text-muted-foreground">
                {contact.locationHref ? (
                  <a
                    href={contact.locationHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-foreground transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    <FormattedLocation location={contact.location} />
                  </a>
                ) : (
                  <span className="font-semibold text-foreground" aria-label={contact.location}>
                    <FormattedLocation location={contact.location} />
                  </span>
                )}
                {contact.email ? <span className="mt-2 block break-words font-mono">{contact.email}</span> : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="block font-mono transition hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                    {contact.phone}
                  </a>
                ) : null}
              </div>
              {hasSocials ? (
                <div className="flex items-center gap-2 border-t border-border/70 pt-4">
                  {contact.socials?.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${social.label}, opens in a new tab`}
                      className="inline-flex size-8 items-center justify-center border border-border/70 text-primary transition hover:border-primary/60 hover:bg-accent/35 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      {getSocialIcon(social.label) ?? (
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em]">{social.label}</span>
                      )}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
