import Link from "next/link";
import ContactSection from "@/components/portfolio/home/ContactSection";
import EducationSection from "@/components/portfolio/home/EducationSection";
import ExperienceSection from "@/components/portfolio/home/ExperienceSection";
import HeroSection from "@/components/portfolio/home/HeroSection";
import ProjectsSection from "@/components/portfolio/home/ProjectsSection";
import SkillsSection from "@/components/portfolio/home/SkillsSection";
import { Button } from "@/components/ui/button";
import { resume } from "@/lib/resume";

export default function Home() {
  const contact = {
    ...resume.contact,
    email: resume.contact.emailFromEnv ? process.env[resume.contact.emailFromEnv] : resume.contact.email,
    phone: resume.contact.phoneFromEnv ? process.env[resume.contact.phoneFromEnv] : resume.contact.phone,
    socials: resume.contact.socialsFromEnv
      ? resume.contact.socialsFromEnv
          .map((social) => ({ label: social.label, href: process.env[social.envKey] }))
          .filter((social): social is { label: string; href: string } => Boolean(social.href))
      : resume.contact.socials ?? [],
  };

  return (
    <main className="relative min-h-screen py-16 text-foreground sm:py-20">
      <div className="glass mx-auto flex max-w-6xl flex-col gap-16 rounded-[2rem] border border-border/70 bg-card/85 px-8 py-16 shadow-2xl shadow-slate-900/10 dark:bg-background/80 dark:shadow-slate-950/20 sm:px-10 lg:px-14">
        <HeroSection />

        <section className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-sm shadow-slate-900/5 sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Interactive Systems Lab</p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Explore the engineering exhibits.</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Step through animated labs for telecom flows, distributed systems, performance, networking, complexity,
                design patterns, concurrency, and Turing machines.
              </p>
            </div>
            <Button asChild>
              <Link href="/labs">Open Labs</Link>
            </Button>
          </div>
        </section>

        <div className="space-y-16">
          <SkillsSection />
          <div className="h-px bg-border/30" />
          <EducationSection />
          <div className="h-px bg-border/30" />
          <ProjectsSection />
          <div className="h-px bg-border/30" />
          <ExperienceSection />
          <div className="h-px bg-border/30" />
          <ContactSection contact={contact} />
        </div>
      </div>
    </main>
  );
}
