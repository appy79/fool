"use client";

import { useState } from "react";
import { databaseAccessModules, labInsight } from "./data";
import { mapInsightStepToPhase, mapPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function useDatabaseSystemsLab() {
  const [moduleId, setModuleId] = useState<string>(databaseAccessModules[0].id);
  const [runs, setRuns] = useState(0);
  const module = databaseAccessModules.find((item) => item.id === moduleId) ?? databaseAccessModules[0];
  const {
    isRunning,
    phaseIndex: activeStage,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: module.stages.length,
    intervalMs: 700,
    onComplete: () => setRuns((count) => count + 1),
  });
  const activeInsight = mergeLabInsight(labInsight, module.insightSteps);
  const insightStepIndex = mapPhaseToInsightStep(activeStage, module.stages.length, activeInsight.steps.length);

  const selectModule = (nextModuleId: string) => {
    setModuleId(nextModuleId);
    setRuns(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    const nextStage = mapInsightStepToPhase(stepIndex, activeInsight.steps.length, module.stages.length);
    selectPhase(nextStage);
  };

  return {
    module,
    activeStage,
    activeInsight,
    insightStepIndex,
    isRunning,
    liveTitle: `${module.stages[activeStage]} ${runs > 0 && !isRunning ? "completed." : "is active."}`,
    reset,
    selectModule,
    selectStep,
    start,
  };
}
