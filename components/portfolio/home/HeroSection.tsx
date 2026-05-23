import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

export default function HeroSection() {
  return (
    <section className="scroll-mt-24 text-foreground" id="home">
      <div className="grid gap-5 border-y border-primary/25 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.36fr)] lg:items-start">
        <div className="min-w-0 space-y-5">
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-primary">
            &gt; portfolio.boot
          </div>
          <div className="max-w-4xl space-y-4">
            <Badge className="font-mono uppercase tracking-[0.18em]">Portfolio</Badge>
            <h1 className="max-w-5xl break-words text-4xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
              Hi, I&apos;m {resume.name} — {resume.title}.
            </h1>
            <p className="max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">{resume.intro}</p>
          </div>
          <div className="grid gap-3 pt-1 sm:grid-cols-2">
            {resume.highlights.map((highlight, index) => (
              <p
                key={highlight}
                className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3 border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground"
              >
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{highlight}</span>
              </p>
            ))}
          </div>
        </div>

        <aside className="min-w-0 border-t border-border/70 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary">runtime.profile</p>
          <div className="mt-3 space-y-3 text-sm leading-6 text-muted-foreground">
            <p className="break-words font-medium text-foreground">loaded role: {resume.title}</p>
            <p>Backend, full-stack, platform tooling, and distributed systems delivery.</p>
          </div>
          <div className="mt-5 flex flex-col gap-3">
            <Button asChild className="font-mono uppercase tracking-[0.16em]">
              <a href="#work">View work</a>
            </Button>
            <Button variant="outline" asChild className="font-mono uppercase tracking-[0.16em]">
              <a href="#contact">Contact</a>
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
