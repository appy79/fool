import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

export default function HeroSection() {
  return (
    <section className="space-y-10" id="home">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-5">
          <Badge>Portfolio</Badge>
          <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Hi, I&apos;m {resume.name} — {resume.title}.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground sm:text-xl">{resume.intro}</p>
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            {resume.highlights.map((highlight) => (
              <p key={highlight} className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-sm font-medium text-foreground shadow-sm shadow-slate-900/5 dark:bg-background/60">
                {highlight}
              </p>
            ))}
          </div>
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
    </section>
  );
}
