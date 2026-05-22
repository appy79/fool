import type { ComponentType } from "react";

export type LabExhibit = {
  id: string;
  label: string;
  summary: string;
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
  initialTape: string[];
  initialHead: number;
  initialState: string;
  haltStates: string[];
  acceptStates?: string[];
  rejectStates?: string[];
  transitions: Record<string, Transition>;
  explanation: string;
  complexityNote: string;
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
  subscriber: string;
  summary: string;
  route: string[];
  metrics: { label: string; value: string }[];
  project: string;
  projectNote: string;
};

export type LabMetric = {
  label: string;
  value: string;
};
