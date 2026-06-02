import { resume, type ResolvedContactInfo } from "@/lib/resume";
import SocialIcon from "../icons/SocialIcon";
import HeroPortraitCard from "./HeroPortraitCard";

type HeroSectionProps = {
  contact: ResolvedContactInfo;
};

function FormattedLocation({ location }: { location: string }) {
  const indiaMatch = /india/i.exec(location);
  const indiaIndex = indiaMatch?.index ?? -1;

  if (indiaIndex === -1) {
    return location;
  }

  return (
    <>
      {location.slice(0, indiaIndex)}
      <span className="sr-only">India</span>
      <span aria-hidden="true">
        <span className="text-orange-500">In</span>
        <span className="text-foreground">d</span>
        <span className="text-green-600">ia</span>
      </span>
      {location.slice(indiaIndex + indiaMatch![0].length)}
    </>
  );
}

export default function HeroSection({ contact }: HeroSectionProps) {
  const hasSocials = Boolean(contact.socials?.length);
  const contactLinks = [
    contact.email ? { label: "Email", href: `mailto:${contact.email}`, value: contact.email } : null,
    contact.phone ? { label: "Phone", href: `tel:${contact.phone.replace(/\s+/g, "")}`, value: contact.phone } : null,
  ].filter((item): item is { label: string; href: string; value: string } => Boolean(item));

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
                  aria-label={`${contact.location}, opens in a new tab`}
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
                    <SocialIcon label={social.label} />
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
          <ul className="grid gap-6 md:grid-cols-3" aria-label="Portfolio highlights">
            {resume.proofPoints.map((point) => (
              <li key={point.label} className="min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">{point.label}</p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.025em] text-foreground">{point.value}</p>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}
