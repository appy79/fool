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
    summary: "Step through mechanical computation with state, tape, and transition rules.",
    component: TuringTapeExhibit,
  },
  {
    id: "telecom",
    label: "Telecom Core Simulator",
    summary: "3GPP-style subscriber flows through policy, charging, orchestration, and events.",
    component: TelecomCoreLab,
  },
  {
    id: "distributed",
    label: "Distributed Consensus Lab",
    summary: "Ordering, clocks, consensus, and fault tolerance across communicating nodes.",
    component: DistributedConsensusLab,
  },
  {
    id: "database",
    label: "Database Systems Lab",
    summary: "Compare scans, indexes, parallel query execution, cache paths, and data-access tradeoffs.",
    component: DatabaseSystemsLab,
  },
  {
    id: "concurrency",
    label: "Concurrency Race Visualizer",
    summary: "Shared memory, synchronization, lost updates, and deadlock behavior.",
    component: ConcurrencyRaceLab,
  },
  {
    id: "network",
    label: "Network Edge Lab",
    summary: "DNS, edge routing, CDN behavior, origin fallback, and request paths.",
    component: NetworkEdgeLab,
  },
  {
    id: "complexity",
    label: "P vs NP Puzzle Chamber",
    summary: "Search growth, witness verification, route costs, and constraint checks.",
    component: ComplexityPuzzleLab,
  },
  {
    id: "patterns",
    label: "Design Patterns Machine",
    summary: "Strategy, adapter, observer, and breaker patterns as system machinery.",
    component: DesignPatternsMachineLab,
  },
] satisfies readonly LabExhibit<LabId>[];
