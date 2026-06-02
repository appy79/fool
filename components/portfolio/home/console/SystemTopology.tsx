"use client";

import { type CSSProperties, type KeyboardEvent, useCallback, useMemo, useRef } from "react";
import ScaledSceneCanvas from "../../labs/shared/ScaledSceneCanvas";
import {
  getServiceProject,
  nodeById,
  SERVICE_NODES,
  STAGES,
  TOPO_CANVAS,
  TOPO_EDGES,
  type ServiceNode,
} from "./topology";

type TopologyProps = {
  selectedId: string;
  onSelect: (id: string) => void;
  /** Explicit activation (click / Enter / Space). Arrow-key navigation only changes selection. */
  onActivate?: (id: string) => void;
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

type Direction = "left" | "right" | "up" | "down";

function findNeighbor(node: ServiceNode, dir: Direction): string | null {
  const others = SERVICE_NODES.filter((n) => n.id !== node.id);

  if (dir === "left" || dir === "right") {
    const candidates = others.filter((n) => (dir === "right" ? n.x > node.x : n.x < node.x));
    if (candidates.length === 0) return null;
    candidates.sort(
      (a, b) =>
        Math.abs(a.x - node.x) - Math.abs(b.x - node.x) ||
        Math.abs(a.y - node.y) - Math.abs(b.y - node.y),
    );
    return candidates[0].id;
  }

  const column = others.filter((n) => n.x === node.x);
  const candidates = column.filter((n) => (dir === "down" ? n.y > node.y : n.y < node.y));
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => Math.abs(a.y - node.y) - Math.abs(b.y - node.y));
  return candidates[0].id;
}

export default function SystemTopology({ selectedId, onSelect, onActivate }: TopologyProps) {
  const buttonRefs = useRef(new Map<string, HTMLButtonElement | null>());

  const neighborIds = useMemo(() => {
    const set = new Set<string>();
    for (const [from, to] of TOPO_EDGES) {
      if (from === selectedId) set.add(to);
      if (to === selectedId) set.add(from);
    }
    return set;
  }, [selectedId]);

  const select = useCallback(
    (id: string, focus = false) => {
      onSelect(id);
      if (focus) {
        requestAnimationFrame(() => buttonRefs.current.get(id)?.focus());
      }
    },
    [onSelect],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, node: ServiceNode) => {
      let targetId: string | null = null;

      if (event.key === "Home") targetId = SERVICE_NODES[0].id;
      else if (event.key === "End") targetId = SERVICE_NODES[SERVICE_NODES.length - 1].id;
      else if (event.key === "ArrowRight") targetId = findNeighbor(node, "right");
      else if (event.key === "ArrowLeft") targetId = findNeighbor(node, "left");
      else if (event.key === "ArrowUp") targetId = findNeighbor(node, "up");
      else if (event.key === "ArrowDown") targetId = findNeighbor(node, "down");

      if (!targetId) return;
      event.preventDefault();
      select(targetId, true);
    },
    [select],
  );

  return (
    <div>
      {/* Desktop: scaled SVG-style schematic with keyboard-navigable nodes. */}
      <div className="relative hidden md:block">
        <ScaledSceneCanvas
          aria-hidden="true"
          className="rounded-[1.4rem] border border-border/70 bg-card/30 backdrop-blur-sm"
          height={TOPO_CANVAS.height}
          width={TOPO_CANVAS.width}
        >
          <div className="absolute inset-0 bg-[linear-gradient(90deg,color-mix(in_oklch,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(0deg,color-mix(in_oklch,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
          {TOPO_EDGES.map(([fromId, toId]) => {
            const from = nodeById.get(fromId)!;
            const to = nodeById.get(toId)!;
            const active = fromId === selectedId || toId === selectedId;
            return <TopologyEdge key={`${fromId}-${toId}`} active={active} from={from} to={to} />;
          })}
        </ScaledSceneCanvas>

        {/* Overlay: stage labels + node buttons positioned by percentage (constant font size). */}
        <div className="pointer-events-none absolute inset-0">
          {STAGES.map((stage) => (
            <p
              key={stage.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
              style={{ left: pct(stage.x, TOPO_CANVAS.width), top: pct(70, TOPO_CANVAS.height) }}
            >
              <span className="block text-foreground">{stage.label}</span>
              <span className="block text-[0.5rem] text-primary">{`// ${stage.kicker}`}</span>
            </p>
          ))}

          <div
            className="pointer-events-auto contents"
            role="group"
            aria-label="System topology — select a service to inspect it"
          >
            {SERVICE_NODES.map((node) => {
              const state =
                node.id === selectedId ? "active" : neighborIds.has(node.id) ? "linked" : "idle";
              const project = getServiceProject(node);
              return (
                <button
                  key={node.id}
                  ref={(el) => {
                    buttonRefs.current.set(node.id, el);
                  }}
                  type="button"
                  aria-pressed={node.id === selectedId}
                  aria-label={`${project.title}, ${node.metric}`}
                  tabIndex={node.id === selectedId ? 0 : -1}
                  onClick={() => {
                    select(node.id);
                    onActivate?.(node.id);
                  }}
                  onKeyDown={(event) => handleKeyDown(event, node)}
                  className={`absolute flex w-[9rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-1 rounded-xl border px-3 py-2.5 text-left backdrop-blur-sm transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                    state === "active"
                      ? "z-20 scale-[1.06] border-primary bg-card/95 shadow-[0_0_28px_color-mix(in_oklch,var(--primary)_30%,transparent)]"
                      : state === "linked"
                        ? "z-10 border-primary/55 bg-card/85 hover:border-primary"
                        : "border-border/70 bg-card/65 hover:border-primary/50"
                  }`}
                  style={{
                    left: pct(node.x, TOPO_CANVAS.width),
                    top: pct(node.y, TOPO_CANVAS.height),
                  }}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-[0.64rem] font-bold uppercase tracking-[0.12em] ${
                        state === "idle" ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {node.label}
                    </span>
                    {state === "active" ? <span className="status-dot" aria-hidden="true" /> : null}
                  </span>
                  <span className="font-mono text-[0.78rem] font-black tabular-nums tracking-[-0.01em] text-primary">
                    {node.metric}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: stacked, grouped service list (no schematic). */}
      <div className="space-y-5 md:hidden">
        {STAGES.map((stage) => (
          <div key={stage.id}>
            <p className="mb-2 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-foreground">{stage.label}</span> {`// ${stage.kicker}`}
            </p>
            <div className="grid gap-2">
              {SERVICE_NODES.filter((node) => node.stageId === stage.id).map((node) => {
                const project = getServiceProject(node);
                const selected = node.id === selectedId;
                return (
                  <button
                    key={node.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      onSelect(node.id);
                      onActivate?.(node.id);
                    }}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-3.5 py-3 text-left transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                      selected
                        ? "border-primary bg-card/90"
                        : "border-border/70 bg-card/60 hover:border-primary/50"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-[0.7rem] font-bold uppercase tracking-[0.1em] text-foreground">
                        {node.label}
                      </span>
                      <span className="block truncate text-[0.7rem] text-muted-foreground">
                        {project.category}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[0.74rem] font-black tabular-nums text-primary">
                      {node.metric}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopologyEdge({
  active,
  from,
  to,
}: {
  active: boolean;
  from: ServiceNode;
  to: ServiceNode;
}) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <>
      <span
        className={`absolute origin-left ${active ? "bg-primary/70" : "bg-primary/15"}`}
        style={{
          left: from.x,
          top: from.y,
          width: length,
          height: active ? 2.5 : 1.5,
          transform: `translateY(-50%) rotate(${angle}deg)`,
        }}
      />
      {active ? (
        <span
          className="pointer-events-none absolute block h-3 origin-left"
          style={{
            left: from.x,
            top: from.y,
            width: length,
            transform: `translateY(-50%) rotate(${angle}deg)`,
          }}
        >
          {[0, 0.6].map((delay) => (
            <span
              key={delay}
              className="project-flow-pulse absolute left-0 top-1/2 block size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_70%,transparent)] motion-reduce:hidden"
              style={
                {
                  "--project-flow-distance": `${Math.max(length - 8, 0)}px`,
                  animationDelay: `${delay}s`,
                } as CSSProperties
              }
            />
          ))}
        </span>
      ) : null}
    </>
  );
}
