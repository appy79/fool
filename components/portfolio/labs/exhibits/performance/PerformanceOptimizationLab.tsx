"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { performanceProfiles } from "./data";
import MetricGrid from "../../MetricGrid";

export default function PerformanceOptimizationLab() {
  const [profileId, setProfileId] = useState<string>(performanceProfiles[0].id);
  const [activeStage, setActiveStage] = useState(0);
  const [runs, setRuns] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const profile = performanceProfiles.find((item) => item.id === profileId) ?? performanceProfiles[0];

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setActiveStage((current) => {
        if (current >= profile.stages.length - 1) {
          setIsRunning(false);
          setRuns((count) => count + 1);
          return current;
        }

        return current + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isRunning, profile.stages.length]);

  const selectProfile = (nextProfileId: string) => {
    setProfileId(nextProfileId);
    setActiveStage(0);
    setRuns(0);
    setIsRunning(false);
  };

  const start = () => {
    setActiveStage(0);
    setIsRunning(true);
  };

  return (
    <section id="performance-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>Performance Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Optimization bench.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Animate the difference between brute force, indexes, parallel work, and cache fast paths.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {performanceProfiles.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={item.id === profile.id ? "secondary" : "outline"}
              onClick={() => selectProfile(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="overflow-hidden p-6">
          <CardHeader>
            <CardTitle className="text-2xl">{profile.name}</CardTitle>
            <CardDescription className="mt-2 text-base">{profile.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 p-5">
              <div className="grid gap-4 md:grid-cols-5">
                {profile.stages.map((stage, index) => {
                  const active = index === activeStage;
                  const completed = index < activeStage;

                  return (
                    <div
                      key={stage}
                      className={`relative min-h-36 rounded-3xl border p-4 transition ${
                        active
                          ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-xl shadow-cyan-500/20"
                          : completed
                            ? "border-emerald-300/40 bg-emerald-300/10 text-slate-100"
                            : "border-slate-700 bg-slate-900 text-slate-300"
                      }`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                        Stage {index + 1}
                      </span>
                      <p className="mt-4 text-lg font-semibold">{stage}</p>
                      {active ? (
                        <span className="absolute right-4 top-4 h-3 w-3 animate-ping rounded-full bg-white" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {["Latency cost", "Memory pressure", "Throughput"].map((label, index) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span>{label}</span>
                      <span>{profile.bars[index]}%</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${index === 0 ? "bg-rose-400" : index === 1 ? "bg-amber-300" : "bg-emerald-300"}`}
                        style={{ width: `${profile.bars[index]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={start}>{isRunning ? "Benchmark running..." : profile.trigger}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveStage(0);
                  setIsRunning(false);
                }}
              >
                Reset Bench
              </Button>
            </div>
            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live Caption</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {profile.stages[activeStage]} {runs > 0 && !isRunning ? "completed." : "is active."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>
                Optimization is a tradeoff between asymptotic cost, memory pressure, contention, data locality,
                and operational complexity.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Bench Output</CardTitle>
              <CardDescription>Metrics shift with each optimization strategy.</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricGrid metrics={profile.metrics} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
