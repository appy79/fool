import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24 space-y-8">
      <div className="space-y-3">
        <Badge>Experience</Badge>
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Where I&apos;ve shipped production systems.</h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">A snapshot of the roles that shaped how I build backend services, platform tooling, and dependable user-facing systems.</p>
      </div>

      <div className="space-y-6">
        {resume.experience.map((item) => (
          <article key={`${item.role}-${item.company}-${item.period}`} className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur dark:bg-background/60 dark:shadow-slate-950/10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-foreground">{item.role}</p>
                <p className="text-sm text-muted-foreground">{item.company} · {item.location}</p>
              </div>
              <p className="text-sm text-muted-foreground">{item.period}</p>
            </div>
            <div className="mt-4 space-y-4">
              {item.description && <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>}
              {item.projects.map((project) => (
                <div key={project.title}>
                  <p className="text-sm font-semibold text-foreground">{project.title}</p>
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
