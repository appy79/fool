"use client";

import { useState } from "react";
import { designPatternScenarios, labInsight } from "./data";
import {
  clampInsightStepToPhase,
  clampPhaseToInsightStep,
  mergeLabInsight,
} from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function usePatternsLab() {
  const [patternId, setPatternId] = useState<string>(designPatternScenarios[0].id);
  const [runs, setRuns] = useState(0);
  const pattern =
    designPatternScenarios.find((item) => item.id === patternId) ?? designPatternScenarios[0];
  const {
    isRunning,
    phaseIndex: activePart,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: pattern.parts.length,
    intervalMs: 780,
    onComplete: () => setRuns((count) => count + 1),
  });
  const activeInsight = mergeLabInsight(labInsight, pattern.insightSteps);
  const insightStepIndex = clampPhaseToInsightStep(activePart, activeInsight.steps.length);

  const selectPattern = (nextPatternId: string) => {
    setPatternId(nextPatternId);
    setRuns(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    selectPhase(clampInsightStepToPhase(stepIndex, pattern.parts.length));
  };

  return {
    pattern,
    activePart,
    activeInsight,
    insightStepIndex,
    isRunning,
    liveTitle:
      runs > 0 && !isRunning
        ? `${pattern.name} reshaped the dependency path.`
        : `${pattern.parts[activePart]} is active.`,
    reset,
    selectPattern,
    selectStep,
    start,
  };
}
