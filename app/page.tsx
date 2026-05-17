import AboutSection from "@/components/portfolio/AboutSection";
import ContactSection from "@/components/portfolio/ContactSection";
import EducationSection from "@/components/portfolio/EducationSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import HeroSection from "@/components/portfolio/HeroSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background/10 text-foreground py-16 sm:py-20">
      <div className="glass mx-auto flex max-w-6xl flex-col gap-16 rounded-[2rem] border border-border/60 bg-white/90 dark:bg-slate-950/80 px-8 py-16 shadow-2xl shadow-slate-950/20 sm:px-10 lg:px-14">
        <HeroSection />

        <div className="space-y-16">
          <AboutSection />
          <div className="h-px bg-border/30" />
          <SkillsSection />
          <div className="h-px bg-border/30" />
          <EducationSection />
          <div className="h-px bg-border/30" />
          <ProjectsSection />
          <div className="h-px bg-border/30" />
          <ExperienceSection />
          <div className="h-px bg-border/30" />
          <ContactSection />
        </div>
      </div>
    </main>
  );
}
