import type { LabInsight, LabScenarioBase } from "../../types";

type DesignPatternScenario = LabScenarioBase & {
  parts: readonly string[];
};

export const designPatternScenarios = [
  {
    id: "strategy",
    name: "Strategy",
    trigger: "Swap algorithm",
    summary: "A context delegates variable behavior to a strategy interface, allowing concrete algorithms to be selected without changing the caller.",
    parts: ["Request", "Context Policy", "Strategy Registry", "Selected Strategy", "Normalize Return", "Caller Result"],
    metrics: [
      { label: "Problem", value: "Vary behavior" },
      { label: "Benefit", value: "Policy choice" },
      { label: "Tradeoff", value: "More types" },
    ],
    insightSteps: [
      {
        title: "Caller sends a normal request",
        description: "The caller asks the context for a result and does not contain branching logic for every algorithm.",
      },
      {
        title: "Context evaluates selection policy",
        description: "The context chooses which strategy key to use based on runtime policy, injected configuration, or request shape.",
      },
      {
        title: "Registry resolves the implementation",
        description: "A registry or dependency-injected map returns a concrete strategy behind the same interface.",
      },
      {
        title: "Only the selected strategy executes",
        description: "One concrete algorithm runs; the alternatives remain available but idle.",
      },
      {
        title: "Context normalizes the return",
        description: "The context receives a common result shape regardless of which strategy ran.",
      },
      {
        title: "Caller receives one contract",
        description: "The caller gets the final result without depending on concrete strategy classes.",
      },
    ],
  },
  {
    id: "adapter",
    name: "Adapter",
    trigger: "Wrap legacy API",
    summary: "A target interface and adapter translate between modern callers and incompatible legacy contracts without leaking old payload details upstream.",
    parts: ["Target Request", "Adapter Boundary", "Map DTO", "Call Legacy", "Map Response", "Target Response"],
    metrics: [
      { label: "Problem", value: "Legacy mismatch" },
      { label: "Benefit", value: "Stable interface" },
      { label: "Use case", value: "SOA bridge" },
    ],
    insightSteps: [
      {
        title: "Client speaks the target contract",
        description: "The client sends a clean request without knowing the legacy API shape.",
      },
      {
        title: "Adapter boundary receives the call",
        description: "The adapter implements the target interface that the rest of the codebase wants to use.",
      },
      {
        title: "Adapter maps request DTO",
        description: "The adapter converts naming, payload shape, protocol expectations, and error semantics.",
      },
      {
        title: "Legacy SOA executes behind the boundary",
        description: "The old request format and dependency call exist only behind the adapter boundary.",
      },
      {
        title: "Legacy response is mapped back",
        description: "Legacy status codes, field names, and errors are normalized into the target model.",
      },
      {
        title: "Target response returns",
        description: "The result is translated back into the target model expected by the client.",
      },
    ],
  },
  {
    id: "observer",
    name: "Observer",
    trigger: "Publish event",
    summary: "A publisher emits one event into a subject/bus, and independent subscribers react without being named by the publisher.",
    parts: ["Domain Event", "Publish", "Fan-out Queue", "Subscribers Consume", "Ack / Retry", "Effects Settled"],
    metrics: [
      { label: "Problem", value: "Notify many" },
      { label: "Benefit", value: "Loose coupling" },
      { label: "Risk", value: "Event storms" },
    ],
    insightSteps: [
      {
        title: "Publisher creates a domain event",
        description: "The publisher records one event describing what happened, without naming downstream consumers.",
      },
      {
        title: "Event is published once",
        description: "The subject or event bus receives the event and becomes the fan-out boundary.",
      },
      {
        title: "Fan-out queues subscriber deliveries",
        description: "Each subscriber gets its own delivery lane so one slow consumer does not block all others.",
      },
      {
        title: "Subscribers consume independently",
        description: "Audit, email, and cache handlers react to the same event with separate responsibilities.",
      },
      {
        title: "Acks and retries are handled",
        description: "Each consumer acknowledges success or retries idempotently if its side effect fails.",
      },
      {
        title: "Side effects complete separately",
        description: "Subscribers may finish at different times, so retries, ordering, and idempotency matter.",
      },
    ],
  },
  {
    id: "breaker",
    name: "Circuit Breaker",
    trigger: "Trip dependency",
    summary: "A breaker tracks dependency failures, opens to fail fast, serves fallback, then probes recovery before closing again.",
    parts: ["Request", "Closed Pass", "Failures Counted", "Open Fail-fast", "Fallback Served", "Half-open Probe"],
    metrics: [
      { label: "Problem", value: "Cascading failure" },
      { label: "Benefit", value: "Resilience" },
      { label: "State", value: "Open/half-open" },
    ],
    insightSteps: [
      {
        title: "Service receives a request",
        description: "The request begins on a path that could normally cascade into failure.",
      },
      {
        title: "Closed breaker passes the call",
        description: "In the closed state the breaker allows calls while tracking failures and latency.",
      },
      {
        title: "Dependency failures accumulate",
        description: "The breaker observes timeout/error thresholds as the dependency becomes unsafe.",
      },
      {
        title: "Breaker opens and fails fast",
        description: "Open state stops new calls from hammering the dependency.",
      },
      {
        title: "Fallback protects the user path",
        description: "The fallback branch returns a degraded but controlled outcome while the dependency recovers.",
      },
      {
        title: "Half-open probe tests recovery",
        description: "After a cooldown, a limited probe decides whether the breaker can close or should reopen.",
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
