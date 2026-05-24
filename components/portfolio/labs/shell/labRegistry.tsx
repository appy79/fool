import dynamic from "next/dynamic";
import TuringTapeExhibit from "../exhibits/turing/TuringTapeExhibit";
import LabLoadingState from "./LabLoadingState";
import type { LabExhibit } from "../types";

export const labIds = [
  "turing",
  "telecom",
  "distributed",
  "database",
  "concurrency",
  "network",
  "complexity",
  "patterns",
] as const;

export type LabId = (typeof labIds)[number];

export const defaultLabId = "turing" satisfies LabId;

const TelecomCoreLab = dynamic(() => import("../exhibits/telecom/TelecomCoreExhibit"), {
  loading: LabLoadingState,
});
const DistributedConsensusLab = dynamic(() => import("../exhibits/distributed/DistributedSystemsLab"), {
  loading: LabLoadingState,
});
const DatabaseSystemsLab = dynamic(() => import("../exhibits/database/DatabaseSystemsLab"), {
  loading: LabLoadingState,
});
const ConcurrencyRaceLab = dynamic(() => import("../exhibits/concurrency/MemoryConcurrencyLab"), {
  loading: LabLoadingState,
});
const NetworkEdgeLab = dynamic(() => import("../exhibits/network/NetworkEdgeLab"), {
  loading: LabLoadingState,
});
const ComplexityPuzzleLab = dynamic(() => import("../exhibits/complexity/ComplexityPuzzleLab"), {
  loading: LabLoadingState,
});
const DesignPatternsMachineLab = dynamic(() => import("../exhibits/patterns/DesignPatternsLab"), {
  loading: LabLoadingState,
});

export const labExhibits = [
  {
    id: "turing",
    label: "Turing Tape Simulator",
    component: TuringTapeExhibit,
  },
  {
    id: "telecom",
    label: "Telecom Core Simulator",
    component: TelecomCoreLab,
  },
  {
    id: "distributed",
    label: "Distributed Consensus Lab",
    component: DistributedConsensusLab,
  },
  {
    id: "database",
    label: "Database Systems Lab",
    component: DatabaseSystemsLab,
  },
  {
    id: "concurrency",
    label: "Concurrency Race Visualizer",
    component: ConcurrencyRaceLab,
  },
  {
    id: "network",
    label: "Network Edge Lab",
    component: NetworkEdgeLab,
  },
  {
    id: "complexity",
    label: "P vs NP Puzzle Chamber",
    component: ComplexityPuzzleLab,
  },
  {
    id: "patterns",
    label: "Design Patterns Machine",
    component: DesignPatternsMachineLab,
  },
] satisfies readonly LabExhibit<LabId>[];
