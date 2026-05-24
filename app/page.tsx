import EducationSection from "@/components/portfolio/home/EducationSection";
import HeroSection from "@/components/portfolio/home/HeroSection";
import ProjectsSection from "@/components/portfolio/home/ProjectsSection";
import SkillsSection from "@/components/portfolio/home/SkillsSection";
import { resume } from "@/lib/resume";
import styles from "./page.module.css";

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
    <main className={`${styles.theme} min-h-screen px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8`}>
      <div className="mx-auto flex max-w-[96rem] flex-col gap-5">
        <HeroSection contact={contact} />

        <div className="space-y-10">
          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
        </div>

        <footer className="grid gap-3 border-t border-primary/25 pt-4 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <p className="text-primary">&gt; end.program</p>
          <p className="min-w-0">Built with Next.js, React, and systems curiosity.</p>
          <div className="flex flex-wrap gap-3">
            <a href="/labs" className="transition hover:text-primary">
              Labs
            </a>
            <span>© 2026 Amandeep Yadav</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
