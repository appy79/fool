import type { LabInsight, LabInsightStep } from "../types";

export function mergeLabInsight(baseInsight: LabInsight, steps?: readonly LabInsightStep[]) {
  return steps ? { ...baseInsight, steps } : baseInsight;
}

export function clampPhaseToInsightStep(phaseIndex: number, stepCount: number) {
  return Math.min(phaseIndex, Math.max(stepCount - 1, 0));
}

export function clampInsightStepToPhase(stepIndex: number, phaseCount: number) {
  return Math.min(stepIndex, Math.max(phaseCount - 1, 0));
}

export function mapPhaseToInsightStep(phaseIndex: number, phaseCount: number, stepCount: number) {
  return Math.min(
    Math.max(stepCount - 1, 0),
    Math.floor((phaseIndex / Math.max(phaseCount - 1, 1)) * stepCount),
  );
}

export function mapInsightStepToPhase(stepIndex: number, stepCount: number, phaseCount: number) {
  return Math.round((stepIndex / Math.max(stepCount - 1, 1)) * Math.max(phaseCount - 1, 0));
}
