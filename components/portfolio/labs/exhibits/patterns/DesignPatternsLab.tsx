"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { designPatternScenarios } from "./data";
import MetricGrid from "../../MetricGrid";

export default function DesignPatternsLab() {
  const [patternId, setPatternId] = useState<string>(designPatternScenarios[0].id);
  const [activePart, setActivePart] = useState(0);
  const [runs, setRuns] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const pattern = designPatternScenarios.find((item) => item.id === patternId) ?? designPatternScenarios[0];
  const positions = [
    { x: 110, y: 205 },
    { x: 330, y: 115 },
    { x: 555, y: 205 },
    { x: 780, y: 205 },
  ];
  const activePosition = positions[activePart] ?? positions[0];

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setActivePart((current) => {
        if (current >= pattern.parts.length - 1) {
          setIsRunning(false);
          setRuns((count) => count + 1);
          return current;
        }

        return current + 1;
      });
    }, 780);

    return () => clearInterval(interval);
  }, [isRunning, pattern.parts.length]);

  const selectPattern = (nextPatternId: string) => {
    setPatternId(nextPatternId);
    setActivePart(0);
    setRuns(0);
    setIsRunning(false);
  };

  const start = () => {
    setActivePart(0);
    setIsRunning(true);
  };

  return (
    <section id="patterns-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>Architecture Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Design patterns machine.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Watch a software problem pass through a pattern and emerge with clearer boundaries, safer dependencies,
            or more flexible behavior.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {designPatternScenarios.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={item.id === pattern.id ? "secondary" : "outline"}
              onClick={() => selectPattern(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="overflow-hidden p-6">
          <CardHeader>
            <CardTitle className="text-2xl">{pattern.name}</CardTitle>
            <CardDescription className="mt-2 text-base">{pattern.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 p-4">
              <svg className="min-h-[340px] w-full" viewBox="0 0 900 380" role="img" aria-label="Design pattern machine animation">
                <defs>
                  <filter id="pattern-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="900" height="380" rx="30" fill="#020617" />
                <circle cx="450" cy="190" r="170" fill="#0f766e" opacity="0.08" />
                {positions.slice(0, -1).map((position, index) => {
                  const next = positions[index + 1];
                  const completed = index < activePart;

                  return (
                    <line
                      key={`${position.x}-${next.x}`}
                      x1={position.x}
                      y1={position.y}
                      x2={next.x}
                      y2={next.y}
                      stroke={completed ? "#67e8f9" : "#1e293b"}
                      strokeDasharray={completed ? "12 10" : undefined}
                      strokeLinecap="round"
                      strokeWidth={completed ? 8 : 4}
                    />
                  );
                })}
                {pattern.parts.map((part, index) => {
                  const position = positions[index];
                  const active = index === activePart;
                  const completed = index < activePart;

                  return (
                    <g key={part}>
                      {active ? <circle className="animate-ping" cx={position.x} cy={position.y} r="58" fill="#2dd4bf" opacity="0.2" /> : null}
                      <rect
                        x={position.x - 72}
                        y={position.y - 42}
                        width="144"
                        height="84"
                        rx="22"
                        fill={active ? "#2dd4bf" : completed ? "#0f766e" : "#0f172a"}
                        filter={active || completed ? "url(#pattern-glow)" : undefined}
                        stroke={active ? "#ccfbf1" : "#14b8a6"}
                        strokeWidth="3"
                      />
                      <text fill={active ? "#042f2e" : "#e2e8f0"} fontSize="14" fontWeight="800" textAnchor="middle" x={position.x} y={position.y + 5}>
                        {part}
                      </text>
                    </g>
                  );
                })}
                <circle className="animate-pulse" cx={activePosition.x} cy={activePosition.y} r="10" fill="#ffffff" filter="url(#pattern-glow)" />
              </svg>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={start}>{isRunning ? "Pattern applying..." : pattern.trigger}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActivePart(0);
                  setIsRunning(false);
                }}
              >
                Reset Machine
              </Button>
            </div>
            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live Caption</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {runs > 0 && !isRunning ? `${pattern.name} reshaped the dependency path.` : `${pattern.parts[activePart]} is active.`}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>
                Patterns are useful when they make a system easier to change, isolate risk, or express a stable boundary.
                The goal is tradeoff-aware design, not pattern collecting.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Pattern Signals</CardTitle>
              <CardDescription>Problem, benefit, and tradeoff for the active pattern.</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricGrid metrics={pattern.metrics} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
