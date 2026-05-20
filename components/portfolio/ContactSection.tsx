"use client";

import { Badge } from "@/components/ui/badge";
import type { ResolvedContactInfo } from "@/lib/resume";

type ContactSectionProps = {
  contact: ResolvedContactInfo;
};

export default function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section id="contact" className="scroll-mt-24 space-y-6">
      <div className="space-y-6">
        <Badge>Contact</Badge>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">Let&apos;s build your next digital experience.</h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">Whether you need a portfolio, product launch, or design system, I&apos;m available for new frontend work and collaboration.</p>
        </div>

        <div className="space-y-4 rounded-[2rem] border border-border/60 bg-background/70 p-6 shadow-sm shadow-slate-950/5 backdrop-blur">
          <p className="text-sm font-semibold text-foreground">Get in touch</p>
          <p className="text-sm text-muted-foreground">{contact.location}</p>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="block text-sm font-medium text-primary hover:underline">
              {contact.email}
            </a>
          )}
          {!contact.email && contact.emailFromEnv && (
            <p className="block text-sm text-muted-foreground">Email Empty</p>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="block text-sm font-medium text-primary hover:underline">
              {contact.phone}
            </a>
          )}
          {!contact.phone && contact.phoneFromEnv && (
            <p className="block text-sm text-muted-foreground">Phone number empty</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {contact.socials?.length ? (
              contact.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                >
                  {social.label}
                </a>
              ))
            ) : contact.socialsFromEnv ? (
              <p className="text-sm text-muted-foreground">Social links empty</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
