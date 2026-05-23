import type { LabInsight, LabScenarioBase } from "../../types";

export type NetworkScenario = LabScenarioBase & {
  route: readonly string[];
};

export const networkScenarios = [
  {
    id: "edge-hit",
    name: "Edge Cache Hit",
    trigger: "Request asset",
    summary: "DNS sends the user to a nearby edge and the CDN responds without origin traffic.",
    route: ["client", "dns", "edge", "cdn"],
    metrics: [
      { label: "Latency", value: "24ms" },
      { label: "Origin load", value: "0%" },
      { label: "Cache", value: "Hit" },
    ],
    insightSteps: [
      {
        title: "Client asks for a cached asset",
        description: "The browser begins with a normal asset request before any cache decision is known.",
      },
      {
        title: "DNS chooses a nearby edge",
        description: "Resolution sends the user to a close point of presence instead of a distant origin.",
      },
      {
        title: "Edge handles the request",
        description: "The request lands near the user, keeping the round-trip path short.",
      },
      {
        title: "CDN cache answers locally",
        description: "The cache-hit badge marks the terminal hop, bypassing origin and app infrastructure.",
      },
    ],
  },
  {
    id: "origin-miss",
    name: "Origin Miss",
    trigger: "Fetch cold asset",
    summary: "A cache miss travels from edge to origin, fills CDN storage, then returns to the client.",
    route: ["client", "dns", "edge", "cdn", "origin", "app"],
    metrics: [
      { label: "Latency", value: "188ms" },
      { label: "Origin load", value: "High" },
      { label: "Cache", value: "Fill" },
    ],
    insightSteps: [
      {
        title: "Client requests a cold asset",
        description: "The request begins like a cache hit, but the object is not warm at the edge.",
      },
      {
        title: "DNS resolves to the edge",
        description: "The user still enters through the nearest point of presence before cache state is checked.",
      },
      {
        title: "Edge forwards to CDN storage",
        description: "The edge checks the delivery layer and discovers that the object cannot be served locally yet.",
      },
      {
        title: "CDN miss continues to origin",
        description: "The route extends beyond the fast path, increasing latency and origin load.",
      },
      {
        title: "Origin retrieves the cold object",
        description: "The origin fetch supplies the missing asset and creates the opportunity to fill cache storage.",
      },
      {
        title: "Application completes the miss path",
        description: "The final hop represents the extra service path that makes misses slower but warms future hits.",
      },
    ],
  },
  {
    id: "api-edge",
    name: "API Edge Route",
    trigger: "Call API",
    summary: "The request resolves DNS, crosses edge routing, terminates TLS, then reaches application services.",
    route: ["client", "dns", "edge", "origin", "app"],
    metrics: [
      { label: "Layers", value: "L3-L7" },
      { label: "TLS", value: "Terminated" },
      { label: "Routing", value: "Nearest POP" },
    ],
    insightSteps: [
      {
        title: "Client calls a dynamic API",
        description: "The request is not a static asset, so it cannot be answered only by a cache hit.",
      },
      {
        title: "DNS chooses the nearest POP",
        description: "Resolution still optimizes entry point selection before the request crosses application boundaries.",
      },
      {
        title: "Edge terminates protocol work",
        description: "The TLS/L7 gate appears at the edge because API routes often handle protocol boundaries there.",
      },
      {
        title: "Origin routes toward services",
        description: "Dynamic traffic crosses into origin infrastructure instead of stopping at CDN storage.",
      },
      {
        title: "App service produces the response",
        description: "The final hop shows why API latency depends on both network routing and application behavior.",
      },
    ],
  },
] as const satisfies readonly NetworkScenario[];

export const networkNodePositions: Record<string, { x: number; y: number; label: string }> = {
  client: { x: 90, y: 210, label: "Client" },
  dns: { x: 240, y: 112, label: "DNS" },
  edge: { x: 405, y: 210, label: "Edge" },
  cdn: { x: 570, y: 112, label: "CDN" },
  origin: { x: 720, y: 210, label: "Origin" },
  app: { x: 890, y: 210, label: "App" },
};

export const labInsight = {
  animation: "The route view activates each hop in a request path across client, DNS, edge, CDN, origin, and application nodes. Different scenarios shorten or extend the route depending on cache and edge behavior.",
  knowledge: "This demonstrates systems knowledge across resolution, routing, caching, TLS or edge boundaries, origin fallback, and the way infrastructure decisions shape latency and load.",
  steps: [
    {
      title: "Client resolves an entry point",
      description: "The request starts at the user and DNS decides where the traffic should enter the network.",
    },
    {
      title: "Edge receives the request",
      description: "The edge or CDN decides whether the request can be answered near the user.",
    },
    {
      title: "Cache or origin path is chosen",
      description: "A cache hit ends early; a miss continues through origin or application infrastructure.",
    },
    {
      title: "Route outcome changes latency",
      description: "The final hop sequence explains origin load, cache behavior, and user-facing response time.",
    },
  ],
  concepts: [
    {
      title: "Request routing path",
      description: "A web request crosses resolution, edge routing, cache lookup, and sometimes origin infrastructure.",
      bullets: [
        "DNS chooses where the client enters the delivery network.",
        "Edge and CDN layers reduce distance and absorb repeat traffic.",
        "Origin and app hops are slower and should be avoided for cacheable assets when possible.",
      ],
    },
    {
      title: "Latency and load behavior",
      description: "The same user action can produce very different system load depending on cache and edge decisions.",
      bullets: [
        "Cache hits shorten the path and reduce origin load.",
        "Cache misses add origin latency but can populate future fast paths.",
        "API edge routes usually need protocol boundaries, TLS handling, and application service calls.",
      ],
    },
  ],
} satisfies LabInsight;
