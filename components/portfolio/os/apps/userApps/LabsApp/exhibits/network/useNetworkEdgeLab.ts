"use client";

import { useState } from "react";
import { labInsight, networkNodePositions, networkScenarios } from "./data";
import { mapInsightStepToPhase, mapPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function useNetworkEdgeLab() {
  const [scenarioId, setScenarioId] = useState<string>(networkScenarios[0].id);
  const [requests, setRequests] = useState(0);
  const scenario = networkScenarios.find((item) => item.id === scenarioId) ?? networkScenarios[0];
  const route = scenario.route as readonly string[];
  const {
    isRunning,
    phaseIndex: activeIndex,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: route.length,
    intervalMs: 760,
    onComplete: () => setRequests((count) => count + 1),
  });
  const activeNodeId = route[activeIndex] ?? route[0] ?? "client";
  const activeNode = networkNodePositions[activeNodeId] ?? networkNodePositions.client;
  const activeInsight = mergeLabInsight(labInsight, scenario.insightSteps);
  const insightStepIndex = mapPhaseToInsightStep(
    activeIndex,
    route.length,
    activeInsight.steps.length,
  );

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setRequests(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    const nextIndex = mapInsightStepToPhase(stepIndex, activeInsight.steps.length, route.length);
    selectPhase(nextIndex);
  };

  return {
    scenario,
    route,
    activeIndex,
    activeNodeId,
    activeInsight,
    insightStepIndex,
    isRunning,
    liveTitle: `${activeNode.label} ${requests > 0 && !isRunning ? "completed the request path." : "is handling the request."}`,
    reset,
    selectScenario,
    selectStep,
    start,
  };
}
