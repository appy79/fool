export const copy = {
  eyebrow: "colophon // build notes",
  title: "How this was built",
  introLead: "A short note on the machinery behind TerminusOS — the portfolio of",
  footerLead: "designed + engineered by",
};

export const stack = [
  { label: "Framework", value: "Next.js App Router · React 19" },
  { label: "Styling", value: "Tailwind CSS v4 · oklch tokens" },
  { label: "Labs", value: "interactive CS exhibits, lazy-loaded" },
  { label: "Persistence", value: "localStorage (settings + modules)" },
  { label: "Motion", value: "CSS keyframes · reduced-motion aware" },
  { label: "Dependencies", value: "no UI kit, no 3D engine" },
];

export const notes = [
  "TerminusOS is a spatial operating system rather than a scrolling page — windows on desktop, full-screen modules on mobile, all driven by one app registry.",
  "The Labs app is a window onto interactive engineering exhibits — Turing machines, consensus, databases, concurrency — each one lazy-loaded only when you open it.",
  "Apps are modules. System modules hold the record; user modules install and uninstall from the App Store and persist in your browser.",
];
