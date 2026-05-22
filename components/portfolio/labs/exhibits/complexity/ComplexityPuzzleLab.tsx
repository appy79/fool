"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { complexityScenarios } from "./data";
import MetricGrid from "../../MetricGrid";

export default function ComplexityPuzzleLab() {
  const [scenarioId, setScenarioId] = useState<string>(complexityScenarios[0].id);
  const [activeDepth, setActiveDepth] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [runs, setRuns] = useState(0);
  const scenario = complexityScenarios.find((item) => item.id === scenarioId) ?? complexityScenarios[0];
  const animationSteps = 4;
  const isRouteSearch = scenario.id === "tsp";
  const choiceRows = isRouteSearch
    ? [
        { label: "choice 1", value: "pick next city", detail: "C costs 4" },
        { label: "choice 2", value: "extend route", detail: "D costs 5" },
        { label: "choice 3", value: "close tour", detail: "B costs 3" },
      ]
    : [
        { label: "choice 1", value: "assign x1", detail: "x1=true" },
        { label: "choice 2", value: "assign x2", detail: "x2=true" },
        { label: "choice 3", value: "assign x3", detail: "x3=true" },
      ];
  const benefitChecks = isRouteSearch
    ? [
        { label: "A-C", value: "+4", activeAt: 1 },
        { label: "C-D", value: "+5", activeAt: 2 },
        { label: "D-B", value: "+3", activeAt: 3 },
      ]
    : [
        { label: "clause 1", value: "pass", activeAt: 1 },
        { label: "clause 2", value: "pass", activeAt: 2 },
        { label: "clause 3", value: "pass", activeAt: 3 },
      ];
  const searchNodes = [
    { id: "root", parent: "", depth: 0, x: 450, y: 70, label: isRouteSearch ? "start A" : "formula", result: "start" },
    { id: "reject-1", parent: "root", depth: 1, x: 285, y: 145, label: isRouteSearch ? "B +12" : "x1=false", result: "reject" },
    { id: "keep-1", parent: "root", depth: 1, x: 615, y: 145, label: isRouteSearch ? "C +4" : "x1=true", result: "keep" },
    { id: "reject-2", parent: "keep-1", depth: 2, x: 510, y: 225, label: isRouteSearch ? "B +8" : "x2=false", result: "reject" },
    { id: "keep-2", parent: "keep-1", depth: 2, x: 720, y: 225, label: isRouteSearch ? "D +5" : "x2=true", result: "keep" },
    { id: "reject-3", parent: "keep-2", depth: 3, x: 650, y: 305, label: isRouteSearch ? "A loop" : "x3=false", result: "reject" },
    { id: "keep-3", parent: "keep-2", depth: 3, x: 790, y: 305, label: isRouteSearch ? "B +3" : "x3=true", result: "success" },
  ];
  const routeCaptions = [
    "Route search makes the same kind of branching choices, but each choice adds travel cost.",
    "Higher-cost route choices fade while the cheaper partial tour stays active.",
    "The benefit is that one proposed tour can be scored by summing a few edges.",
    "Search is expensive because many tours compete; checking one route is cheap.",
  ];
  const constraintCaptions = [
    "Constraint search makes the same kind of branching choices, but each choice assigns a variable.",
    "Assignments that violate clauses fade while a consistent witness stays active.",
    "The benefit is that one witness can be checked against clauses quickly.",
    "Search is expensive because many assignments compete; checking one witness is cheap.",
  ];
  const activeCaption = isRouteSearch ? routeCaptions[activeDepth] : constraintCaptions[activeDepth];

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setActiveDepth((current) => {
        if (current >= animationSteps - 1) {
          setIsRunning(false);
          setRuns((count) => count + 1);
          return current;
        }

        return current + 1;
      });
    }, 760);

    return () => clearInterval(interval);
  }, [isRunning, animationSteps]);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setActiveDepth(0);
    setRuns(0);
    setIsRunning(false);
  };

  const start = () => {
    setActiveDepth(0);
    setIsRunning(true);
  };

  return (
    <section id="complexity-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>Complexity Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            P vs NP puzzle chamber.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Watch the difference between checking one candidate solution and searching through an exploding state space.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {complexityScenarios.map((item) => (
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
            <CardTitle className="text-2xl">{scenario.name}</CardTitle>
            <CardDescription className="mt-2 text-base">{scenario.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 p-4">
              <svg className="min-h-[370px] w-full" viewBox="0 0 900 420" role="img" aria-label={isRouteSearch ? "Route search graph animation" : "Constraint assignment search tree animation"}>
                <defs>
                  <filter id="complexity-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="900" height="420" rx="30" fill="#020617" />
                <circle cx="450" cy="210" r="190" fill="#7c3aed" opacity="0.08" />

                <text fill="#e0f2fe" fontSize="15" fontWeight="900" x="42" y="48">
                  {isRouteSearch ? "Route choices" : "Constraint choices"}
                </text>
                <text fill="#94a3b8" fontSize="12" fontWeight="700" x="42" y="70">
                  Same search shape; the choices carry different meaning and benefits.
                </text>
                {choiceRows.map((choice, index) => {
                  const active = activeDepth === index + 1;
                  const complete = activeDepth > index + 1;

                  return (
                    <g key={choice.label}>
                      <rect
                        x="42"
                        y={102 + index * 70}
                        width="250"
                        height="52"
                        rx="16"
                        fill={active || complete ? "#312e81" : "#0f172a"}
                        stroke={active || complete ? "#a5b4fc" : "#334155"}
                        strokeWidth={active ? 2.5 : 1.5}
                        opacity={complete ? 0.72 : 1}
                      />
                      <text fill="#94a3b8" fontSize="11" fontWeight="800" x="62" y={124 + index * 70}>
                        {choice.label.toUpperCase()}
                      </text>
                      <text fill="#f8fafc" fontSize="14" fontWeight="900" x="62" y={143 + index * 70}>
                        {choice.value}
                      </text>
                      <text fill={isRouteSearch ? "#67e8f9" : "#bbf7d0"} fontSize="12" fontWeight="900" textAnchor="end" x="272" y={143 + index * 70}>
                        {choice.detail}
                      </text>
                    </g>
                  );
                })}
                <g opacity={activeDepth >= 3 ? 1 : 0.45}>
                  <rect x="42" y="324" width="250" height="46" rx="16" fill="#111827" stroke="#475569" />
                  <text fill="#f8fafc" fontSize="14" fontWeight="900" x="64" y="353">
                    {isRouteSearch ? "benefit: score one tour fast" : "benefit: verify clauses fast"}
                  </text>
                </g>

                <text fill="#e0f2fe" fontSize="15" fontWeight="900" x="350" y="48">
                  Shared branching search
                </text>
                {searchNodes.map((node) => {
                  if (!node.parent) {
                    return null;
                  }

                  const parent = searchNodes.find((item) => item.id === node.parent)!;
                  const visible = node.depth <= activeDepth;
                  const rejected = node.result === "reject" && visible;
                  const kept = (node.result === "keep" || node.result === "success") && visible;

                  return (
                    <line
                      key={`${node.id}-edge`}
                      x1={parent.x}
                      y1={parent.y + 18}
                      x2={node.x}
                      y2={node.y - 18}
                      stroke={rejected ? "#ef4444" : kept ? "#67e8f9" : "#334155"}
                      strokeDasharray={rejected ? "8 8" : undefined}
                      strokeLinecap="round"
                      strokeWidth={kept ? 4 : 2}
                      opacity={visible ? (rejected ? 0.45 : 1) : 0.16}
                    />
                  );
                })}
                {searchNodes.map((node) => {
                  const visible = node.depth <= activeDepth;
                  const rejected = node.result === "reject" && visible;
                  const success = node.result === "success" && visible;
                  const kept = (node.result === "keep" || node.result === "success") && visible;

                  return (
                    <g key={node.id} opacity={visible ? (rejected ? 0.56 : 1) : 0.2}>
                      <rect
                        className={success ? "animate-pulse" : undefined}
                        x={node.x - 48}
                        y={node.y - 18}
                        width="96"
                        height="36"
                        rx="12"
                        fill={success ? "#22d3ee" : rejected ? "#7f1d1d" : kept ? "#312e81" : "#0f172a"}
                        filter={success ? "url(#complexity-glow)" : undefined}
                        stroke={success ? "#e0f2fe" : rejected ? "#fca5a5" : kept ? "#a5b4fc" : "#334155"}
                        strokeWidth={success || kept ? 2.5 : 1.5}
                      />
                      <text fill={success ? "#020617" : "#e2e8f0"} fontSize="12" fontWeight="900" textAnchor="middle" x={node.x} y={node.y + 4}>
                        {node.label}
                      </text>
                      {rejected ? (
                        <text fill="#fecaca" fontSize="11" fontWeight="900" textAnchor="middle" x={node.x} y={node.y + 34}>
                          {isRouteSearch ? "costly" : "prune"}
                        </text>
                      ) : null}
                    </g>
                  );
                })}

                <g>
                  <rect x="352" y="338" width="500" height="38" rx="16" fill="#0f172a" stroke="#334155" />
                  <text fill="#94a3b8" fontSize="12" fontWeight="800" x="374" y="362">
                    {isRouteSearch ? "cost check" : "clause check"}
                  </text>
                  {benefitChecks.map((check, index) => {
                    const active = activeDepth >= check.activeAt;

                    return (
                      <g key={check.label} opacity={active ? 1 : 0.32}>
                        <rect
                          x={480 + index * 112}
                          y="346"
                          width="92"
                          height="20"
                          rx="8"
                          fill={active ? (isRouteSearch ? "#164e63" : "#14532d") : "#111827"}
                          stroke={active ? (isRouteSearch ? "#67e8f9" : "#86efac") : "#334155"}
                        />
                        <text fill="#e2e8f0" fontSize="10" fontWeight="900" textAnchor="middle" x={526 + index * 112} y="360">
                          {check.label} {check.value}
                        </text>
                      </g>
                    );
                  })}
                </g>
                <text fill="#e0f2fe" fontSize="15" fontWeight="800" textAnchor="middle" x="450" y="400">
                  {isRouteSearch
                    ? "The path is chosen by route cost; the benefit is quick scoring of one tour."
                    : "The path is chosen by valid assignments; the benefit is quick witness verification."}
                </text>
              </svg>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={start}>{isRunning ? "Search expanding..." : scenario.trigger}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveDepth(0);
                  setIsRunning(false);
                }}
              >
                Reset Search
              </Button>
            </div>
            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live Caption</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {runs > 0 && !isRunning
                  ? isRouteSearch
                    ? `${scenario.searchNodes} possible tours visualized. Scoring one tour is small; finding the best tour is the hard part.`
                    : `${scenario.searchNodes} assignment branches visualized. Checking one assignment is small; finding it is the hard part.`
                  : activeCaption}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>
                Good engineers do not only implement algorithms. They recognize when brute force is structurally doomed
                and when verification is easier than discovery.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Complexity Signals</CardTitle>
              <CardDescription>The active puzzle maps to computational limits and search growth.</CardDescription>
            </CardHeader>
            <CardContent>
              <MetricGrid metrics={scenario.metrics} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
