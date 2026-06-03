import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";
import { distributedNodePositions } from "./data";
import type { DistributedEdge, DistributedScenario } from "./data";

type DistributedSceneProps = {
  scenario: DistributedScenario;
  phaseIndex: number;
};

const canvas = { width: 780, height: 390 };

function getUndirectedEdgeKey([fromId, toId]: DistributedEdge) {
  return [fromId, toId].sort().join("-");
}

function getScenarioEdges(scenario: DistributedScenario) {
  const edges = new Map<string, DistributedEdge>();

  scenario.phases.forEach((phase) => {
    phase.activeEdges.forEach((edge) => {
      const [fromId, toId] = edge;

      if (fromId !== toId) {
        edges.set(getUndirectedEdgeKey(edge), edge);
      }
    });
  });

  return Array.from(edges.values());
}

export default function DistributedScene({ scenario, phaseIndex }: DistributedSceneProps) {
  const safePhaseIndex = Math.min(phaseIndex, scenario.phases.length - 1);
  const phase = scenario.phases[safePhaseIndex] ?? scenario.phases[0];
  const networkEdges = getScenarioEdges(scenario);
  const activeEdgeKeys = new Set(phase.activeEdges.map((edge) => getUndirectedEdgeKey(edge)));
  const activeNodeIds = new Set([
    ...(phase.activeNodes ?? []),
    ...phase.activeEdges.flatMap(([fromId, toId]) => [fromId, toId]),
    ...(phase.selfNodes ?? []),
  ]);
  const selfMessageIds = new Set(phase.selfNodes ?? []);

  return (
    <LabSceneFrame className="p-0 border-gray-800 shadow-inner">
      <ScaledSceneCanvas
        aria-label="Distributed systems message animation"
        className="bg-[#0f172a]"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:96px_68px] opacity-40 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
        <div className="absolute left-4 top-4 z-20 max-w-[320px] rounded-2xl border border-slate-700/80 bg-slate-950/80 px-4 py-3 shadow-xl">
          <p className="text-[0.62rem] font-black uppercase tracking-[0.22em] text-amber-200">
            Step {safePhaseIndex + 1} / {scenario.phases.length}
          </p>
          <p className="mt-1 text-sm font-black text-slate-100">{phase.title}</p>
          <p className="mt-1 text-[0.7rem] leading-5 text-slate-300">{phase.summary}</p>
        </div>

        {networkEdges.map((edge) => {
          const [fromId, toId] = edge;
          const startNode = distributedNodePositions.find((node) => node.id === fromId)!;
          const endNode = distributedNodePositions.find((node) => node.id === toId)!;
          const active = activeEdgeKeys.has(getUndirectedEdgeKey(edge));

          return (
            <SceneConnector
              key={`${fromId}-${toId}`}
              canvasHeight={canvas.height}
              canvasWidth={canvas.width}
              className={
                active
                  ? "animate-pulse bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.6)] motion-reduce:animate-none"
                  : "bg-slate-800"
              }
              from={startNode}
              thickness={active ? 5 : 2}
              to={endNode}
            />
          );
        })}

        {distributedNodePositions.map((node) => {
          const faulty = scenario.faultyNodeIds?.includes(node.id) ?? false;
          const leader = scenario.leaderNodeIds?.includes(node.id) ?? false;
          const active = activeNodeIds.has(node.id);
          const selfMessage = selfMessageIds.has(node.id);
          const status = phase.statuses[node.id] ?? "idle";
          const role =
            scenario.nodeRoles?.[node.id] ??
            (scenario.id === "logical-clocks" ? "Node" : node.role);
          const badge = phase.badges?.[node.id];

          // Configure distinct hardware profiles for Distributed nodes without any clip-paths to avoid text clipping!
          let shapeClasses = "";
          if (faulty) {
            // Cracked, rotated warning card representing a buggy byzantine element
            shapeClasses =
              "rounded-xl border-4 border-dashed border-red-500 bg-red-950/80 rotate-6 text-red-100 shadow-red-950/50 scale-95";
          } else if (leader) {
            // Glorious double gold outline circle represents the central routing organizer / leader
            shapeClasses =
              "rounded-full border-4 border-double border-amber-300 bg-amber-500 text-stone-950 font-black shadow-amber-400/40 scale-105";
          } else if (node.id === "A") {
            // Satellite client device sphere
            shapeClasses =
              "rounded-full border-2 border-dashed border-sky-400 bg-sky-950/80 text-sky-100";
          } else {
            // Standard honest cluster replica nodes - sleek rounded hexagons / boxes
            shapeClasses =
              "rounded-2xl border-2 border-indigo-400 bg-[#16122d]/90 text-white shadow-lg";
          }

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 motion-reduce:transition-none"
              style={scenePointStyle(node, canvas.width, canvas.height)}
            >
              {selfMessage ? (
                <>
                  <div className="absolute inset-[-1.1rem] animate-ping rounded-full border-4 border-amber-300/40 motion-reduce:animate-none" />
                  <div className="absolute inset-[-0.7rem] rounded-full border-2 border-dashed border-amber-100/60" />
                </>
              ) : null}

              {/* Node container */}
              <div
                className={`relative mx-auto grid h-16 w-16 place-items-center text-xl font-black shadow-xl transition-all duration-300 ${shapeClasses} ${
                  leader || faulty || active ? "animate-pulse motion-reduce:animate-none" : ""
                }`}
              >
                {node.id}
              </div>

              {/* Sub-node details labels */}
              <div className="mt-1.5 flex flex-col items-center">
                <span className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-slate-400 leading-none">
                  {role}
                </span>
                <span
                  className={`text-[0.62rem] font-bold leading-normal mt-0.5 ${active || faulty || leader ? "text-amber-200" : "text-slate-500"}`}
                >
                  {status}
                </span>
              </div>

              {badge ? (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-amber-500/30 bg-slate-950 px-2 py-0.5 text-[0.55rem] font-black uppercase tracking-wider text-amber-200 shadow-md">
                  {badge}
                </div>
              ) : null}
            </div>
          );
        })}
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
