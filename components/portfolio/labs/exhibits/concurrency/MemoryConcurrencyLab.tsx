"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { concurrencyModes } from "./data";
import MetricGrid from "../../MetricGrid";

export default function MemoryConcurrencyLab() {
  const [modeId, setModeId] = useState<string>(concurrencyModes[0].id);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [expectedCounter, setExpectedCounter] = useState(0);
  const [observedCounter, setObservedCounter] = useState(0);
  const [contextSwitches, setContextSwitches] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const mode = concurrencyModes.find((item) => item.id === modeId) ?? concurrencyModes[0];
  const currentPhase = mode.phases[phaseIndex];
  const progress = Math.round(((phaseIndex + 1) / mode.phases.length) * 100);
  const isRace = mode.id === "race";
  const isQueue = mode.id === "queue";
  const isAtomic = mode.id === "atomic";
  const isMultiprocessing = mode.id === "multiprocessing";
  const isMutexLike = ["mutex", "semaphore"].includes(mode.id);
  const workerPositions = [
    { x: 110, y: 92 },
    { x: 110, y: 172 },
    { x: 110, y: 252 },
    { x: 110, y: 332 },
  ];
  const activeWorkerCount = mode.workers;
  const lockHeld = ["mutex", "semaphore", "deadlock"].includes(mode.id) && phaseIndex > 0;
  const deadlocked = mode.id === "deadlock" && phaseIndex >= 2;
  const finalPhaseReached = phaseIndex === mode.phases.length - 1 && !isRunning;
  const visibleExpectedCounter = finalPhaseReached
    ? expectedCounter
    : isRunning || phaseIndex > 0
      ? expectedCounter + mode.workers
      : expectedCounter;
  const visibleObservedCounter =
    finalPhaseReached
      ? observedCounter
      : phaseIndex >= mode.phases.length - 1
        ? observedCounter + mode.observedIncrement
        : observedCounter;
  const localReadValue = observedCounter;
  const localComputedValue = observedCounter + 1;
  const ownerLabel = mode.id === "semaphore" ? "T1 + T2" : mode.id === "mutex" ? "T1" : mode.id === "deadlock" ? "T1/T2" : "-";

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setPhaseIndex((current) => {
        if (current >= mode.phases.length - 1) {
          setIsRunning(false);
          return current;
        }

        if (current === mode.phases.length - 2) {
          setIsRunning(false);
          setExpectedCounter((count) => count + mode.workers);
          setObservedCounter((count) => count + mode.observedIncrement);
        }

        setContextSwitches((count) => count + (mode.id === "mutex" ? 2 : mode.id === "deadlock" ? 1 : 3));
        return current + 1;
      });
    }, 760);

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const selectMode = (nextModeId: string) => {
    setModeId(nextModeId);
    setPhaseIndex(0);
    setExpectedCounter(0);
    setObservedCounter(0);
    setContextSwitches(0);
    setIsRunning(false);
  };

  const start = () => {
    setPhaseIndex(0);
    setIsRunning(true);
  };

  return (
    <section id="concurrency-lab" className="scroll-mt-24 space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div className="space-y-3">
          <Badge>OS / Concurrency Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Memory and race visualizer.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Watch threads contend for a shared counter, then compare locks, atomics, semaphores, queues,
            deadlocks, and multiprocessing-style isolation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {concurrencyModes.map((item) => (
            <Button
              key={item.id}
              size="sm"
              variant={item.id === mode.id ? "secondary" : "outline"}
              onClick={() => selectMode(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <Card className="overflow-hidden p-6">
          <CardHeader>
            <CardTitle className="text-2xl">{mode.name}</CardTitle>
            <CardDescription className="mt-2 text-base">{mode.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-slate-950 p-4">
              <svg className="min-h-[390px] w-full" viewBox="0 0 920 430" role="img" aria-label="Memory concurrency race visualizer">
                <defs>
                  <filter id="concurrency-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <rect width="920" height="430" rx="30" fill="#020617" />
                <circle cx="530" cy="210" r="190" fill="#0f766e" opacity="0.08" />

                {["READY", "READ", "COMPUTE", "COMMIT"].map((label, index) => (
                  <g key={label}>
                    <rect
                      x={172 + index * 132}
                      y="32"
                      width="104"
                      height="36"
                      rx="14"
                      fill={phaseIndex === index ? "#22d3ee" : index < phaseIndex ? "#0f766e" : "#0f172a"}
                      stroke={phaseIndex === index ? "#e0f2fe" : "#334155"}
                      strokeWidth="2"
                    />
                    <text
                      fill={phaseIndex === index ? "#020617" : "#cbd5e1"}
                      fontSize="11"
                      fontWeight="900"
                      textAnchor="middle"
                      x={224 + index * 132}
                      y="55"
                    >
                      {label}
                    </text>
                  </g>
                ))}

                <rect x="676" y="96" width="178" height="188" rx="28" fill="#0f172a" stroke={visibleObservedCounter === visibleExpectedCounter ? "#38bdf8" : "#fb7185"} strokeWidth="3" />
                <text fill="#94a3b8" fontSize="12" fontWeight="800" textAnchor="middle" x="765" y="124">
                  SHARED COUNTER
                </text>
                <text fill={visibleObservedCounter === visibleExpectedCounter ? "#67e8f9" : "#fb7185"} fontSize="48" fontWeight="900" textAnchor="middle" x="765" y="184">
                  {visibleObservedCounter}
                </text>
                <text fill="#94a3b8" fontSize="12" textAnchor="middle" x="765" y="214">
                  expected {visibleExpectedCounter}
                </text>
                <text fill={isRace && phaseIndex >= 3 ? "#fecaca" : "#94a3b8"} fontSize="12" fontWeight="700" textAnchor="middle" x="765" y="246">
                  {isRace && phaseIndex >= 3 ? "lost updates: all workers wrote stale +1" : deadlocked ? "no commit: circular wait" : "commit target"}
                </text>

                <rect
                  x="496"
                  y="118"
                  width="128"
                  height="104"
                  rx="22"
                  fill={deadlocked ? "#7f1d1d" : lockHeld || isAtomic || isQueue || isMultiprocessing ? "#164e63" : "#0f172a"}
                  stroke={deadlocked ? "#fecaca" : lockHeld || isAtomic || isQueue || isMultiprocessing ? "#67e8f9" : "#334155"}
                  strokeWidth="3"
                />
                <text fill={deadlocked ? "#fecaca" : "#e0f2fe"} fontSize="12" fontWeight="900" textAnchor="middle" x="560" y="150">
                  {isAtomic ? "ATOMIC CAS" : isQueue ? "QUEUE" : isMultiprocessing ? "IPC MERGE" : "CRITICAL"}
                </text>
                <text fill="#cbd5e1" fontSize="12" textAnchor="middle" x="560" y="176">
                  owner: {ownerLabel}
                </text>
                <text fill={deadlocked ? "#fecaca" : "#94a3b8"} fontSize="12" textAnchor="middle" x="560" y="200">
                  {deadlocked ? "A waits Y / B waits X" : lockHeld ? "protected write" : "unprotected"}
                </text>

                {workerPositions.map((position, index) => {
                  const active = index < activeWorkerCount;
                  const waiting = deadlocked && index < 2;
                  const serialized = isMutexLike && index > (mode.id === "semaphore" ? 1 : 0) && phaseIndex > 0;
                  const tokenX = phaseIndex === 0 ? 224 : phaseIndex === 1 ? 356 : phaseIndex === 2 ? 488 : 620;
                  const tokenY = position.y;
                  const localText =
                    phaseIndex === 0
                      ? "local: -"
                      : phaseIndex === 1
                        ? `read ${localReadValue}`
                        : phaseIndex === 2
                          ? `local ${localComputedValue}`
                          : isRace
                            ? `writes ${localComputedValue}`
                            : mode.id === "deadlock"
                              ? "waiting"
                              : `commit +1`;

                  return (
                    <g key={index} opacity={active ? 1 : 0.25}>
                      <rect
                        x={position.x - 52}
                        y={position.y - 26}
                        width="104"
                        height="52"
                        rx="16"
                        fill={waiting ? "#7f1d1d" : serialized ? "#312e81" : "#0f172a"}
                        stroke={waiting ? "#fecaca" : serialized ? "#a5b4fc" : "#38bdf8"}
                        strokeWidth="2"
                      />
                      <text fill="#e2e8f0" fontSize="13" fontWeight="900" textAnchor="middle" x={position.x} y={position.y - 4}>
                        T{index + 1}
                      </text>
                      <text fill={waiting ? "#fecaca" : "#94a3b8"} fontSize="11" textAnchor="middle" x={position.x} y={position.y + 15}>
                        {serialized ? "waiting turn" : localText}
                      </text>
                      <line
                        x1={position.x + 56}
                        y1={position.y}
                        x2={phaseIndex < 3 ? tokenX : 676}
                        y2={tokenY}
                        stroke={waiting ? "#ef4444" : isRace && phaseIndex >= 3 ? "#fb7185" : "#1e293b"}
                        strokeDasharray={waiting || (isRace && phaseIndex >= 3) ? "8 8" : undefined}
                        strokeWidth="3"
                      />
                      {active && !serialized ? (
                        <circle
                          className={isRunning ? "animate-pulse" : undefined}
                          cx={tokenX}
                          cy={tokenY}
                          fill={waiting ? "#fb7185" : phaseIndex >= 3 && isRace ? "#fb7185" : "#ffffff"}
                          filter="url(#concurrency-glow)"
                          r="8"
                        />
                      ) : null}
                    </g>
                  );
                })}

                {isQueue ? (
                  <g>
                    <rect x="330" y="326" width="212" height="58" rx="18" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
                    {[0, 1, 2, 3].map((item) => (
                      <rect
                        key={item}
                        className={phaseIndex > 0 ? "animate-pulse" : undefined}
                        x={352 + item * 34}
                        y={344}
                        width="24"
                        height="22"
                        rx="6"
                        fill="#22d3ee"
                        opacity={phaseIndex > 1 ? 0.9 : 0.45}
                      />
                    ))}
                    <text fill="#94a3b8" fontSize="12" textAnchor="middle" x="454" y="404">
                      single reducer drains queued +1 deltas
                    </text>
                  </g>
                ) : null}

                {isMultiprocessing ? (
                  <g>
                    <rect x="300" y="326" width="270" height="58" rx="18" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
                    <text fill="#ddd6fe" fontSize="13" fontWeight="800" textAnchor="middle" x="435" y="351">
                      each process owns private memory
                    </text>
                    <text fill="#94a3b8" fontSize="12" textAnchor="middle" x="435" y="372">
                      merge happens through IPC/result collection
                    </text>
                  </g>
                ) : null}

                {deadlocked ? (
                  <g>
                    <path d="M496 250 C440 300, 350 300, 292 250" fill="none" stroke="#ef4444" strokeDasharray="10 10" strokeWidth="4" />
                    <path d="M292 236 C350 184, 440 184, 496 236" fill="none" stroke="#ef4444" strokeDasharray="10 10" strokeWidth="4" />
                    <text fill="#fecaca" fontSize="13" fontWeight="900" textAnchor="middle" x="394" y="292">
                      circular wait
                    </text>
                  </g>
                ) : null}
              </svg>
            </div>

            <div className="overflow-hidden rounded-full border border-border/70 bg-secondary/40">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${deadlocked ? "bg-destructive" : "bg-primary"}`}
                style={{ width: `${deadlocked ? 66 : progress}%` }}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Button onClick={start}>{isRunning ? "Threads scheduled..." : mode.trigger}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPhaseIndex(0);
                  setIsRunning(false);
                }}
              >
                Reset Cycle
              </Button>
            </div>

            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Scheduler Caption</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{currentPhase}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {deadlocked
                  ? "Circular wait detected: no worker can make progress."
                  : observedCounter === expectedCounter
                    ? "Counter is currently consistent with expected increments."
                    : "Counter divergence shows lost updates or incomplete synchronization."}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>
                Performance work is also correctness work. Concurrency primitives change throughput, memory isolation,
                context switching, and whether the final state can be trusted.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Runtime Signals</CardTitle>
              <CardDescription>Current counter behavior and synchronization tradeoffs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MetricGrid metrics={mode.metrics} />
              <div className="rounded-3xl border border-border/70 bg-card/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Context switches
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{contextSwitches}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
