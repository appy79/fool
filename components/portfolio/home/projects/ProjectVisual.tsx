import Link from "next/link";
import type { resume } from "@/lib/resume";
import ScaledSceneCanvas from "../../labs/shared/ScaledSceneCanvas";
import ProjectFlowScene from "./ProjectFlowScene";
import { projectFlows } from "./projectFlows";
import { CANVAS } from "./types";

type Project = (typeof resume.projects)[number];

export default function ProjectVisual({ project }: { project: Project }) {
  const flow = projectFlows[project.visualKind] ?? projectFlows.system;

  return (
    <Link
      href={project.labHref}
      className="labs-acceleration-cta project-showcase"
      aria-label={`Open ${project.labLabel} for ${project.title}`}
    >
      <span className="visual-banner !absolute">click to deep dive</span>
      <ScaledSceneCanvas
        aria-hidden="true"
        className="rounded-none bg-transparent"
        height={CANVAS.height}
        innerClassName="pointer-events-none"
        width={CANVAS.width}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--primary)_13%,transparent)_1px,transparent_1px),linear-gradient(0deg,color-mix(in_oklch,var(--primary)_13%,transparent)_1px,transparent_1px)] bg-[size:74px_58px] opacity-45" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <ProjectFlowScene flow={flow} />
      </ScaledSceneCanvas>
    </Link>
  );
}
