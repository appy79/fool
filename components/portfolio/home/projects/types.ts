export type ScenePoint = { x: number; y: number };

export type MotifKind = "events" | "stack" | "rows" | "bars" | "grid" | "gauge" | "ring" | "check";
type FlowRole = "input" | "process" | "output";
export type FlowEdge = [string, string];

export type FlowNode = {
  id: string;
  label: string;
  detail: string;
  point: ScenePoint;
  role: FlowRole;
  motif: MotifKind;
  width?: number;
};

type FlowStep = {
  caption: string;
  lit: string[];
  edges: FlowEdge[];
  metric?: string;
};

export type ProjectFlow = {
  problem: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  steps: FlowStep[];
};

export type NodeState = "pending" | "active" | "done";
export type EdgeState = "idle" | "flow" | "done";

export const CANVAS = { width: 920, height: 430 } as const;

export const edgeKey = ([from, to]: FlowEdge) => `${from}>${to}`;
