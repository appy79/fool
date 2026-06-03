"use client";

import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  EDGE_DURATION,
  edgeKey,
  INGRESS_IDS,
  LOAD_FOR_DEGRADE,
  type LogEntry,
  type LogLevel,
  type Metrics,
  nodeById,
  type NodeStat,
  nodeLatency,
  PACKET_CAP,
  type Packet,
  percentile,
  pickNextHop,
  SERVICE_NODES,
  SPAWN_RATE,
  STAGE_PEERS,
  statusFor,
  TERMINAL,
  TOPO_CANVAS,
  TOPO_EDGES,
  type TrafficLevel,
} from "./simModel";

type NodeStats = Record<string, NodeStat>;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const initialNodeStats = (): NodeStats => {
  const stats: NodeStats = {};
  for (const node of SERVICE_NODES) {
    stats[node.id] = { load: 0, latencyMs: 8, rps: 0, status: "healthy" };
  }
  return stats;
};

const initialMetrics: Metrics = {
  throughput: 0,
  p99: 0,
  errorRate: 0,
  served: 0,
  healthy: SERVICE_NODES.length,
  inflight: 0,
};

type Colors = { primary: string; gold: string; destructive: string };

const FALLBACK_COLORS: Colors = {
  primary: "#3b82f6",
  gold: "#e0b341",
  destructive: "#e5484d",
};

export type SystemSimulation = ReturnType<typeof useSystemSimulation>;

export function useSystemSimulation({
  canvasRef,
  reducedMotion,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  reducedMotion: boolean;
}) {
  const [metrics, setMetrics] = useState<Metrics>(initialMetrics);
  const [nodeStats, setNodeStats] = useState<NodeStats>(initialNodeStats);
  const [log, setLog] = useState<LogEntry[]>([
    { id: 0, level: "info", text: "operator console online · traffic nominal" },
  ]);
  const [running, setRunning] = useState(true);
  const [traffic, setTraffic] = useState<TrafficLevel>("nominal");
  const [downIds, setDownIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string>(SERVICE_NODES[0].id);
  const [announce, setAnnounce] = useState("");

  // Loop-facing mirrors so the rAF loop reads the latest controls without restarting.
  const runningRef = useRef(running);
  const trafficRef = useRef(traffic);
  const downRef = useRef<Set<string>>(new Set());

  // High-frequency simulation state lives in refs (never triggers a React render).
  const packetsRef = useRef<Packet[]>([]);
  const nextIdRef = useRef(1);
  const spawnAccRef = useRef(0);
  const deliveredTimesRef = useRef<number[]>([]);
  const droppedTimesRef = useRef<number[]>([]);
  const latRingRef = useRef<number[]>([]);
  const servedRef = useRef(0);
  const inflightByNodeRef = useRef<Map<string, number>>(new Map());
  const inflightByEdgeRef = useRef<Map<string, number>>(new Map());
  const nodeQRef = useRef<Map<string, number>>(new Map());
  const nodeProcessedRef = useRef<Map<string, number>>(new Map());
  const procSnapRef = useRef<Map<string, number>>(new Map());
  const nodeLoadDisplayRef = useRef<Map<string, number>>(new Map());

  const logIdRef = useRef(1);
  const lastInfoLogRef = useRef(0);

  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ cw: 0, ch: 0 });
  const colorsRef = useRef<Colors>(FALLBACK_COLORS);
  const lastColorTsRef = useRef(0);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);
  useEffect(() => {
    trafficRef.current = traffic;
  }, [traffic]);
  useEffect(() => {
    downRef.current = new Set(downIds);
  }, [downIds]);

  const addLog = (level: LogLevel, text: string) => {
    const id = logIdRef.current++;
    setLog((current) => [{ id, level, text }, ...current].slice(0, 26));
  };

  // --- Controls -----------------------------------------------------------
  const actions = useMemo(
    () => ({
      toggleRunning: () =>
        setRunning((value) => {
          runningRef.current = !value;
          return !value;
        }),
      setTrafficLevel: (level: TrafficLevel) => {
        trafficRef.current = level;
        setTraffic(level);
        addLog("info", `traffic set to ${level}`);
      },
      selectNode: (id: string) => setSelectedId(id),
      toggleNodeDown: (id: string) =>
        setDownIds((current) => {
          const isDown = current.includes(id);
          const next = isDown ? current.filter((value) => value !== id) : [...current, id];
          downRef.current = new Set(next);
          const label = nodeById.get(id)?.label ?? id;
          if (isDown) {
            addLog("ok", `${label} restored — rejoining the cluster`);
            setAnnounce(`${label} restored`);
          } else {
            addLog("error", `${label} taken offline — rerouting traffic`);
            setAnnounce(`${label} offline`);
          }
          return next;
        }),
      reset: () => {
        packetsRef.current = [];
        deliveredTimesRef.current = [];
        droppedTimesRef.current = [];
        latRingRef.current = [];
        servedRef.current = 0;
        spawnAccRef.current = 0;
        inflightByNodeRef.current.clear();
        inflightByEdgeRef.current.clear();
        nodeQRef.current.clear();
        nodeProcessedRef.current.clear();
        procSnapRef.current.clear();
        nodeLoadDisplayRef.current.clear();
        downRef.current = new Set();
        setDownIds([]);
        setMetrics(initialMetrics);
        setNodeStats(initialNodeStats());
        logIdRef.current = 1;
        setLog([{ id: 0, level: "info", text: "simulation reset · cluster healthy" }]);
        setAnnounce("simulation reset");
      },
    }),
    [],
  );

  // --- Engine + renderer --------------------------------------------------
  useEffect(() => {
    const refreshColors = () => {
      try {
        const cs = getComputedStyle(document.documentElement);
        colorsRef.current = {
          primary: cs.getPropertyValue("--primary").trim() || FALLBACK_COLORS.primary,
          gold: cs.getPropertyValue("--gold").trim() || FALLBACK_COLORS.gold,
          destructive: cs.getPropertyValue("--destructive").trim() || FALLBACK_COLORS.destructive,
        };
      } catch {
        colorsRef.current = FALLBACK_COLORS;
      }
    };
    refreshColors();

    const incProcessed = (id: string) =>
      nodeProcessedRef.current.set(id, (nodeProcessedRef.current.get(id) ?? 0) + 1);

    const makePacket = (fromId: string, toId: string): Packet => ({
      id: nextIdRef.current++,
      fromId,
      toId,
      t: 0,
      dur: EDGE_DURATION.get(edgeKey(fromId, toId)) ?? 0.5,
      lat: 0,
      hot: (inflightByNodeRef.current.get(toId) ?? 0) >= LOAD_FOR_DEGRADE * 0.7,
    });

    const recordDeliver = (ts: number, lat: number, terminalId: string) => {
      deliveredTimesRef.current.push(ts);
      servedRef.current += 1;
      const ring = latRingRef.current;
      ring.push(lat);
      if (ring.length > 120) ring.shift();
      if (Math.random() < 0.014) {
        addLog("ok", `req delivered via ${nodeById.get(terminalId)?.label ?? terminalId} · ${Math.round(lat)}ms`);
      }
    };

    const recordDrop = (ts: number, atId: string, reason: "down" | "noroute") => {
      droppedTimesRef.current.push(ts);
      if (Math.random() < 0.05) {
        const label = nodeById.get(atId)?.label ?? atId;
        if (reason === "down") addLog("warn", `request hit offline ${label} · dropped`);
        else addLog("error", `no healthy route past ${label} · dropped`);
      }
    };

    const advance = (dt: number, ts: number) => {
      const down = downRef.current;
      const packets = packetsRef.current;

      spawnAccRef.current += SPAWN_RATE[trafficRef.current] * dt;
      const ingress = INGRESS_IDS.filter((id) => !down.has(id));
      while (spawnAccRef.current >= 1) {
        spawnAccRef.current -= 1;
        if (packets.length >= PACKET_CAP) break;
        if (ingress.length === 0) break;
        const start = ingress[(Math.random() * ingress.length) | 0];
        const next = pickNextHop(start, down);
        if (!next || next === TERMINAL) continue;
        incProcessed(start);
        packets.push(makePacket(start, next));
      }

      const keep: Packet[] = [];
      for (const p of packets) {
        p.t += dt / p.dur;
        if (p.t < 1) {
          keep.push(p);
          continue;
        }
        if (down.has(p.toId)) {
          recordDrop(ts, p.toId, "down");
          continue;
        }
        incProcessed(p.toId);
        const q = inflightByNodeRef.current.get(p.toId) ?? 0;
        p.lat += nodeLatency(q);
        const next = pickNextHop(p.toId, down);
        if (next === TERMINAL) {
          recordDeliver(ts, p.lat, p.toId);
          continue;
        }
        if (next === null) {
          recordDrop(ts, p.toId, "noroute");
          continue;
        }
        p.fromId = p.toId;
        p.toId = next;
        p.t = p.t - 1 < 0 ? 0 : p.t - 1;
        p.dur = EDGE_DURATION.get(edgeKey(p.fromId, next)) ?? 0.5;
        p.hot = (inflightByNodeRef.current.get(next) ?? 0) >= LOAD_FOR_DEGRADE * 0.7;
        keep.push(p);
      }
      packetsRef.current = keep;

      const byNode = inflightByNodeRef.current;
      const byEdge = inflightByEdgeRef.current;
      byNode.clear();
      byEdge.clear();
      for (const p of keep) {
        byNode.set(p.toId, (byNode.get(p.toId) ?? 0) + 1);
        const key = edgeKey(p.fromId, p.toId);
        byEdge.set(key, (byEdge.get(key) ?? 0) + 1);
      }
    };

    const pushMetrics = (ts: number, dtSec: number) => {
      const down = downRef.current;
      const cutoff3 = ts - 3000;
      const delivered = deliveredTimesRef.current;
      while (delivered.length && delivered[0] < cutoff3) delivered.shift();
      const dropped = droppedTimesRef.current;
      while (dropped.length && dropped[0] < cutoff3) dropped.shift();

      const cutoff1 = ts - 1000;
      let throughput = 0;
      for (let i = delivered.length - 1; i >= 0; i -= 1) {
        if (delivered[i] >= cutoff1) throughput += 1;
        else break;
      }
      const totalWindow = delivered.length + dropped.length;
      const errorRate = totalWindow > 0 ? dropped.length / totalWindow : 0;
      const p99 = percentile(latRingRef.current, 0.99);

      const stats: NodeStats = {};
      let healthy = 0;
      for (const node of SERVICE_NODES) {
        const isDown = down.has(node.id);
        const inst = isDown ? 0 : inflightByNodeRef.current.get(node.id) ?? 0;
        const prev = nodeQRef.current.get(node.id) ?? 0;
        const smoothed = prev + (inst - prev) * 0.3;
        nodeQRef.current.set(node.id, smoothed);
        const latencyMs = isDown ? 0 : nodeLatency(smoothed);
        const status = statusFor(isDown, smoothed, latencyMs);
        if (status === "healthy") healthy += 1;

        const curProc = nodeProcessedRef.current.get(node.id) ?? 0;
        const prevProc = procSnapRef.current.get(node.id) ?? curProc;
        procSnapRef.current.set(node.id, curProc);
        const rps = isDown ? 0 : Math.max(0, (curProc - prevProc) / dtSec);

        const load = clamp01(smoothed / (LOAD_FOR_DEGRADE * 1.7));
        nodeLoadDisplayRef.current.set(node.id, isDown ? 0 : load);
        stats[node.id] = { load, latencyMs: Math.round(latencyMs), rps: Math.round(rps), status };
      }

      setNodeStats(stats);
      setMetrics({
        throughput,
        p99: Math.round(p99),
        errorRate,
        served: servedRef.current,
        healthy,
        inflight: packetsRef.current.length,
      });

      if (ts - lastInfoLogRef.current > 2600) {
        lastInfoLogRef.current = ts;
        addLog("info", `throughput ${throughput} req/s · p99 ${Math.round(p99)}ms`);
      }
    };

    const draw = () => {
      const ctx = ctxRef.current;
      const { cw, ch } = sizeRef.current;
      if (!ctx || cw === 0 || ch === 0) return;

      const now = performance.now();
      if (now - lastColorTsRef.current > 500) {
        lastColorTsRef.current = now;
        refreshColors();
      }
      const colors = colorsRef.current;
      const down = downRef.current;
      const sx = cw / TOPO_CANVAS.width;
      const sy = ch / TOPO_CANVAS.height;

      ctx.clearRect(0, 0, cw, ch);
      ctx.lineCap = "round";

      // Edges.
      for (const [fromId, toId] of TOPO_EDGES) {
        const a = nodeById.get(fromId)!;
        const b = nodeById.get(toId)!;
        const x1 = a.x * sx;
        const y1 = a.y * sy;
        const x2 = b.x * sx;
        const y2 = b.y * sy;
        const isDown = down.has(fromId) || down.has(toId);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        if (isDown) {
          ctx.setLineDash([5, 6]);
          ctx.strokeStyle = colors.destructive;
          ctx.globalAlpha = 0.32;
          ctx.lineWidth = 1.4;
        } else {
          const pktNorm = Math.min((inflightByEdgeRef.current.get(edgeKey(fromId, toId)) ?? 0) / 6, 1);
          const la = nodeLoadDisplayRef.current.get(fromId) ?? 0;
          const lb = nodeLoadDisplayRef.current.get(toId) ?? 0;
          const activity = Math.max(pktNorm, ((la + lb) / 2) * 0.8);
          ctx.setLineDash([]);
          ctx.strokeStyle = colors.primary;
          ctx.globalAlpha = 0.1 + activity * 0.42;
          ctx.lineWidth = 1.2 + activity * 1.8;
        }
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Packets (skipped under reduced motion — there are none).
      for (const p of packetsRef.current) {
        const a = nodeById.get(p.fromId)!;
        const b = nodeById.get(p.toId)!;
        const tt = p.t < 0 ? 0 : p.t > 1 ? 1 : p.t;
        const x = (a.x + (b.x - a.x) * tt) * sx;
        const y = (a.y + (b.y - a.y) * tt) * sy;
        const color = p.hot ? colors.gold : colors.primary;

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.16;
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.95;
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // Stochastic stand-in used under reduced-motion (no packet animation).
    const modelTick = () => {
      const down = downRef.current;
      const intensity = SPAWN_RATE[trafficRef.current];
      const maxIntensity = SPAWN_RATE.surge;
      const stats: NodeStats = {};
      let healthy = 0;
      let loadSum = 0;
      let loadN = 0;
      for (const node of SERVICE_NODES) {
        if (down.has(node.id)) {
          stats[node.id] = { load: 0, latencyMs: 0, rps: 0, status: "down" };
          nodeLoadDisplayRef.current.set(node.id, 0);
          continue;
        }
        const peers = STAGE_PEERS.get(node.id) ?? [];
        const peersDown = peers.filter((id) => down.has(id)).length;
        const concentration = peers.length > 0 ? 1 + peersDown / peers.length : 1;
        let load = (intensity / maxIntensity) * 0.6 * concentration + (Math.random() - 0.5) * 0.12;
        load = clamp01(load < 0.02 ? 0.02 : load);
        const queue = load * LOAD_FOR_DEGRADE * 1.7;
        const latencyMs = nodeLatency(queue);
        const status = statusFor(false, queue, latencyMs);
        if (status === "healthy") healthy += 1;
        loadSum += load;
        loadN += 1;
        nodeLoadDisplayRef.current.set(node.id, load);
        const rps = intensity * (0.6 + load * 0.8);
        stats[node.id] = { load, latencyMs: Math.round(latencyMs), rps: Math.round(rps), status };
      }
      const downCount = SERVICE_NODES.filter((node) => down.has(node.id)).length;
      const healthyFraction = 1 - downCount / SERVICE_NODES.length;
      const throughput = Math.round(intensity * healthyFraction * (0.9 + Math.random() * 0.2));
      const errorRate = downCount > 0 ? 0.02 + Math.random() * 0.08 : Math.random() * 0.008;
      servedRef.current += throughput * 1.1;
      const p99 = Math.round(40 + (loadN ? loadSum / loadN : 0) * 220 + Math.random() * 30);

      setNodeStats(stats);
      setMetrics({
        throughput,
        p99,
        errorRate,
        served: Math.round(servedRef.current),
        healthy,
        inflight: 0,
      });
      draw();
    };

    const measure = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cw = rect.width;
      const ch = rect.height;
      if (cw === 0 || ch === 0) {
        sizeRef.current = { cw: 0, ch: 0 };
        return;
      }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      const ctx = canvas.getContext("2d");
      ctxRef.current = ctx;
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { cw, ch };
      if (reducedMotion) draw();
    };

    let observer: ResizeObserver | undefined;
    const canvas = canvasRef.current;
    if (canvas) {
      observer = new ResizeObserver(measure);
      observer.observe(canvas);
      measure();
    }

    if (reducedMotion) {
      modelTick();
      const interval = window.setInterval(modelTick, 1100);
      return () => {
        window.clearInterval(interval);
        observer?.disconnect();
      };
    }

    let raf = 0;
    let lastTs = 0;
    let lastPushTs = performance.now();
    const step = (ts: number) => {
      const last = lastTs || ts;
      lastTs = ts;
      let dt = (ts - last) / 1000;
      if (dt > 0.05) dt = 0.05;
      if (runningRef.current) advance(dt, ts);
      draw();
      if (ts - lastPushTs >= 180) {
        const dtSec = Math.max((ts - lastPushTs) / 1000, 0.001);
        lastPushTs = ts;
        pushMetrics(ts, dtSec);
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
    // Engine is intentionally rebuilt only when the motion mode changes; live controls
    // are read through refs so they never need to restart the loop.
  }, [reducedMotion, canvasRef]);

  return {
    metrics,
    nodeStats,
    log,
    running,
    traffic,
    downIds,
    selectedId,
    announce,
    ...actions,
  };
}
