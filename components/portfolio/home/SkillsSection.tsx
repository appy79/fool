import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "../icons/BrandTechnologyIcon";

export default function SkillsSection() {
  return (
    <section id="skills" className="scroll-mt-24 space-y-10">
      <header className="section-header-motion grid gap-4 border-b border-border/70 pb-7 md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">capabilities</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-foreground">Stack in practice.</h2>
        </div>
      </header>

      <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
        {resume.skills.map((section, sectionIndex) => (
          <section key={section.title} className="relative overflow-hidden border border-border/70 bg-background/35 p-5">
            <div className="relative">
              <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-primary">capability 0{sectionIndex + 1}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">{section.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{section.summary}</p>
            </div>
            <div className="relative mt-5 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 bg-muted/55 px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground dark:bg-accent/20"
                >
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
