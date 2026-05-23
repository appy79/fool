"use client";

import { useState } from "react";
import { complexityScenarios, labInsight } from "./data";
import { clampInsightStepToPhase, clampPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

const animationSteps = 4;
const routeCaptions = [
  "Route search makes the same kind of branching choices, but each choice adds travel cost.",
  "Higher-cost route choices fade while the cheaper partial tour stays active.",
  "The benefit is that one proposed tour can be scored by summing a few edges.",
  "Search is expensive because many tours compete; checking one route is cheap.",
];
const constraintCaptions = [
  "Constraint search makes the same kind of branching choices, but each choice assigns a variable.",
  "Assignments that violate clauses fade while a consistent witness stays active.",
  "The benefit is that one witness can be checked against clauses quickly.",
  "Search is expensive because many assignments compete; checking one witness is cheap.",
];

export default function useComplexityLab() {
  const [scenarioId, setScenarioId] = useState<string>(complexityScenarios[0].id);
  const [runs, setRuns] = useState(0);
  const scenario = complexityScenarios.find((item) => item.id === scenarioId) ?? complexityScenarios[0];
  const {
    isRunning,
    phaseIndex: activeDepth,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: animationSteps,
    intervalMs: 760,
    onComplete: () => setRuns((count) => count + 1),
  });
  const isRouteSearch = scenario.id === "tsp";
  const activeCaption = isRouteSearch ? routeCaptions[activeDepth] : constraintCaptions[activeDepth];
  const activeInsight = mergeLabInsight(labInsight, scenario.insightSteps);
  const insightStepIndex = clampPhaseToInsightStep(activeDepth, activeInsight.steps.length);

  const selectScenario = (nextScenarioId: string) => {
    setScenarioId(nextScenarioId);
    setRuns(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    selectPhase(clampInsightStepToPhase(stepIndex, animationSteps));
  };

  const liveTitle =
    runs > 0 && !isRunning
      ? isRouteSearch
        ? `${scenario.searchNodes} possible tours visualized. Scoring one tour is small; finding the best tour is the hard part.`
        : `${scenario.searchNodes} assignment branches visualized. Checking one assignment is small; finding it is the hard part.`
      : activeCaption;

  return {
    scenario,
    activeDepth,
    activeInsight,
    insightStepIndex,
    isRouteSearch,
    isRunning,
    liveTitle,
    reset,
    selectScenario,
    selectStep,
    start,
  };
}
