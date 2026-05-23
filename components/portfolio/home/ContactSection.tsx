import type { ResolvedContactInfo } from "@/lib/resume";

type ContactSectionProps = {
  contact: ResolvedContactInfo;
};

export default function ContactSection({ contact }: ContactSectionProps) {
  const hasSocials = Boolean(contact.socials?.length);

  return (
    <section id="contact" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">&gt; section:contact</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Let&apos;s talk about reliable software delivery.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          I&apos;m open to backend, full-stack, platform tooling, and distributed systems work where clear execution matters.
        </p>
      </header>

      <div className="border border-border/70 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">contact.channel</p>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <p className="text-sm leading-6 text-muted-foreground">{contact.location}</p>
          <div className="min-w-0 space-y-3">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="block break-words font-mono text-sm text-primary hover:underline">
                {contact.email}
              </a>
            )}
            {contact.phone && (
              <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="block font-mono text-sm text-primary hover:underline">
                {contact.phone}
              </a>
            )}
            {hasSocials && (
              <div className="flex flex-wrap gap-2">
                {contact.socials?.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-border/70 bg-card/60 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary dark:bg-background/40"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
