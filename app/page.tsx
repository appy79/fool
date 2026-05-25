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
    <main id="main-content" className={`${styles.theme} min-h-screen px-3 py-4 text-foreground sm:px-5 sm:py-6 lg:px-8`}>
      <div className="mx-auto flex max-w-[96rem] flex-col gap-5">
        <HeroSection contact={contact} />

        <div className="space-y-10">
          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
        </div>

        <PortfolioFooter />
      </div>
    </main>
  );
}
