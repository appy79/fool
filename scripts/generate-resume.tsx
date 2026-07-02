/**
 * Generates the résumé PDF in `public/` straight from `lib/resume.ts`, so the downloadable file
 * never drifts from the site. A single ATS-optimized document is produced:
 *
 *   - Amandeep_Yadav_Resume.pdf — single-column, standard fonts, selectable text, standard section
 *     headings (Summary / Experience / Skills / Education) and document metadata, so applicant
 *     tracking systems parse it cleanly. A restrained accent keeps it readable for humans too
 *     (color is ignored by parsers). The richly styled view lives in the in-OS Resume app.
 *
 * Run with `npm run gen:resume` (also runs automatically before `next build`). Contact details
 * (email/phone/socials) resolve from env exactly like the site; local `.env.local` / `.env` files
 * are loaded automatically. Uses React.createElement (no JSX) so it runs under `tsx` without any
 * transform config, and @react-pdf/renderer so no headless browser is required.
 */
import fs from "node:fs";
import path from "node:path";
import React from "react";
import { Document, Link, Page, renderToFile, StyleSheet, Text, View } from "@react-pdf/renderer";
import { getResolvedContact } from "../lib/contact";
import { resume } from "../lib/resume";

const e = React.createElement;

const OUTPUT_FILENAME = "Amandeep_Yadav_Resume.pdf";

// Load KEY=VALUE lines from a dotenv file into process.env without adding a dotenv dependency,
// so the generated PDF includes the same contact details the site renders. Never overwrites a
// value already in the environment, so real env vars win.
function loadEnvFile(relativePath: string): void {
  const file = path.resolve(process.cwd(), relativePath);
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) process.env[key] = value;
  }
}

// Precedence: real env > .env.local > .env (matches Next.js). getResolvedContact() then simply
// omits any field whose env var is absent, so missing vars are skipped automatically.
loadEnvFile(".env.local");
loadEnvFile(".env");
const contact = getResolvedContact();

type Theme = {
  accent: string;
  ink: string;
  text: string;
  muted: string;
  rule: string;
  nameSize: number;
};

// One restrained, consistent palette. `accent` (teal) is the ONLY color used for structure —
// section headings, links, and bullets — so the document reads as one system rather than a mix.
// `ink` is the near-black for headings/name, `text` the body, `muted` every secondary line.
// Structure (single column, standard headings, selectable text) is what keeps it ATS-friendly;
// color only affects human readers.
const THEME: Theme = {
  accent: "#0F766E",
  ink: "#111827",
  text: "#374151",
  muted: "#6B7280",
  rule: "#D1D5DB",
  nameSize: 17,
};

// Sizes are tuned so all sections fit on a single Letter page while filling the full width.
function makeStyles(t: Theme) {
  return StyleSheet.create({
    page: {
      paddingTop: 26,
      paddingBottom: 26,
      paddingHorizontal: 44,
      fontFamily: "Helvetica",
      fontSize: 8.5,
      color: t.text,
      lineHeight: 1.26,
    },
    // Own tight line box + generous gap to the title so the two never crowd each other.
    name: { fontSize: t.nameSize, fontFamily: "Helvetica-Bold", color: t.ink, lineHeight: 1.1 },
    title: { marginTop: 4, fontSize: 9, color: t.muted },
    contact: { marginTop: 4, fontSize: 8.2, color: t.muted },
    link: { color: t.accent, textDecoration: "none" },
    headerRule: { marginTop: 7, borderBottomWidth: 1, borderBottomColor: t.rule },
    section: { marginTop: 6 },
    sectionTitle: {
      fontSize: 8.6,
      fontFamily: "Helvetica-Bold",
      color: t.accent,
      textTransform: "uppercase",
      letterSpacing: 0.9,
    },
    sectionRule: {
      marginTop: 2.5,
      marginBottom: 4,
      borderBottomWidth: 0.8,
      borderBottomColor: t.rule,
    },
    summary: { fontSize: 8.5, color: t.text },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    itemTitle: { flex: 1, fontSize: 9.4, fontFamily: "Helvetica-Bold", color: t.ink },
    period: { flexShrink: 0, marginLeft: 10, fontSize: 8, color: t.muted },
    subLine: { marginTop: 1, marginBottom: 2, fontSize: 8, color: t.muted },
    bulletRow: { flexDirection: "row", marginBottom: 1.5 },
    bulletDot: { width: 9, fontSize: 8, color: t.accent },
    bulletText: { flex: 1, fontSize: 8 },
    bold: { fontFamily: "Helvetica-Bold", color: t.ink },
    highlights: { fontSize: 8 },
    skillRow: { marginBottom: 1.5, fontSize: 8 },
    expItem: { marginBottom: 4.5 },
    eduRow: { marginBottom: 2, fontSize: 8 },
  });
}

type Styles = ReturnType<typeof makeStyles>;

function sectionHeader(styles: Styles, title: string): React.ReactNode {
  return e(
    View,
    null,
    e(Text, { style: styles.sectionTitle }, title),
    e(View, { style: styles.sectionRule }),
  );
}

function contactPieces(styles: Styles): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  if (contact.location) parts.push(contact.location);
  if (contact.phone) parts.push(contact.phone);
  if (contact.email)
    parts.push(e(Link, { src: `mailto:${contact.email}`, style: styles.link }, contact.email));
  for (const social of contact.socials ?? [])
    parts.push(e(Link, { src: social.href, style: styles.link }, social.label));

  const out: React.ReactNode[] = [];
  parts.forEach((part, index) => {
    if (index > 0) out.push(e(Text, { key: `sep-${index}` }, "  ·  "));
    out.push(e(React.Fragment, { key: `part-${index}` }, part));
  });
  return out;
}

function header(styles: Styles): React.ReactNode {
  return e(
    View,
    null,
    e(Text, { key: "name", style: styles.name }, resume.name),
    e(Text, { key: "title", style: styles.title }, `${resume.title} — ${resume.focus}`),
    e(Text, { key: "contact", style: styles.contact }, contactPieces(styles)),
    e(View, { key: "rule", style: styles.headerRule }),
  );
}

function summarySection(styles: Styles): React.ReactNode {
  return e(
    View,
    { style: styles.section },
    sectionHeader(styles, "Summary"),
    e(Text, { style: styles.summary }, resume.summary),
  );
}

function highlightsSection(styles: Styles): React.ReactNode {
  const line = resume.telemetry
    .map((reading) => `${reading.value} ${reading.label}`)
    .join("   ·   ");
  return e(
    View,
    { style: styles.section },
    sectionHeader(styles, "Highlights"),
    e(Text, { style: styles.highlights }, line),
  );
}

function experienceSection(styles: Styles): React.ReactNode {
  return e(
    View,
    { style: styles.section },
    sectionHeader(styles, "Experience"),
    ...resume.experience.map((item, index) =>
      e(
        View,
        { key: `exp-${index}`, style: styles.expItem },
        e(
          View,
          { style: styles.rowBetween },
          e(Text, { style: styles.itemTitle }, item.role),
          e(Text, { style: styles.period }, item.period),
        ),
        e(Text, { style: styles.subLine }, `${item.company}   ·   ${item.location}`),
        ...item.projects.map((project, projectIndex) =>
          e(
            View,
            { key: `proj-${projectIndex}`, style: styles.bulletRow },
            e(Text, { style: styles.bulletDot }, "•"),
            e(
              Text,
              { style: styles.bulletText },
              e(Text, { style: styles.bold }, `${project.title}. `),
              project.description,
            ),
          ),
        ),
      ),
    ),
  );
}

function skillsSection(styles: Styles): React.ReactNode {
  return e(
    View,
    { style: styles.section },
    sectionHeader(styles, "Skills"),
    ...resume.skills.map((category, index) =>
      e(
        Text,
        { key: `skill-${index}`, style: styles.skillRow },
        e(Text, { style: styles.bold }, `${category.title}: `),
        category.items.join(", "),
      ),
    ),
  );
}

function educationSection(styles: Styles): React.ReactNode {
  return e(
    View,
    { style: styles.section },
    sectionHeader(styles, "Education"),
    ...resume.education.map((entry, index) =>
      e(
        Text,
        { key: `edu-${index}`, style: styles.eduRow },
        e(Text, { style: styles.bold }, entry.degree),
        `   —   ${entry.school}   ·   ${entry.location}   ·   ${entry.period}`,
      ),
    ),
  );
}

function resumeDoc() {
  const styles = makeStyles(THEME);
  return e(
    Document,
    {
      title: `${resume.name} — Résumé`,
      author: resume.name,
      subject: `${resume.title} — ${resume.focus}`,
      keywords: [resume.title, ...resume.skills.flatMap((category) => category.items)].join(", "),
      creator: "resume.ts generator",
      producer: "@react-pdf/renderer",
    },
    e(
      Page,
      { size: "LETTER", style: styles.page },
      header(styles),
      summarySection(styles),
      highlightsSection(styles),
      experienceSection(styles),
      skillsSection(styles),
      educationSection(styles),
    ),
  );
}

async function main(): Promise<void> {
  const outFile = path.resolve(process.cwd(), "public", OUTPUT_FILENAME);
  await renderToFile(resumeDoc(), outFile);
  console.log(`✓ ${OUTPUT_FILENAME}`);

  if (!contact.email) {
    console.warn(
      "! CONTACT_EMAIL not set — email omitted from the PDF. Set it in .env(.local) and re-run `npm run gen:resume`.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
