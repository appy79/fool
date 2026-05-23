"use client";

import { useState } from "react";
import { labInsight, performanceProfiles } from "./data";
import { mapInsightStepToPhase, mapPhaseToInsightStep, mergeLabInsight } from "../../utils/insight";
import useTimedPhase from "../../hooks/useTimedPhase";

export default function usePerformanceLab() {
  const [profileId, setProfileId] = useState<string>(performanceProfiles[0].id);
  const [runs, setRuns] = useState(0);
  const profile = performanceProfiles.find((item) => item.id === profileId) ?? performanceProfiles[0];
  const {
    isRunning,
    phaseIndex: activeStage,
    reset: resetPhase,
    selectPhase,
    start,
  } = useTimedPhase({
    phaseCount: profile.stages.length,
    intervalMs: 700,
    onComplete: () => setRuns((count) => count + 1),
  });
  const activeInsight = mergeLabInsight(labInsight, profile.insightSteps);
  const insightStepIndex = mapPhaseToInsightStep(activeStage, profile.stages.length, activeInsight.steps.length);

  const selectProfile = (nextProfileId: string) => {
    setProfileId(nextProfileId);
    setRuns(0);
    resetPhase();
  };

  const reset = () => {
    resetPhase();
  };

  const selectStep = (stepIndex: number) => {
    const nextStage = mapInsightStepToPhase(stepIndex, activeInsight.steps.length, profile.stages.length);
    selectPhase(nextStage);
  };

  return {
    profile,
    activeStage,
    activeInsight,
    insightStepIndex,
    isRunning,
    liveTitle: `${profile.stages[activeStage]} ${runs > 0 && !isRunning ? "completed." : "is active."}`,
    reset,
    selectProfile,
    selectStep,
    start,
  };
}
