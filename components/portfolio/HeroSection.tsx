import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

export default function HeroSection() {
  return (
    <section className="space-y-10" id="home">
      <div className="space-y-8">
        <div className="max-w-3xl space-y-5">
          <Badge>Portfolio</Badge>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            Hi, I&apos;m {resume.name} — {resume.title}.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground sm:text-xl">{resume.intro}</p>
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
