"use client";

import SocialIcon from "../../icons/SocialIcon";
import { useOS } from "../osStore";

export default function CommsApp() {
  const { contact } = useOS();

  const primary = [
    contact.email
      ? { label: "Email", value: contact.email, href: `mailto:${contact.email}` }
      : null,
    contact.phone
      ? { label: "Phone", value: contact.phone, href: `tel:${contact.phone.replace(/\s+/g, "")}` }
      : null,
  ].filter((item): item is { label: string; value: string; href: string } => Boolean(item));

  return (
    <div className="space-y-6 p-5 sm:p-7">
      <header>
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          <span className="status-dot" aria-hidden="true" />
          comms // open channel
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          Reach the operator
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Based in {contact.location}. Channels below are live.
        </p>
      </header>

      {primary.length > 0 ? (
        <ul className="grid gap-3">
          {primary.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="flex items-center justify-between gap-3 border border-border/70 bg-card/50 p-4 transition hover:border-primary/55 hover:bg-card/70 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
              >
                <span>
                  <span className="block font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
                    {item.label}
                  </span>
                  <span className="mt-1 block break-all font-medium text-foreground">
                    {item.value}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0 font-mono text-primary">
                  &gt;
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Direct channels are configured via environment; use the social links below.
        </p>
      )}

      {contact.socials && contact.socials.length > 0 ? (
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-5">
          {contact.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${social.label}, opens in a new tab`}
              className="inline-flex items-center gap-2 border border-border/70 px-3 py-2 text-sm text-foreground transition hover:border-primary/55 hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              <SocialIcon label={social.label} />
              {social.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
