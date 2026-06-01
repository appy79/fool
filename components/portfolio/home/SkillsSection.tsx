import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "./BrandTechnologyIcon";

export default function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 space-y-10">
      <header className="grid gap-4 border-b border-border/70 pb-7 md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">capabilities</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-foreground">Stack in practice.</h2>
        </div>
      </header>

      <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
        {resume.skills.map((section) => (
          <section key={section.title} className="border-t border-border/70 pt-5">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-foreground">{section.title}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 bg-muted/55 px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground dark:bg-accent/20">
                  <BrandTechnologyIcon name={item} />
                  {item}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
