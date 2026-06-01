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
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.98c.85 0 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.98H3.68V20h3.26V8.98ZM5.31 4C4.25 4 3.6 4.7 3.6 5.62c0 .9.63 1.62 1.67 1.62h.02c1.09 0 1.72-.72 1.72-1.62C6.99 4.7 6.38 4 5.31 4ZM20.4 13.68c0-3.37-1.8-4.94-4.21-4.94-1.94 0-2.81 1.07-3.29 1.82V8.98H9.64c.04 1.03 0 11.02 0 11.02h3.26v-6.15c0-.33.02-.66.12-.89.26-.66.85-1.34 1.84-1.34 1.3 0 1.82 1.01 1.82 2.49V20h3.26l.46-6.32Z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
      <path d={siLeetcode.path} />
    </svg>
  );
}

export default function HeroSection({ contact }: HeroSectionProps) {
  const hasSocials = Boolean(contact.socials?.length);
  const contactLinks = [
    contact.email ? { label: "Email", href: `mailto:${contact.email}`, value: contact.email } : null,
    contact.phone ? { label: "Phone", href: `tel:${contact.phone.replace(/\s+/g, "")}`, value: contact.phone } : null,
  ].filter((item): item is { label: string; href: string; value: string } => Boolean(item));

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
      <div className="border-b border-border/70 pb-16 pt-6 sm:pb-20 lg:pt-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_30rem] lg:items-start">
          <div className="min-w-0">
            <p className="text-lg font-medium text-foreground">Hello. I build software that explains itself.</p>
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-primary">
              {resume.title} / {resume.focus}
            </p>
            <h1 className="mt-6 max-w-5xl break-words text-5xl font-semibold leading-[0.96] tracking-[-0.065em] text-foreground [overflow-wrap:anywhere] sm:text-7xl lg:text-8xl">
              {resume.name}
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-foreground sm:text-2xl">
              Full-stack systems for telecom-scale platforms.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em]">
              <a href="#work" className="border-b border-foreground px-1 py-2 text-foreground transition hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                View work
              </a>
              <a href="/labs" className="border-b border-primary/60 px-1 py-2 text-primary transition hover:border-foreground hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
                Open labs
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 text-sm leading-6 text-muted-foreground">
              {contact.locationHref ? (
                <a
                  href={contact.locationHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <FormattedLocation location={contact.location} />
                </a>
              ) : (
                <span className="font-semibold text-foreground" aria-label={contact.location}>
                  <FormattedLocation location={contact.location} />
                </span>
              )}
              {contactLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="break-words font-mono underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {item.value}
                </a>
              ))}
            </div>

            {hasSocials ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {contact.socials?.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${social.label}, opens in a new tab`}
                    className="inline-flex items-center gap-2 border-b border-border/70 px-1 py-1 text-sm text-muted-foreground transition hover:border-primary/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {getSocialIcon(social.label)}
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="min-w-0 lg:pt-6">
            <HeroPortraitCard />
          </aside>
        </div>

        <div className="mt-14 border-t border-border/70 pt-7">
          <div className="grid gap-6 md:grid-cols-3" aria-label="Portfolio highlights">
            {resume.proofPoints.map((point) => (
              <div key={point.label} className="min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">{point.label}</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">{point.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
