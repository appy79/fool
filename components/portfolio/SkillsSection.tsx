import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 space-y-8">
      <div className="space-y-3">
        <Badge>Skills</Badge>
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Tools, platforms, and systems I work with.</h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">From microservices and distributed data flows to product-facing interfaces, I work across the stack to ship reliable software.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {resume.skills.map((section) => (
          <div key={section.title} className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur dark:bg-background/60 dark:shadow-slate-950/10">
            <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span key={item} className="rounded-full border border-border/70 bg-secondary/80 px-3 py-1 text-sm text-foreground shadow-sm shadow-slate-900/5 dark:bg-secondary/60 dark:shadow-slate-950/10">
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
