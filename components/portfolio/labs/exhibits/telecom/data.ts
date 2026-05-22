import type { TelecomScenario, TelecomStage } from "../../types";

export const telecomStages = [
  {
    id: "ue",
    label: "UE",
    layer: "Device",
    description: "A subscriber device initiates data, voice, or charging usage.",
    signal: "Usage event",
  },
  {
    id: "ran",
    label: "RAN",
    layer: "Access",
    description: "Radio access forwards the subscriber session into the mobile network.",
    signal: "Bearer context",
  },
  {
    id: "core",
    label: "5G/4G Core",
    layer: "Control plane",
    description: "The core validates session context, subscriber state, and policy inputs.",
    signal: "Session state",
  },
  {
    id: "policy",
    label: "Policy",
    layer: "Rules",
    description: "Policy and entitlement checks decide how usage should be handled.",
    signal: "Quota + rule",
  },
  {
    id: "charging",
    label: "CHF/CGF",
    layer: "Charging",
    description: "Charging functions rate, aggregate, and prepare accounting records.",
    signal: "Charging event",
  },
  {
    id: "kafka",
    label: "Kafka",
    layer: "Event stream",
    description: "Events are published for asynchronous processing and integration.",
    signal: "Ordered topic",
  },
  {
    id: "services",
    label: "Microservices",
    layer: "Application",
    description: "Spring Boot services enrich, validate, reconcile, and expose outcomes.",
    signal: "Business command",
  },
  {
    id: "store",
    label: "Data Store",
    layer: "Persistence",
    description: "Cassandra, Redis, Couchbase, or PostgreSQL persist records and read models.",
    signal: "Durable record",
  },
  {
    id: "billing",
    label: "Billing",
    layer: "Revenue",
    description: "The usage outcome reaches billing, dashboards, or downstream product systems.",
    signal: "Rated usage",
  },
] satisfies TelecomStage[];

export const telecomScenarios = [
  {
    id: "data-session",
    name: "Data Session Charging",
    trigger: "Start data usage",
    subscriber: "AT&T subscriber using mobile data",
    summary: "Follow a live data event from the device through policy, charging, event streaming, and persistence.",
    route: ["ue", "ran", "core", "policy", "charging", "kafka", "services", "store", "billing"],
    metrics: [
      { label: "Scale", value: "50M+ subscribers" },
      { label: "Throughput", value: "1M+ events/sec" },
      { label: "Accuracy", value: "99.9%" },
    ],
    project: "AT&T Openet Microservices",
    projectNote:
      "Connects to CHF-CGF microservices built with Spring Boot, Kafka, Redis, Cassandra, and Kubernetes.",
  },
  {
    id: "billing-aggregation",
    name: "Billing Aggregation",
    trigger: "Aggregate records",
    subscriber: "T-Mobile digital billing flow",
    summary: "Watch records move from high-volume ingestion into aggregation, cache, storage, and billing sync.",
    route: ["ue", "core", "charging", "kafka", "services", "store", "billing"],
    metrics: [
      { label: "Volume", value: "5M+ daily records" },
      { label: "Reliability", value: "99.9%" },
      { label: "Sync", value: "50% faster" },
    ],
    project: "TMO DGB",
    projectNote:
      "Maps to digital billing aggregation work bridging legacy SOA and new billing systems.",
  },
  {
    id: "metro-integration",
    name: "Metro Service Integration",
    trigger: "Provision service",
    subscriber: "Metro by T-Mobile user",
    summary: "Simulate a service access flow after platform integration, with delivery systems and downstream services.",
    route: ["ue", "ran", "core", "services", "kafka", "store", "billing"],
    metrics: [
      { label: "Reach", value: "20M+ users" },
      { label: "Adoption", value: "+15%" },
      { label: "Integration", value: "40% faster" },
    ],
    project: "Metro By T-Mobile Platform",
    projectNote:
      "Represents service delivery work across Spring Boot, Kafka, Angular, Jenkins, and Kubernetes.",
  },
] satisfies TelecomScenario[];

export const telecomStagePositions: Record<string, { x: number; y: number }> = {
  ue: { x: 74, y: 210 },
  ran: { x: 190, y: 118 },
  core: { x: 318, y: 210 },
  policy: { x: 450, y: 116 },
  charging: { x: 572, y: 210 },
  kafka: { x: 690, y: 126 },
  services: { x: 804, y: 210 },
  store: { x: 690, y: 310 },
  billing: { x: 926, y: 210 },
};
