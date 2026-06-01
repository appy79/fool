import EducationSection from "@/components/portfolio/home/EducationSection";
import HeroSection from "@/components/portfolio/home/HeroSection";
import ProjectsSection from "@/components/portfolio/home/ProjectsSection";
import SkillsSection from "@/components/portfolio/home/SkillsSection";
import PortfolioFooter from "@/components/portfolio/shared/PortfolioFooter";
import styles from "@/components/portfolio/shared/portfolioTheme.module.css";
import { resume } from "@/lib/resume";

export const dynamic = "force-dynamic";

const absoluteHrefPattern = /^(?:https?:|mailto:|tel:)/i;
const domainHrefPattern = /^(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:[/?#]|$)/i;

const normalizeSocialParameter = (value: string) => value.trim().replace(/^@+/, "").replace(/^\/+|\/+$/g, "");

const resolveSocialHref = (value: string, hrefTemplate?: string) => {
  const trimmedValue = value.trim();

  if (absoluteHrefPattern.test(trimmedValue)) {
    return trimmedValue;
  }

  if (domainHrefPattern.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  if (hrefTemplate) {
    return hrefTemplate.replace("{value}", encodeURIComponent(normalizeSocialParameter(trimmedValue)));
  }

  return trimmedValue;
};

export default function Home() {
  const contact = {
    ...resume.contact,
    email: resume.contact.emailFromEnv ? process.env[resume.contact.emailFromEnv] : resume.contact.email,
    phone: resume.contact.phoneFromEnv ? process.env[resume.contact.phoneFromEnv] : resume.contact.phone,
    socials: resume.contact.socialsFromEnv
      ? resume.contact.socialsFromEnv
          .map((social) => {
            const envValue = process.env[social.envKey]?.trim();

            return envValue
              ? { label: social.label, href: resolveSocialHref(envValue, social.hrefTemplate) }
              : null;
          })
          .filter((social): social is { label: string; href: string } => Boolean(social?.href))
      : resume.contact.socials ?? [],
  };

  return (
    <main id="main-content" className={`${styles.theme} min-h-screen px-4 py-8 text-foreground sm:px-8 sm:py-12 lg:px-10`}>
      <div className="mx-auto flex max-w-[82rem] flex-col gap-20">
        <HeroSection contact={contact} />

        <div className="space-y-24">
          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
        </div>

        <PortfolioFooter contact={contact} />
      </div>
    </main>
  );
}
