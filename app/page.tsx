import ContactSection from "@/components/portfolio/ContactSection";
import EducationSection from "@/components/portfolio/EducationSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
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
    <main className="relative min-h-screen bg-background/10 text-foreground py-16 sm:py-20">
      <div className="glass mx-auto flex max-w-6xl flex-col gap-16 rounded-[2rem] border border-border/60 bg-white/90 dark:bg-slate-950/80 px-8 py-16 shadow-2xl shadow-slate-950/20 sm:px-10 lg:px-14">
        <HeroSection />

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
