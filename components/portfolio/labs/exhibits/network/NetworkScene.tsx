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
        <div className="absolute left-[7%] top-[80%] h-24 w-[88%] -translate-y-1/2 rotate-[-12deg] rounded-full bg-sky-950/45 blur-sm pointer-events-none" />
        <div className="absolute left-[78%] top-[5%] h-44 w-44 rounded-full border border-sky-300/10 pointer-events-none" />
        <div className="absolute left-[75%] top-[-3%] h-64 w-64 rounded-full border border-sky-300/10 pointer-events-none" />
        <div className="absolute left-[50%] top-[40%] h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl pointer-events-none" />

        {scenarioId === "edge-hit" ? (
          <div className={`absolute left-[50%] top-[9%] rounded-full border border-emerald-400 bg-emerald-950/90 px-4 py-1 text-center text-xs font-black uppercase tracking-[0.18em] text-emerald-100 shadow-lg shadow-emerald-500/20 transition ${activeIndex >= 3 ? "opacity-100" : "opacity-35"}`}>
            ⚡ Edge Cache Hit: Origin Bypassed
          </div>
        ) : null}
        {scenarioId === "origin-miss" ? (
          <div className={`absolute left-[64%] top-[11%] rounded-full border border-orange-400 bg-orange-950/90 px-4 py-1 text-center text-xs font-black uppercase tracking-[0.18em] text-orange-100 shadow-lg shadow-orange-500/20 transition ${activeIndex >= 3 ? "opacity-100" : "opacity-35"}`}>
            🔍 Cache Miss: Fetch Origin, Fill Cache
          </div>
        ) : null}
        {scenarioId === "api-edge" ? (
          <div className={`absolute left-[46%] top-[72%] rounded-full border border-violet-400 bg-violet-950/90 px-4 py-1 text-center text-xs font-black uppercase tracking-[0.18em] text-violet-100 shadow-lg shadow-violet-500/20 transition ${activeIndex >= 2 ? "opacity-100" : "opacity-35"}`}>
            🔒 TLS/L7 Edge Handling
          </div>
        ) : null}
        <div className={`absolute left-[17%] top-[27%] rounded-full border border-sky-300/30 bg-sky-950/80 px-3 py-1 text-[0.58rem] font-black uppercase tracking-[0.16em] text-sky-100 transition ${activeIndex >= 1 ? "opacity-100" : "opacity-35"}`}>
          DNS is resolution, not payload transit
        </div>

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
              className={completed ? "bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.55)]" : "bg-slate-800"}
              from={from}
              thickness={completed ? 6 : 3}
              to={to}
            />
          );
        })}

        {Object.entries(networkNodePositions).map(([nodeId, node]) => {
          const inRoute = routeSet.has(nodeId);
          const routeIndex = route.indexOf(nodeId);
          const active = activeNodeId === nodeId;
          const completed = inRoute && routeIndex < activeIndex;

          // Define unique visual character/styles for each distinct network node type - NO clip-paths to prevent text cutting!
          let shapeClasses = "";
          let prefixLabel = "";

          if (nodeId === "client") {
            // Screen / Laptop Terminal form factor
            shapeClasses = "rounded-t-2xl rounded-b-sm border-b-[8px] border-b-slate-600";
            prefixLabel = "💻 ";
          } else if (nodeId === "dns") {
            // Concentric directory circular compass hub
            shapeClasses = "rounded-full border-2 border-dashed";
            prefixLabel = "🎯 ";
          } else if (nodeId === "edge" || nodeId === "cdn") {
            // Cloud edge/router nodes - organic rounded leaf/cloud design
            shapeClasses = "rounded-t-3xl rounded-b-xl border-t-[4px] border-cyan-400 bg-[#092e40]/85 px-4";
            prefixLabel = "☁️ ";
          } else if (nodeId === "origin") {
            // Solid cylindrical server vault
            shapeClasses = "rounded-b-2xl rounded-t-[1.1rem] border-t-8 border-t-slate-500 bg-slate-900/90";
            prefixLabel = "🗄️ ";
          } else if (nodeId === "fill") {
            // Cache-fill checkpoint on the response path
            shapeClasses = "rounded-2xl border-dashed border-emerald-400 bg-emerald-950/70";
            prefixLabel = "↻ ";
          } else if (nodeId === "app") {
            // High-tech cluster server blades style
            shapeClasses = "rounded-xl border-y-4 border-l border-r border-indigo-400 bg-[#16122d]/90";
            prefixLabel = "⚙️ ";
          } else if (nodeId === "response") {
            // Return path marker
            shapeClasses = "rounded-full border-2 border-emerald-400 bg-emerald-950/70";
            prefixLabel = "↩ ";
          }

          return (
            <div
              key={nodeId}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 motion-reduce:transition-none"
              style={scenePointStyle(node, canvas.width, canvas.height)}
            >
              {active ? <div className="absolute inset-[-0.65rem] animate-ping rounded-2xl bg-sky-300/20 motion-reduce:animate-none" /> : null}
              <div
                className={`relative grid h-15 min-w-28 place-items-center border-2 text-xs font-bold shadow-xl transition-all duration-300 ${shapeClasses} ${
                  active
                    ? "border-sky-200 bg-sky-300 text-sky-950 font-black shadow-sky-400/40 scale-105"
                    : completed
                      ? "border-teal-300 bg-teal-800 text-white shadow-teal-500/25"
                      : "border-sky-500 bg-sky-950/90 text-sky-100"
                } ${inRoute ? "opacity-100" : "opacity-35"}`}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[0.62rem] font-bold opacity-60 uppercase tracking-widest leading-none mb-0.5">{prefixLabel}{nodeId}</span>
                  <span className="mt-0.5 leading-tight text-[0.68rem]">{node.label}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Pulse beacon tracking active position */}
        <div
          className="absolute z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100 shadow-[0_0_15px_rgba(103,232,249,0.9)] transition-all duration-500 motion-reduce:transition-none"
          style={scenePointStyle(activeNode, canvas.width, canvas.height)}
        />
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
