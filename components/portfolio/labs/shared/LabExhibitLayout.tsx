import { type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MetricGrid from "./MetricGrid";
import type { LabMetric } from "../types";

type LabExhibitLayoutProps = {
  id: string;
  badge: ReactNode;
  title: ReactNode;
  description: ReactNode;
  selector: ReactNode;
  exhibitTitle: ReactNode;
  exhibitDescription: ReactNode;
  scene: ReactNode;
  controls: ReactNode;
  stepPanel: ReactNode;
  signals?: readonly LabMetric[];
  signalsDescription?: ReactNode;
  proof: ReactNode;
  proofDetail?: ReactNode;
  gridClassName?: string;
  sidebar?: ReactNode;
};

export default function LabExhibitLayout({
  id,
  badge,
  title,
  description,
  selector,
  exhibitTitle,
  exhibitDescription,
  scene,
  controls,
  stepPanel,
  signals,
  signalsDescription = "Static characteristics of the selected scenario.",
  proof,
  proofDetail,
  gridClassName = "xl:grid-cols-[1.35fr_0.85fr]",
  sidebar,
}: LabExhibitLayoutProps) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/85 p-4 text-foreground shadow-inner shadow-slate-900/10 dark:bg-background/80 dark:shadow-slate-950/40"
    >
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative min-w-0 space-y-4">
        <div className="grid min-w-0 gap-4 rounded-[1.35rem] border border-border/70 bg-background/65 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.55fr)] lg:items-start dark:bg-card/35">
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-primary/30 bg-primary/10 font-mono text-primary">{badge}</Badge>
              <span className="max-w-full break-words rounded-full border border-border/70 bg-secondary/60 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] [overflow-wrap:anywhere]">
                module:{id}
              </span>
            </div>
            <div className="min-w-0 font-mono">
              <p className="break-words text-xs text-primary/75 [overflow-wrap:anywhere]">lab@runtime:~$ inspect --module={id}</p>
              <h2 className="mt-1 break-words text-2xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] sm:text-3xl">
                {title}
              </h2>
            </div>
            <p className="max-w-3xl break-words text-sm leading-6 text-muted-foreground">{description}</p>
          </div>

          <div className="min-w-0 rounded-2xl border border-border/70 bg-card/70 p-3 dark:bg-background/45">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 font-mono">
              <span className="break-words text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">scenario.input</span>
              <span className="text-[0.65rem] uppercase tracking-[0.22em] text-primary">ready</span>
            </div>
            <div className="mt-3 flex min-w-0 flex-wrap gap-2">{selector}</div>
          </div>
        </div>

        <div className={`grid min-w-0 gap-4 ${gridClassName}`}>
          <Card className="min-w-0 overflow-hidden border-border/70 bg-card/80 p-4 text-foreground shadow-xl shadow-slate-900/5 dark:bg-background/65 dark:shadow-slate-950/25">
            <CardHeader className="rounded-2xl border border-border/70 bg-background/65 p-4 dark:bg-card/40">
              <div className="mb-2 flex min-w-0 flex-wrap items-center justify-between gap-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="break-words">active.scene</span>
                <span className="text-primary">streaming</span>
              </div>
              <CardTitle className="text-2xl text-foreground">{exhibitTitle}</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-muted-foreground">{exhibitDescription}</CardDescription>
            </CardHeader>
            <CardContent className="min-w-0">
              <div className="lab-scene-stage">
                <div className="lab-scene-visual">
                  <div className="lab-scene-node">{scene}</div>
                </div>
                <div className="lab-scene-control-item">{controls}</div>
              </div>
            </CardContent>
          </Card>

          <div className="min-w-0 space-y-4">
            <div className="min-w-0">{stepPanel}</div>

            {sidebar ??
              (signals ? (
                <Card className="min-w-0 border-border/70 bg-card/80 p-4 text-foreground shadow-xl shadow-slate-900/5 dark:bg-background/65 dark:shadow-slate-950/20">
                  <CardHeader className="rounded-2xl border border-border/70 bg-background/65 p-4 dark:bg-card/40">
                    <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary">
                      telemetry.signals
                    </div>
                    <CardTitle className="text-foreground">Scenario Signals</CardTitle>
                    <CardDescription className="text-muted-foreground">{signalsDescription}</CardDescription>
                  </CardHeader>
                  <CardContent className="min-w-0">
                    <MetricGrid metrics={signals} />
                  </CardContent>
                </Card>
              ) : null)}

            <Card className="min-w-0 border-border/70 bg-card/80 p-4 text-foreground shadow-xl shadow-slate-900/5 dark:bg-background/65 dark:shadow-slate-950/20">
              <CardHeader className="rounded-2xl border border-border/70 bg-background/65 p-4 dark:bg-card/40">
                <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary">
                  assertion.output
                </div>
                <CardTitle className="text-foreground">What this proves</CardTitle>
                <CardDescription className="text-muted-foreground">{proof}</CardDescription>
              </CardHeader>
              {proofDetail ? <CardContent className="min-w-0 break-words">{proofDetail}</CardContent> : null}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
