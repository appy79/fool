import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function AboutSection() {
  return (
    <section id="about" className="grid gap-10 lg:grid-cols-[0.95fr_0.85fr] lg:items-start">
      <div className="space-y-6">
        <div className="space-y-3">
          <Badge>About</Badge>
          <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">A thoughtful approach to frontend development.</h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">I bring clarity to product goals and build interfaces that feel both polished and dependable across every screen.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {resume.skills[0].items.map((skill) => (
            <div key={skill} className="rounded-3xl border border-border/60 bg-background/70 p-5 shadow-sm shadow-slate-950/5 backdrop-blur">
              <p className="text-base font-medium text-foreground">{skill}</p>
              <p className="mt-2 text-sm text-muted-foreground">Built with modern web standards in mind.</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-border/60 bg-white/90 p-8 shadow-2xl shadow-slate-950/10 dark:bg-slate-950/85 dark:text-white sm:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-primary/80">Story</p>
        <h3 className="mt-4 text-2xl font-semibold">Bringing digital products to life.</h3>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          My work balances technical rigor with visual detail. I enjoy translating user needs into elegant interfaces, while keeping the experience fast, accessible, and easy to maintain.
        </p>
        <div className="mt-6 space-y-4">
          {resume.highlights.map((item) => (
            <div key={item} className="rounded-3xl border border-border/60 bg-background/80 p-4 text-sm text-foreground">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
