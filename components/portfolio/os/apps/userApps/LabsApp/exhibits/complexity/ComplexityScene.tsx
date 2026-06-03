import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";

type ComplexitySceneProps = {
  isRouteSearch: boolean;
  activeDepth: number;
};

// Increased canvas height to 480px to completely avoid clipping
const canvas = { width: 900, height: 480 };

export default function ComplexityScene({ isRouteSearch, activeDepth }: ComplexitySceneProps) {
  const choiceRows = isRouteSearch
    ? [
        { label: "choice 1", value: "pick next city", detail: "C costs 4" },
        { label: "choice 2", value: "extend route", detail: "D costs 5" },
        { label: "choice 3", value: "finish route", detail: "B costs 3" },
      ]
    : [
        { label: "choice 1", value: "assign x1", detail: "x1=true" },
        { label: "choice 2", value: "assign x2", detail: "x2=true" },
        { label: "choice 3", value: "assign x3", detail: "x3=true" },
      ];
  const benefitChecks = isRouteSearch
    ? [
        { label: "A-C", value: "+4", activeAt: 1 },
        { label: "C-D", value: "+5", activeAt: 2 },
        { label: "D-B", value: "+3", activeAt: 3 },
        { label: "B-A", value: "+6", activeAt: 3 },
      ]
    : [
        { label: "clause 1", value: "pass", activeAt: 1 },
        { label: "clause 2", value: "pass", activeAt: 2 },
        { label: "clause 3", value: "pass", activeAt: 3 },
      ];
  const searchNodes = [
    {
      id: "root",
      parent: "",
      depth: 0,
      x: 620,
      y: 75,
      label: isRouteSearch ? "start A" : "formula",
      result: "start",
    },
    {
      id: "reject-1",
      parent: "root",
      depth: 1,
      x: 470,
      y: 155,
      label: isRouteSearch ? "B +12" : "x1=false",
      result: "reject",
    },
    {
      id: "keep-1",
      parent: "root",
      depth: 1,
      x: 740,
      y: 155,
      label: isRouteSearch ? "C +4" : "x1=true",
      result: "keep",
    },
    {
      id: "reject-2",
      parent: "keep-1",
      depth: 2,
      x: 620,
      y: 235,
      label: isRouteSearch ? "B +8" : "x2=false",
      result: "reject",
    },
    {
      id: "keep-2",
      parent: "keep-1",
      depth: 2,
      x: 820,
      y: 235,
      label: isRouteSearch ? "D +5" : "x2=true",
      result: "keep",
    },
    {
      id: "reject-3",
      parent: "keep-2",
      depth: 3,
      x: 715,
      y: 315,
      label: isRouteSearch ? "A loop" : "x3=false",
      result: "reject",
    },
    {
      id: "keep-3",
      parent: "keep-2",
      depth: 3,
      x: 840,
      y: 315,
      label: isRouteSearch ? "B +3" : "x3=true",
      result: "success",
    },
  ];

  return (
    <LabSceneFrame className="p-0 border-violet-950/40 shadow-inner">
      <ScaledSceneCanvas
        aria-label={
          isRouteSearch
            ? "Route search graph animation"
            : "Constraint assignment search tree animation"
        }
        className="bg-[#180a22]"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="absolute left-[3%] top-[18%] h-[78%] w-[31%] rounded-3xl bg-violet-950/20 border border-violet-900/10 pointer-events-none" />
        <div className="absolute left-[36%] top-[18%] h-[78%] w-[61%] rounded-3xl bg-orange-950/10 border border-orange-900/5 pointer-events-none" />
        <div className="absolute left-[62%] top-[-8%] h-80 w-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-[4%] top-[34%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="absolute left-[5%] top-[5%] text-sm font-black text-violet-100 uppercase tracking-wider">
          {isRouteSearch ? "Route decisions" : "Constraint decisions"}
        </div>
        <div className="absolute left-[5%] top-[11%] max-w-[270px] text-[0.68rem] font-bold text-slate-400 leading-normal">
          Both problems have compact witnesses. Search may branch explosively, while one proposed
          witness can be verified directly.
        </div>

        {/* Isometric skewed crystalline panel design for complexity decision blocks */}
        <div className="absolute left-[5%] top-[18%] grid w-[27%] gap-3">
          {choiceRows.map((choice, index) => {
            const active = activeDepth === index + 1;
            const complete = activeDepth > index + 1;

            return (
              <div
                key={choice.label}
                className={`rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm border p-2.5 transition-all duration-300 ${
                  active || complete
                    ? "border-violet-300 bg-gradient-to-br from-violet-950 to-slate-950 text-white shadow-lg shadow-violet-500/30 scale-[1.02]"
                    : "border-violet-900 bg-violet-950/20 text-slate-400"
                } ${complete ? "opacity-60" : "opacity-100"}`}
              >
                <div className="text-[0.6rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  {choice.label}
                </div>
                <div className="mt-0.5 text-xs font-black font-mono leading-tight">
                  {choice.value}
                </div>
                <div
                  className={`text-[0.65rem] font-extrabold uppercase tracking-wider leading-none mt-0.5 ${isRouteSearch ? "text-cyan-200" : "text-emerald-200"}`}
                >
                  {choice.detail}
                </div>
              </div>
            );
          })}
          <div
            className={`rounded-tr-2xl rounded-bl-2xl rounded-tl-sm rounded-br-sm border border-violet-800 bg-slate-950 p-2.5 text-[0.62rem] uppercase tracking-wider font-black text-center text-white transition ${activeDepth >= 3 ? "opacity-100" : "opacity-40"}`}
          >
            {isRouteSearch
              ? "🔍 O(n) verification: sum complete tour"
              : "✅ Polynomial verification: evaluate formula"}
          </div>
        </div>

        <div className="absolute left-[38%] top-[5%] text-sm font-black text-orange-200 uppercase tracking-wider">
          Decision tree search space
        </div>

        {searchNodes.map((node) => {
          if (!node.parent) {
            return null;
          }

          const parent = searchNodes.find((item) => item.id === node.parent)!;
          const visible = node.depth <= activeDepth;
          const rejected = node.result === "reject" && visible;
          const kept = (node.result === "keep" || node.result === "success") && visible;

          return (
            <SceneConnector
              key={`${node.id}-edge`}
              canvasHeight={canvas.height}
              canvasWidth={canvas.width}
              className={
                rejected
                  ? "bg-red-500/30"
                  : kept
                    ? "bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                    : "bg-stone-800/40"
              }
              from={{ x: parent.x, y: parent.y + 16 }}
              thickness={kept ? 4 : 2}
              to={{ x: node.x, y: node.y - 16 }}
            />
          );
        })}

        {/* Render nodes as beautiful faceted crystal shards instead of aggressive text-clipping clip-paths! */}
        {searchNodes.map((node) => {
          const visible = node.depth <= activeDepth;
          const rejected = node.result === "reject" && visible;
          const success = node.result === "success" && visible;
          const kept = (node.result === "keep" || node.result === "success") && visible;

          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 motion-reduce:transition-none ${visible ? (rejected ? "opacity-60" : "opacity-100") : "opacity-25"}`}
              style={scenePointStyle(node, canvas.width, canvas.height)}
            >
              <div
                className={`grid h-10 w-26 place-items-center rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none border-2 text-[0.68rem] font-bold uppercase tracking-wider shadow-md transition-all duration-300 ${
                  success
                    ? "border-amber-200 bg-gradient-to-br from-amber-400 to-yellow-600 text-stone-950 font-black shadow-amber-500/40 scale-105"
                    : rejected
                      ? "border-red-900/60 bg-gradient-to-br from-red-950 to-stone-950 text-red-200"
                      : kept
                        ? "border-cyan-400 bg-[#0e172a] text-cyan-50 shadow-cyan-500/25"
                        : "border-stone-800 bg-[#160a21] text-stone-400"
                } ${success ? "animate-pulse motion-reduce:animate-none" : ""}`}
              >
                <span className="px-2 leading-none text-center truncate w-full">{node.label}</span>
              </div>
              {rejected ? (
                <div className="mt-0.5 text-[0.55rem] font-extrabold text-red-400 uppercase tracking-wider">
                  {isRouteSearch ? "over budget" : "conflict"}
                </div>
              ) : success ? (
                <div className="mt-0.5 text-[0.55rem] font-black text-amber-300 uppercase tracking-widest animate-pulse motion-reduce:animate-none">
                  witness path
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Anchored bottom panel with explicit padding and bounds to prevent any canvas clipping! */}
        <div className="absolute bottom-4 left-[38%] right-[3%] rounded-2xl border border-violet-800/40 bg-stone-950/80 p-3 shadow-lg">
          <div className="mb-2 text-[0.62rem] font-black uppercase tracking-[0.2em] text-violet-300 leading-none">
            {isRouteSearch ? "tour verification register" : "clause verification registry"}
          </div>
          <div className={`grid gap-2 ${isRouteSearch ? "grid-cols-4" : "grid-cols-3"}`}>
            {benefitChecks.map((check) => {
              const active = activeDepth >= check.activeAt;

              return (
                <div
                  key={check.label}
                  className={`rounded-lg border px-3 py-1.5 text-center font-mono text-[0.68rem] font-black transition-all duration-300 ${
                    active
                      ? isRouteSearch
                        ? "border-cyan-400 bg-cyan-950/70 text-cyan-200 shadow-sm"
                        : "border-emerald-400 bg-emerald-950/70 text-emerald-200 shadow-sm"
                      : "border-stone-800 bg-stone-900/30 text-stone-600"
                  }`}
                >
                  <span className="font-sans font-bold text-[0.6rem] text-slate-400 mr-1">
                    {check.label}:
                  </span>
                  {check.value}
                </div>
              );
            })}
          </div>
        </div>
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
