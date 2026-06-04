"use client";

import { useState } from "react";
import { concurrencyModes, labInsight } from "./data";
import {
  clampInsightStepToPhase,
  clampPhaseToInsightStep,
  mergeLabInsight,
} from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

function getLiveCounters(modeId: string, phaseIndex: number) {
  let expected = 0;
  let observed = 0;

  if (modeId === "race") {
    if (phaseIndex >= 1) {
      expected = 4;
    }
    if (phaseIndex >= 3) {
      observed = 1;
    }
  } else if (modeId === "mutex" || modeId === "atomic") {
    expected = Math.min(phaseIndex, 4);
    observed = Math.min(phaseIndex, 4);
  } else if (modeId === "semaphore") {
    if (phaseIndex === 1) {
      expected = 2;
      observed = 0;
    } else if (phaseIndex === 2) {
      expected = 2;
      observed = 2;
    } else if (phaseIndex === 3) {
      expected = 4;
      observed = 2;
    } else if (phaseIndex >= 4) {
      expected = 4;
      observed = 4;
    }
  } else if (modeId === "queue") {
    if (phaseIndex === 1) {
      expected = 4;
      observed = 0;
    } else if (phaseIndex === 2) {
      expected = 4;
      observed = 2;
    } else if (phaseIndex >= 3) {
      expected = 4;
      observed = 4;
    }
  } else if (modeId === "deadlock") {
    if (phaseIndex >= 4) {
      expected = 2;
    }
    observed = 0;
  } else if (modeId === "multiprocessing") {
    if (phaseIndex >= 3) {
      expected = 4;
    }
    if (phaseIndex >= 4) {
      observed = 4;
    }
  }

  return { expected, observed };
}

export default function useConcurrencyLab() {
  const [modeId, setModeId] = useState<string>(concurrencyModes[0].id);
  const mode = concurrencyModes.find((item) => item.id === modeId) ?? concurrencyModes[0];
  const {
    isRunning,
    phaseIndex,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: mode.phases.length,
    intervalMs: 1100, // Slightly slower for better readability and educational flow
    stopOnAdvanceToFinal: true,
  });
  const isRace = mode.id === "race";
  const isQueue = mode.id === "queue";
  const isAtomic = mode.id === "atomic";
  const isMultiprocessing = mode.id === "multiprocessing";
  const liveOffsets = getLiveCounters(mode.id, phaseIndex);

  const lockHeld =
    mode.id === "deadlock"
      ? phaseIndex > 0
      : mode.id === "mutex"
        ? phaseIndex > 0 && phaseIndex < 5
        : mode.id === "semaphore"
          ? phaseIndex === 1 || phaseIndex === 3
          : false;

  const deadlocked = mode.id === "deadlock" && phaseIndex >= 2;

  const ownerLabel = lockHeld
    ? mode.id === "semaphore"
      ? phaseIndex <= 2
        ? "T1 + T2"
        : "T3 + T4"
      : mode.id === "deadlock"
        ? "T1/T2"
        : `T${Math.min(phaseIndex, 4)}`
    : "-";

  const criticalStatus = deadlocked
    ? "A waits Y / B waits X"
    : lockHeld
      ? mode.id === "semaphore"
        ? "bounded resource slots"
        : "protected write"
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
      isAtomic,
      isMultiprocessing,
      isQueue,
      isRace,
      lockHeld,
      visibleExpectedCounter: liveOffsets.expected,
      visibleObservedCounter: liveOffsets.observed,
      ownerLabel,
      criticalStatus,
    },
    activeInsight,
    currentPhase: mode.phases[phaseIndex],
    deadlocked,
    insightStepIndex,
    isRunning,
    liveDescription: deadlocked
      ? "Circular wait detected: no worker can make progress."
      : liveOffsets.observed === liveOffsets.expected
        ? "Counter is currently consistent with expected increments."
        : "Counter divergence shows lost updates or incomplete synchronization.",
    reset,
    selectMode,
    selectStep,
    start,
  };
}
