import { resume } from "@/lib/resume";

const foundationTiers: Record<string, string> = {
  "Master of Computer Applications": "second.foundation",
  "Bachelor of Computer Applications": "terminus.archive",
  Schooling: "outer.province",
};

const foundationTierNotes: Record<string, string> = {
  "Master of Computer Applications": "Highest tier: systems reasoning, application architecture, and graduate-level computing.",
  "Bachelor of Computer Applications": "Middle tier: the Terminus archive where application fundamentals became working practice.",
  Schooling: "Starting tier: the outer province that built discipline, structure, and the first technical base.",
};

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">
            &gt; section:education
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Academic record through the Foundation archive.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          Formal training mapped as a quiet tier system, from the outer province of schooling to the Second Foundation of graduate work.
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
              <p>{item.school}</p>
              <p>{item.location}</p>
              <p>{item.period}</p>
            </div>
            <p className="mt-4 border-t border-primary/20 pt-4 text-sm leading-6 text-muted-foreground">
              {foundationTierNotes[item.degree] ?? "Archived academic record in the Foundation ledger."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
