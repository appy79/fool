import type { TelecomScenario, TelecomStage, LabInsight } from "../../types";

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
] satisfies readonly TelecomStage[];

export const telecomScenarios = [
  {
    id: "data-session",
    name: "Data Session Charging",
    trigger: "Start data usage",
    summary: "Follow a live data event from the device through policy, charging, event streaming, and persistence.",
    route: ["ue", "ran", "core", "policy", "charging", "kafka", "services", "store", "billing"],
    signals: [
      { label: "Flow type", value: "Online charging" },
      { label: "Control point", value: "Policy gate" },
      { label: "Delivery mode", value: "Rated event stream" },
    ],
    stageOutputs: {
      ue: "usage event opened",
      ran: "bearer context attached",
      core: "session state validated",
      policy: "quota and entitlement ok",
      charging: "rated CDR generated",
      kafka: "event committed to topic",
      services: "record enriched + reconciled",
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
        description: "The subscriber device creates the usage event that will eventually become a rated billing record.",
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
        title: "Charging rates the usage",
        description: "Charging functions convert the data event into an accounting event with rating context.",
      },
      {
        title: "Kafka decouples event processing",
        description: "The rated event enters the stream so downstream services can scale independently.",
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
    summary: "Watch records move from high-volume ingestion into aggregation, cache, storage, and billing sync.",
    route: ["ue", "core", "charging", "kafka", "services", "store", "billing"],
    signals: [
      { label: "Flow type", value: "Batch aggregation" },
      { label: "Input shape", value: "Rated records" },
      { label: "Recovery model", value: "Checkpointed sync" },
    ],
    stageOutputs: {
      ue: "usage source selected",
      core: "subscriber context normalized",
      charging: "records grouped for aggregation",
      kafka: "batch window published",
      services: "source + target billing reconciled",
      store: "aggregate checkpoint stored",
      billing: "billing sync acknowledged",
    },
    bypassNotes: {
      ran: "not needed for record aggregation",
      policy: "policy already resolved upstream",
    },
    guardrail: {
      label: "Checkpointed aggregation",
      stageId: "store",
      description: "Batch checkpoints let workers retry a failed billing sync without replaying the entire day.",
    },
    insightSteps: [
      {
        title: "Subscriber usage creates billable records",
        description: "The UE represents the original usage activity that eventually becomes aggregation input.",
      },
      {
        title: "Core context normalizes the records",
        description: "Subscriber and session context is aligned before the records move into charging aggregation.",
      },
      {
        title: "Charging groups billable events",
        description: "Charging output becomes the unit of work for high-volume billing aggregation.",
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
    summary: "Simulate a service access flow after platform integration, with delivery systems and downstream services.",
    route: ["ue", "ran", "core", "services", "kafka", "store", "billing"],
    signals: [
      { label: "Flow type", value: "Provisioning" },
      { label: "Control point", value: "Service orchestration" },
      { label: "Audit model", value: "Event trail" },
    ],
    stageOutputs: {
      ue: "activation request received",
      ran: "access context attached",
      core: "subscriber eligibility confirmed",
      services: "service orchestration started",
      kafka: "provisioning event emitted",
      store: "activation state persisted",
      billing: "service lifecycle closed",
    },
    bypassNotes: {
      policy: "handled inside orchestration",
      charging: "billing follows provisioning outcome",
    },
    guardrail: {
      label: "Provisioning audit trail",
      stageId: "kafka",
      description: "Every activation emits an audit event so downstream recovery can reconstruct the service state.",
    },
    insightSteps: [
      {
        title: "Subscriber requests service access",
        description: "A subscriber initiates a provisioning or service-activation flow.",
      },
      {
        title: "RAN carries the activation context",
        description: "Access context enters the network so the platform can identify the subscriber flow.",
      },
      {
        title: "Core validates the subscriber state",
        description: "The core confirms the session and prepares the request for service orchestration.",
      },
      {
        title: "Services orchestrate fulfillment",
        description: "Application services coordinate the integrated platform behavior for the activation.",
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
        description: "The completed path connects activation, durable state, and revenue-facing systems.",
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
  animation: "The flow highlights a subscriber event as it moves through access, core control, policy, charging, event streaming, services, persistence, and billing. Completed links show the production path already crossed, while the active node explains the current telecom function.",
  knowledge: "This demonstrates practical understanding of 3GPP-inspired charging flows, event-driven microservices, persistence boundaries, and how subscriber usage becomes a reliable billing outcome.",
  steps: [
    {
      title: "Subscriber event enters the network",
      description: "The device and access network hand a usage or provisioning event into the mobile core.",
    },
    {
      title: "Core validates session and policy",
      description: "The control-plane path checks subscriber context, entitlement, quota, and charging rules.",
    },
    {
      title: "Charging emits durable events",
      description: "Charging functions rate or aggregate the event and publish it into the streaming path.",
    },
    {
      title: "Services persist and reconcile outcome",
      description: "Microservices enrich the record, write read models, and complete the billing-facing result.",
    },
  ],
  concepts: [
    {
      title: "Subscriber usage flow",
      description: "Telecom systems turn network activity into policy decisions, charging events, and durable billing records.",
      bullets: [
        "Access and core layers establish the subscriber/session context.",
        "Policy and charging decide entitlement, quota, rating, and accounting behavior.",
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
