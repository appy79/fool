"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { distributedNodePositions, distributedScenarios } from "./data";
import MetricGrid from "../../MetricGrid";

export default function DistributedSystemsLab() {
  const [scenarioId, setScenarioId] = useState<string>(distributedScenarios[0].id);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const scenario = distributedScenarios.find((item) => item.id === scenarioId) ?? distributedScenarios[0];
  const activePhase = scenario.phases[phaseIndex];
  const activeEdgeIndex = phaseIndex % 4;
  const edges = [
    ["A", "B"],
    ["B", "C"],
    ["B", "D"],
    ["D", "A"],
    ["C", "D"],
  ] as const;

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setPhaseIndex((current) => {
        if (current >= scenario.phases.length - 1) {
          setIsRunning(false);
          setRounds((count) => count + 1);
          return current;
        }

        return current + 1;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isRunning, scenario.phases.length]);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setPhaseIndex(0);
    setRounds(0);
    setIsRunning(false);
  };

  const start = () => {
    setPhaseIndex(0);
    setIsRunning(true);
  };

  const activeEdge = edges[activeEdgeIndex];
  const from = distributedNodePositions.find((node) => node.id === activeEdge[0])!;
  const to = distributedNodePositions.find((node) => node.id === activeEdge[1])!;
  const packetX = from.x + (to.x - from.x) * 0.55;
  const packetY = from.y + (to.y - from.y) * 0.55;

  return (
    <section id="distributed-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>Distributed Systems Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Consensus, clocks, and ordering lab.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Watch messages move between replicas while the lab visualizes ordering, causality, and fault tolerance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {distributedScenarios.map((item) => (
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
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 p-3">
              <svg className="min-h-[360px] w-full" viewBox="0 0 780 390" role="img" aria-label="Distributed systems message animation">
                <defs>
                  <filter id="distributed-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="780" height="390" rx="30" fill="#020617" />
                <circle cx="400" cy="190" r="180" fill="#1d4ed8" opacity="0.08" />
                {edges.map(([fromId, toId], index) => {
                  const startNode = distributedNodePositions.find((node) => node.id === fromId)!;
                  const endNode = distributedNodePositions.find((node) => node.id === toId)!;
                  const active = index === activeEdgeIndex;

                  return (
                    <line
                      key={`${fromId}-${toId}`}
                      x1={startNode.x}
                      y1={startNode.y}
                      x2={endNode.x}
                      y2={endNode.y}
                      stroke={active ? "#67e8f9" : "#1e293b"}
                      strokeDasharray={active ? "10 12" : undefined}
                      strokeLinecap="round"
                      strokeWidth={active ? 6 : 3}
                      opacity={active ? 0.95 : 0.65}
                    />
                  );
                })}
                {distributedNodePositions.map((node, index) => {
                  const faulty = scenario.id === "byzantine" && node.id === "C";
                  const leader = node.id === "B";

                  return (
                    <g key={node.id}>
                      <circle
                        className={leader || faulty ? "animate-pulse" : undefined}
                        cx={node.x}
                        cy={node.y}
                        fill={faulty ? "#ef4444" : leader ? "#22d3ee" : "#0f172a"}
                        filter={leader || faulty ? "url(#distributed-glow)" : undefined}
                        r={leader ? 44 : 38}
                        stroke={faulty ? "#fecaca" : "#7dd3fc"}
                        strokeWidth="3"
                      />
                      <text fill={leader ? "#020617" : "#e2e8f0"} fontSize="20" fontWeight="800" textAnchor="middle" x={node.x} y={node.y + 7}>
                        {node.id}
                      </text>
                      <text fill="#94a3b8" fontSize="12" textAnchor="middle" x={node.x} y={node.y + 60}>
                        clock {rounds + phaseIndex + index}
                      </text>
                    </g>
                  );
                })}
                <circle
                  key={`distributed-packet-${phaseIndex}-${rounds}`}
                  className="animate-ping"
                  cx={packetX}
                  cy={packetY}
                  fill="#ffffff"
                  r="13"
                  opacity="0.75"
                />
                <circle cx={packetX} cy={packetY} fill="#f8fafc" filter="url(#distributed-glow)" r="9" />
              </svg>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={start}>{isRunning ? "Messages in flight..." : scenario.trigger}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPhaseIndex(0);
                  setIsRunning(false);
                }}
              >
                Reset Round
              </Button>
            </div>
            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live Phase</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{activePhase}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>
                Distributed systems are not just about services talking to each other. Correctness depends on order,
                causality, failure assumptions, and what every node believes happened.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>System Signals</CardTitle>
              <CardDescription>Short invariants attached to the active scenario.</CardDescription>
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
