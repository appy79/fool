"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ResolvedContactInfo } from "@/lib/resume";

type ContactSectionProps = {
  contact: ResolvedContactInfo;
};

export default function ContactSection({ contact }: ContactSectionProps) {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormState((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-start">
      <div className="space-y-6">
        <Badge>Contact</Badge>
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">Let&apos;s build your next digital experience.</h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">Whether you need a portfolio, product launch, or design system, I&apos;m available for new frontend work and collaboration.</p>
        </div>

        <div className="space-y-4 rounded-3xl border border-border/60 bg-background/70 p-6 shadow-sm shadow-slate-950/5 backdrop-blur">
          <p className="text-sm font-semibold text-foreground">Get in touch</p>
          <p className="text-sm text-muted-foreground">{contact.location}</p>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="block text-sm font-medium text-primary hover:underline">
              {contact.email}
            </a>
          )}
          {contact.phone && (
            <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="block text-sm font-medium text-primary hover:underline">
              {contact.phone}
            </a>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            {contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm text-foreground transition hover:bg-muted"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-border/60 bg-white/90 p-8 shadow-2xl shadow-slate-950/10 dark:bg-slate-950/85 dark:text-white sm:p-10">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">Name</label>
          <input
            value={formState.name}
            onChange={(event) => handleChange("name", event.target.value)}
            required
            className="w-full rounded-3xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Your name"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            value={formState.email}
            onChange={(event) => handleChange("email", event.target.value)}
            required
            className="w-full rounded-3xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">Message</label>
          <textarea
            value={formState.message}
            onChange={(event) => handleChange("message", event.target.value)}
            required
            rows={5}
            className="w-full rounded-3xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Tell me about your project"
          />
        </div>

        <Button type="submit">Send message</Button>

        {submitted && (
          <p className="rounded-3xl border border-green-300/50 bg-green-100/80 px-4 py-3 text-sm text-green-900 dark:border-green-500/30 dark:bg-green-900/20 dark:text-green-200">
            Thanks for reaching out! I&apos;ll follow up shortly.
          </p>
        )}
      </form>
    </section>
  );
}
