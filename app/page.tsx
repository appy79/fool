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
    <main className="labs-theme min-h-screen px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto flex max-w-[96rem] flex-col gap-5">
        <HeroSection />

        <section className="border-y border-primary/25 py-4">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="min-w-0 space-y-2">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-primary">
                &gt; route:/labs
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Explore the engineering exhibits.</h2>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                Step through animated labs for telecom flows, distributed systems, performance, networking, complexity,
                design patterns, concurrency, and Turing machines.
              </p>
            </div>
            <Button asChild className="font-mono uppercase tracking-[0.16em]">
              <Link href="/labs">Open Labs</Link>
            </Button>
          </div>
        </section>

        <div className="space-y-10">
          <SkillsSection />
          <EducationSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection contact={contact} />
        </div>
      </div>
    </main>
  );
}
