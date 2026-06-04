import SocialIcon, { hasSocialIcon } from "../icons/SocialIcon";

type Social = { label: string; href: string };

/**
 * A row of polished social-profile chips: a glyph badge plus the network name, with a
 * hover lift toward the primary accent. Shared by the Operator app and the lock screen.
 */
export default function SocialLinks({
  socials,
  className = "",
}: {
  socials?: readonly Social[];
  className?: string;
}) {
  if (!socials || socials.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`${social.label}, opens in a new tab`}
          className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-foreground transition hover:-translate-y-px hover:border-primary/55 hover:bg-card/80 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full border border-border/60 bg-background/60 text-primary transition group-hover:border-primary/55 group-hover:bg-primary/10">
            {hasSocialIcon(social.label) ? (
              <SocialIcon label={social.label} />
            ) : (
              <span className="text-[0.7rem] font-semibold uppercase">
                {social.label.slice(0, 1)}
              </span>
            )}
          </span>
          <span className="transition group-hover:text-primary">{social.label}</span>
        </a>
      ))}
    </div>
  );
}
