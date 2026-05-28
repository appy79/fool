import type { ComponentType } from "react";

export type LabExhibit<TId extends string = string> = {
  id: TId;
  label: string;
  component: ComponentType;
};

export type Direction = "L" | "R" | "S";

export type Transition = {
  write: string;
  move: Direction;
  next: string;
  note: string;
};

export type MachinePreset = {
  id: string;
  name: string;
  goal: string;
  initialTape: readonly string[];
  initialHead: number;
  initialState: string;
  haltStates: readonly string[];
  transitions: Record<string, Transition>;
  metrics: readonly LabMetric[];
  insightSteps: readonly LabInsightStep[];
  explanation: string;
  complexityNote: string;
};

export type LabScenarioBase = {
  id: string;
  name: string;
  trigger: string;
  summary: string;
  metrics: readonly LabMetric[];
  insightSteps?: readonly LabInsightStep[];
};

export type TelecomStage = {
  id: string;
  label: string;
  layer: string;
  description: string;
  signal: string;
};

export type TelecomScenario = {
  id: string;
  name: string;
  trigger: string;
  summary: string;
  route: readonly string[];
  signals: readonly LabMetric[];
  stageOverrides?: Partial<Record<string, Partial<TelecomStage>>>;
  stageOutputs?: Partial<Record<string, string>>;
  bypassNotes?: Partial<Record<string, string>>;
  guardrail?: {
    label: string;
    stageId: string;
    description: string;
  };
  insightSteps?: readonly LabInsightStep[];
};

export type LabMetric = {
  label: string;
  value: string;
};

export type LabInsight = {
  steps: readonly LabInsightStep[];
  concepts: readonly LabConcept[];
};

export type LabInsightStep = {
  title: string;
  description: string;
};

export type LabConcept = {
  title: string;
  description: string;
  bullets: readonly string[];
};
