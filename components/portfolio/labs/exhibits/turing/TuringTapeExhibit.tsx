"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { blank, machinePresets, tapeRadius, transitionKey } from "./data";
import type { Direction, MachinePreset } from "../../types";

function createInitialTape(preset: MachinePreset) {
  const cells = new Map<number, string>();
  preset.initialTape.forEach((symbol, index) => cells.set(index, symbol));

  return cells;
}

function readCell(tape: Map<number, string>, index: number) {
  return tape.get(index) ?? blank;
}

function moveHead(head: number, direction: Direction) {
  if (direction === "L") {
    return head - 1;
  }

  if (direction === "R") {
    return head + 1;
  }

  return head;
}

export default function TuringTapeExhibit() {
  const [presetId, setPresetId] = useState(machinePresets[0].id);
  const preset = machinePresets.find((machine) => machine.id === presetId) ?? machinePresets[0];
  const [tape, setTape] = useState(() => createInitialTape(preset));
  const [head, setHead] = useState(preset.initialHead);
  const [state, setState] = useState(preset.initialState);
  const [steps, setSteps] = useState(0);
  const [lastTransition, setLastTransition] = useState("Ready. Press Step or Run.");
  const [isRunning, setIsRunning] = useState(false);
  const [lastMove, setLastMove] = useState<Direction>("S");
  const [clackTick, setClackTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<(() => void) | null>(null);

  const isHalted = preset.haltStates.includes(state);
  const visibleCells = useMemo(
    () => Array.from({ length: tapeRadius * 2 + 1 }, (_, index) => head - tapeRadius + index),
    [head]
  );

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRunning(false);
  }, []);

  const reset = (nextPreset = preset) => {
    stop();
    setTape(createInitialTape(nextPreset));
    setHead(nextPreset.initialHead);
    setState(nextPreset.initialState);
    setSteps(0);
    setLastTransition("Ready. Press Step or Run.");
    setLastMove("S");
    setClackTick(0);
  };

  const selectPreset = (nextPresetId: string) => {
    const nextPreset = machinePresets.find((machine) => machine.id === nextPresetId) ?? machinePresets[0];
    setPresetId(nextPreset.id);
    reset(nextPreset);
  };

  const step = useCallback(() => {
    if (preset.haltStates.includes(state)) {
      stop();
      setLastTransition(`Machine halted in state ${state}.`);
      return;
    }

    const symbol = readCell(tape, head);
    const transition = preset.transitions[transitionKey(state, symbol)];

    if (!transition) {
      stop();
      setState("stuck");
      setLastTransition(`No transition for (${state}, ${symbol}). Machine is stuck.`);
      return;
    }

    const nextTape = new Map(tape);
    nextTape.set(head, transition.write);

    setTape(nextTape);
    setHead(moveHead(head, transition.move));
    setState(transition.next);
    setSteps((current) => current + 1);
    setLastMove(transition.move);
    setClackTick((current) => current + 1);
    setLastTransition(`(${state}, ${symbol}) -> write ${transition.write}, move ${transition.move}, next ${transition.next}. ${transition.note}`);
  }, [head, preset, state, stop, tape]);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const run = () => {
    if (isRunning || isHalted) {
      return;
    }

    setIsRunning(true);
    intervalRef.current = setInterval(() => stepRef.current?.(), 650);
  };

  useEffect(() => () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const statusLabel = preset.acceptStates?.includes(state)
    ? "Accepted"
    : preset.rejectStates?.includes(state)
      ? "Rejected"
      : isHalted
        ? "Halted"
        : state === "stuck"
          ? "Stuck"
          : isRunning
            ? "Running"
            : "Paused";

  return (
    <section id="turing-lab" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Badge>Flagship Exhibit</Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Turing Tape Simulator.
          </h2>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Watch a fixed read/write head click and clack over an old-style tape while the machine mutates memory.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {machinePresets.map((machine) => (
            <Button
              key={machine.id}
              size="sm"
              variant={machine.id === preset.id ? "secondary" : "outline"}
              onClick={() => selectPreset(machine.id)}
            >
              {machine.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
        <Card className="overflow-hidden p-6">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{preset.name}</CardTitle>
                <CardDescription className="mt-2 text-base">{preset.goal}</CardDescription>
              </div>
              <div className="rounded-2xl border border-border/70 bg-secondary/70 px-4 py-3 text-sm">
                <p className="font-semibold text-foreground">{statusLabel}</p>
                <p className="text-muted-foreground">State: {state} / Head: {head} / Steps: {steps}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-amber-900/50 bg-[#201811] p-4 text-amber-50 shadow-2xl shadow-amber-950/25">
              <style>
                {`
                  @keyframes turing-head-clack {
                    0% { transform: translateY(-4px) rotate(-0.5deg); }
                    38% { transform: translateY(12px) rotate(0.5deg); }
                    62% { transform: translateY(5px) rotate(-0.25deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                  }
                  @keyframes turing-tape-shift-left {
                    0% { transform: translateX(-68px); }
                    100% { transform: translateX(0); }
                  }
                  @keyframes turing-tape-shift-right {
                    0% { transform: translateX(68px); }
                    100% { transform: translateX(0); }
                  }
                  @keyframes turing-tape-stamp {
                    0% { transform: translateY(0); }
                    42% { transform: translateY(3px); }
                    100% { transform: translateY(0); }
                  }
                  @keyframes turing-reel-spin {
                    to { transform: rotate(360deg); }
                  }
                `}
              </style>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-100/10 bg-black/25 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-200/80">
                    TM-1956 Tape Console
                  </p>
                  <p className="mt-1 font-mono text-sm text-amber-100">
                    READ HEAD: {head} / MOVE: {lastMove} / STATE: {state}
                  </p>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em]">
                  <span className={`h-3 w-3 rounded-full ${isRunning ? "animate-pulse bg-emerald-300" : "bg-amber-900"}`} />
                  {clackTick > 0 ? (
                    <span key={`clack-label-${clackTick}`} className="rounded-full border border-amber-100/20 bg-amber-100/10 px-3 py-1 text-amber-100 animate-pulse">
                      {lastMove === "S" ? "CLACK" : lastMove === "R" ? "CLICK ->" : "<- CLACK"}
                    </span>
                  ) : (
                    <span className="rounded-full border border-amber-100/10 px-3 py-1 text-amber-200/60">IDLE</span>
                  )}
                </div>
              </div>

              <div className="relative min-h-[310px] overflow-hidden rounded-[1.5rem] border border-amber-100/10 bg-[radial-gradient(circle_at_50%_35%,rgba(245,158,11,0.14),transparent_34%),linear-gradient(180deg,#332315,#120d08)]">
                {["left", "right"].map((side) => (
                  <div
                    key={side}
                    className={`pointer-events-none absolute top-10 z-0 hidden h-32 w-32 rounded-full border border-amber-100/20 bg-[conic-gradient(from_0deg,#3b2a1c,#c0842f,#2a1e14,#8a5a1f,#3b2a1c)] shadow-inner shadow-black/70 md:block ${side === "left" ? "left-7" : "right-7"}`}
                    style={{
                      animationDuration: "1.4s",
                      animationDirection: side === "left" ? "reverse" : "normal",
                      animationIterationCount: "infinite",
                      animationName: isRunning ? "turing-reel-spin" : "none",
                      animationTimingFunction: "linear",
                    }}
                  >
                    <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-amber-100/20 bg-[#160f09]" />
                    <div className="absolute left-1/2 top-4 h-5 w-5 -translate-x-1/2 rounded-full bg-black/45" />
                    <div className="absolute bottom-4 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-black/45" />
                    <div className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-black/45" />
                    <div className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-black/45" />
                  </div>
                ))}

                <div className="absolute left-1/2 top-12 z-20 w-28 -translate-x-1/2 text-center">
                  <div
                    key={`head-${clackTick}`}
                    className="mx-auto"
                    style={{
                      animationDuration: "280ms",
                      animationName: clackTick > 0 ? "turing-head-clack" : "none",
                      animationTimingFunction: "ease-out",
                    }}
                  >
                    <div className="mx-auto rounded-t-2xl border border-amber-100/30 bg-gradient-to-b from-stone-300 to-stone-700 px-3 py-3 text-[0.65rem] font-black uppercase tracking-[0.18em] text-stone-950 shadow-xl shadow-black/50">
                      R/W Head
                    </div>
                    <div className="mx-auto h-[4.6rem] w-3 bg-gradient-to-b from-stone-500 to-amber-200 shadow-lg shadow-amber-200/20" />
                    <div className="mx-auto h-0 w-0 border-l-[13px] border-r-[13px] border-t-[28px] border-l-transparent border-r-transparent border-t-amber-200 drop-shadow-[0_8px_12px_rgba(251,191,36,0.45)]" />
                  </div>
                </div>

                <div className="absolute left-0 right-0 top-[150px] z-10 border-y border-amber-950/60 bg-[#d7b46a] py-4 shadow-2xl shadow-black/50">
                  <div className="absolute left-0 right-0 top-2 flex justify-around">
                    {Array.from({ length: 34 }).map((_, index) => (
                      <span key={`top-hole-${index}`} className="h-2 w-2 rounded-full bg-[#5c3a16]/65" />
                    ))}
                  </div>
                  <div className="absolute bottom-2 left-0 right-0 flex justify-around">
                    {Array.from({ length: 34 }).map((_, index) => (
                      <span key={`bottom-hole-${index}`} className="h-2 w-2 rounded-full bg-[#5c3a16]/65" />
                    ))}
                  </div>

                  <div className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-[4.45rem] -translate-x-1/2 border-x border-amber-950/50 bg-amber-50/20 shadow-[0_0_30px_rgba(251,191,36,0.45)]" />
                  <div className="overflow-hidden px-0 pb-1 pt-4">
                    <div className="relative left-1/2 w-max -translate-x-1/2">
                      <div
                        key={`tape-${clackTick}`}
                        className="flex justify-center gap-1"
                        style={{
                          animation:
                            clackTick > 0
                              ? `${lastMove === "L" ? "turing-tape-shift-left" : lastMove === "R" ? "turing-tape-shift-right" : "turing-tape-stamp"} 320ms ease-out`
                              : undefined,
                        }}
                      >
                        {visibleCells.map((index) => {
                          const active = index === head;
                          const value = readCell(tape, index);

                          return (
                            <div key={index} className="flex w-16 flex-col items-center gap-1">
                              <div
                                className={`grid h-16 w-16 place-items-center border-y border-r border-[#6b481f]/45 font-mono text-2xl font-black transition ${
                                  active
                                    ? "bg-amber-50 text-slate-950 shadow-[0_0_28px_rgba(251,191,36,0.65)]"
                                    : "bg-[#e5c982] text-[#4a2f11]"
                                }`}
                              >
                                {value}
                              </div>
                              <span className="font-mono text-[0.62rem] text-[#5c3a16]">{index}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 right-5 z-20 grid gap-3 rounded-2xl border border-amber-100/10 bg-black/30 p-3 font-mono text-xs text-amber-100/80 sm:grid-cols-3">
                  <span>READ: {readCell(tape, head)}</span>
                  <span>WRITE: {lastTransition.includes("write") ? lastTransition.split("write ")[1]?.split(",")[0] : "-"}</span>
                  <span>STEPS: {steps}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <Button onClick={step} disabled={isRunning || isHalted}>
                Step
              </Button>
              <Button onClick={run} disabled={isRunning || isHalted} variant="secondary">
                Run
              </Button>
              <Button onClick={stop} disabled={!isRunning} variant="outline">
                Pause
              </Button>
              <Button onClick={() => reset()} variant="outline">
                Reset
              </Button>
            </div>

            <div className="rounded-3xl border border-border/70 bg-secondary/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Current Transition
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground">{lastTransition}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>What this proves</CardTitle>
              <CardDescription>{preset.explanation}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-3xl border border-border/70 bg-card/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Efficiency Note
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">{preset.complexityNote}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Transition Table</CardTitle>
              <CardDescription>Readable rules for the active machine.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {Object.entries(preset.transitions).map(([key, transition]) => {
                  const [fromState, read] = key.split(":");

                  return (
                    <div key={key} className="rounded-2xl border border-border/70 bg-secondary/45 p-3 text-sm">
                      <span className="font-semibold text-foreground">({fromState}, {read})</span>
                      <span className="text-muted-foreground">
                        {" -> "}({transition.next}, {transition.write}, {transition.move})
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
