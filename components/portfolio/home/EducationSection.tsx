import { resume } from "@/lib/resume";

const foundationTiers: Record<string, string> = {
  "Master of Computer Applications": "second.foundation",
  "Bachelor of Computer Applications": "terminus.archive",
  Schooling: "outer.province",
};

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.36fr)] lg:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.86rem] uppercase tracking-[0.24em] text-primary">
            &gt; section:education
          </p>
          <h2 className="sr-only">
            Academic record through the Foundation archive.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
          Formal training, indexed by tier.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resume.education.map((item) => (
          <div key={item.degree} className="border border-border/70 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
            <div className="flex items-center justify-between gap-4">
              <p className="min-w-0 text-base font-semibold leading-6 text-foreground">{item.degree}</p>
              <span className="shrink-0 self-center font-mono text-[0.65rem] uppercase leading-6 tracking-[0.18em] text-primary">
                {foundationTiers[item.degree] ?? "foundation.record"}
              </span>
            </div>
            <div className="mt-4 space-y-2 border-t border-border/70 pt-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <div className="flex items-start justify-between gap-4">
                <p className="min-w-0">{item.school}</p>
                <p className="shrink-0 text-right text-primary">{item.period}</p>
              </div>
              <p>{item.location}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
