import type { LabInsight, LabScenarioBase } from "../../types";

type DesignPatternScenario = LabScenarioBase & {
  parts: readonly string[];
};

export const designPatternScenarios = [
  {
    id: "strategy",
    name: "Strategy",
    trigger: "Swap algorithm",
    summary: "The same request can choose between interchangeable algorithms without rewriting the caller.",
    parts: ["Caller", "Strategy", "Algorithm A/B", "Result"],
    metrics: [
      { label: "Problem", value: "Vary behavior" },
      { label: "Benefit", value: "Runtime choice" },
      { label: "Tradeoff", value: "More types" },
    ],
    insightSteps: [
      {
        title: "Caller asks for behavior",
        description: "The caller depends on a stable contract rather than a concrete algorithm.",
      },
      {
        title: "Strategy boundary selects an implementation",
        description: "The pattern node represents choosing an algorithm at runtime.",
      },
      {
        title: "Algorithm A or B executes",
        description: "The branching rails show interchangeable behavior behind the same interface.",
      },
      {
        title: "Result returns through one contract",
        description: "The caller gets the result without knowing which algorithm produced it.",
      },
    ],
  },
  {
    id: "adapter",
    name: "Adapter",
    trigger: "Wrap legacy API",
    summary: "A modern interface translates requests into a legacy contract without leaking old details upstream.",
    parts: ["Client", "Adapter", "Legacy SOA", "Unified API"],
    metrics: [
      { label: "Problem", value: "Legacy mismatch" },
      { label: "Benefit", value: "Stable interface" },
      { label: "Use case", value: "SOA bridge" },
    ],
    insightSteps: [
      {
        title: "Client speaks the modern contract",
        description: "The client sends a clean request without knowing the legacy API shape.",
      },
      {
        title: "Adapter translates the request",
        description: "The adapter panel converts naming, payload, and protocol expectations.",
      },
      {
        title: "Legacy SOA remains contained",
        description: "The old dependency is called behind the adapter boundary instead of leaking upstream.",
      },
      {
        title: "Unified API returns a stable response",
        description: "The final result preserves a modern contract while still using the legacy system.",
      },
    ],
  },
  {
    id: "observer",
    name: "Observer",
    trigger: "Publish event",
    summary: "One event fans out to many subscribers without the publisher knowing every downstream consumer.",
    parts: ["Publisher", "Event Bus", "Subscribers", "Side effects"],
    metrics: [
      { label: "Problem", value: "Notify many" },
      { label: "Benefit", value: "Loose coupling" },
      { label: "Risk", value: "Event storms" },
    ],
    insightSteps: [
      {
        title: "Publisher emits one event",
        description: "The publisher sends a single notification without naming every downstream consumer.",
      },
      {
        title: "Event bus owns fan-out",
        description: "The bus becomes the decoupling point between producer and subscribers.",
      },
      {
        title: "Subscribers react independently",
        description: "The fan-out branches show multiple consumers handling the same event in parallel.",
      },
      {
        title: "Side effects complete separately",
        description: "The final node represents independent downstream work such as audit, email, or cache update.",
      },
    ],
  },
  {
    id: "breaker",
    name: "Circuit Breaker",
    trigger: "Trip dependency",
    summary: "A failing dependency is isolated before it cascades through the rest of the system.",
    parts: ["Service", "Breaker", "Dependency", "Fallback"],
    metrics: [
      { label: "Problem", value: "Cascading failure" },
      { label: "Benefit", value: "Resilience" },
      { label: "State", value: "Open/half-open" },
    ],
    insightSteps: [
      {
        title: "Service calls an unstable dependency",
        description: "The request begins on a path that could normally cascade into failure.",
      },
      {
        title: "Breaker watches failure state",
        description: "The breaker boundary tracks whether calls should pass, fail fast, or probe recovery.",
      },
      {
        title: "Dependency is isolated",
        description: "The red dependency rail shows the risky call being contained instead of overwhelming the service.",
      },
      {
        title: "Fallback protects the user path",
        description: "The fallback branch returns a degraded but controlled outcome while the dependency recovers.",
      },
    ],
  },
] as const satisfies readonly DesignPatternScenario[];

export const labInsight = {
  steps: [
    {
      title: "Caller pressure enters the design",
      description: "The first node represents the code or service that needs behavior, translation, notification, or protection.",
    },
    {
      title: "Pattern boundary takes responsibility",
      description: "The selected pattern absorbs variation, mismatch, fan-out, or failure handling.",
    },
    {
      title: "Implementation detail is isolated",
      description: "Algorithm, legacy service, subscriber, or dependency behavior stays behind a clearer boundary.",
    },
    {
      title: "Result exposes the tradeoff",
      description: "The final node shows the benefit and the complexity cost introduced by the pattern.",
    },
  ],
  concepts: [
    {
      title: "Patterns as boundaries",
      description: "A useful design pattern creates a stable boundary around variation, mismatch, fan-out, or failure.",
      bullets: [
        "Strategy isolates interchangeable behavior behind one caller contract.",
        "Adapter translates incompatible APIs without leaking legacy detail upstream.",
        "Observer separates event producers from many downstream consumers.",
      ],
    },
    {
      title: "Tradeoff-aware architecture",
      description: "Patterns are not free; each one buys flexibility by introducing more structure.",
      bullets: [
        "Circuit breakers add state and policy but contain cascading failures.",
        "Event fan-out improves decoupling but can create ordering and storm risks.",
        "The right pattern is justified by change pressure, not by pattern collecting.",
      ],
    },
  ],
} satisfies LabInsight;
