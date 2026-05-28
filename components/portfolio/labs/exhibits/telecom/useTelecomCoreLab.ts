"use client";

import { useState } from "react";
import { labInsight, telecomScenarios, telecomStagePositions, telecomStages } from "./data";
import { mapInsightStepToPhase, mapPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";
import type { TelecomScenario } from "../../types";

export default function useTelecomCoreLab() {
  const [scenarioId, setScenarioId] = useState(telecomScenarios[0].id);
  const [eventsProcessed, setEventsProcessed] = useState(0);
  const scenario: TelecomScenario = telecomScenarios.find((item) => item.id === scenarioId) ?? telecomScenarios[0];
  const {
    isRunning: isSimulating,
    phaseIndex: activeIndex,
    reset: resetRoute,
    selectPhase,
    start: startRoute,
  } = useTimedPhase({
    phaseCount: scenario.route.length,
    intervalMs: 900,
    onAdvance: () => setEventsProcessed((count) => count + 1),
  });
  const activeStageId = scenario.route[activeIndex] ?? scenario.route[0];
  const baseActiveStage = telecomStages.find((stage) => stage.id === activeStageId) ?? telecomStages[0];
  const activeStage = { ...baseActiveStage, ...scenario.stageOverrides?.[baseActiveStage.id] };
  const isComplete = activeIndex === scenario.route.length - 1 && !isSimulating && eventsProcessed > 0;
  const activeInsight = mergeLabInsight(labInsight, scenario.insightSteps);
  const stageOutputs: Partial<Record<string, string>> | undefined = scenario.stageOutputs;
  const bypassNotes: Partial<Record<string, string>> | undefined = scenario.bypassNotes;
  const activeOutput = stageOutputs?.[activeStage.id] ?? activeStage.signal;
  const guardrailStageIndex = scenario.guardrail ? scenario.route.indexOf(scenario.guardrail.stageId) : -1;
  const guardrailReached = guardrailStageIndex >= 0 && activeIndex >= guardrailStageIndex;
  const guardrailPosition = scenario.guardrail ? telecomStagePositions[scenario.guardrail.stageId] : undefined;
  const insightStepIndex = mapPhaseToInsightStep(activeIndex, scenario.route.length, activeInsight.steps.length);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setEventsProcessed(0);
    resetRoute();
  };

  const start = () => {
    startRoute();
    setEventsProcessed((count) => count + 1);
  };

  const reset = () => {
    resetRoute();
  };

  const selectStage = (routeIndex: number) => {
    selectPhase(routeIndex);
  };

  const selectStep = (stepIndex: number) => {
    const routeIndex = mapInsightStepToPhase(stepIndex, activeInsight.steps.length, scenario.route.length);
    selectPhase(routeIndex);
  };

  return {
    scenario,
    activeIndex,
    activeStage,
    activeInsight,
    activeOutput,
    bypassNotes,
    guardrailReached,
    guardrailPosition,
    insightStepIndex,
    isComplete,
    isSimulating,
    reset,
    selectScenario,
    selectStage,
    selectStep,
    start,
  };
}
