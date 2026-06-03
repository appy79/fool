import {
  nodeById,
  SERVICE_NODES,
  STAGES,
  TOPO_CANVAS,
  TOPO_EDGES,
} from "../../home/console/topology";

export { nodeById, SERVICE_NODES, STAGES, TOPO_CANVAS, TOPO_EDGES };

export type NodeStatus = "healthy" | "degraded" | "down";
export type TrafficLevel = "calm" | "nominal" | "surge";
export type LogLevel = "info" | "ok" | "warn" | "error";

export type NodeStat = {
  /** Normalised queue depth, 0..1, for the load bar. */
  load: number;
  latencyMs: number;
  rps: number;
  status: NodeStatus;
};

export type Metrics = {
  /** Delivered requests per second (rolling 1s). */
  throughput: number;
  /** Approximate tail latency in ms. */
  p99: number;
  /** Dropped / total over the rolling window, 0..1. */
  errorRate: number;
  /** Cumulative delivered requests since reset. */
  served: number;
  /** Healthy (non-degraded, non-down) node count. */
  healthy: number;
  inflight: number;
};

export type LogEntry = { id: number; level: LogLevel; text: string };

/** Packet travelling along the edge fromId -> toId. */
export type Packet = {
  id: number;
  fromId: string;
  toId: string;
  /** Progress on the current edge, 0..1. */
  t: number;
  /** Seconds to traverse the current edge. */
  dur: number;
  /** Accumulated service latency in ms. */
  lat: number;
  hot: boolean;
};

export const TRAFFIC_LEVELS: { id: TrafficLevel; label: string; rate: number }[] = [
  { id: "calm", label: "Calm", rate: 7 },
  { id: "nominal", label: "Nominal", rate: 18 },
  { id: "surge", label: "Surge", rate: 46 },
];

export const SPAWN_RATE: Record<TrafficLevel, number> = {
  calm: 7,
  nominal: 18,
  surge: 46,
};

export const PACKET_CAP = 150;
/** Canvas units per second. */
export const VELOCITY = 360;
export const LOAD_FOR_DEGRADE = 7;
export const LATENCY_DEGRADE_MS = 95;
export const MAX_NODE_LATENCY = 380;

/** Sentinel: the packet reached a terminal (delivery-stage) node. */
export const TERMINAL = "\u0000terminal";

const FIRST_STAGE = STAGES[0].id;
export const INGRESS_IDS = SERVICE_NODES.filter((node) => node.stageId === FIRST_STAGE).map(
  (node) => node.id,
);

export const ADJACENCY: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const [from, to] of TOPO_EDGES) {
    const list = map.get(from) ?? [];
    list.push(to);
    map.set(from, list);
  }
  return map;
})();

export const edgeKey = (from: string, to: string) => `${from}\u0000${to}`;

export const EDGE_DURATION: Map<string, number> = (() => {
  const map = new Map<string, number>();
  for (const [from, to] of TOPO_EDGES) {
    const a = nodeById.get(from)!;
    const b = nodeById.get(to)!;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    map.set(edgeKey(from, to), Math.max(length / VELOCITY, 0.28));
  }
  return map;
})();

/** Same-stage peers (used to model load concentration when a sibling fails). */
export const STAGE_PEERS: Map<string, string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const node of SERVICE_NODES) {
    map.set(
      node.id,
      SERVICE_NODES.filter((other) => other.stageId === node.stageId && other.id !== node.id).map(
        (other) => other.id,
      ),
    );
  }
  return map;
})();

/**
 * Choose the next hop for a packet leaving `fromId`. Returns a downstream node id, the
 * TERMINAL sentinel when the node is a delivery endpoint, or null when every downstream
 * route is offline (the request has nowhere healthy to go and is dropped).
 */
export function pickNextHop(fromId: string, down: ReadonlySet<string>): string | null {
  const outs = ADJACENCY.get(fromId);
  if (!outs || outs.length === 0) return TERMINAL;
  const healthy = outs.filter((id) => !down.has(id));
  if (healthy.length === 0) return null;
  return healthy[(Math.random() * healthy.length) | 0];
}

export const nodeLatency = (queue: number) =>
  Math.min(8 + queue * 7, MAX_NODE_LATENCY);

export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor(p * sorted.length));
  return sorted[index];
}

export function statusFor(down: boolean, queue: number, latencyMs: number): NodeStatus {
  if (down) return "down";
  if (queue >= LOAD_FOR_DEGRADE || latencyMs >= LATENCY_DEGRADE_MS) return "degraded";
  return "healthy";
}

export function formatCount(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return `${Math.round(value)}`;
}
