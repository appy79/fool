import { resume } from "@/lib/resume";

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">
            &gt; section:education
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Academic foundation in computing and application development.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          Formal training in software development and computer applications from top Indian institutions.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resume.education.map((item, index) => (
          <div key={item.degree} className="border border-border/70 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
            <div className="flex items-start justify-between gap-4">
              <p className="text-base font-semibold text-foreground">{item.degree}</p>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                edu.{String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-4 space-y-2 border-t border-border/70 pt-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              <p>{item.school}</p>
              <p>{item.location}</p>
              <p>{item.period}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
