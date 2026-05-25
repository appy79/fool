import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";
import { distributedNodePositions } from "./data";

type Edge = readonly [string, string];

type DistributedSceneProps = {
  scenarioId: string;
  phaseIndex: number;
};

const canvas = { width: 780, height: 390 };

const meshEdges: readonly Edge[] = [
  ["A", "B"],
  ["B", "C"],
  ["B", "D"],
  ["B", "E"],
  ["B", "F"],
  ["B", "G"],
  ["C", "G"],
  ["D", "G"],
  ["E", "G"],
  ["F", "G"],
  ["C", "F"],
  ["D", "E"],
] as const;

const scenarioEdgeGroups: Record<string, readonly (readonly Edge[])[]> = {
  "total-order": [
    [["A", "B"]],
    [["B", "C"], ["B", "D"], ["B", "E"], ["B", "F"], ["B", "G"]],
    [["C", "C"], ["D", "D"], ["E", "E"], ["F", "F"], ["G", "G"]],
    [["C", "B"], ["D", "B"], ["E", "B"], ["F", "B"], ["G", "B"]],
  ],
  "logical-clocks": [
    [["A", "A"]],
    [["A", "D"]],
    [["D", "D"]],
    [["C", "F"]],
  ],
  byzantine: [
    [["B", "C"], ["B", "D"], ["B", "E"], ["B", "F"], ["B", "G"]],
    [["G", "C"], ["G", "D"], ["G", "F"]],
    [["C", "E"], ["D", "E"], ["F", "E"]],
    [["E", "B"], ["C", "B"], ["D", "B"], ["F", "B"]],
  ],
};

function getNodeStatus(scenarioId: string, phaseIndex: number, nodeId: string, nodeIndex: number) {
  if (scenarioId === "total-order") {
    if (nodeId === "B") {
      return phaseIndex >= 1 ? "seq #42" : "leader";
    }

    if (nodeId === "A") {
      return phaseIndex === 0 ? "propose" : "client";
    }

    return phaseIndex >= 2 ? "log #42" : "waiting";
  }

  if (scenarioId === "logical-clocks") {
    const clocksByPhase = [
      [1, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 0, 0, 0, 0],
      [2, 0, 0, 3, 0, 0, 0],
      [2, 0, 1, 3, 0, 1, 0],
    ];
    return `clock ${clocksByPhase[phaseIndex]?.[nodeIndex] ?? 0}`;
  }

  if (nodeId === "G") {
    return phaseIndex >= 1 ? "forked value" : "faulty";
  }

  if (nodeId === "B") {
    return phaseIndex >= 3 ? "reject lie" : "commander";
  }

  return phaseIndex >= 2 ? "honest vote" : "prepare";
}

function getNodeRole(scenarioId: string, nodeId: string, defaultRole: string) {
  if (scenarioId === "logical-clocks") {
    return "Node";
  }

  if (scenarioId === "byzantine") {
    if (nodeId === "B") {
      return "Commander";
    }

    if (nodeId === "G") {
      return "Faulty";
    }

    return "Honest";
  }

  return defaultRole;
}

export default function DistributedScene({ scenarioId, phaseIndex }: DistributedSceneProps) {
  const activeEdges = scenarioEdgeGroups[scenarioId]?.[phaseIndex] ?? [];
  const activeEdgeKeys = new Set(activeEdges.flatMap(([fromId, toId]) => [`${fromId}-${toId}`, `${toId}-${fromId}`]));
  const activeNodeIds = new Set(activeEdges.flatMap(([fromId, toId]) => [fromId, toId]));
  const selfMessageIds = new Set(activeEdges.filter(([fromId, toId]) => fromId === toId).map(([nodeId]) => nodeId));

  return (
    <LabSceneFrame className="p-0">
      <ScaledSceneCanvas
        aria-label="Distributed systems message animation"
        className="bg-gray-900"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(156,163,175,0.12)_1px,transparent_1px),linear-gradient(0deg,rgba(156,163,175,0.12)_1px,transparent_1px)] bg-[size:96px_68px] opacity-35" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />

        {meshEdges.map(([fromId, toId]) => {
          const startNode = distributedNodePositions.find((node) => node.id === fromId)!;
          const endNode = distributedNodePositions.find((node) => node.id === toId)!;
          const active = activeEdgeKeys.has(`${fromId}-${toId}`);

          return (
            <SceneConnector
              key={`${fromId}-${toId}`}
              canvasHeight={canvas.height}
              canvasWidth={canvas.width}
              className={active ? "animate-pulse bg-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.65)] motion-reduce:animate-none" : "bg-gray-700/70"}
              from={startNode}
              thickness={active ? 5 : 2}
              to={endNode}
            />
          );
        })}

        {distributedNodePositions.map((node, index) => {
          const faulty = scenarioId === "byzantine" && node.id === "G";
          const leader = scenarioId !== "logical-clocks" && node.id === "B";
          const active = activeNodeIds.has(node.id);
          const selfMessage = selfMessageIds.has(node.id);
          const status = getNodeStatus(scenarioId, phaseIndex, node.id, index);
          const role = getNodeRole(scenarioId, node.id, node.role);

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 motion-reduce:transition-none"
              style={scenePointStyle(node, canvas.width, canvas.height)}
            >
              {selfMessage ? (
                <>
                  <div className="absolute inset-[-1.25rem] animate-ping rounded-full border-4 border-amber-300/50 motion-reduce:animate-none" />
                  <div className="absolute inset-[-0.8rem] rounded-full border-2 border-dashed border-amber-100/80" />
                </>
              ) : null}
              <div
                className={`relative mx-auto grid h-20 w-20 place-items-center border-2 text-xl font-black shadow-xl transition [clip-path:polygon(25%_6%,75%_6%,100%_50%,75%_94%,25%_94%,0_50%)] ${
                  faulty
                    ? "border-red-100 bg-red-500 text-white shadow-red-500/35"
                    : leader
                      ? "border-yellow-100 bg-amber-400 text-stone-950 shadow-amber-500/35"
                      : active
                        ? "border-violet-200 bg-violet-900 text-white shadow-violet-500/35"
                        : "border-violet-300 bg-gray-800 text-gray-100"
                } ${leader || faulty || active ? "animate-pulse motion-reduce:animate-none" : ""}`}
              >
                {node.id}
              </div>
              <div className="mt-2 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-slate-400">{role}</div>
              <div className={`text-[0.68rem] ${active || faulty || leader ? "text-amber-200" : "text-slate-400"}`}>{status}</div>
              {scenarioId === "byzantine" && phaseIndex >= 1 && ["C", "D", "F"].includes(node.id) ? (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-red-200/40 bg-red-950 px-2 py-1 text-[0.62rem] font-black text-red-100">
                  {node.id === "D" ? "value Y" : "value X"}
                </div>
              ) : null}
              {scenarioId === "total-order" && phaseIndex >= 1 && node.id !== "A" ? (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-amber-200/40 bg-amber-950 px-2 py-1 text-[0.62rem] font-black text-amber-100">
                  log #42
                </div>
              ) : null}
            </div>
          );
        })}
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
