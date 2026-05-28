import type { TelecomScenario, TelecomStage, LabInsight } from "../../types";

export const telecomStages = [
  {
    id: "ue",
    label: "UE",
    layer: "Device",
    description: "A subscriber device starts a network session whose usage may later become chargeable records.",
    signal: "Session request",
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
    description: "Charging functions collect, correlate, and prepare charging records for rating, mediation, or billing.",
    signal: "Charging record",
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
    description: "Revenue systems rate, invoice, sync, or expose the completed commercial outcome.",
    signal: "Billing outcome",
  },
] satisfies readonly TelecomStage[];

export const telecomScenarios = [
  {
    id: "data-session",
    name: "Data Session Charging",
    trigger: "Start data usage",
    summary: "Follow a data session from access and core validation into charging, mediation, backend persistence, and billing.",
    route: ["ue", "ran", "core", "policy", "charging", "kafka", "services", "store", "billing"],
    signals: [
      { label: "Flow type", value: "Online charging" },
      { label: "Control point", value: "Policy + charging" },
      { label: "Delivery mode", value: "Mediated event stream" },
    ],
    stageOutputs: {
      ue: "data session requested",
      ran: "access bearer established",
      core: "subscriber session validated",
      policy: "policy and quota decision ready",
      charging: "charging record produced",
      kafka: "record mediated into stream",
      services: "backend enrichment reconciled",
      store: "usage ledger persisted",
      billing: "billable outcome delivered",
    },
    guardrail: {
      label: "Idempotent charging event",
      stageId: "kafka",
      description: "Retries are keyed so duplicate usage events do not double-rate the subscriber.",
    },
    insightSteps: [
      {
        title: "UE starts mobile data usage",
        description: "The subscriber device starts a data session. The chargeable usage is observed and prepared later in the core and charging path.",
      },
      {
        title: "RAN forwards bearer context",
        description: "Radio access carries the data-session context from the device into the mobile network.",
      },
      {
        title: "Core validates session state",
        description: "The control plane checks subscriber state and prepares policy inputs for the charging decision.",
      },
      {
        title: "Policy checks entitlement and quota",
        description: "Policy rules decide whether the session is allowed and which charging behavior applies.",
      },
      {
        title: "Charging prepares the record",
        description: "Charging functions produce charging records and rating context. Final pricing may happen here or in downstream billing, depending on the operator stack.",
      },
      {
        title: "Kafka decouples event processing",
        description: "The charging record enters a mediated stream so downstream services can scale independently.",
      },
      {
        title: "Microservices enrich and reconcile",
        description: "Services validate, enrich, and reconcile the usage event before persistence.",
      },
      {
        title: "Store writes durable records",
        description: "Persistent storage captures the rated usage and read models needed by product systems.",
      },
      {
        title: "Billing receives the outcome",
        description: "The final hop completes the path from network activity to a billing-facing result.",
      },
    ],
  },
  {
    id: "billing-aggregation",
    name: "Billing Aggregation",
    trigger: "Aggregate records",
    summary: "Watch already-produced charging records move through mediation, aggregation, checkpointing, and billing sync.",
    route: ["charging", "kafka", "services", "store", "billing"],
    signals: [
      { label: "Flow type", value: "Batch aggregation" },
      { label: "Input shape", value: "CDR/EDR records" },
      { label: "Recovery model", value: "Checkpointed sync" },
    ],
    stageOverrides: {
      charging: {
        label: "CDR/EDR",
        layer: "Mediation",
        description: "The batch job starts from charging records that have already been collected or mediated upstream.",
        signal: "Rated records",
      },
    },
    stageOutputs: {
      charging: "charging records selected",
      kafka: "batch window published",
      services: "source + target billing reconciled",
      store: "aggregate checkpoint stored",
      billing: "billing sync acknowledged",
    },
    bypassNotes: {
      ue: "usage happened upstream",
      ran: "not part of batch aggregation",
      core: "session context already resolved",
      policy: "policy already resolved upstream",
    },
    guardrail: {
      label: "Checkpointed aggregation",
      stageId: "store",
      description: "Batch checkpoints let workers retry a failed billing sync without replaying the entire day.",
    },
    insightSteps: [
      {
        title: "Charging records enter aggregation",
        description: "The flow starts from CDR/EDR or mediated charging records, not from the live UE/RAN session.",
      },
      {
        title: "Kafka absorbs daily volume",
        description: "The stream keeps ingestion from blocking downstream billing sync and service processing.",
      },
      {
        title: "Services reconcile billing state",
        description: "Application services group records, normalize legacy boundaries, and prepare a consistent billing view.",
      },
      {
        title: "Store protects the aggregate",
        description: "Durable storage captures the aggregate before it is synchronized into billing.",
      },
      {
        title: "Billing sync completes",
        description: "The final hop represents faster downstream synchronization with reliability protected by storage.",
      },
    ],
  },
  {
    id: "service-integration",
    name: "Service Provisioning Integration",
    trigger: "Provision service",
    summary: "Simulate an OSS/BSS service order moving through orchestration, audit streaming, durable state, and billing updates.",
    route: ["ue", "services", "kafka", "store", "billing"],
    signals: [
      { label: "Flow type", value: "Provisioning" },
      { label: "Control point", value: "Service orchestration" },
      { label: "Audit model", value: "Event trail" },
    ],
    stageOverrides: {
      ue: {
        label: "Order API",
        layer: "OSS/BSS",
        description: "An order-management, CRM, or API entry point starts the service activation request.",
        signal: "Service order",
      },
      services: {
        label: "Orchestrator",
        description: "Application services coordinate fulfillment across inventory, network-facing APIs, and downstream systems.",
        signal: "Fulfillment command",
      },
    },
    stageOutputs: {
      ue: "service order accepted",
      services: "fulfillment workflow started",
      kafka: "provisioning event emitted",
      store: "activation state persisted",
      billing: "billing profile updated",
    },
    bypassNotes: {
      ran: "not in the order path",
      core: "network activation is called downstream",
      policy: "entitlement handled by orchestration",
      charging: "charging follows activated service",
    },
    guardrail: {
      label: "Provisioning audit trail",
      stageId: "kafka",
      description: "Every activation emits an audit event so downstream recovery can reconstruct the service state.",
    },
    insightSteps: [
      {
        title: "Order API receives activation",
        description: "Provisioning begins in OSS/BSS or an external API, not in the live RAN session path.",
      },
      {
        title: "Services orchestrate fulfillment",
        description: "Application services coordinate the integrated platform behavior and call any required network-facing systems.",
      },
      {
        title: "Kafka publishes platform events",
        description: "Provisioning outcomes are streamed so audit, billing, and downstream systems can react.",
      },
      {
        title: "Store records the activation",
        description: "Durable state captures what was provisioned and what downstream consumers should see.",
      },
      {
        title: "Billing closes the lifecycle",
        description: "The completed path connects activation state to subscription, invoicing, or revenue-facing systems.",
      },
    ],
  },
] satisfies readonly TelecomScenario[];

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

export const labInsight = {
  steps: [
    {
      title: "Event enters the platform",
      description: "The flow starts from either a live network session or an OSS/BSS order, depending on the scenario.",
    },
    {
      title: "Context and entitlement resolve",
      description: "Network control-plane functions or backend orchestration resolve subscriber context, entitlement, quota, and charging inputs.",
    },
    {
      title: "Charging or orchestration emits events",
      description: "Charging records, provisioning outcomes, or billing batches are published into the streaming path.",
    },
    {
      title: "Services persist and reconcile outcome",
      description: "Microservices enrich the record, write read models, and complete the billing-facing result.",
    },
  ],
  concepts: [
    {
      title: "Subscriber usage flow",
      description: "Telecom platforms turn network activity or OSS/BSS orders into charging records, activation state, and durable billing outcomes.",
      bullets: [
        "Access and core layers establish subscriber/session context for live network usage.",
        "OSS/BSS and orchestration layers handle service orders and provisioning workflows.",
        "Policy, charging, mediation, and billing divide entitlement, quota, rating, and accounting behavior.",
        "Downstream services persist and expose the result for billing or product workflows.",
      ],
    },
    {
      title: "Event-driven telecom services",
      description: "High-volume charging systems rely on asynchronous streams and bounded microservice responsibilities.",
      bullets: [
        "Kafka-like event paths decouple ingestion from enrichment and reconciliation.",
        "Persistence choices support both durable records and fast read models.",
        "Each boundary needs idempotency, ordering awareness, and failure recovery.",
      ],
    },
  ],
} satisfies LabInsight;
