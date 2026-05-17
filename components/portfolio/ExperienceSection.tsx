import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function ExperienceSection() {
  return (
    <section id="experience" className="space-y-8">
      <div className="space-y-3">
        <Badge>Experience</Badge>
        <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">Where I&apos;ve shipped product experiences.</h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">A snapshot of the roles that shaped the way I design, code, and ship digital products.</p>
      </div>

      <div className="space-y-6">
        {resume.experience.map((item) => (
          <article key={item.role} className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm shadow-slate-950/5 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-foreground">{item.role}</p>
                <p className="text-sm text-muted-foreground">{item.company} · {item.location}</p>
              </div>
              <p className="text-sm text-muted-foreground">{item.period}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
