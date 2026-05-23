"use client";

import { useState } from "react";
import { concurrencyModes, labInsight } from "./data";
import { clampInsightStepToPhase, clampPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function useConcurrencyLab() {
  const [modeId, setModeId] = useState<string>(concurrencyModes[0].id);
  const [expectedCounter, setExpectedCounter] = useState(0);
  const [observedCounter, setObservedCounter] = useState(0);
  const mode = concurrencyModes.find((item) => item.id === modeId) ?? concurrencyModes[0];
  const {
    isRunning,
    phaseIndex,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: mode.phases.length,
    intervalMs: 760,
    onAdvanceToFinal: () => {
      setExpectedCounter((count) => count + mode.workers);
      setObservedCounter((count) => count + mode.observedIncrement);
    },
    stopOnAdvanceToFinal: true,
  });
  const progress = Math.round(((phaseIndex + 1) / mode.phases.length) * 100);
  const isRace = mode.id === "race";
  const isQueue = mode.id === "queue";
  const isAtomic = mode.id === "atomic";
  const isMultiprocessing = mode.id === "multiprocessing";
  const isMutexLike = ["mutex", "semaphore"].includes(mode.id);
  const finalPhaseIndex = mode.phases.length - 1;
  const lockHeld =
    mode.id === "deadlock"
      ? phaseIndex > 0
      : ["mutex", "semaphore"].includes(mode.id) && phaseIndex > 0 && phaseIndex < finalPhaseIndex;
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
  const ownerLabel = lockHeld
    ? mode.id === "semaphore"
      ? "T1 + T2"
      : mode.id === "deadlock"
        ? "T1/T2"
        : "T1"
    : "-";
  const criticalStatus = deadlocked
    ? "A waits Y / B waits X"
    : lockHeld
      ? "protected write"
      : isAtomic
        ? "indivisible increment"
        : isQueue
          ? "single writer reducer"
          : isMultiprocessing
            ? "isolated memory"
            : "unprotected";
  const activeInsight = mergeLabInsight(labInsight, mode.insightSteps);
  const insightStepIndex = clampPhaseToInsightStep(phaseIndex, activeInsight.steps.length);

  const selectMode = (nextModeId: string) => {
    setModeId(nextModeId);
    setExpectedCounter(0);
    setObservedCounter(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    selectPhase(clampInsightStepToPhase(stepIndex, mode.phases.length));
  };

  return {
    mode,
    scene: {
      mode,
      phaseIndex,
      isRunning,
      activeWorkerCount: mode.workers,
      deadlocked,
      finalPhaseIndex,
      isAtomic,
      isMultiprocessing,
      isMutexLike,
      isQueue,
      isRace,
      lockHeld,
      visibleExpectedCounter,
      visibleObservedCounter,
      localReadValue: observedCounter,
      localComputedValue: observedCounter + 1,
      ownerLabel,
      criticalStatus,
    },
    activeInsight,
    currentPhase: mode.phases[phaseIndex],
    deadlocked,
    insightStepIndex,
    isRunning,
    progress,
    liveDescription: deadlocked
      ? "Circular wait detected: no worker can make progress."
      : visibleObservedCounter === visibleExpectedCounter
        ? "Counter is currently consistent with expected increments."
        : "Counter divergence shows lost updates or incomplete synchronization.",
    reset,
    selectMode,
    selectStep,
    start,
  };
}
