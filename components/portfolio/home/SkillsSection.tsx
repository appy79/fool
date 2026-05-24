import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 space-y-5">
      <header className="grid gap-3 border-y border-primary/25 py-3 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)] md:items-start">
        <div className="min-w-0 space-y-2">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">&gt; section:skills</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Core stack for backend and platform delivery.
          </h2>
        </div>
        <p className="min-w-0 border-t border-border/70 pt-3 text-sm leading-6 text-muted-foreground md:border-l md:border-t-0 md:pl-4 md:pt-0">
          Focused around the tools I use most for Java services, distributed data flows, Kubernetes delivery, and internal developer tooling.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {resume.skills.map((section, index) => (
          <div key={section.title} className="border border-border/70 bg-card/45 p-5 backdrop-blur dark:bg-background/35">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-foreground">{section.title}</h3>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <Badge key={item} variant="outline" className="rounded-none font-mono text-[0.68rem] uppercase tracking-[0.12em]">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
