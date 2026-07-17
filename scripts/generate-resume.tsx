/**
 * Generates the résumé PDF in `public/` straight from `lib/resume.ts`, so the downloadable file
 * never drifts from the site. A single ATS-optimized document is produced:
 *
 *   - Amandeep_Yadav_Resume.pdf — single-column, selectable text, standard section headings
 *     (Summary / Work Experience / Skills / Education) and document metadata, so applicant
 *     tracking systems parse it cleanly.
 *
 * Visually it speaks the site's "Foundation" language: Space Grotesk display type, Inter body,
 * IBM Plex Mono instrument labels, a deep-navy ink, Prime-Radiant cyan + imperial-gold accents,
 * and the signature cyan→gold section underline. @react-pdf/renderer writes a ToUnicode CMap
 * (with ligature decomposition), so text stays fully extractable — color and typography only
 * affect human readers, never the parser.
 *
 * The only deliberately non-extractable element is the foot-of-page colophon ("Dynamically built
 * from Terminus OS · amandeepyadav.com"): it is drawn as vector glyph OUTLINES, so a human sees it
 * but no text run exists for an ATS/keyword parser to read (the domain is still a clickable link via
 * a URI annotation). See colophon() / outlineSvg().
 *
 * Font sourcing note: @react-pdf's bundled fontkit subsetter cannot embed @fontsource's `woff2`
 * builds (it throws while subsetting), so Inter/Space Grotesk are loaded from their `woff` builds.
 * IBM Plex Mono's fontsource build additionally crashes the subsetter because its (empty) space
 * glyph sits at the tail of the glyf table — computing its bounding box reads past the buffer — so
 * the full upstream IBM Plex Mono TTFs are vendored in `assets/fonts/` instead.
 *
 * Run with `npm run gen:resume` (also runs automatically before `next build`). Contact details
 * (email/phone/socials) resolve from env exactly like the site; local `.env.local` / `.env` files
 * are loaded automatically. Uses React.createElement (no JSX) so it runs under `tsx` without any
 * transform config, and @react-pdf/renderer so no headless browser is required.
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import React from "react";
import {
  Circle,
  Defs,
  Document,
  Font,
  G,
  LinearGradient,
  Link,
  Page,
  Path,
  Rect,
  renderToFile,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { getResolvedContact } from "../lib/contact";
import { resume } from "../lib/resume";

const e = React.createElement;
const requireFrom = createRequire(import.meta.url);
// fontkit (bundled by @react-pdf) is loaded via require so it stays untyped `any` — no extra
// @types dependency — and gives us glyph outlines for the human-only footer (see footerOutline).
const fontkit = requireFrom("fontkit");

// ---------------------------------------------------------------------------
// Fonts — the exact three families the site loads, so the PDF matches the on-screen identity.
// Inter/Space Grotesk come from @fontsource's `woff` builds (resolved via the package root, not
// cwd); IBM Plex Mono comes from the vendored upstream TTFs. See the font sourcing note above.
// ---------------------------------------------------------------------------
const DISPLAY = "Space Grotesk";
const SANS = "Inter";
const MONO = "IBM Plex Mono";

function fontsourceFile(pkg: string, file: string): string {
  const root = path.dirname(requireFrom.resolve(`${pkg}/package.json`));
  return path.join(root, "files", file);
}
function vendoredFont(file: string): string {
  return path.resolve(process.cwd(), "assets/fonts", file);
}

Font.register({
  family: DISPLAY,
  fonts: [
    { src: fontsourceFile("@fontsource/space-grotesk", "space-grotesk-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
Font.register({
  family: SANS,
  fonts: [
    { src: fontsourceFile("@fontsource/inter", "inter-latin-400-normal.woff"), fontWeight: 400 },
    { src: fontsourceFile("@fontsource/inter", "inter-latin-600-normal.woff"), fontWeight: 600 },
  ],
});
Font.register({
  family: MONO,
  fonts: [
    { src: vendoredFont("IBMPlexMono-Medium.ttf"), fontWeight: 500 },
    { src: vendoredFont("IBMPlexMono-SemiBold.ttf"), fontWeight: 600 },
  ],
});

// Never hyphenate: react-pdf's default breaks long tokens mid-word (e.g. "leetcode.com/ex-plorer79"),
// which reads badly and splits URL/keyword tokens for ATS parsers. Wrap whole words instead.
Font.registerHyphenationCallback((word) => [word]);

const OUTPUT_FILENAME = "Amandeep_Yadav_Resume.pdf";

// Letter geometry. Section rules are drawn at a fixed width (deterministic, no % ambiguity in SVG).
const PAGE_PAD_H = 40;
const CONTENT_W = 612 - PAGE_PAD_H * 2;

// ---------------------------------------------------------------------------
// Environment — load contact details exactly like the site (real env > .env.local > .env).
// ---------------------------------------------------------------------------
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

loadEnvFile(".env.local");
loadEnvFile(".env");
const contact = getResolvedContact();

// ---------------------------------------------------------------------------
// Palette — the "Foundation" system tokens (globals.css) converted from OKLCH to hex: cool
// star-chart paper, deep-navy ink, Prime-Radiant cyan, imperial gold.
// ---------------------------------------------------------------------------
const C = {
  ink: "#0F1828", // headings, name, emphasis
  body: "#33405A", // body copy
  muted: "#5B6675", // periods, notes, secondary lines
  cyan: "#00779E", // primary accent — eyebrows, labels, dots
  cyanDeep: "#00658D", // links
  gold: "#AC7D1B", // secondary accent — gradient tail
  rule: "#CBD6E0", // hairlines / dividers
  ruleSoft: "#E6ECF2", // faint hairlines
  panel: "#F1F6FA", // instrument-panel fill
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 22,
    paddingBottom: 20,
    paddingHorizontal: PAGE_PAD_H,
    fontFamily: SANS,
    fontSize: 8.2,
    color: C.body,
    lineHeight: 1.32,
  },

  // Masthead -----------------------------------------------------------------
  eyebrow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  eyebrowGlyph: { marginRight: 5 },
  eyebrowText: {
    fontFamily: MONO,
    fontWeight: 600,
    fontSize: 7.8,
    color: C.cyan,
    textTransform: "uppercase",
  },
  name: {
    fontFamily: DISPLAY,
    fontWeight: 600,
    fontSize: 21,
    color: C.ink,
    letterSpacing: -0.5,
    lineHeight: 1.05,
  },
  focus: { marginTop: 1, fontSize: 8.6, color: C.muted },

  // Contact — two grouped rows; atomic "sep + item" groups so wraps only fall between whole
  // items and a URL never splits mid-token.
  contactBlock: { marginTop: 3.5 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  contactRowSpaced: { marginTop: 3 },
  contactGroup: { flexDirection: "row", alignItems: "center" },
  contactItem: { fontFamily: MONO, fontWeight: 500, fontSize: 7.4, color: C.muted },
  contactLink: { fontFamily: MONO, fontWeight: 500, fontSize: 7.4, color: C.cyanDeep, textDecoration: "none" },
  contactSep: { fontFamily: MONO, fontWeight: 500, fontSize: 7.4, color: C.rule, marginHorizontal: 5 },

  // Section header -----------------------------------------------------------
  section: { marginTop: 7 },
  sectionLabel: {
    fontFamily: MONO,
    fontWeight: 600,
    fontSize: 7.8,
    color: C.cyan,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  ruleSvg: { marginBottom: 5 },

  // Summary ------------------------------------------------------------------
  summary: { fontSize: 8.3, color: C.body, lineHeight: 1.36 },

  // Key achievements — a single-line instrument-panel readout. Kept single-column (one text run,
  // no side-by-side cells) so ATS parsers read it in order instead of scrambling the columns.
  statPanel: {
    borderWidth: 0.7,
    borderColor: C.rule,
    borderTopWidth: 1.6,
    borderTopColor: C.cyan,
    backgroundColor: C.panel,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statLine: { fontSize: 8.3, lineHeight: 1.4, color: C.body },
  statValue: {
    fontFamily: DISPLAY,
    fontWeight: 600,
    fontSize: 9.5,
    color: C.ink,
    letterSpacing: -0.3,
  },
  statSep: { color: C.rule },

  // Experience ---------------------------------------------------------------
  // Every entry is a single-column block (role line, then a company·location·dates meta line,
  // then bullets) — no right-aligned date column, which is what makes Workday/Taleo reassign
  // dates and companies to the wrong job.
  expItem: { marginBottom: 3.8 },
  role: { fontFamily: SANS, fontWeight: 600, fontSize: 9.2, color: C.ink },
  period: {
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: 6.4,
    color: C.muted,
    textTransform: "uppercase",
  },
  company: {
    marginTop: 1.5,
    marginBottom: 3,
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: 6.4,
    color: C.cyan,
    textTransform: "uppercase",
  },
  bulletRow: { flexDirection: "row", marginBottom: 2 },
  bulletDot: {
    width: 2.4,
    height: 2.4,
    borderRadius: 1.2,
    backgroundColor: C.cyan,
    marginTop: 2.9,
    marginRight: 6,
  },
  bulletText: { flex: 1, fontSize: 8.1, lineHeight: 1.34, color: C.body },
  bold: { fontFamily: SANS, fontWeight: 600, color: C.ink },

  // Skills -------------------------------------------------------------------
  // One wrapping line per category ("Category: item, item, ...") — a single text run, so the
  // parser keeps each category's label attached to its own items instead of splitting the
  // labels and values into two mis-aligned columns.
  skillLine: { marginBottom: 3, fontSize: 8.1, lineHeight: 1.38, color: C.body },
  skillCat: { fontFamily: SANS, fontWeight: 600, color: C.cyan },

  // Education ----------------------------------------------------------------
  eduMain: { marginBottom: 3.2, fontSize: 8.1, lineHeight: 1.38, color: C.body },

  // Colophon — pinned to the foot of the page, drawn as vector outlines (see outlineSvg).
  footer: { position: "absolute", left: PAGE_PAD_H, right: PAGE_PAD_H, bottom: 15 },
  footerInner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  footerGlyph: { marginRight: 4, opacity: 0.9 },
  footerLink: { textDecoration: "none" },
});

type Style = (typeof styles)[keyof typeof styles];

// ---------------------------------------------------------------------------
// Brand marks & section chrome
// ---------------------------------------------------------------------------

// The Prime-Radiant polyhedron glyph, mirrored from FoundationMotifs.tsx — the site's brand mark.
function primeGlyph(size: number): React.ReactNode {
  return e(
    Svg,
    { width: size, height: size, viewBox: "0 0 24 24" },
    e(Path, {
      d: "M12 2.5 19.5 6.75v10.5L12 21.5 4.5 17.25V6.75Z",
      stroke: C.cyan,
      strokeWidth: 1.6,
      fill: "none",
    }),
    e(Path, {
      d: "M12 2.5V21.5M4.5 6.75 19.5 17.25M19.5 6.75 4.5 17.25",
      stroke: C.cyan,
      strokeWidth: 1.1,
      fill: "none",
      opacity: 0.5,
    }),
    e(Circle, { cx: 12, cy: 12, r: 2.4, stroke: C.cyan, strokeWidth: 1.6, fill: "none" }),
  );
}

// The signature cyan→gold→transparent underline (globals.css `.section-header-motion::after`),
// over a faint full-width baseline so sections still read as separated. `id` must be unique per
// call so each gradient resolves to its own <Defs>.
function gradientRule(id: string, style?: Style): React.ReactNode {
  return e(
    Svg,
    { width: CONTENT_W, height: 3, style },
    e(
      Defs,
      null,
      e(
        LinearGradient,
        { id, x1: "0", y1: "0", x2: "1", y2: "0" },
        e(Stop, { offset: "0", stopColor: C.cyan }),
        e(Stop, { offset: "0.5", stopColor: C.gold }),
        e(Stop, { offset: "1", stopColor: C.gold, stopOpacity: 0 }),
      ),
    ),
    e(Rect, { x: 0, y: 1.9, width: CONTENT_W, height: 0.5, fill: C.ruleSoft }),
    e(Rect, { x: 0, y: 0.6, width: CONTENT_W * 0.58, height: 1.5, fill: `url(#${id})` }),
  );
}

// Turn a heading into a stable, unique gradient id (e.g. "Key Achievements" -> "grad-key-achievements").
function gradientId(label: string): string {
  return `grad-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

// A titled section: the uppercase mono label, its cyan→gold rule, then the caller's content.
function section(label: string, ...children: React.ReactNode[]): React.ReactNode {
  return e(
    View,
    { style: styles.section },
    e(Text, { style: styles.sectionLabel }, label),
    gradientRule(gradientId(label), styles.ruleSvg),
    ...children,
  );
}

// ---------------------------------------------------------------------------
// Colophon footer — a human-only "watermark"
// ---------------------------------------------------------------------------
// Rendered as glyph OUTLINES (filled vector paths), never as text. A person reads it, but there is
// no text run in the content stream, so ATS / keyword parsers extract nothing from it — it can't
// pollute parsed keywords or section detection.
const FOOTER_FONT = fontkit.create(fs.readFileSync(vendoredFont("IBMPlexMono-Medium.ttf")));

// Minimal shapes for the fontkit values we touch (fontkit itself is loaded untyped via require).
type GlyphRun = {
  glyphs: Array<{ path: { toSVG(): string } }>;
  positions: Array<{ xAdvance: number }>;
};

const FOOTER_SIZE = 6.2; // cap size in pt
const FOOTER_LETTER_FU = 30; // letter-spacing in font units (~0.03em)

// Lay out a run of colored segments as vector glyph OUTLINES inside a tightly-sized <Svg>.
function outlineSvg(segments: { text: string; fill: string }[]): React.ReactNode {
  const scale = FOOTER_SIZE / FOOTER_FONT.unitsPerEm;
  const glyphs: React.ReactNode[] = [];
  let penFU = 0;
  let key = 0;
  for (const seg of segments) {
    const run = FOOTER_FONT.layout(seg.text) as GlyphRun;
    run.glyphs.forEach((glyph, i) => {
      const d = glyph.path.toSVG();
      if (d) {
        glyphs.push(
          e(G, { key: `g${key++}`, transform: `translate(${penFU}, 0)` }, e(Path, { d, fill: seg.fill })),
        );
      }
      penFU += run.positions[i].xAdvance + FOOTER_LETTER_FU;
    });
  }

  const width = Math.ceil((penFU - FOOTER_LETTER_FU) * scale) + 1;
  const height = Math.ceil(FOOTER_SIZE * 1.4);
  // Outer group flips the y-axis (font paths are y-up) and scales font units → points; each glyph
  // is then translated along the baseline in raw font units.
  return e(
    Svg,
    { width, height },
    e(G, { transform: `translate(0, ${FOOTER_SIZE}) scale(${scale}, ${-scale})` }, ...glyphs),
  );
}

function colophon(): React.ReactNode {
  const portfolio = (contact.socials ?? []).find((social) => social.label === "Portfolio");
  const siteHref = portfolio?.href ?? "https://amandeepyadav.com";
  return e(
    View,
    { style: styles.footer },
    e(
      View,
      { style: styles.footerInner },
      e(View, { style: styles.footerGlyph }, primeGlyph(8)),
      outlineSvg([
        { text: "Dynamically built from ", fill: C.muted },
        { text: "Terminus OS", fill: C.cyan },
        { text: "  ·  ", fill: C.rule },
      ]),
      // The domain stays vector outlines (still non-extractable), but wrapping it in a Link adds a
      // clickable URI annotation over its box — a real hyperlink with no parseable text leaked.
      e(
        Link,
        { src: siteHref, style: styles.footerLink },
        outlineSvg([{ text: readableUrl(siteHref), fill: C.cyanDeep }]),
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Contact helpers
// ---------------------------------------------------------------------------

// Strip scheme/host noise so a link's *visible* text is the bare URL (e.g. "linkedin.com/in/handle").
function readableUrl(href: string): string {
  return href
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");
}

// Group a bare "+91XXXXXXXXXX" into readable "+91 XXXXX XXXXX"; anything else is left as-is.
function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  const india = digits.match(/^\+?91(\d{10})$/);
  if (india) return `+91 ${india[1].slice(0, 5)} ${india[1].slice(5)}`;
  return raw.trim();
}

// One wrapping row of contact items, each preceded (except the first) by an atomic "· item" group
// so line wraps only ever fall between whole items — a URL never splits mid-token.
function contactLine(items: React.ReactNode[], spaced: boolean): React.ReactNode {
  return e(
    View,
    { style: spaced ? [styles.contactRow, styles.contactRowSpaced] : styles.contactRow },
    ...items.map((item, index) =>
      e(
        View,
        { key: `c-${index}`, style: styles.contactGroup },
        index > 0 ? e(Text, { key: "sep", style: styles.contactSep }, "·") : null,
        item,
      ),
    ),
  );
}

// ---------------------------------------------------------------------------
// Document sections
// ---------------------------------------------------------------------------

function header(): React.ReactNode {
  const personal: React.ReactNode[] = [];
  if (contact.location) personal.push(e(Text, { style: styles.contactItem }, contact.location));
  if (contact.phone)
    personal.push(e(Text, { style: styles.contactItem }, formatPhone(contact.phone)));
  if (contact.email)
    personal.push(e(Link, { src: `mailto:${contact.email}`, style: styles.contactLink }, contact.email));

  const links = (contact.socials ?? []).map((social) =>
    e(Link, { src: social.href, style: styles.contactLink }, readableUrl(social.href)),
  );

  return e(
    View,
    null,
    e(
      View,
      { key: "eyebrow", style: styles.eyebrow },
      e(View, { style: styles.eyebrowGlyph }, primeGlyph(9)),
      e(Text, { style: styles.eyebrowText }, resume.title),
    ),
    e(Text, { key: "name", style: styles.name }, resume.name),
    e(Text, { key: "focus", style: styles.focus }, resume.focus),
    e(View, { key: "rule", style: { marginTop: 8 } }, gradientRule("grad-head")),
    e(
      View,
      { key: "contact", style: styles.contactBlock },
      personal.length ? contactLine(personal, false) : null,
      links.length ? contactLine(links, personal.length > 0) : null,
    ),
  );
}

function summarySection(): React.ReactNode {
  return section("Summary", e(Text, { style: styles.summary }, resume.summary));
}

function achievementsSection(): React.ReactNode {
  const parts: React.ReactNode[] = [];
  resume.telemetry.forEach((reading, index) => {
    if (index > 0) parts.push(e(Text, { key: `sep-${index}`, style: styles.statSep }, "    ·    "));
    parts.push(e(Text, { key: `val-${index}`, style: styles.statValue }, `${reading.value} `));
    parts.push(reading.label);
  });
  return section(
    "Systems at Scale",
    e(View, { style: styles.statPanel }, e(Text, { style: styles.statLine }, ...parts)),
  );
}

function experienceSection(): React.ReactNode {
  return section(
    "Work Experience",
    ...resume.experience.map((item, index) =>
      e(
        View,
        { key: `exp-${index}`, style: styles.expItem },
        e(Text, { style: styles.role }, item.role),
        e(
          Text,
          { style: styles.company },
          `${item.company}  ·  ${item.location}  ·  `,
          e(Text, { style: styles.period }, item.period),
        ),
        ...item.projects.map((project, projectIndex) =>
          e(
            View,
            { key: `proj-${projectIndex}`, style: styles.bulletRow },
            e(View, { style: styles.bulletDot }),
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

function skillsSection(): React.ReactNode {
  return section(
    "Skills",
    ...resume.skills.map((category, index) =>
      e(
        Text,
        { key: `skill-${index}`, style: styles.skillLine },
        e(Text, { style: styles.skillCat }, `${category.title}: `),
        category.items.join(", "),
      ),
    ),
  );
}

function educationSection(): React.ReactNode {
  return section(
    "Education",
    ...resume.education.map((entry, index) =>
      e(
        Text,
        { key: `edu-${index}`, style: styles.eduMain },
        e(Text, { style: styles.bold }, entry.degree),
        `  —  ${entry.school}  ·  ${entry.location}  ·  `,
        e(Text, { style: styles.period }, entry.period),
      ),
    ),
  );
}

function resumeDoc() {
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
      header(),
      summarySection(),
      achievementsSection(),
      experienceSection(),
      skillsSection(),
      educationSection(),
      colophon(),
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
