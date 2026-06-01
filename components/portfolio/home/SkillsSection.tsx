"use client";

import { useMemo, useState } from "react";
import { resume } from "@/lib/resume";
import BrandTechnologyIcon from "./BrandTechnologyIcon";

export default function SkillsSection() {
  const [activeSkillTitle, setActiveSkillTitle] = useState(resume.skills[0]?.title ?? "");
  const activeSkill = useMemo(
    () => resume.skills.find((section) => section.title === activeSkillTitle) ?? resume.skills[0],
    [activeSkillTitle]
  );

  return (
    <section id="skills" className="scroll-mt-24 space-y-8">
      <header className="border-b border-border/70 pb-6">
        <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">working stack</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground">Stack</h2>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(14rem,0.45fr)_minmax(0,1fr)]">
        <div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
          role="tablist"
          aria-label="Skill categories"
        >
          {resume.skills.map((section) => {
            const active = section.title === activeSkill.title;

            return (
              <button
                key={section.title}
                type="button"
                role="tab"
                aria-selected={active}
                className={`border px-4 py-3 text-left text-sm font-semibold transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  active
                    ? "border-primary/60 bg-primary/5 text-foreground"
                    : "border-border/70 bg-transparent text-muted-foreground hover:border-primary/45 hover:bg-accent/25 hover:text-foreground"
                }`}
                onClick={() => setActiveSkillTitle(section.title)}
              >
                {section.title}
              </button>
            );
          })}
        </div>

        <div className="border border-border/70 bg-card/60 p-6 dark:bg-background" role="tabpanel" aria-live="polite">
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">{activeSkill.title}</h3>
          <div className="mt-6 flex flex-wrap gap-3">
            {activeSkill.items.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 border border-border/70 bg-transparent px-3 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                <BrandTechnologyIcon name={item} />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
