import type { LabInsight, LabScenarioBase } from "../../types";

export type DistributedEdge = readonly [string, string];

type DistributedPhase = {
  title: string;
  summary: string;
  activeEdges: readonly DistributedEdge[];
  selfNodes?: readonly string[];
  activeNodes?: readonly string[];
  statuses: Partial<Record<string, string>>;
  badges?: Partial<Record<string, string>>;
};

export type DistributedScenario = LabScenarioBase & {
  phases: readonly DistributedPhase[];
  leaderNodeIds?: readonly string[];
  faultyNodeIds?: readonly string[];
  nodeRoles?: Partial<Record<string, string>>;
};

export const distributedScenarios = [
  {
    id: "total-order",
    name: "Total Order Broadcast",
    trigger: "Broadcast event",
    summary: "A sequencer assigns one global log position, then replicas append, acknowledge, and commit the same entry.",
    leaderNodeIds: ["B"],
    phases: [
      {
        title: "Client submits E7",
        summary: "A sends an operation to the sequencer instead of asking every replica to choose an order.",
        activeEdges: [["A", "B"]],
        activeNodes: ["A", "B"],
        statuses: {
          A: "submit E7",
          B: "sequencer",
          C: "waiting",
          D: "waiting",
          E: "waiting",
          F: "waiting",
          G: "waiting",
        },
      },
      {
        title: "Sequencer reserves slot 42",
        summary: "B performs the single ordering decision and assigns the next log slot.",
        activeEdges: [],
        selfNodes: ["B"],
        activeNodes: ["B"],
        statuses: {
          A: "client",
          B: "slot #42",
          C: "waiting",
          D: "waiting",
          E: "waiting",
          F: "waiting",
          G: "waiting",
        },
        badges: { B: "ORDER E7 -> #42" },
      },
      {
        title: "Ordered entry fans out",
        summary: "The sequencer broadcasts the same ordered entry to every replica.",
        activeEdges: [["B", "C"], ["B", "D"], ["B", "E"], ["B", "F"], ["B", "G"]],
        activeNodes: ["B", "C", "D", "E", "F", "G"],
        statuses: {
          A: "client",
          B: "broadcast #42",
          C: "receive #42",
          D: "receive #42",
          E: "receive #42",
          F: "receive #42",
          G: "receive #42",
        },
      },
      {
        title: "Replicas append locally",
        summary: "Each replica appends E7 at slot 42; this local write is shown as self-pulsing state.",
        activeEdges: [],
        selfNodes: ["C", "D", "E", "F", "G"],
        activeNodes: ["C", "D", "E", "F", "G"],
        statuses: {
          A: "client",
          B: "await quorum",
          C: "log[42]=E7",
          D: "log[42]=E7",
          E: "log[42]=E7",
          F: "log[42]=E7",
          G: "log[42]=E7",
        },
        badges: {
          C: "APPENDED",
          D: "APPENDED",
          E: "APPENDED",
          F: "APPENDED",
          G: "APPENDED",
        },
      },
      {
        title: "Quorum acknowledgements return",
        summary: "A quorum proves enough replicas observed the same ordered slot.",
        activeEdges: [["C", "B"], ["D", "B"], ["E", "B"], ["F", "B"]],
        activeNodes: ["B", "C", "D", "E", "F"],
        statuses: {
          A: "client",
          B: "4/5 acks",
          C: "ack #42",
          D: "ack #42",
          E: "ack #42",
          F: "ack #42",
          G: "lagging ok",
        },
      },
      {
        title: "Commit becomes visible",
        summary: "The ordered entry is safe to expose because the quorum converged on slot 42.",
        activeEdges: [["B", "A"], ["B", "G"]],
        selfNodes: ["B"],
        activeNodes: ["A", "B", "C", "D", "E", "F", "G"],
        statuses: {
          A: "committed",
          B: "commit #42",
          C: "committed",
          D: "committed",
          E: "committed",
          F: "committed",
          G: "catch up",
        },
        badges: { B: "COMMIT #42" },
      },
    ],
    metrics: [
      { label: "Invariant", value: "Same order" },
      { label: "Risk", value: "Leader bottleneck" },
      { label: "Use case", value: "Replicated log" },
    ],
    insightSteps: [
      {
        title: "Client submits one event",
        description: "Node A sends E7 to the sequencer so replicas do not independently choose incompatible positions.",
      },
      {
        title: "Sequencer assigns slot #42",
        description: "Node B serializes the operation by reserving a single global log slot.",
      },
      {
        title: "Ordered entry is broadcast",
        description: "Every replica receives the same instruction: append E7 at log position 42.",
      },
      {
        title: "Replicas append locally",
        description: "The local append is not a network message; each node updates its own durable log.",
      },
      {
        title: "Quorum acknowledgements return",
        description: "Enough acknowledgements prove the ordered entry survived on a quorum of replicas.",
      },
      {
        title: "Commit becomes visible",
        description: "The client and any lagging replica can learn the committed order after quorum convergence.",
      },
    ],
  },
  {
    id: "logical-clocks",
    name: "Lamport Clock",
    trigger: "Send messages",
    summary: "Local events and messages advance counters so nodes can preserve happened-before relationships without physical time.",
    phases: [
      {
        title: "A performs a local event",
        summary: "A increments its own counter before sending anything.",
        activeEdges: [],
        selfNodes: ["A"],
        activeNodes: ["A"],
        statuses: {
          A: "clock 1",
          B: "clock 0",
          C: "clock 0",
          D: "clock 0",
          E: "clock 0",
          F: "clock 0",
          G: "clock 0",
        },
        badges: { A: "LOCAL TICK" },
      },
      {
        title: "A sends timestamp 2 to D",
        summary: "A increments before send and attaches the logical timestamp to the message.",
        activeEdges: [["A", "D"]],
        activeNodes: ["A", "D"],
        statuses: {
          A: "send ts=2",
          B: "clock 0",
          C: "clock 0",
          D: "waiting",
          E: "clock 0",
          F: "clock 0",
          G: "clock 0",
        },
        badges: { A: "TS=2" },
      },
      {
        title: "D receives and merges",
        summary: "D sets its counter above both its local value and the received timestamp.",
        activeEdges: [],
        selfNodes: ["D"],
        activeNodes: ["D"],
        statuses: {
          A: "clock 2",
          B: "clock 0",
          C: "clock 0",
          D: "clock 3",
          E: "clock 0",
          F: "clock 0",
          G: "clock 0",
        },
        badges: { D: "MAX(0,2)+1" },
      },
      {
        title: "C and F exchange unrelated work",
        summary: "Another part of the cluster advances without a causal path from A to D.",
        activeEdges: [["C", "F"]],
        activeNodes: ["C", "F"],
        statuses: {
          A: "clock 2",
          B: "clock 0",
          C: "send ts=1",
          D: "clock 3",
          E: "clock 0",
          F: "recv -> 2",
          G: "clock 0",
        },
        badges: { C: "CONCURRENT", F: "CONCURRENT" },
      },
      {
        title: "Partial order is visible",
        summary: "A happened before D, but the C/F exchange is only ordered with itself.",
        activeEdges: [["A", "D"], ["C", "F"]],
        activeNodes: ["A", "C", "D", "F"],
        statuses: {
          A: "A -> D",
          B: "idle",
          C: "C -> F",
          D: "after A",
          E: "idle",
          F: "after C",
          G: "idle",
        },
        badges: { D: "CAUSAL", F: "SEPARATE CHAIN" },
      },
    ],
    metrics: [
      { label: "Causality", value: "A -> D" },
      { label: "Concurrent", value: "A/D || C/F" },
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
        title: "C and F exchange unrelated work",
        description: "The side link advances independently, so that chain is concurrent with A's chain.",
      },
      {
        title: "Only a partial order exists",
        description: "Lamport clocks prove happened-before, but they do not prove that unrelated events happened at the same real time.",
      },
    ],
  },
  {
    id: "byzantine",
    name: "Byzantine Vote",
    trigger: "Run vote",
    summary: "A faulty replica equivocates, honest nodes exchange evidence, and the quorum converges on one decision.",
    leaderNodeIds: ["B"],
    faultyNodeIds: ["G"],
    nodeRoles: {
      B: "Commander",
      G: "Byzantine",
    },
    phases: [
      {
        title: "Commander proposes X",
        summary: "B sends one intended value to the replica set.",
        activeEdges: [["B", "C"], ["B", "D"], ["B", "E"], ["B", "F"], ["B", "G"]],
        activeNodes: ["B", "C", "D", "E", "F", "G"],
        statuses: {
          A: "observer",
          B: "propose X",
          C: "recv X",
          D: "recv X",
          E: "recv X",
          F: "recv X",
          G: "recv X",
        },
      },
      {
        title: "Faulty G equivocates",
        summary: "G sends different claims to different honest nodes.",
        activeEdges: [["G", "C"], ["G", "D"], ["G", "F"]],
        activeNodes: ["G", "C", "D", "F"],
        statuses: {
          A: "observer",
          B: "await reports",
          C: "heard X",
          D: "heard Y",
          E: "heard X",
          F: "heard X",
          G: "fork X/Y",
        },
        badges: { G: "LIES DIFFERENTLY", D: "G SAYS Y" },
      },
      {
        title: "Honest replicas echo evidence",
        summary: "Honest nodes share what they received instead of trusting G in isolation.",
        activeEdges: [["C", "D"], ["D", "E"], ["E", "F"], ["F", "C"]],
        activeNodes: ["C", "D", "E", "F"],
        statuses: {
          A: "observer",
          B: "await reports",
          C: "echo X",
          D: "echo Y",
          E: "echo X",
          F: "echo X",
          G: "silent",
        },
        badges: { C: "X", D: "Y?", E: "X", F: "X" },
      },
      {
        title: "Majority observes X",
        summary: "The honest view contains enough matching X reports to isolate the conflicting value.",
        activeEdges: [["C", "E"], ["E", "F"], ["C", "F"]],
        activeNodes: ["C", "E", "F"],
        statuses: {
          A: "observer",
          B: "collecting",
          C: "vote X",
          D: "outlier Y",
          E: "vote X",
          F: "vote X",
          G: "suspect",
        },
        badges: { E: "3X > 1Y" },
      },
      {
        title: "Quorum certificate returns",
        summary: "Honest replicas return their evidence to the commander.",
        activeEdges: [["C", "B"], ["D", "B"], ["E", "B"], ["F", "B"]],
        activeNodes: ["B", "C", "D", "E", "F"],
        statuses: {
          A: "observer",
          B: "QC for X",
          C: "report X",
          D: "report conflict",
          E: "report X",
          F: "report X",
          G: "ignored",
        },
        badges: { B: "QUORUM X" },
      },
      {
        title: "Decision X is committed",
        summary: "The system rejects the equivocation and commits the quorum-supported value.",
        activeEdges: [["B", "C"], ["B", "D"], ["B", "E"], ["B", "F"]],
        activeNodes: ["B", "C", "D", "E", "F"],
        statuses: {
          A: "observer",
          B: "commit X",
          C: "decide X",
          D: "decide X",
          E: "decide X",
          F: "decide X",
          G: "excluded",
        },
        badges: { G: "FAULT ISOLATED" },
      },
    ],
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
        title: "Honest replicas echo evidence",
        description: "Cross-check links show replicas sharing what they heard instead of trusting one sender.",
      },
      {
        title: "Majority observes X",
        description: "The conflicting report becomes an outlier once honest replicas compare evidence.",
      },
      {
        title: "Quorum certificate returns",
        description: "The commander receives enough matching evidence to identify the supported value.",
      },
      {
        title: "Decision X is committed",
        description: "Honest replicas commit the quorum-supported value and exclude the faulty sender's equivocation.",
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
  { id: "G", x: 520, y: 255, role: "Replica" },
] as const;

export const labInsight = {
  steps: [
    {
      title: "Proposal or local event begins",
      description: "The first phase introduces a client request, logical-clock tick, or commander proposal.",
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
