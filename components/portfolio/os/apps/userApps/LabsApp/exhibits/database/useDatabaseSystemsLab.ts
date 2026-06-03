"use client";

import { useState } from "react";
import { databaseAccessModules, labInsight } from "./data";
import { mapInsightStepToPhase, mapPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function useDatabaseSystemsLab() {
  const [moduleId, setModuleId] = useState<string>(databaseAccessModules[0].id);
  const [runs, setRuns] = useState(0);
  const accessModule =
    databaseAccessModules.find((item) => item.id === moduleId) ?? databaseAccessModules[0];
  const {
    isRunning,
    phaseIndex: activeStage,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: accessModule.stages.length,
    intervalMs: 700,
    onComplete: () => setRuns((count) => count + 1),
  });
  const activeInsight = mergeLabInsight(labInsight, accessModule.insightSteps);
  const insightStepIndex = mapPhaseToInsightStep(
    activeStage,
    accessModule.stages.length,
    activeInsight.steps.length,
  );

  const selectModule = (nextModuleId: string) => {
    setModuleId(nextModuleId);
    setRuns(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    const nextStage = mapInsightStepToPhase(
      stepIndex,
      activeInsight.steps.length,
      accessModule.stages.length,
    );
    selectPhase(nextStage);
  };

  return {
    accessModule,
    activeStage,
    activeInsight,
    insightStepIndex,
    isRunning,
    liveTitle: `${accessModule.stages[activeStage]} ${runs > 0 && !isRunning ? "completed." : "is active."}`,
    reset,
    selectModule,
    selectStep,
    start,
  };
}
