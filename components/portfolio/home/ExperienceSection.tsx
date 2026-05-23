import { resume } from "@/lib/resume";

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">
            &gt; section:experience
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Where I&apos;ve shipped production systems.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          A snapshot of the roles that shaped how I build backend services, platform tooling, and dependable user-facing systems.
        </p>
      </header>

      <div className="space-y-4">
        {resume.experience.map((item, index) => (
          <article key={`${item.role}-${item.company}-${item.period}`} className="border border-border/70 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                  exp.{String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-base font-semibold text-foreground">{item.role}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.company} / {item.location}
                </p>
              </div>
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">{item.period}</p>
            </div>
            <div className="mt-5 space-y-4 border-t border-border/70 pt-5">
              {item.description && <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>}
              {item.projects.map((project) => (
                <div key={project.title} className="grid gap-2 md:grid-cols-[14rem_minmax(0,1fr)]">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary">{project.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
