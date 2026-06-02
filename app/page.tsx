import EducationSection from "@/components/portfolio/home/EducationSection";
import HeroSection from "@/components/portfolio/home/HeroSection";
import ProjectsSection from "@/components/portfolio/home/ProjectsSection";
import SkillsSection from "@/components/portfolio/home/SkillsSection";
import PageShell from "@/components/portfolio/shared/PageShell";
import PortfolioFooter from "@/components/portfolio/shared/PortfolioFooter";
import { getResolvedContact } from "@/lib/contact";

export default function Home() {
  const contact = getResolvedContact();

  return (
    <PageShell innerClassName="max-w-[82rem] gap-20">
      <HeroSection contact={contact} />

      <div className="space-y-24">
        <ProjectsSection />
        <SkillsSection />
        <EducationSection />
      </div>

      <PortfolioFooter />
    </PageShell>
  );
}
