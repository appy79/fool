import type { LabInsight, LabScenarioBase } from "../../types";

type NetworkScenario = LabScenarioBase & {
  route: readonly string[];
};

export const networkScenarios = [
  {
    id: "edge-hit",
    name: "Edge Cache Hit",
    trigger: "Request asset",
    summary: "DNS resolves the user to a nearby POP, where the edge cache serves the asset without origin traffic.",
    route: ["client", "dns", "edge", "cdn", "response"],
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
        description: "DNS returns an address for a close point of presence; it does not carry the HTTP payload.",
      },
      {
        title: "Edge handles the request",
        description: "After resolution, the browser sends the request to the nearby edge POP, keeping the round-trip path short.",
      },
      {
        title: "Edge cache answers locally",
        description: "The cached object is returned from the POP, bypassing origin and app infrastructure.",
      },
      {
        title: "Response returns from the POP",
        description: "The user receives the asset from the edge cache, so origin load stays at zero.",
      },
    ],
  },
  {
    id: "origin-miss",
    name: "Origin Miss",
    trigger: "Fetch cold asset",
    summary: "A cache miss travels from edge to origin, fills CDN storage, then returns to the client.",
    route: ["client", "dns", "edge", "cdn", "origin", "fill", "response"],
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
        description: "DNS still returns a nearby POP address before the HTTP request checks cache state.",
      },
      {
        title: "Edge cache lookup misses",
        description: "The POP checks its cache and discovers that the object cannot be served locally yet.",
      },
      {
        title: "CDN miss continues to origin",
        description: "The route extends beyond the fast path to the origin/object store, increasing latency and origin load.",
      },
      {
        title: "Origin retrieves the cold object",
        description: "The origin fetch supplies the missing asset and creates the opportunity to fill cache storage.",
      },
      {
        title: "Cache fills on the response path",
        description: "The response writes the object into edge/CDN storage so future requests can become hits.",
      },
      {
        title: "Client receives the fetched object",
        description: "The first cold request is slower, but the path has warmed the cache for the next user.",
      },
    ],
  },
  {
    id: "api-edge",
    name: "API Edge Route",
    trigger: "Call API",
    summary: "The request resolves DNS, enters an edge POP, terminates or proxies TLS/L7 work, then reaches service ingress and application code.",
    route: ["client", "dns", "edge", "origin", "app", "response"],
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
        description: "Resolution chooses the entry point before the HTTP request crosses application boundaries.",
      },
      {
        title: "Edge terminates protocol work",
        description: "The TLS/L7 gate appears at the edge because API routes often terminate, inspect, or proxy protocol boundaries there.",
      },
      {
        title: "Service ingress receives dynamic traffic",
        description: "Dynamic traffic crosses into origin infrastructure or a load balancer/service gateway instead of stopping at cache storage.",
      },
      {
        title: "App service produces the response",
        description: "The final hop shows why API latency depends on both network routing and application behavior.",
      },
      {
        title: "Response returns through the edge",
        description: "The API response travels back through the same delivery boundary to the client.",
      },
    ],
  },
] as const satisfies readonly NetworkScenario[];

export const networkNodePositions: Record<string, { x: number; y: number; label: string }> = {
  client: { x: 90, y: 210, label: "Client" },
  dns: { x: 240, y: 112, label: "DNS Resolver" },
  edge: { x: 405, y: 210, label: "Edge POP" },
  cdn: { x: 570, y: 112, label: "Edge Cache" },
  origin: { x: 720, y: 210, label: "Origin / Ingress" },
  fill: { x: 570, y: 292, label: "Cache Fill" },
  app: { x: 890, y: 210, label: "App Service" },
  response: { x: 250, y: 292, label: "Response" },
};

export const labInsight = {
  steps: [
    {
      title: "Client resolves an entry point",
      description: "The request starts at the user and DNS resolves where traffic should enter the delivery network.",
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
