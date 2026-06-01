import EducationSection from "@/components/portfolio/home/EducationSection";
import HeroSection from "@/components/portfolio/home/HeroSection";
import ProjectsSection from "@/components/portfolio/home/ProjectsSection";
import SkillsSection from "@/components/portfolio/home/SkillsSection";
import PortfolioFooter from "@/components/portfolio/shared/PortfolioFooter";
import styles from "@/components/portfolio/shared/portfolioTheme.module.css";
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
    <main id="main-content" className={`${styles.theme} min-h-screen px-4 py-6 text-foreground sm:px-8 sm:py-10 lg:px-10`}>
      <div className="mx-auto flex max-w-[86rem] flex-col gap-12">
        <HeroSection contact={contact} />

        <div className="space-y-24">
          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
        </div>

        <PortfolioFooter />
      </div>
    </main>
  );
}
