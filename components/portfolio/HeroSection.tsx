import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

export default function HeroSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] lg:items-center" id="home">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-5">
          <Badge>Portfolio</Badge>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Hi, I&apos;m {resume.name} — {resume.title}.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground sm:text-xl">{resume.tagline}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {resume.highlights.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-border/60 bg-background/70 p-5 text-sm text-foreground shadow-sm shadow-slate-950/5 backdrop-blur"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <a href="#work">View work</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#contact">Contact</a>
          </Button>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-border/60 bg-slate-950/95 p-8 text-white shadow-2xl shadow-slate-950/30 sm:p-10">
        <p className="text-sm uppercase tracking-[0.28em] text-primary/80">Featured work</p>
        <h2 className="mt-4 text-3xl font-semibold">High-impact web experiences</h2>
        <p className="mt-4 text-base leading-7 text-slate-300">{resume.intro}</p>
        <div className="mt-8 grid gap-4">
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Performance</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">Fast loading, accessible interfaces, and modern frontend architecture for smooth experiences.</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-5">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Design system</p>
            <p className="mt-3 text-sm leading-6 text-slate-200">Reusable components and consistent styling make every page feel polished.</p>
          </div>
        </div>
      </aside>
    </section>
  );
}
