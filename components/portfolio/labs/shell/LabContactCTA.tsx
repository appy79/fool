import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ResolvedContactInfo } from "@/lib/resume";

type LabContactCTAProps = {
  contact: ResolvedContactInfo;
};

export default function LabContactCTA({ contact }: LabContactCTAProps) {
  const contactLinks = [
    ...(contact.email ? [{ label: "Email", href: `mailto:${contact.email}` }] : []),
    ...(contact.phone ? [{ label: "Phone", href: `tel:${contact.phone}` }] : []),
    ...(contact.socials ?? []),
  ];

  return (
    <section id="contact" className="scroll-mt-24 rounded-3xl border border-border/70 bg-card/60 p-6 dark:bg-background/50">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <Badge>Contact</Badge>
          <h2 className="mt-3 text-3xl font-semibold text-foreground">Build the next exhibit or the next system.</h2>
          <p className="mt-2 text-muted-foreground">Based in {contact.location}. Available for backend, platform, and full-stack engineering conversations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {contactLinks.length > 0 ? (
            contactLinks.map((link) => (
              <Button key={`${link.label}-${link.href}`} variant="outline" asChild>
                <a href={link.href}>{link.label}</a>
              </Button>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">Contact links are read from environment variables.</span>
          )}
        </div>
      </div>
    </section>
  );
}
