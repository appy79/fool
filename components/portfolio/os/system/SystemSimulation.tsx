"use client";

import { type KeyboardEvent, useRef } from "react";
import {
  getServiceProject,
  nodeById,
  SERVICE_NODES,
  STAGES,
  stageById,
  TOPO_CANVAS,
  type ServiceNode,
} from "../../home/console/topology";
import { PrimeRadiantGlyph } from "../../icons/FoundationMotifs";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";
import { useOS } from "../osStore";
import { useOSSettings } from "../osSettings";
import {
  formatCount,
  type LogLevel,
  type NodeStat,
  type NodeStatus,
  TRAFFIC_LEVELS,
} from "./simModel";
import { useSystemSimulation } from "./useSystemSimulation";

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

const STATUS_DOT: Record<NodeStatus, string> = {
  healthy: "bg-primary",
  degraded: "bg-gold",
  down: "bg-destructive",
};

const STATUS_BAR: Record<NodeStatus, string> = {
  healthy: "bg-primary",
  degraded: "bg-gold",
  down: "bg-destructive/60",
};

const STATUS_LABEL: Record<NodeStatus, string> = {
  healthy: "Healthy",
  degraded: "Degraded",
  down: "Offline",
};

const LOG_DOT: Record<LogLevel, string> = {
  info: "bg-muted-foreground",
  ok: "bg-primary",
  warn: "bg-gold",
  error: "bg-destructive",
};

export default function SystemSimulation() {
  const { openApp } = useOS();
  const settingsMotion = useOSSettings().reduceMotion;
  const systemMotion = usePrefersReducedMotion();
  const reducedMotion = settingsMotion || systemMotion;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement | null>());

  const sim = useSystemSimulation({ canvasRef, reducedMotion });
  const {
    metrics,
    nodeStats,
    log,
    running,
    traffic,
    downIds,
    selectedId,
    announce,
    toggleRunning,
    setTrafficLevel,
    selectNode,
    toggleNodeDown,
    reset,
  } = sim;

  const selectedNode = nodeById.get(selectedId) ?? SERVICE_NODES[0];
  const selectedProject = getServiceProject(selectedNode);
  const selectedStage = stageById.get(selectedNode.stageId);
  const selectedStat = nodeStats[selectedNode.id];
  const selectedDown = downIds.includes(selectedNode.id);

  const openCaseFile = (node: ServiceNode) =>
    openApp("casefile", { projectTitle: node.projectTitle });

  const handleNodeKeyDown = (event: KeyboardEvent<HTMLButtonElement>, node: ServiceNode) => {
    const index = SERVICE_NODES.findIndex((n) => n.id === node.id);
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      nextIndex = (index + 1) % SERVICE_NODES.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      nextIndex = (index - 1 + SERVICE_NODES.length) % SERVICE_NODES.length;
    if (nextIndex === null) return;
    event.preventDefault();
    const target = SERVICE_NODES[nextIndex];
    selectNode(target.id);
    requestAnimationFrame(() => buttonRefs.current.get(target.id)?.focus());
  };

  return (
    <div className="space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
            <PrimeRadiantGlyph className="size-3.5" />
            system // live operations
          </span>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
            The operations console
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            A live request mesh from edge to delivery. Drive traffic, take a node offline, and watch
            the cluster reroute. Each node is a real system — open its case file.
          </p>
        </div>
      </header>

      {/* HUD */}
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        <Metric label="Throughput" value={`${metrics.throughput}`} unit="req/s" />
        <Metric label="p99 latency" value={`${metrics.p99}`} unit="ms" />
        <Metric
          label="Error rate"
          value={`${(metrics.errorRate * 100).toFixed(1)}`}
          unit="%"
          alert={metrics.errorRate > 0.05}
        />
        <Metric label="Served" value={formatCount(metrics.served)} unit="reqs" />
        <Metric
          label="Nodes online"
          value={`${SERVICE_NODES.length - downIds.length}`}
          unit={`/ ${SERVICE_NODES.length}`}
          alert={downIds.length > 0}
        />
      </dl>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={toggleRunning}
          disabled={reducedMotion}
          aria-pressed={running}
          className="inline-flex items-center gap-2 border border-primary/50 bg-primary/10 px-3.5 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {running ? "❚❚ Pause" : "▶ Resume"}
        </button>

        <div
          role="group"
          aria-label="Traffic level"
          className="inline-flex items-center overflow-hidden rounded-md border border-border/70"
        >
          {TRAFFIC_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              aria-pressed={traffic === level.id}
              onClick={() => setTrafficLevel(level.id)}
              className={`px-3 py-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                traffic === level.id
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 border border-border/70 px-3.5 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
        >
          ↺ Reset
        </button>

        <span className="ml-auto inline-flex items-center gap-3 font-mono text-[0.54rem] uppercase tracking-[0.14em] text-muted-foreground">
          <Legend status="healthy" />
          <Legend status="degraded" />
          <Legend status="down" />
        </span>
      </div>

      {reducedMotion ? (
        <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted-foreground">
          motion reduced // showing live metrics without packet animation
        </p>
      ) : null}

      {/* Desktop schematic */}
      <div className="relative hidden overflow-hidden rounded-[1.4rem] border border-border/70 bg-card/30 backdrop-blur-sm md:block">
        <div
          className="relative w-full"
          style={{ aspectRatio: `${TOPO_CANVAS.width} / ${TOPO_CANVAS.height}` }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(0deg,color-mix(in_oklch,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />

          <div className="pointer-events-none absolute inset-0">
            {STAGES.map((stage) => (
              <p
                key={stage.id}
                className="absolute -translate-x-1/2 text-center font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                style={{ left: pct(stage.x, TOPO_CANVAS.width), top: "4%" }}
              >
                <span className="block text-foreground">{stage.label}</span>
                <span className="block text-[0.48rem] text-primary">{`// ${stage.kicker}`}</span>
              </p>
            ))}
          </div>

          <div
            className="absolute inset-0"
            role="group"
            aria-label="Live system topology — select a service to inspect it"
          >
            {SERVICE_NODES.map((node) => {
              const stat = nodeStats[node.id];
              const isSelected = node.id === selectedId;
              return (
                <NodeChip
                  key={node.id}
                  node={node}
                  stat={stat}
                  selected={isSelected}
                  buttonRef={(el) => buttonRefs.current.set(node.id, el)}
                  onSelect={() => selectNode(node.id)}
                  onKeyDown={(event) => handleNodeKeyDown(event, node)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile service list */}
      <div className="space-y-4 md:hidden">
        {STAGES.map((stage) => (
          <div key={stage.id}>
            <p className="mb-2 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">{stage.label}</span> {`// ${stage.kicker}`}
            </p>
            <div className="grid gap-2">
              {SERVICE_NODES.filter((node) => node.stageId === stage.id).map((node) => {
                const stat = nodeStats[node.id];
                const isSelected = node.id === selectedId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => selectNode(node.id)}
                    className={`flex flex-col gap-2 rounded-lg border px-3.5 py-3 text-left transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                      isSelected
                        ? "border-primary bg-card/90"
                        : "border-border/70 bg-card/60 hover:border-primary/50"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] text-foreground">
                        <span
                          className={`size-1.5 rounded-full ${STATUS_DOT[stat?.status ?? "healthy"]}`}
                          aria-hidden="true"
                        />
                        {node.label}
                      </span>
                      <span className="shrink-0 font-mono text-[0.66rem] tabular-nums text-muted-foreground">
                        {stat ? `${stat.rps} rps · ${stat.latencyMs}ms` : "—"}
                      </span>
                    </span>
                    <LoadBar stat={stat} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Detail + log */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <section
          className="instrument-panel flex flex-col gap-3"
          aria-label={`${selectedNode.label} detail`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-primary">
              {`${selectedStage?.label ?? "Service"} // ${selectedProject.category}`}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.14em] ${
                selectedStat?.status === "down"
                  ? "text-destructive"
                  : selectedStat?.status === "degraded"
                    ? "text-gold"
                    : "text-primary"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${STATUS_DOT[selectedStat?.status ?? "healthy"]}`}
                aria-hidden="true"
              />
              {STATUS_LABEL[selectedStat?.status ?? "healthy"]}
            </span>
          </div>

          <p className="font-semibold tracking-[-0.01em] text-foreground">{selectedProject.title}</p>

          <dl className="grid grid-cols-3 gap-2">
            <MiniStat label="Req/s" value={selectedStat ? `${selectedStat.rps}` : "—"} />
            <MiniStat label="Latency" value={selectedStat ? `${selectedStat.latencyMs}ms` : "—"} />
            <MiniStat
              label="Load"
              value={selectedStat ? `${Math.round(selectedStat.load * 100)}%` : "—"}
            />
          </dl>
          <LoadBar stat={selectedStat} />

          <p className="text-sm leading-6 text-muted-foreground">{selectedProject.impact}</p>

          <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => openCaseFile(selectedNode)}
              className="border border-primary/50 bg-primary/10 px-3.5 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              Open case file
            </button>
            <button
              type="button"
              onClick={() => toggleNodeDown(selectedNode.id)}
              className={`border px-3.5 py-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                selectedDown
                  ? "border-primary/50 text-primary hover:bg-primary/10"
                  : "border-destructive/55 text-destructive hover:bg-destructive/10"
              }`}
            >
              {selectedDown ? "Restore node" : "Take offline"}
            </button>
          </div>
        </section>

        <section aria-label="Event log" className="instrument-panel flex flex-col gap-2">
          <span className="font-mono text-[0.54rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            event log // live
          </span>
          <ul className="flex flex-col gap-1.5 overflow-hidden font-mono text-[0.66rem] leading-5">
            {log.slice(0, 8).map((entry) => (
              <li key={entry.id} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 size-1.5 shrink-0 rounded-full ${LOG_DOT[entry.level]}`}
                  aria-hidden="true"
                />
                <span
                  className={
                    entry.level === "error"
                      ? "text-destructive"
                      : entry.level === "warn"
                        ? "text-gold"
                        : entry.level === "ok"
                          ? "text-foreground"
                          : "text-muted-foreground"
                  }
                >
                  {entry.text}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
  alert,
}: {
  label: string;
  value: string;
  unit?: string;
  alert?: boolean;
}) {
  return (
    <div className="border border-border/60 bg-card/40 p-3">
      <dt className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 flex items-baseline gap-1">
        <span
          className={`font-mono text-xl font-black tabular-nums tracking-[-0.02em] ${
            alert ? "text-destructive" : "text-primary"
          }`}
        >
          {value}
        </span>
        {unit ? (
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 bg-card/40 px-2.5 py-2">
      <dt className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-sm font-bold tabular-nums text-foreground">{value}</dd>
    </div>
  );
}

function LoadBar({ stat }: { stat?: NodeStat }) {
  const status = stat?.status ?? "healthy";
  const width = stat?.status === "down" ? 0 : Math.round((stat?.load ?? 0) * 100);
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-border/60" aria-hidden="true">
      <div
        className={`h-full rounded-full transition-[width] duration-200 ${STATUS_BAR[status]}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function Legend({ status }: { status: NodeStatus }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  );
}

function NodeChip({
  node,
  stat,
  selected,
  buttonRef,
  onSelect,
  onKeyDown,
}: {
  node: ServiceNode;
  stat?: NodeStat;
  selected: boolean;
  buttonRef: (el: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const status = stat?.status ?? "healthy";
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-pressed={selected}
      aria-label={`${node.label}, ${STATUS_LABEL[status]}${stat ? `, ${stat.rps} requests per second` : ""}`}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={`absolute flex w-[8.5rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left backdrop-blur-sm transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
        status === "down"
          ? "border-destructive/60 bg-card/80"
          : selected
            ? "z-20 scale-[1.05] border-primary bg-card/95 shadow-[0_0_28px_color-mix(in_oklch,var(--primary)_28%,transparent)]"
            : status === "degraded"
              ? "z-10 border-gold/60 bg-card/85"
              : "border-border/70 bg-card/70 hover:border-primary/50"
      }`}
      style={{ left: pct(node.x, TOPO_CANVAS.width), top: pct(node.y, TOPO_CANVAS.height) }}
    >
      <span className="flex items-center justify-between gap-2">
        <span
          className={`font-mono text-[0.62rem] font-bold uppercase tracking-[0.1em] ${
            status === "down" ? "text-muted-foreground" : "text-foreground"
          }`}
        >
          {node.label}
        </span>
        <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
      </span>
      <span className="flex items-baseline justify-between gap-1">
        <span className="font-mono text-[0.74rem] font-black tabular-nums text-primary">
          {status === "down" ? "—" : `${stat?.rps ?? 0}`}
        </span>
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.1em] text-muted-foreground">
          {status === "down" ? "offline" : `${stat?.latencyMs ?? 0}ms`}
        </span>
      </span>
      <LoadBar stat={stat} />
    </button>
  );
}
