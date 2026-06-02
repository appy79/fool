"use client";

import { type CSSProperties, useMemo } from "react";
import SceneConnector, { scenePointStyle } from "../../labs/shared/SceneConnector";
import NodeMotif from "./NodeMotif";
import useFlowPhase from "./useFlowPhase";
import {
  CANVAS,
  edgeKey,
  type EdgeState,
  type FlowNode,
  type NodeState,
  type ProjectFlow,
  type ScenePoint,
} from "./types";

export default function ProjectFlowScene({ flow }: { flow: ProjectFlow }) {
  const phase = useFlowPhase(flow.steps.length);
  const safePhase = Math.min(phase, flow.steps.length - 1);
  const step = flow.steps[safePhase];

  const litNow = useMemo(() => new Set(step.lit), [step]);
  const reached = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < safePhase; i += 1) {
      flow.steps[i].lit.forEach((id) => set.add(id));
    }
    return set;
  }, [flow, safePhase]);

  const flowingEdges = useMemo(() => new Set(step.edges.map(edgeKey)), [step]);
  const doneEdges = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < safePhase; i += 1) {
      flow.steps[i].edges.forEach((edge) => set.add(edgeKey(edge)));
    }
    return set;
  }, [flow, safePhase]);

  const nodeById = useMemo(() => {
    const map: Record<string, FlowNode> = {};
    flow.nodes.forEach((node) => {
      map[node.id] = node;
    });
    return map;
  }, [flow]);

  const getNodeState = (id: string): NodeState => {
    if (litNow.has(id)) return "active";
    if (reached.has(id)) return "done";
    return "pending";
  };

  return (
    <>
      <div className="absolute left-8 top-8 z-20 max-w-[520px] overflow-hidden rounded-full border border-primary/25 bg-background/75 px-4 py-2 shadow-xl">
        <span className="block truncate font-mono text-[0.62rem] font-black uppercase tracking-[0.16em] text-primary">
          <span className="text-muted-foreground">problem · </span>
          {flow.problem}
        </span>
      </div>

      {flow.edges.map((edge) => {
        const key = edgeKey(edge);
        const state: EdgeState = flowingEdges.has(key) ? "flow" : doneEdges.has(key) ? "done" : "idle";
        const from = nodeById[edge[0]]?.point;
        const to = nodeById[edge[1]]?.point;
        if (!from || !to) return null;

        return <FlowEdgeLine key={key} from={from} state={state} to={to} />;
      })}

      {flow.nodes.map((node) => (
        <ProjectFlowNode key={node.id} node={node} state={getNodeState(node.id)} />
      ))}

      <SceneNarration
        caption={step.caption}
        metric={step.metric}
        phase={safePhase}
        total={flow.steps.length}
      />
    </>
  );
}

function FlowEdgeLine({ from, state, to }: { from: ScenePoint; state: EdgeState; to: ScenePoint }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const color =
    state === "flow"
      ? "bg-primary/75 shadow-[0_0_16px_color-mix(in_oklch,var(--primary)_55%,transparent)]"
      : state === "done"
        ? "bg-primary/45"
        : "bg-primary/12";
  const thickness = state === "idle" ? 3 : state === "done" ? 5 : 6;

  return (
    <>
      <SceneConnector
        canvasHeight={CANVAS.height}
        canvasWidth={CANVAS.width}
        className={`transition-all duration-500 motion-reduce:transition-none ${color}`}
        from={from}
        thickness={thickness}
        to={to}
      />
      {state === "flow" ? (
        <span
          className="pointer-events-none absolute z-[2] block h-3"
          style={{
            left: from.x,
            top: from.y,
            transform: `translateY(-50%) rotate(${angle}deg)`,
            transformOrigin: "left center",
            width: length,
          }}
        >
          {[0, 0.4].map((delay) => (
            <span
              key={delay}
              className="project-flow-pulse absolute left-0 top-0 block size-3 rounded-full bg-primary shadow-[0_0_18px_color-mix(in_oklch,var(--primary)_70%,transparent)] motion-reduce:hidden"
              style={
                {
                  "--project-flow-distance": `${Math.max(length - 12, 0)}px`,
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

function ProjectFlowNode({ node, state }: { node: FlowNode; state: NodeState }) {
  const active = state === "active";
  const done = state === "done";

  return (
    <div
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 motion-reduce:transition-none ${
        active ? "scale-[1.05]" : ""
      }`}
      style={{ ...scenePointStyle(node.point, CANVAS.width, CANVAS.height), width: node.width ?? 156 }}
    >
      {active ? <span className="absolute inset-[-0.7rem] animate-ping rounded-[1.7rem] bg-primary/15 motion-reduce:hidden" /> : null}
      <div
        className={`relative grid min-h-[96px] content-center gap-2 rounded-2xl border px-3 py-3 text-center shadow-xl transition-all duration-500 motion-reduce:transition-none ${
          active
            ? "border-primary/75 bg-background/90 shadow-[0_0_30px_color-mix(in_oklch,var(--primary)_22%,transparent)]"
            : done
              ? "border-primary/45 bg-background/75 shadow-foreground/10"
              : "border-primary/15 bg-background/45 opacity-55 shadow-none"
        }`}
      >
        <p className={`truncate font-mono text-[0.6rem] font-black uppercase tracking-[0.16em] ${active || done ? "text-primary" : "text-muted-foreground"}`}>
          {node.label}
        </p>
        <NodeMotif active={active} kind={node.motif} />
        <p className="mx-auto max-w-[150px] text-balance font-mono text-[0.58rem] font-bold uppercase leading-tight tracking-[0.06em] text-foreground/80">
          {node.detail}
        </p>
      </div>
      {done ? (
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full border border-primary/50 bg-background font-mono text-[0.6rem] font-black leading-none text-primary shadow-md">
          ✓
        </span>
      ) : null}
    </div>
  );
}

function SceneNarration({
  caption,
  metric,
  phase,
  total,
}: {
  caption: string;
  metric?: string;
  phase: number;
  total: number;
}) {
  return (
    <div
      className="absolute z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      style={{ left: "50%", top: 378 }}
    >
      <div className="flex max-w-[660px] items-center gap-3 rounded-full border border-primary/45 bg-background/85 px-4 py-2 shadow-2xl backdrop-blur">
        <span className="font-mono text-[0.62rem] font-black tabular-nums text-primary">
          {String(phase + 1).padStart(2, "0")}
          <span className="text-muted-foreground">/{String(total).padStart(2, "0")}</span>
        </span>
        <span className="h-3.5 w-px bg-primary/30" />
        <span className="whitespace-nowrap font-mono text-[0.64rem] font-bold uppercase tracking-[0.12em] text-foreground">
          {caption}
        </span>
        {metric ? (
          <span className="rounded-full bg-primary px-2 py-0.5 font-mono text-[0.58rem] font-black uppercase tracking-[0.08em] text-background shadow-sm">
            {metric}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={`h-1 rounded-full transition-all duration-500 motion-reduce:transition-none ${
              index === phase ? "w-7 bg-primary" : index < phase ? "w-4 bg-primary/55" : "w-4 bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
