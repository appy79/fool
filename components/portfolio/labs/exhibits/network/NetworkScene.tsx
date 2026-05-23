import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";
import { networkNodePositions } from "./data";

type NetworkSceneProps = {
  scenarioId: string;
  route: readonly string[];
  activeIndex: number;
  activeNodeId: string;
};

const canvas = { width: 980, height: 360 };

export default function NetworkScene({ scenarioId, route, activeIndex, activeNodeId }: NetworkSceneProps) {
  const routeSet = new Set(route);
  const activeNode = networkNodePositions[activeNodeId] ?? networkNodePositions.client;

  return (
    <LabSceneFrame className="p-0">
      <ScaledSceneCanvas
        aria-label="Network edge route animation"
        className="bg-[#071a2f]"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="absolute left-[7%] top-[80%] h-24 w-[88%] -translate-y-1/2 rotate-[-12deg] rounded-full bg-sky-950/45 blur-sm" />
        <div className="absolute left-[78%] top-[5%] h-44 w-44 rounded-full border border-sky-300/10" />
        <div className="absolute left-[75%] top-[-3%] h-64 w-64 rounded-full border border-sky-300/10" />
        <div className="absolute left-[50%] top-[40%] h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />

        {scenarioId === "edge-hit" ? (
          <div className={`absolute left-[50%] top-[9%] rounded-2xl border border-emerald-200 bg-emerald-950 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-emerald-100 shadow-lg shadow-emerald-500/15 transition ${activeIndex >= 2 ? "opacity-100" : "opacity-30"}`}>
            Cache hit: stop here
          </div>
        ) : null}
        {scenarioId === "origin-miss" ? (
          <div className={`absolute left-[64%] top-[11%] rounded-2xl border border-orange-300 bg-orange-950 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-orange-100 shadow-lg shadow-orange-500/15 transition ${activeIndex >= 3 ? "opacity-100" : "opacity-30"}`}>
            Miss: fetch + fill
          </div>
        ) : null}
        {scenarioId === "api-edge" ? (
          <div className={`absolute left-[46%] top-[72%] rounded-2xl border border-violet-300 bg-violet-950 px-4 py-2 text-center text-xs font-black uppercase tracking-[0.16em] text-violet-100 shadow-lg shadow-violet-500/15 transition ${activeIndex >= 2 ? "opacity-100" : "opacity-30"}`}>
            TLS / L7 gate
          </div>
        ) : null}

        {route.slice(0, -1).map((fromId, index) => {
          const toId = route[index + 1] ?? fromId;
          const from = networkNodePositions[fromId];
          const to = networkNodePositions[toId];
          const completed = index < activeIndex;

          return (
            <SceneConnector
              key={`${fromId}-${toId}`}
              canvasHeight={canvas.height}
              canvasWidth={canvas.width}
              className={completed ? "bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.65)]" : "bg-slate-800"}
              from={from}
              thickness={completed ? 8 : 4}
              to={to}
            />
          );
        })}

        {Object.entries(networkNodePositions).map(([nodeId, node]) => {
          const inRoute = routeSet.has(nodeId);
          const routeIndex = route.indexOf(nodeId);
          const active = activeNodeId === nodeId;
          const completed = inRoute && routeIndex < activeIndex;

          return (
            <div
              key={nodeId}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={scenePointStyle(node, canvas.width, canvas.height)}
            >
              {active ? <div className="absolute inset-[-0.65rem] animate-ping rounded-2xl bg-sky-300/20" /> : null}
              <div
                className={`relative grid h-14 min-w-24 place-items-center rounded-2xl border-2 px-4 text-sm font-extrabold shadow-xl transition ${
                  active
                    ? "border-sky-50 bg-sky-300 text-sky-950 shadow-sky-400/35"
                    : completed
                      ? "border-teal-300 bg-teal-700 text-white shadow-teal-500/25"
                      : "border-sky-500 bg-sky-950 text-slate-100"
                } ${inRoute ? "opacity-100" : "opacity-35"}`}
              >
                {node.label}
              </div>
            </div>
          );
        })}

        <div
          className="absolute h-0 w-0 -translate-x-1/2 -translate-y-[3.2rem] animate-pulse border-x-[10px] border-b-[18px] border-x-transparent border-b-white drop-shadow-[0_0_14px_rgba(255,255,255,0.8)] transition-all duration-700"
          style={scenePointStyle(activeNode, canvas.width, canvas.height)}
        />
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
