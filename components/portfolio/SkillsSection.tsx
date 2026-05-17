import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function SkillsSection() {
  return (
    <section id="skills" className="space-y-8">
      <div className="space-y-3">
        <Badge>Skills</Badge>
        <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">Tools, technologies, and design systems I work with.</h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">From interface architecture to developer tooling, I work across the full frontend stack to create reliable product experiences.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {resume.skills.map((section) => (
          <div key={section.title} className="rounded-3xl border border-border/60 bg-background/80 p-6 shadow-sm shadow-slate-950/5 backdrop-blur">
            <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span key={item} className="rounded-full border border-border/60 bg-white/80 px-3 py-1 text-sm text-foreground shadow-sm dark:bg-slate-950/70">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
