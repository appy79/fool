import { resume, type ResolvedContactInfo } from "@/lib/resume";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Flattened, de-duplicated technology list — doubles as `knowsAbout` keywords. */
const knownTech = Array.from(new Set(resume.skills.flatMap((group) => group.items)));

/**
 * Builds a schema.org `Person` graph so search engines and rich-result/knowledge panels
 * can read the operator's identity, links, expertise, and history. This is the structured
 * counterpart to the human-readable dossier below.
 */
function personJsonLd(contact: ResolvedContactInfo) {
  const sameAs = (contact.socials ?? []).map((social) => social.href);
  const current = resume.experience[0];

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: resume.name,
    jobTitle: resume.title,
    description: `${resume.focus}.`,
    url: SITE_URL,
    knowsAbout: knownTech,
    address: { "@type": "PostalAddress", addressLocality: contact.location },
    alumniOf: resume.education.map((item) => ({
      "@type": "EducationalOrganization",
      name: item.school,
      sameAs: item.schoolHref,
    })),
  };

  if (sameAs.length) data.sameAs = sameAs;
  if (contact.email) data.email = `mailto:${contact.email}`;
  if (contact.phone) data.telephone = contact.phone;
  if (current) data.worksFor = { "@type": "Organization", name: current.company };

  return data;
}

/**
 * Server-rendered, crawlable summary of the portfolio. The OS shell itself is client-only
 * (`ssr: false`), so without this a crawler or link-unfurler would see almost nothing. The
 * content is visually hidden (`sr-only`) — it stays available to assistive tech and search
 * engines while the OS renders on top — and a `<noscript>` fallback keeps the essentials
 * readable when JavaScript is unavailable.
 */
export default function SeoDossier({ contact }: { contact: ResolvedContactInfo }) {
  const jsonLd = personJsonLd(contact);

  return (
    <>
      <section className="sr-only">
        <h1>
          {resume.name} — {resume.title}
        </h1>
        <p>{resume.focus}.</p>

        <h2>Highlights</h2>
        <ul>
          {resume.proofPoints.map((point) => (
            <li key={point.label}>
              {point.label}: {point.value}
            </li>
          ))}
          {resume.telemetry.map((reading) => (
            <li key={reading.label}>
              {reading.label}: {reading.value} ({reading.note})
            </li>
          ))}
        </ul>

        <h2>Skills</h2>
        {resume.skills.map((group) => (
          <p key={group.title}>
            <strong>{group.title}:</strong> {group.items.join(", ")}.
          </p>
        ))}

        <h2>Experience</h2>
        {resume.experience.map((item) => (
          <div key={`${item.company}-${item.period}`}>
            <h3>
              {item.role} — {item.company} ({item.period})
            </h3>
            <ul>
              {item.projects.map((project) => (
                <li key={project.title}>
                  <strong>{project.title}:</strong> {project.description}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h2>Selected projects</h2>
        <ul>
          {resume.projects.map((project) => (
            <li key={project.title}>
              <strong>{project.title}</strong> ({project.category}) — {project.impact}
            </li>
          ))}
        </ul>

        <h2>Education</h2>
        <ul>
          {resume.education.map((item) => (
            <li key={`${item.school}-${item.period}`}>
              {item.degree}, {item.school} ({item.period})
            </li>
          ))}
        </ul>

        <h2>Contact</h2>
        <ul>
          <li>Location: {contact.location}</li>
          {contact.email ? <li>Email: {contact.email}</li> : null}
          {(contact.socials ?? []).map((social) => (
            <li key={social.href}>
              <a href={social.href}>{social.label}</a>
            </li>
          ))}
        </ul>
      </section>

      <noscript>
        <div style={{ maxWidth: "42rem", margin: "0 auto", padding: "2rem 1.25rem" }}>
          <h1>
            {resume.name} — {resume.title}
          </h1>
          <p>{resume.focus}.</p>
          <p>
            This portfolio is an interactive app that needs JavaScript. Key links:
            {contact.email ? <> Email {contact.email}.</> : null}
          </p>
          <ul>
            {(contact.socials ?? []).map((social) => (
              <li key={social.href}>
                <a href={social.href}>{social.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </noscript>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
