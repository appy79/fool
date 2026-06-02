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
    opcode: "TM",
    component: TuringTapeExhibit,
  },
  {
    id: "telecom",
    label: "Telecom Core Simulator",
    opcode: "5GC",
    component: TelecomCoreLab,
  },
  {
    id: "distributed",
    label: "Distributed Consensus Lab",
    opcode: "RAFT",
    component: DistributedConsensusLab,
  },
  {
    id: "database",
    label: "Database Systems Lab",
    opcode: "DB",
    component: DatabaseSystemsLab,
  },
  {
    id: "concurrency",
    label: "Concurrency Race Visualizer",
    opcode: "LOCK",
    component: ConcurrencyRaceLab,
  },
  {
    id: "network",
    label: "Network Edge Lab",
    opcode: "EDGE",
    component: NetworkEdgeLab,
  },
  {
    id: "complexity",
    label: "P vs NP Puzzle Chamber",
    opcode: "NP",
    component: ComplexityPuzzleLab,
  },
  {
    id: "patterns",
    label: "Design Patterns Machine",
    opcode: "GOF",
    component: DesignPatternsMachineLab,
  },
] satisfies readonly LabExhibit<LabId>[];
