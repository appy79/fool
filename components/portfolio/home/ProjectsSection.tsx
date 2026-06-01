"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";
import { resume } from "@/lib/resume";
import ScaledSceneCanvas from "../labs/shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../labs/shared/SceneConnector";
import TechnologyIcon from "./TechnologyIcon";

type Project = (typeof resume.projects)[number];
type Experience = (typeof resume.experience)[number];
type ScenePoint = { x: number; y: number };

const getProjectRole = (source: string) => source.split("/").at(-1)?.trim() ?? source;
const getExperienceKey = (experience: Experience) => `${experience.role}-${experience.company}-${experience.period}`;

const getProjectVisualKind = (title: string) => {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("deployment")) return "deployment";
  if (normalizedTitle.includes("openet")) return "charging";
  if (normalizedTitle.includes("metro")) return "telecom";
  if (normalizedTitle.includes("digital billing")) return "billing";
  if (normalizedTitle.includes("northstar")) return "ordering";
  if (normalizedTitle.includes("media")) return "media";
  if (normalizedTitle.includes("training")) return "pipeline";
  if (normalizedTitle.includes("monetization")) return "monetization";

  return "system";
};

const getProjectsForExperience = (role: string) =>
  resume.projects.filter((project) => getProjectRole(project.source) === role);

const projectVisualContent: Record<
  string,
  {
    value: string;
    problem: string;
    source: string;
    core: string;
    result: string;
  }
> = {
  deployment: {
    value: "ship",
    problem: "slow environment validation",
    source: "secrets + config",
    core: "parallel diff engine",
    result: "release target",
  },
  charging: {
    value: "1M+",
    problem: "carrier-scale charging events",
    source: "event firehose",
    core: "rating + ordering",
    result: "subscriber ledger",
  },
  telecom: {
    value: "flow",
    problem: "post-acquisition platform migration",
    source: "customer action",
    core: "BSS / OSS bridge",
    result: "provisioned service",
  },
  billing: {
    value: "5M",
    problem: "daily billing aggregation",
    source: "billing records",
    core: "sync boundary",
    result: "subscriber view",
  },
  ordering: {
    value: "4x",
    problem: "enterprise order throughput",
    source: "work queue",
    core: "orchestrated workers",
    result: "fulfilled orders",
  },
  media: {
    value: "300%",
    problem: "serial media processing",
    source: "media batches",
    core: "worker pool",
    result: "processed assets",
  },
  pipeline: {
    value: "70%",
    problem: "manual training-data prep",
    source: "daily records",
    core: "clean + store",
    result: "training set",
  },
  monetization: {
    value: "$200K",
    problem: "usage-to-revenue path",
    source: "usage records",
    core: "metering model",
    result: "invoice + revenue",
  },
  system: {
    value: "trace",
    problem: "system tradeoff",
    source: "inputs",
    core: "model",
    result: "lab view",
  },
};

function ProjectVisual({ project }: { project: Project }) {
  const visualKind = getProjectVisualKind(project.title);
  const visual = projectVisualContent[visualKind] ?? projectVisualContent.system;
  const canvas = { width: 920, height: 430 };

  return (
    <Link
      href={project.labHref}
      className={`labs-acceleration-cta project-showcase project-showcase-${visualKind}`}
      aria-label={`Open ${project.labLabel} for ${project.title}`}
    >
      <span className="visual-banner !absolute">click to deep dive</span>
      <ScaledSceneCanvas
        aria-hidden="true"
        className="rounded-none bg-transparent"
        height={canvas.height}
        innerClassName="pointer-events-none"
        width={canvas.width}
      >
        <ProjectSceneMotionStyles />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--primary)_13%,transparent)_1px,transparent_1px),linear-gradient(0deg,color-mix(in_oklch,var(--primary)_13%,transparent)_1px,transparent_1px)] bg-[size:74px_58px] opacity-45" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-8 top-8 z-20 max-w-[520px] overflow-hidden rounded-full border border-primary/25 bg-background/75 px-4 py-2 font-mono text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary shadow-xl">
          <span className="block truncate">{visual.problem}</span>
        </div>
        {renderProjectScene(visualKind, visual, canvas)}
      </ScaledSceneCanvas>
    </Link>
  );
}

function ProjectSceneMotionStyles() {
  return (
    <style>
      {`
        @keyframes project-flow-pulse {
          0% { opacity: 0; transform: translateX(0) scale(0.55); }
          12% { opacity: 1; }
          78% { opacity: 1; }
          100% { opacity: 0; transform: translateX(var(--project-flow-distance)) scale(1); }
        }

        @keyframes project-line-scan {
          0%, 100% { opacity: 0.45; transform: scaleX(0.64); }
          50% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes project-dot-chase {
          0%, 100% { opacity: 0.28; transform: translateY(0) scale(0.78); }
          45% { opacity: 1; transform: translateY(-4px) scale(1); }
        }

        @keyframes project-bar-rise {
          0%, 100% { opacity: 0.42; transform: scaleY(0.44); }
          55% { opacity: 1; transform: scaleY(1); }
        }

        @keyframes project-queue-shift {
          0%, 100% { opacity: 0.45; transform: translateX(-8px); }
          50% { opacity: 1; transform: translateX(8px); }
        }

        @keyframes project-worker-tick {
          0%, 100% { opacity: 0.42; transform: translateY(0) scale(0.96); }
          50% { opacity: 1; transform: translateY(-3px) scale(1); }
        }

        @keyframes project-gauge-sweep {
          0%, 100% { transform: rotate(-28deg); }
          50% { transform: rotate(28deg); }
        }

        @media (prefers-reduced-motion: no-preference) {
          .project-flow-pulse {
            animation: project-flow-pulse 1.65s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          }

          .project-line-scan {
            animation: project-line-scan 1.8s ease-in-out infinite;
            transform-origin: left center;
          }

          .project-dot-chase {
            animation: project-dot-chase 1.4s ease-in-out infinite;
          }

          .project-bar-rise {
            animation: project-bar-rise 1.75s ease-in-out infinite;
            transform-origin: bottom center;
          }

          .project-queue-shift {
            animation: project-queue-shift 1.6s ease-in-out infinite;
          }

          .project-worker-tick {
            animation: project-worker-tick 1.55s ease-in-out infinite;
          }

          .project-gauge-sweep {
            animation: project-gauge-sweep 1.9s ease-in-out infinite;
            transform-origin: left center;
          }
        }
      `}
    </style>
  );
}

function AnimatedSceneConnector({
  className,
  delay = 0,
  from,
  thickness = 4,
  to,
  canvasHeight,
  canvasWidth,
}: {
  className?: string;
  delay?: number;
  from: ScenePoint;
  thickness?: number;
  to: ScenePoint;
  canvasHeight: number;
  canvasWidth: number;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <>
      <SceneConnector canvasHeight={canvasHeight} canvasWidth={canvasWidth} className={className} from={from} thickness={thickness} to={to} />
      <span
        className="pointer-events-none absolute z-[1] block h-3 -translate-y-1/2"
        style={{
          left: from.x,
          top: from.y,
          transform: `translateY(-50%) rotate(${angle}deg)`,
          transformOrigin: "left center",
          width: length,
        }}
      >
        <span
          className="project-flow-pulse block size-3 rounded-full bg-primary shadow-[0_0_18px_color-mix(in_oklch,var(--primary)_65%,transparent)] motion-reduce:hidden"
          style={
            {
              "--project-flow-distance": `${Math.max(length - 12, 0)}px`,
              animationDelay: `${delay}s`,
            } as CSSProperties
          }
        />
      </span>
    </>
  );
}

function renderProjectScene(
  kind: string,
  visual: (typeof projectVisualContent)[string],
  canvas: { width: number; height: number }
) {
  if (kind === "deployment") {
    const before = { x: 230, y: 230 };
    const after = { x: 690, y: 230 };

    return (
      <>
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/50" from={before} thickness={5} to={after} />
        <ProjectSceneNode label="env snapshot" point={before} subtitle={visual.source}>
          <SceneTelemetryLines />
        </ProjectSceneNode>
        <div className="absolute left-[42%] top-[36%] z-20 grid w-[150px] gap-2 rounded-2xl border border-primary/45 bg-background/85 p-3 shadow-xl">
          <span className="font-mono text-[0.58rem] font-black uppercase tracking-[0.18em] text-primary">diff runner</span>
          <span className="project-line-scan h-2 w-full bg-primary/45 motion-reduce:animate-none" />
          <span className="project-line-scan h-2 w-2/3 bg-primary/25 motion-reduce:animate-none" style={{ animationDelay: "0.22s" }} />
        </div>
        <ProjectSceneNode label="validated" point={after} subtitle={visual.result}>
          <DiffRows resolved />
        </ProjectSceneNode>
      </>
    );
  }

  if (kind === "telecom") {
    const stages = [
      { id: "UE", point: { x: 120, y: 245 }, label: "subscriber" },
      { id: "BSS", point: { x: 305, y: 160 }, label: "care" },
      { id: "OSS", point: { x: 520, y: 250 }, label: "network" },
      { id: "BILL", point: { x: 760, y: 170 }, label: "billing" },
    ];

    return (
      <>
        {stages.slice(0, -1).map((stage, index) => (
          <AnimatedSceneConnector key={stage.id} canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/55" delay={index * 0.2} from={stage.point} thickness={5} to={stages[index + 1].point} />
        ))}
        {stages.map((stage) => (
          <ProjectSceneNode key={stage.id} label={stage.id} point={stage.point} subtitle={stage.label}>
            <span className="project-dot-chase mx-auto block size-10 rounded-full border border-primary/40 bg-primary/15 motion-reduce:animate-none" />
          </ProjectSceneNode>
        ))}
      </>
    );
  }

  if (kind === "charging") {
    const sources = [
      { x: 150, y: 120 },
      { x: 150, y: 230 },
      { x: 150, y: 340 },
    ];
    const rating = { x: 440, y: 230 };
    const ledger = { x: 760, y: 230 };

    return (
      <>
        {sources.map((point, index) => (
          <AnimatedSceneConnector key={index} canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/60 motion-reduce:animate-none" delay={index * 0.18} from={point} thickness={4} to={rating} />
        ))}
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/60" delay={0.35} from={rating} thickness={6} to={ledger} />
        {sources.map((point, index) => (
          <ProjectSceneNode compact key={index} className="w-[132px]" label={`stream ${index + 1}`} point={point} subtitle="events">
            <EventDots />
          </ProjectSceneNode>
        ))}
        <ProjectSceneNode className="w-[230px]" label="rating core" point={rating} subtitle={visual.core}>
          <ProjectSceneMotif kind="charging" />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[190px]" label="ledger" point={ledger} subtitle={visual.result}>
          <LedgerLines />
        </ProjectSceneNode>
      </>
    );
  }

  if (kind === "billing") {
    const records = [
      { x: 150, y: 160 },
      { x: 150, y: 292 },
    ];
    const aggregator = { x: 438, y: 225 };
    const sync = { x: 720, y: 225 };

    return (
      <>
        {records.map((point, index) => (
          <AnimatedSceneConnector key={index} canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/50" delay={index * 0.25} from={point} thickness={5} to={aggregator} />
        ))}
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/65 motion-reduce:animate-none" delay={0.35} from={aggregator} thickness={6} to={sync} />
        {records.map((point, index) => (
          <ProjectSceneNode compact key={index} className="w-[160px]" label={`records ${index + 1}`} point={point} subtitle={visual.source}>
            <LedgerLines />
          </ProjectSceneNode>
        ))}
        <ProjectSceneNode className="w-[240px]" label="aggregate" point={aggregator} subtitle={visual.core}>
          <BarStack />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[200px]" label="subscriber" point={sync} subtitle={visual.result}>
          <DiffRows resolved />
        </ProjectSceneNode>
      </>
    );
  }

  if (kind === "ordering") {
    const queue = { x: 170, y: 220 };
    const orchestrator = { x: 430, y: 220 };
    const workers = [
      { x: 650, y: 150 },
      { x: 650, y: 290 },
    ];
    const done = { x: 790, y: 220 };

    return (
      <>
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/55" from={queue} thickness={6} to={orchestrator} />
        {workers.map((point, index) => (
          <AnimatedSceneConnector key={index} canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/55 motion-reduce:animate-none" delay={0.25 + index * 0.2} from={orchestrator} thickness={5} to={point} />
        ))}
        {workers.map((point, index) => (
          <AnimatedSceneConnector key={`done-${index}`} canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/45" delay={0.5 + index * 0.2} from={point} thickness={4} to={done} />
        ))}
        <ProjectSceneNode className="w-[190px]" label="queue" point={queue} subtitle={visual.source}>
          <QueueRows />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[220px]" label="orchestrator" point={orchestrator} subtitle={visual.core}>
          <WorkerGrid />
        </ProjectSceneNode>
        {workers.map((point, index) => (
          <ProjectSceneNode compact key={index} className="w-[142px]" label={`worker ${index + 1}`} point={point} subtitle="bounded work">
            <SceneTelemetryLines />
          </ProjectSceneNode>
        ))}
        <ProjectSceneNode compact className="w-[142px]" label="done" point={done} subtitle={visual.result}>
          <LedgerLines />
        </ProjectSceneNode>
      </>
    );
  }

  if (kind === "media") {
    const media = { x: 150, y: 220 };
    const workerPoints = [
      { x: 390, y: 140 },
      { x: 390, y: 300 },
      { x: 575, y: 140 },
      { x: 575, y: 300 },
    ];
    const output = { x: 765, y: 220 };

    return (
      <>
        {workerPoints.map((point, index) => (
          <AnimatedSceneConnector key={index} canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/45" delay={index * 0.12} from={media} thickness={4} to={point} />
        ))}
        {workerPoints.map((point, index) => (
          <AnimatedSceneConnector key={`out-${index}`} canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/50 motion-reduce:animate-none" delay={0.4 + index * 0.12} from={point} thickness={4} to={output} />
        ))}
        <ProjectSceneNode className="w-[170px]" label="media" point={media} subtitle={visual.source}>
          <span className="mx-auto block h-14 w-20 rounded-xl border border-primary/40 bg-primary/15" />
        </ProjectSceneNode>
        {workerPoints.map((point, index) => (
          <ProjectSceneNode compact key={index} className="w-[138px]" label={`proc ${index + 1}`} point={point} subtitle="ffmpeg">
            <WorkerGrid />
          </ProjectSceneNode>
        ))}
        <ProjectSceneNode className="w-[170px]" label="assets" point={output} subtitle={visual.result}>
          <BarStack />
        </ProjectSceneNode>
      </>
    );
  }

  if (kind === "pipeline") {
    const ingest = { x: 140, y: 220 };
    const clean = { x: 350, y: 220 };
    const storage = { x: 560, y: 220 };
    const train = { x: 755, y: 220 };

    return (
      <>
        {[ingest, clean, storage].map((point, index) => (
          <AnimatedSceneConnector key={index} canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/55" delay={index * 0.25} from={point} thickness={5} to={[clean, storage, train][index]} />
        ))}
        <ProjectSceneNode compact className="w-[152px]" label="ingest" point={ingest} subtitle={visual.source}>
          <LedgerLines />
        </ProjectSceneNode>
        <ProjectSceneNode compact className="w-[152px]" label="clean" point={clean} subtitle="normalize">
          <DiffRows resolved />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[170px]" label="store" point={storage} subtitle={visual.core}>
          <ProjectSceneMotif kind="pipeline" />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[170px]" label="train set" point={train} subtitle={visual.result}>
          <BarStack />
        </ProjectSceneNode>
      </>
    );
  }

  if (kind === "monetization") {
    const usage = { x: 150, y: 255 };
    const rules = { x: 330, y: 145 };
    const meter = { x: 500, y: 255 };
    const invoice = { x: 710, y: 255 };

    return (
      <>
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/45" from={usage} thickness={5} to={meter} />
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="bg-primary/35" delay={0.18} from={rules} thickness={4} to={meter} />
        <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/60 motion-reduce:animate-none" delay={0.35} from={meter} thickness={6} to={invoice} />
        <ProjectSceneNode className="w-[165px]" label="usage" point={usage} subtitle={visual.source}>
          <EventDots />
        </ProjectSceneNode>
        <ProjectSceneNode compact className="w-[145px]" label="rules" point={rules} subtitle="plans">
          <SceneTelemetryLines />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[190px]" label="meter" point={meter} subtitle={visual.core}>
          <ProjectSceneMotif kind="monetization" />
        </ProjectSceneNode>
        <ProjectSceneNode className="w-[185px]" label="invoice" point={invoice} subtitle={visual.result}>
          <LedgerLines />
        </ProjectSceneNode>
      </>
    );
  }

  const left = { x: 170, y: 230 };
  const center = { x: 460, y: 210 };
  const right = { x: 750, y: 230 };

  return (
    <>
      <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/65 shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_45%,transparent)] motion-reduce:animate-none" from={left} thickness={6} to={center} />
      <AnimatedSceneConnector canvasHeight={canvas.height} canvasWidth={canvas.width} className="animate-pulse bg-primary/65 shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_45%,transparent)] motion-reduce:animate-none" delay={0.35} from={center} thickness={6} to={right} />
      <ProjectSceneNode label={kind === "charging" ? "firehose" : kind === "media" ? "media batch" : kind === "ordering" ? "queue" : kind === "pipeline" ? "ingest" : kind === "monetization" ? "usage" : "records"} point={left} subtitle={visual.source}>
        {kind === "charging" || kind === "monetization" ? <EventDots /> : <SceneTelemetryLines />}
      </ProjectSceneNode>
      <ProjectSceneNode isCore kind={kind} label={kind === "billing" ? "aggregate" : kind === "ordering" ? "orchestrate" : kind === "media" ? "worker pool" : kind === "pipeline" ? "dataset" : kind === "monetization" ? "metering" : "rating"} point={center} subtitle={visual.core} />
      <ProjectSceneNode label={kind === "media" ? "rendered" : kind === "pipeline" ? "training" : kind === "monetization" ? "invoice" : "result"} point={right} subtitle={visual.result}>
        {kind === "billing" || kind === "media" ? <BarStack /> : <LedgerLines />}
      </ProjectSceneNode>
    </>
  );
}

function ProjectSceneNode({
  children,
  className,
  compact = false,
  isCore = false,
  kind,
  label,
  point,
  subtitle,
}: {
  children?: ReactNode;
  className?: string;
  compact?: boolean;
  isCore?: boolean;
  kind?: string;
  label: string;
  point: ScenePoint;
  subtitle: string;
}) {
  return (
    <div
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center ${className ?? "w-[196px]"}`}
      style={scenePointStyle(point, 920, 430)}
    >
      {isCore ? <span className="absolute inset-[-0.85rem] animate-ping rounded-[2rem] bg-primary/15 motion-reduce:animate-none" /> : null}
      <div
        className={`relative grid content-center overflow-visible rounded-[1.4rem] border shadow-2xl ${
          compact ? "min-h-[104px] gap-2 px-3 py-3" : "min-h-[142px] gap-2.5 px-4 py-4"
        } ${
          isCore
            ? "border-primary/70 bg-background/80 shadow-primary/20"
            : "border-primary/35 bg-background/70 shadow-foreground/10"
        }`}
      >
        <p className="truncate font-mono text-[0.62rem] font-black uppercase tracking-[0.18em] text-primary">{label}</p>
        <p className={`mx-auto max-w-[160px] text-balance font-mono font-black uppercase leading-tight tracking-[0.08em] text-foreground ${compact ? "text-[0.62rem]" : "text-[0.7rem]"}`}>
          {subtitle}
        </p>
        {children ?? (isCore ? <ProjectSceneMotif kind={kind ?? "system"} /> : <SceneTelemetryLines />)}
      </div>
    </div>
  );
}

function SceneTelemetryLines() {
  return (
    <div className="mx-auto grid w-full max-w-[128px] gap-1.5">
      {[1, 0.66, 0.84].map((width, item) => (
        <span
          key={item}
          className="project-line-scan h-1.5 bg-primary/25 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.18}s`, width: `${width * 100}%` }}
        />
      ))}
    </div>
  );
}

function DiffRows({ resolved = false }: { resolved?: boolean }) {
  return (
    <div className="mx-auto grid w-full max-w-[128px] gap-1.5">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className={`project-line-scan h-2 rounded-full motion-reduce:animate-none ${resolved ? "bg-primary/35" : "bg-destructive/30"}`}
          style={{ animationDelay: `${item * 0.16}s` }}
        />
      ))}
    </div>
  );
}

function EventDots() {
  return (
    <div className="mx-auto grid max-w-[112px] grid-cols-4 gap-2">
      {Array.from({ length: 8 }, (_, item) => (
        <span
          key={item}
          className="project-dot-chase size-3 rounded-full bg-primary/35 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.08}s` }}
        />
      ))}
    </div>
  );
}

function LedgerLines() {
  return (
    <div className="mx-auto grid w-full max-w-[128px] gap-1.5">
      {[1, 0.7, 0.9].map((width, item) => (
        <span
          key={item}
          className="project-line-scan h-2 rounded-full bg-primary/25 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.16}s`, width: `${width * 100}%` }}
        />
      ))}
    </div>
  );
}

function BarStack() {
  return (
    <div className="mx-auto flex h-16 items-end justify-center gap-2">
      {[38, 58, 76, 96].map((height, item) => (
        <span
          key={height}
          className="project-bar-rise w-5 rounded-t-lg bg-primary/30 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.14}s`, height }}
        />
      ))}
    </div>
  );
}

function QueueRows() {
  return (
    <div className="mx-auto grid w-full max-w-[132px] gap-1.5">
      {[0, 1, 2, 3].map((item) => (
        <span
          key={item}
          className="project-queue-shift h-3 rounded-full border border-primary/35 bg-primary/15 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.12}s` }}
        />
      ))}
    </div>
  );
}

function WorkerGrid() {
  return (
    <div className="mx-auto grid max-w-[112px] grid-cols-2 gap-2">
      {[0, 1, 2, 3].map((item) => (
        <span
          key={item}
          className="project-worker-tick aspect-video rounded-lg border border-primary/35 bg-primary/15 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.12}s` }}
        />
      ))}
    </div>
  );
}

function ProjectSceneMotif({ kind }: { kind: string }) {
  if (kind === "charging") {
    return (
      <div className="mx-auto grid size-16 animate-pulse place-items-center rounded-full border-8 border-primary/55 bg-primary/10 shadow-[0_0_24px_color-mix(in_oklch,var(--primary)_35%,transparent)] motion-reduce:animate-none">
        <span className="size-7 rounded-full bg-background/80" />
      </div>
    );
  }

  if (kind === "telecom") {
    return (
      <div className="mx-auto grid w-full max-w-[132px] grid-cols-3 gap-1.5">
        {["BSS", "OSS", "BILL"].map((item) => (
          <span key={item} className="grid min-h-8 place-items-center rounded-lg border border-primary/35 bg-primary/12 font-mono text-[0.52rem] font-black text-foreground">
            {item}
          </span>
        ))}
      </div>
    );
  }

  if (kind === "billing") {
    return (
      <div className="mx-auto flex h-16 w-full max-w-[112px] items-end justify-center gap-2">
        {[42, 68, 92].map((height, item) => (
          <span
            key={height}
            className="project-bar-rise w-6 rounded-t-lg bg-primary/30 shadow-[0_0_14px_color-mix(in_oklch,var(--primary)_25%,transparent)] motion-reduce:animate-none"
            style={{ animationDelay: `${item * 0.18}s`, height }}
          />
        ))}
      </div>
    );
  }

  if (kind === "ordering") {
    return (
      <div className="mx-auto grid w-full max-w-[128px] gap-1.5">
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className="project-queue-shift h-3 rounded-full border border-primary/30 bg-primary/15 motion-reduce:animate-none"
            style={{ animationDelay: `${item * 0.12}s` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "media") {
    return (
      <div className="mx-auto grid w-full max-w-[104px] grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((item) => (
          <span
            key={item}
            className="project-worker-tick aspect-video rounded-lg border border-primary/35 bg-primary/15 motion-reduce:animate-none"
            style={{ animationDelay: `${item * 0.12}s` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "pipeline") {
    return (
      <div className="mx-auto grid w-full max-w-[116px] gap-1.5">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="project-line-scan h-5 rounded-[50%] border border-primary/35 bg-primary/15 motion-reduce:animate-none"
            style={{ animationDelay: `${item * 0.18}s` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "monetization") {
    return (
      <div className="mx-auto grid h-16 w-24 place-items-center rounded-t-full border border-primary/45 bg-primary/15">
        <span className="project-gauge-sweep h-1.5 w-12 origin-left rounded-full bg-primary shadow-[0_0_14px_color-mix(in_oklch,var(--primary)_45%,transparent)] motion-reduce:rotate-[24deg] motion-reduce:animate-none" />
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-[120px] grid-cols-3 gap-1.5">
      {[0, 1, 2].map((item) => (
        <span
          key={item}
          className="project-worker-tick aspect-square rounded-lg border border-primary/35 bg-primary/15 motion-reduce:animate-none"
          style={{ animationDelay: `${item * 0.14}s` }}
        />
      ))}
    </div>
  );
}

export default function ProjectsSection() {
  const [activeProjectTitle, setActiveProjectTitle] = useState(resume.projects[0]?.title ?? "");
  const [openExperienceKey, setOpenExperienceKey] = useState(
    resume.experience[0] ? getExperienceKey(resume.experience[0]) : ""
  );
  const activeProject = useMemo(
    () => resume.projects.find((project) => project.title === activeProjectTitle) ?? resume.projects[0],
    [activeProjectTitle]
  );
  const projectGroups = resume.experience.map((experience) => ({
    experience,
    projects: getProjectsForExperience(experience.role),
  }));

  return (
    <section id="work" className="scroll-mt-24 space-y-10">
      <header className="grid gap-4 border-b border-border/70 pb-7 md:grid-cols-[minmax(12rem,0.38fr)_minmax(0,1fr)]">
        <div>
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">work</p>
          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.045em] text-foreground">Project reel.</h2>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.36fr)_minmax(0,1fr)] lg:items-start">
        <aside className="min-w-0 lg:sticky lg:top-24">
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">case index</p>
          <div className="mt-4 space-y-6">
            {projectGroups.map(({ experience, projects }) => {
              const groupKey = getExperienceKey(experience);
              const groupOpen = openExperienceKey === groupKey;

              return (
                <section key={groupKey} className="border-t border-border/70 pt-4">
                  <button
                    type="button"
                    aria-expanded={groupOpen}
                    className="grid w-full min-w-0 gap-1 text-left transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    onClick={() => setOpenExperienceKey(groupOpen ? "" : groupKey)}
                  >
                    <span className="flex flex-wrap items-baseline justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground">{experience.role}</span>
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">{experience.period}</span>
                    </span>
                    <span className="flex min-w-0 items-center justify-between gap-3 text-sm leading-6 text-muted-foreground">
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{experience.company}</span>
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-primary">
                        {groupOpen ? "collapse" : "expand"}
                      </span>
                    </span>
                  </button>
                  {groupOpen ? (
                    <div className="mt-3 grid gap-1">
                      {projects.map((project) => {
                        const active = activeProject.title === project.title;

                        return (
                          <button
                            key={project.title}
                            type="button"
                            aria-pressed={active}
                            className={`group min-w-0 px-0 py-2 text-left transition focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none ${
                              active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => {
                              setActiveProjectTitle(project.title);
                              setOpenExperienceKey(groupKey);
                            }}
                          >
                            <span className="flex min-w-0 items-start gap-3">
                              <span className={`mt-2 h-px w-5 shrink-0 transition ${active ? "bg-primary" : "bg-border group-hover:bg-primary/70"}`} aria-hidden="true" />
                              <span className="min-w-0">
                                <span className="block break-words text-sm font-medium [overflow-wrap:anywhere]">{project.title}</span>
                                <span className="mt-1 block font-mono text-[0.58rem] uppercase tracking-[0.14em] text-primary">{project.category}</span>
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        </aside>

        <article className="min-w-0">
          <ProjectVisual project={activeProject} />

          <div className="mt-7">
            <div className="min-w-0">
              <h3 className="break-words text-3xl font-semibold tracking-[-0.045em] text-foreground [overflow-wrap:anywhere]">
                {activeProject.title}
              </h3>
              <p className="mt-4 max-w-3xl text-base font-medium leading-8 text-foreground">{activeProject.impact}</p>

              <details className="mt-6 border-t border-border/70 pt-4">
                <summary className="cursor-pointer font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary marker:text-muted-foreground">
                  Open project note
                </summary>
                <div className="mt-5 space-y-5">
                  <p className="text-sm leading-7 text-muted-foreground">{activeProject.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span key={tag} className="inline-flex shrink-0 items-center gap-1.5 bg-muted/55 px-3 py-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground dark:bg-accent/20">
                        <TechnologyIcon name={tag} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
