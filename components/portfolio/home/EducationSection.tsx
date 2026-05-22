import { Badge } from "@/components/ui/badge";
import { resume } from "@/lib/resume";

export default function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 space-y-8">
      <div className="space-y-3">
        <Badge>Education</Badge>
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Academic foundation in computing and application development.</h2>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">Formal training in software development and computer applications from top Indian institutions.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {resume.education.map((item) => (
          <div key={item.degree} className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm shadow-slate-900/5 backdrop-blur dark:bg-background/60 dark:shadow-slate-950/10">
            <p className="text-base font-semibold text-foreground">{item.degree}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.school}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.location}</p>
            <p className="mt-3 text-sm text-muted-foreground">{item.period}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
