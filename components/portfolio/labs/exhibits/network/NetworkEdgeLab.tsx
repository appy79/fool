"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { networkNodePositions, networkScenarios } from "./data";
import MetricGrid from "../../MetricGrid";

export default function NetworkEdgeLab() {
  const [scenarioId, setScenarioId] = useState<string>(networkScenarios[0].id);
  const [activeIndex, setActiveIndex] = useState(0);
  const [requests, setRequests] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const scenario = networkScenarios.find((item) => item.id === scenarioId) ?? networkScenarios[0];
  const route = scenario.route as readonly string[];
  const activeNodeId = route[activeIndex] ?? route[0] ?? "client";
  const activeNode = networkNodePositions[activeNodeId] ?? networkNodePositions.client;
  const routeSet = new Set(route);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => {
        if (current >= route.length - 1) {
          setIsRunning(false);
          setRequests((count) => count + 1);
          return current;
        }

        return current + 1;
      });
    }, 760);

    return () => clearInterval(interval);
  }, [isRunning, route.length]);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setActiveIndex(0);
    setRequests(0);
    setIsRunning(false);
  };

  const start = () => {
    setActiveIndex(0);
    setIsRunning(true);
  };

  return (
    <section id="network-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>Networking Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            DNS, edge, and CDN routing lab.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Follow a request from client to DNS, edge, CDN, origin, and app layers while latency and cache behavior change.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {networkScenarios.map((item) => (
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
              <svg className="min-h-[330px] w-full" viewBox="0 0 980 360" role="img" aria-label="Network edge route animation">
                <defs>
                  <filter id="network-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="980" height="360" rx="30" fill="#020617" />
                <path d="M80 255 C230 80, 370 80, 520 210 S760 330, 910 130" fill="none" stroke="#0f172a" strokeWidth="90" />
                {route.slice(0, -1).map((fromId, index) => {
                  const toId = route[index + 1] ?? fromId;
                  const from = networkNodePositions[fromId];
                  const to = networkNodePositions[toId];
                  const completed = index < activeIndex;

                  return (
                    <line
                      key={`${fromId}-${toId}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={completed ? "#67e8f9" : "#1e293b"}
                      strokeLinecap="round"
                      strokeWidth={completed ? 8 : 4}
                      opacity={completed ? 0.95 : 0.75}
                    />
                  );
                })}
                {Object.entries(networkNodePositions).map(([nodeId, node]) => {
                  const inRoute = routeSet.has(nodeId);
                  const routeIndex = route.indexOf(nodeId);
                  const active = activeNodeId === nodeId;
                  const completed = inRoute && routeIndex < activeIndex;

                  return (
                    <g key={nodeId}>
                      {active ? <circle className="animate-ping" cx={node.x} cy={node.y} r="54" fill="#38bdf8" opacity="0.2" /> : null}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={active ? 41 : 35}
                        fill={active ? "#38bdf8" : completed ? "#0f766e" : "#0f172a"}
                        filter={active || completed ? "url(#network-glow)" : undefined}
                        opacity={inRoute ? 1 : 0.35}
                        stroke={active ? "#e0f2fe" : "#38bdf8"}
                        strokeWidth="3"
                      />
                      <text fill={active ? "#020617" : "#e2e8f0"} fontSize="14" fontWeight="800" textAnchor="middle" x={node.x} y={node.y + 5}>
                        {node.label}
                      </text>
                    </g>
                  );
                })}
                <circle className="animate-pulse" cx={activeNode.x} cy={activeNode.y} r="10" fill="#ffffff" filter="url(#network-glow)" />
              </svg>
            </div>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={start}>{isRunning ? "Request in flight..." : scenario.trigger}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveIndex(0);
                  setIsRunning(false);
                }}
              >
                Reset Route
              </Button>
            </div>
            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Live Hop</p>
              <p className="mt-2 text-xl font-semibold text-foreground">
                {activeNode.label} {requests > 0 && !isRunning ? "completed the request path." : "is handling the request."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>
                Networking performance is a chain of resolution, routing, caching, protocol boundaries, and origin behavior.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Route Output</CardTitle>
              <CardDescription>The same request changes dramatically based on cache and edge behavior.</CardDescription>
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
