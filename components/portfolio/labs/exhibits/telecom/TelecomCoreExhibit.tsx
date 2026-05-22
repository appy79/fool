"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { telecomScenarios, telecomStagePositions, telecomStages } from "./data";

export default function TelecomCoreExhibit() {
  const [scenarioId, setScenarioId] = useState(telecomScenarios[0].id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [eventsProcessed, setEventsProcessed] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const scenario = telecomScenarios.find((item) => item.id === scenarioId) ?? telecomScenarios[0];
  const activeStageId = scenario.route[activeIndex] ?? scenario.route[0];
  const activeStage = telecomStages.find((stage) => stage.id === activeStageId) ?? telecomStages[0];
  const activePosition = telecomStagePositions[activeStage.id];
  const routeProgress = Math.round(((activeIndex + 1) / scenario.route.length) * 100);
  const routeSet = new Set(scenario.route);
  const isComplete = activeIndex === scenario.route.length - 1 && !isSimulating && eventsProcessed > 0;

  useEffect(() => {
    if (!isSimulating) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        if (current >= scenario.route.length - 1) {
          setIsSimulating(false);
          return current;
        }

        setEventsProcessed((count) => count + 1);
        return current + 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isSimulating, scenario.route.length]);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setActiveIndex(0);
    setIsSimulating(false);
    setEventsProcessed(0);
  };

  const startSimulation = () => {
    setActiveIndex(0);
    setEventsProcessed((count) => count + 1);
    setIsSimulating(true);
  };

  const resetFlow = () => {
    setIsSimulating(false);
    setActiveIndex(0);
  };

  return (
    <section id="telecom-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>Foundations Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            3GPP Telecom Core Simulator.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Start a subscriber event and watch the packet move through access, core, policy, charging,
            event streaming, microservices, persistence, and billing without stepping through prompts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {telecomScenarios.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={item.id === scenario.id ? "secondary" : "outline"}
              onClick={() => selectScenario(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="overflow-hidden p-6">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{scenario.name}</CardTitle>
                <CardDescription className="mt-2 text-base">{scenario.summary}</CardDescription>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/70 px-4 py-3 text-sm">
                <p className="font-semibold text-foreground">{scenario.subscriber}</p>
                <p className="text-muted-foreground">Progress: {routeProgress}% / Events: {eventsProcessed}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 p-3 shadow-inner shadow-cyan-950/40">
              <svg
                aria-label="Animated telecom core route"
                className="min-h-[360px] w-full"
                role="img"
                viewBox="0 0 1000 430"
              >
                <defs>
                  <filter id="telecom-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="telecom-route" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="55%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>

                <rect width="1000" height="430" rx="34" fill="#020617" />
                <circle cx="180" cy="96" r="160" fill="#0e7490" opacity="0.08" />
                <circle cx="760" cy="310" r="190" fill="#4f46e5" opacity="0.08" />

                {scenario.route.slice(0, -1).map((fromStageId, index) => {
                  const toStageId = scenario.route[index + 1];
                  const from = telecomStagePositions[fromStageId];
                  const to = telecomStagePositions[toStageId];
                  const completed = index < activeIndex;
                  const current = index === activeIndex - 1;

                  return (
                    <g key={`${fromStageId}-${toStageId}`}>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={completed ? "url(#telecom-route)" : "#1e293b"}
                        strokeLinecap="round"
                        strokeWidth={completed ? 8 : 4}
                        opacity={completed ? 0.95 : 0.75}
                      />
                      {current ? (
                        <line
                          className="animate-pulse"
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="#e0f2fe"
                          strokeDasharray="12 18"
                          strokeLinecap="round"
                          strokeWidth="3"
                          opacity="0.8"
                        />
                      ) : null}
                    </g>
                  );
                })}

                {telecomStages.map((stage) => {
                  const position = telecomStagePositions[stage.id];
                  const routeIndex = scenario.route.indexOf(stage.id);
                  const inRoute = routeSet.has(stage.id);
                  const completed = inRoute && routeIndex < activeIndex;
                  const active = stage.id === activeStage.id;

                  return (
                    <g
                      key={stage.id}
                      className={inRoute ? "cursor-pointer" : "opacity-35"}
                      onClick={() => {
                        if (inRoute) {
                          setActiveIndex(routeIndex);
                          setIsSimulating(false);
                        }
                      }}
                    >
                      {active ? (
                        <circle
                          className="animate-ping"
                          cx={position.x}
                          cy={position.y}
                          fill="#22d3ee"
                          opacity="0.24"
                          r="54"
                        />
                      ) : null}
                      <circle
                        cx={position.x}
                        cy={position.y}
                        fill={active ? "#22d3ee" : completed ? "#0f766e" : "#0f172a"}
                        filter={active || completed ? "url(#telecom-glow)" : undefined}
                        r={active ? 40 : 34}
                        stroke={active ? "#e0f2fe" : inRoute ? "#38bdf8" : "#334155"}
                        strokeWidth={active ? 4 : 2}
                      />
                      <text
                        fill={active ? "#020617" : "#e2e8f0"}
                        fontSize="14"
                        fontWeight="700"
                        textAnchor="middle"
                        x={position.x}
                        y={position.y + 5}
                      >
                        {stage.label}
                      </text>
                      <text
                        fill="#94a3b8"
                        fontSize="11"
                        textAnchor="middle"
                        x={position.x}
                        y={position.y + 56}
                      >
                        {stage.signal}
                      </text>
                    </g>
                  );
                })}

                {["kafka", "services", "store"].includes(activeStage.id) ? (
                  <g opacity="0.9">
                    {[0, 1, 2, 3].map((offset) => (
                      <circle
                        key={offset}
                        className="animate-pulse"
                        cx={activePosition.x + 52 + offset * 18}
                        cy={activePosition.y - 28 + (offset % 2) * 18}
                        fill="#67e8f9"
                        r={4 + offset}
                      />
                    ))}
                  </g>
                ) : null}

                <circle
                  cx={activePosition.x}
                  cy={activePosition.y}
                  fill="#ffffff"
                  filter="url(#telecom-glow)"
                  r="10"
                  style={{ transition: "cx 700ms ease, cy 700ms ease" }}
                />
                <circle
                  cx={activePosition.x}
                  cy={activePosition.y}
                  fill="none"
                  r="18"
                  stroke="#ffffff"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  style={{ transition: "cx 700ms ease, cy 700ms ease" }}
                />
              </svg>
            </div>

            <div className="overflow-hidden rounded-full border border-border/70 bg-secondary/40">
              <div
                className="h-3 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${routeProgress}%` }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={startSimulation}>
                {isSimulating ? "Flow running..." : isComplete ? "Replay animated flow" : scenario.trigger}
              </Button>
              <Button onClick={resetFlow} variant="outline">
                Reset Flow
              </Button>
            </div>

            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Live Caption
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">{activeStage.label}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isComplete ? "Billing outcome received. The subscriber event completed the production path." : activeStage.description}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Production Context</CardTitle>
              <CardDescription>{scenario.projectNote}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border border-border/70 bg-card/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Mapped Project
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{scenario.project}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Live Metrics</CardTitle>
              <CardDescription>Scenario-specific outcomes from the resume mapped into the flow.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {scenario.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-3xl border border-border/70 bg-secondary/45 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
