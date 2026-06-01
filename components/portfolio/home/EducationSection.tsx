import { resume } from "@/lib/resume";

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 space-y-8">
      <header className="border-b border-border/70 pb-6">
        <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">background</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">Education</h2>
      </header>

      <div className="divide-y divide-border/70 border-y border-border/70">
        {resume.education.map((item) => (
          <article key={item.degree} className="grid gap-4 py-6 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)_auto] md:items-center">
            <h3 className="text-base font-semibold leading-6 text-foreground">{item.degree}</h3>
            <a
              href={item.schoolHref}
              target="_blank"
              rel="noreferrer"
              className="min-w-0 text-sm leading-6 text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              aria-label={`${item.school}, opens in a new tab`}
            >
              {item.school} / {item.location}
            </a>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-primary">{item.period}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
