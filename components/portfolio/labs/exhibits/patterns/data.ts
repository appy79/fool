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
  },
] as const;
