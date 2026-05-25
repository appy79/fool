import type { Metadata } from "next";
import EngineeringSystemsLab from "@/components/portfolio/labs/EngineeringSystemsLab";
import { resume } from "@/lib/resume";

const labsTitle = `Engineering Systems Labs | ${resume.name}`;
const labsDescription =
  "Interactive labs for telecom flows, distributed consensus, database access paths, concurrency, networking, complexity, and design patterns.";

export const metadata: Metadata = {
  title: labsTitle,
  description: labsDescription,
  alternates: {
    canonical: "/labs",
  },
  openGraph: {
    title: labsTitle,
    description: labsDescription,
    url: "/labs",
    siteName: `${resume.name} Portfolio`,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: `${resume.name} engineering systems labs preview`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: labsTitle,
    description: labsDescription,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: `${resume.name} engineering systems labs preview`,
      },
    ],
  },
};

export default function LabsPage() {
  return <EngineeringSystemsLab />;
}
