"use client";

import { useState } from "react";
import { distributedScenarios, labInsight } from "./data";
import { clampInsightStepToPhase, clampPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function useDistributedSystemsLab() {
  const [scenarioId, setScenarioId] = useState<string>(distributedScenarios[0].id);
  const [rounds, setRounds] = useState(0);
  const scenario = distributedScenarios.find((item) => item.id === scenarioId) ?? distributedScenarios[0];
  const {
    isRunning,
    phaseIndex,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: scenario.phases.length,
    intervalMs: 900,
    onComplete: () => setRounds((count) => count + 1),
  });
  const activeInsight = mergeLabInsight(labInsight, scenario.insightSteps);
  const insightStepIndex = clampPhaseToInsightStep(phaseIndex, activeInsight.steps.length);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setRounds(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    selectPhase(clampInsightStepToPhase(stepIndex, scenario.phases.length));
  };

  return {
    scenario,
    phaseIndex,
    activePhase: scenario.phases[phaseIndex],
    activeInsight,
    insightStepIndex,
    isRunning,
    rounds,
    reset,
    selectScenario,
    selectStep,
    start,
  };
}
