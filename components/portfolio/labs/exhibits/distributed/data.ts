import type { LabInsight, LabScenarioBase } from "../../types";

export type DistributedScenario = LabScenarioBase & {
  phases: readonly string[];
};

export const distributedScenarios = [
  {
    id: "total-order",
    name: "Total Order Broadcast",
    trigger: "Broadcast event",
    summary: "A leader sequences concurrent events so every replica applies the same log order.",
    phases: ["Client proposes E7", "Leader assigns sequence #42", "Replicas append #42", "Quorum acks converge"],
    metrics: [
      { label: "Invariant", value: "Same order" },
      { label: "Risk", value: "Leader bottleneck" },
      { label: "Use case", value: "Kafka-style log" },
    ],
    insightSteps: [
      {
        title: "Client proposes one event",
        description: "Node A sends event E7 to the leader instead of every replica choosing its own order.",
      },
      {
        title: "Leader assigns sequence #42",
        description: "Node B becomes the serialization point and broadcasts the same log position to replicas.",
      },
      {
        title: "Replicas append the same entry",
        description: "Each replica performs a local log update, shown as self-pulsing state rather than network motion.",
      },
      {
        title: "Quorum acks prove convergence",
        description: "Acknowledgements flow back so the system can trust that enough replicas observed the order.",
      },
    ],
  },
  {
    id: "logical-clocks",
    name: "Lamport Clock",
    trigger: "Send messages",
    summary: "Nodes exchange messages and increment clocks to preserve happened-before relationships.",
    phases: ["A ticks to 1", "A sends to D", "D merges max clock", "C and F remain concurrent"],
    metrics: [
      { label: "Causality", value: "A -> B" },
      { label: "Concurrent", value: "B || C" },
      { label: "Clock type", value: "Logical" },
    ],
    insightSteps: [
      {
        title: "A performs a local tick",
        description: "The first pulse is local state only: A increments its logical clock without a network message.",
      },
      {
        title: "A sends its timestamp to D",
        description: "The active edge carries A's clock value so D can learn the happened-before relationship.",
      },
      {
        title: "D merges the max clock",
        description: "D updates to a clock greater than the received timestamp, preserving causality.",
      },
      {
        title: "C and F remain concurrent",
        description: "The side link shows unrelated clocks advancing without a causal path between those events and A.",
      },
    ],
  },
  {
    id: "byzantine",
    name: "Byzantine Vote",
    trigger: "Run vote",
    summary: "One faulty node sends conflicting values while honest nodes try to converge on a decision.",
    phases: ["Commander proposes", "Faulty G forks value", "Honest replicas compare", "Quorum rejects lie"],
    metrics: [
      { label: "Fault model", value: "Byzantine" },
      { label: "Faulty nodes", value: "1" },
      { label: "Decision", value: "Quorum" },
    ],
    insightSteps: [
      {
        title: "Commander proposes a value",
        description: "The commander broadcasts one intended decision to the replica set.",
      },
      {
        title: "Faulty G forks the message",
        description: "G sends conflicting values to different honest replicas, which is the Byzantine behavior.",
      },
      {
        title: "Honest replicas compare evidence",
        description: "Cross-check links show replicas sharing what they heard instead of trusting one sender.",
      },
      {
        title: "Quorum rejects the lie",
        description: "The final round routes evidence back to the commander so the conflicting value is discarded.",
      },
    ],
  },
] as const satisfies readonly DistributedScenario[];

export const distributedNodePositions = [
  { id: "A", x: 105, y: 112, role: "Client" },
  { id: "B", x: 390, y: 72, role: "Leader" },
  { id: "C", x: 675, y: 112, role: "Replica" },
  { id: "D", x: 135, y: 300, role: "Replica" },
  { id: "E", x: 390, y: 318, role: "Replica" },
  { id: "F", x: 645, y: 300, role: "Replica" },
  { id: "G", x: 390, y: 196, role: "Replica" },
] as const;

export const labInsight = {
  animation: "The cluster changes active links and node states to show the current protocol phase: leader sequencing, Lamport clock updates, local appends, acknowledgements, or Byzantine comparison. Pulsing nodes represent local state changes, not moving packets.",
  knowledge: "This demonstrates fluency with ordering guarantees, causality, quorum thinking, and failure models, which are core to designing reliable distributed services and event platforms.",
  steps: [
    {
      title: "Proposal or local event begins",
      description: "The first phase introduces the client request, local clock tick, or commander proposal.",
    },
    {
      title: "Coordination message fans out",
      description: "Active links show sequencing, causal delivery, or conflicting Byzantine messages.",
    },
    {
      title: "Replicas update local belief",
      description: "Nodes append, merge clocks, or compare received values depending on the scenario.",
    },
    {
      title: "Convergence or conflict is resolved",
      description: "Acknowledgements, concurrency, or quorum rejection make the final distributed invariant visible.",
    },
  ],
  concepts: [
    {
      title: "Ordering and consensus",
      description: "Replicated systems need a shared story about what happened and in what order.",
      bullets: [
        "A leader can assign sequence numbers so replicas apply the same log order.",
        "Acknowledgements indicate whether enough replicas have observed the decision.",
        "The tradeoff is simpler ordering at the cost of leader coordination and bottlenecks.",
      ],
    },
    {
      title: "Causality and failure models",
      description: "Distributed correctness depends on whether messages are delayed, concurrent, or actively malicious.",
      bullets: [
        "Lamport clocks preserve happened-before relationships without physical clock sync.",
        "Concurrent events can be unrelated even if both are valid.",
        "Byzantine scenarios require quorum comparison because faulty nodes can lie differently to different peers.",
      ],
    },
  ],
} satisfies LabInsight;
