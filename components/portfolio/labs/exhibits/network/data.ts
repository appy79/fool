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
  },
] as const;

export const networkNodePositions: Record<string, { x: number; y: number; label: string }> = {
  client: { x: 90, y: 210, label: "Client" },
  dns: { x: 240, y: 112, label: "DNS" },
  edge: { x: 405, y: 210, label: "Edge" },
  cdn: { x: 570, y: 112, label: "CDN" },
  origin: { x: 720, y: 210, label: "Origin" },
  app: { x: 890, y: 210, label: "App" },
};
