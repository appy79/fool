export const distributedScenarios = [
  {
    id: "total-order",
    name: "Total Order Broadcast",
    trigger: "Broadcast event",
    summary: "A leader sequences concurrent events so every replica applies the same log order.",
    phases: ["Client proposes E7", "Leader assigns sequence #42", "Replicas append in total order", "Acks converge"],
    metrics: [
      { label: "Invariant", value: "Same order" },
      { label: "Risk", value: "Leader bottleneck" },
      { label: "Use case", value: "Kafka-style log" },
    ],
  },
  {
    id: "logical-clocks",
    name: "Lamport Clock",
    trigger: "Send messages",
    summary: "Nodes exchange messages and increment clocks to preserve happened-before relationships.",
    phases: ["A ticks to 1", "A sends to B", "B merges max clock", "C observes concurrency"],
    metrics: [
      { label: "Causality", value: "A -> B" },
      { label: "Concurrent", value: "B || C" },
      { label: "Clock type", value: "Logical" },
    ],
  },
  {
    id: "byzantine",
    name: "Byzantine Vote",
    trigger: "Run vote",
    summary: "One faulty node sends conflicting values while honest nodes try to converge on a decision.",
    phases: ["Commander proposes", "Faulty node forks value", "Honest nodes compare messages", "Quorum rejects lie"],
    metrics: [
      { label: "Fault model", value: "Byzantine" },
      { label: "Faulty nodes", value: "1" },
      { label: "Decision", value: "Quorum" },
    ],
  },
] as const;

export const distributedNodePositions = [
  { id: "A", x: 150, y: 128 },
  { id: "B", x: 390, y: 82 },
  { id: "C", x: 640, y: 132 },
  { id: "D", x: 410, y: 292 },
] as const;
