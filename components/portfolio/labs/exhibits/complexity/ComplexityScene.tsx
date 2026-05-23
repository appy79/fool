import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";

type ComplexitySceneProps = {
  isRouteSearch: boolean;
  activeDepth: number;
};

const canvas = { width: 900, height: 420 };

export default function ComplexityScene({ isRouteSearch, activeDepth }: ComplexitySceneProps) {
  const choiceRows = isRouteSearch
    ? [
        { label: "choice 1", value: "pick next city", detail: "C costs 4" },
        { label: "choice 2", value: "extend route", detail: "D costs 5" },
        { label: "choice 3", value: "close tour", detail: "B costs 3" },
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
      ]
    : [
        { label: "clause 1", value: "pass", activeAt: 1 },
        { label: "clause 2", value: "pass", activeAt: 2 },
        { label: "clause 3", value: "pass", activeAt: 3 },
      ];
  const searchNodes = [
    { id: "root", parent: "", depth: 0, x: 620, y: 78, label: isRouteSearch ? "start A" : "formula", result: "start" },
    { id: "reject-1", parent: "root", depth: 1, x: 470, y: 150, label: isRouteSearch ? "B +12" : "x1=false", result: "reject" },
    { id: "keep-1", parent: "root", depth: 1, x: 740, y: 150, label: isRouteSearch ? "C +4" : "x1=true", result: "keep" },
    { id: "reject-2", parent: "keep-1", depth: 2, x: 620, y: 222, label: isRouteSearch ? "B +8" : "x2=false", result: "reject" },
    { id: "keep-2", parent: "keep-1", depth: 2, x: 820, y: 222, label: isRouteSearch ? "D +5" : "x2=true", result: "keep" },
    { id: "reject-3", parent: "keep-2", depth: 3, x: 725, y: 292, label: isRouteSearch ? "A loop" : "x3=false", result: "reject" },
    { id: "keep-3", parent: "keep-2", depth: 3, x: 850, y: 292, label: isRouteSearch ? "B +3" : "x3=true", result: "success" },
  ];

  return (
    <LabSceneFrame className="p-0">
      <ScaledSceneCanvas
        aria-label={isRouteSearch ? "Route search graph animation" : "Constraint assignment search tree animation"}
        className="bg-[#1e102a]"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="absolute left-[4%] top-[20%] h-[72%] w-[29%] rounded-3xl bg-violet-950/30" />
        <div className="absolute left-[37%] top-[20%] h-[72%] w-[59%] rounded-3xl bg-orange-950/20" />
        <div className="absolute left-[62%] top-[-8%] h-80 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute left-[4%] top-[34%] h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="absolute left-[5%] top-[9%] text-sm font-black text-sky-100">
          {isRouteSearch ? "Route choices" : "Constraint choices"}
        </div>
        <div className="absolute left-[5%] top-[15%] max-w-72 text-xs font-bold text-slate-400">
          Same search shape; the choices carry different meaning and benefits.
        </div>

        <div className="absolute left-[5%] top-[24%] grid w-[28%] gap-4">
          {choiceRows.map((choice, index) => {
            const active = activeDepth === index + 1;
            const complete = activeDepth > index + 1;

            return (
              <div
                key={choice.label}
                className={`rounded-2xl border p-3 transition ${
                  active || complete
                    ? "border-violet-200 bg-violet-950 text-white shadow-lg shadow-violet-500/20"
                    : "border-violet-800 bg-indigo-950/80 text-slate-300"
                } ${complete ? "opacity-70" : "opacity-100"}`}
              >
                <div className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">{choice.label}</div>
                <div className="mt-1 text-sm font-black">{choice.value}</div>
                <div className={`text-xs font-black ${isRouteSearch ? "text-cyan-200" : "text-emerald-200"}`}>{choice.detail}</div>
              </div>
            );
          })}
          <div className={`rounded-2xl border border-slate-600 bg-slate-950 p-3 text-sm font-black text-white transition ${activeDepth >= 3 ? "opacity-100" : "opacity-45"}`}>
            {isRouteSearch ? "benefit: score one tour fast" : "benefit: verify clauses fast"}
          </div>
        </div>

        <div className="absolute left-[39%] top-[9%] text-sm font-black text-sky-100">Shared branching search</div>
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
              className={rejected ? "bg-red-400/50" : kept ? "bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.65)]" : "bg-slate-700/40"}
              from={{ x: parent.x, y: parent.y + 18 }}
              thickness={kept ? 4 : 2}
              to={{ x: node.x, y: node.y - 18 }}
            />
          );
        })}
        {searchNodes.map((node) => {
          const visible = node.depth <= activeDepth;
          const rejected = node.result === "reject" && visible;
          const success = node.result === "success" && visible;
          const kept = (node.result === "keep" || node.result === "success") && visible;

          return (
            <div
              key={node.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 ${visible ? (rejected ? "opacity-55" : "opacity-100") : "opacity-20"}`}
              style={scenePointStyle(node, canvas.width, canvas.height)}
            >
              <div
                className={`grid h-10 min-w-24 place-items-center px-3 text-xs font-black shadow-lg transition [clip-path:polygon(16%_0,84%_0,100%_50%,84%_100%,16%_100%,0_50%)] ${
                  success
                    ? "bg-amber-400 text-slate-950 shadow-amber-500/35"
                    : rejected
                      ? "bg-red-900 text-red-100"
                      : kept
                        ? "bg-violet-900 text-violet-50 shadow-violet-500/25"
                        : "bg-indigo-950 text-slate-200"
                } ${success ? "animate-pulse" : ""}`}
              >
                {node.label}
              </div>
              {rejected ? <div className="mt-1 text-[0.68rem] font-black text-red-200">{isRouteSearch ? "costly" : "prune"}</div> : null}
            </div>
          );
        })}

        <div className="absolute bottom-[10%] left-[39%] right-[5%] rounded-2xl border border-slate-700 bg-slate-950 p-3">
          <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {isRouteSearch ? "cost check" : "clause check"}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {benefitChecks.map((check) => {
              const active = activeDepth >= check.activeAt;

              return (
                <div
                  key={check.label}
                  className={`rounded-xl border px-3 py-2 text-center text-xs font-black transition ${
                    active
                      ? isRouteSearch
                        ? "border-cyan-300 bg-cyan-950 text-cyan-100"
                        : "border-emerald-300 bg-emerald-950 text-emerald-100"
                      : "border-slate-700 bg-slate-900 text-slate-500"
                  }`}
                >
                  {check.label} {check.value}
                </div>
              );
            })}
          </div>
        </div>
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
