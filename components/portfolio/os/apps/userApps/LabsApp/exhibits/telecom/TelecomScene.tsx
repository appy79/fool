import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";
import SceneConnector, { scenePointStyle } from "../../shared/SceneConnector";
import { telecomStagePositions, telecomStages } from "./data";
import type { TelecomScenario, TelecomStage } from "../../types";

type TelecomSceneProps = {
  scenario: TelecomScenario;
  activeIndex: number;
  activeStage: TelecomStage;
  activeOutput: string;
  bypassNotes?: Partial<Record<string, string>>;
  guardrailReached: boolean;
  onStageSelect: (routeIndex: number) => void;
};

const canvas = { width: 1000, height: 430 };

export default function TelecomScene({
  scenario,
  activeIndex,
  activeStage,
  activeOutput,
  bypassNotes,
  guardrailReached,
  onStageSelect,
}: TelecomSceneProps) {
  const routeSet = new Set(scenario.route);

  return (
    <LabSceneFrame className="p-0 shadow-inner shadow-cyan-950/40">
      <ScaledSceneCanvas
        aria-label="Interactive telecom core route"
        className="bg-[linear-gradient(135deg,#1c1917_0%,#052e1a_52%,#042f2e_100%)]"
        role="group"
        width={canvas.width}
        height={canvas.height}
      >
        {/* Ambient decorative background grids */}
        <div className="absolute left-[-2%] top-[-8%] h-72 w-72 rounded-full border border-dashed border-amber-500/10 pointer-events-none" />
        <div className="absolute left-[2%] top-[4%] h-44 w-44 rounded-full border border-dashed border-amber-500/15 pointer-events-none" />
        <div className="absolute right-[4%] top-[8%] flex items-end gap-2 opacity-35 pointer-events-none">
          {[0, 1, 2, 3, 4].map((bar) => (
            <span
              key={bar}
              className="w-2.5 rounded-full bg-emerald-400/20"
              style={{ height: 60 + bar * 16 }}
            />
          ))}
        </div>

        {scenario.id === "data-session" ? (
          <div
            className={`absolute left-[39%] top-[6%] rounded-full border border-amber-500/30 bg-amber-950/85 px-4 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em] text-amber-100 transition shadow-lg ${activeIndex >= 3 ? "opacity-100 border-amber-400" : "opacity-35"}`}
          >
            Policy & Quota Core Active
          </div>
        ) : null}
        {scenario.id === "billing-aggregation" ? (
          <div
            className={`absolute left-[58%] top-[6%] rounded-full border border-emerald-500/30 bg-emerald-950/85 px-4 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em] text-emerald-100 transition shadow-lg ${activeIndex >= 3 ? "opacity-100 border-emerald-400" : "opacity-35"}`}
          >
            Aggregation Batch Window Open
          </div>
        ) : null}
        {scenario.id === "service-integration" ? (
          <div
            className={`absolute left-[70%] top-[6%] rounded-full border border-indigo-500/30 bg-indigo-950/85 px-4 py-1 text-[0.68rem] font-black uppercase tracking-[0.2em] text-indigo-100 transition shadow-lg ${activeIndex >= 3 ? "opacity-100 border-indigo-400" : "opacity-35"}`}
          >
            Dynamic Orchestration & Audit
          </div>
        ) : null}

        {/* Telemetry output display with angled brackets */}
        <div className="absolute bottom-5 left-5 z-20 w-[320px] rounded-2xl border border-emerald-500/30 bg-stone-950/85 p-3.5 shadow-xl">
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-emerald-500/40" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-emerald-500/40" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-emerald-500/40" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-emerald-500/40" />

          <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-emerald-400/70">
            Telecom Stage Telemetry
          </div>
          <div className="mt-1 font-mono text-[0.72rem] font-bold text-stone-100 leading-relaxed max-h-16 overflow-y-auto">
            {activeOutput}
          </div>
        </div>

        {guardrailReached && scenario.guardrail ? (
          <div className="absolute bottom-5 right-5 z-20 max-w-[270px] rounded-2xl border border-violet-400/80 bg-violet-950/95 px-3.5 py-2 text-right text-[0.6rem] font-black uppercase leading-snug tracking-[0.14em] text-violet-100 shadow-xl shadow-violet-500/25">
            Guardrail: {scenario.guardrail.label}
          </div>
        ) : null}

        {scenario.route.slice(0, -1).map((fromStageId, index) => {
          const toStageId = scenario.route[index + 1];
          const from = telecomStagePositions[fromStageId];
          const to = telecomStagePositions[toStageId];
          const completed = index < activeIndex;
          const current = index === activeIndex - 1;

          return (
            <SceneConnector
              key={`${fromStageId}-${toStageId}`}
              canvasHeight={canvas.height}
              canvasWidth={canvas.width}
              className={
                completed
                  ? "bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 shadow-[0_0_12px_rgba(34,197,94,0.45)]"
                  : current
                    ? "animate-pulse bg-sky-200/50 motion-reduce:animate-none"
                    : "bg-stone-800"
              }
              from={from}
              thickness={completed ? 6 : 3}
              to={to}
            />
          );
        })}

        {telecomStages.map((stage) => {
          const stageView = { ...stage, ...scenario.stageOverrides?.[stage.id] };
          const position = telecomStagePositions[stage.id];
          const routeIndex = scenario.route.indexOf(stage.id);
          const inRoute = routeSet.has(stage.id);
          const completed = inRoute && routeIndex < activeIndex;
          const active = stage.id === activeStage.id;

          // Configure distinct hardware profiles for Telecom Core nodes without clip-paths to avoid text cropping!
          let shapeClasses = "";
          let prefix = "";
          let nodeCode = stage.id;

          if (stage.id === "ue") {
            // Handheld Subscriber Smartphone Device
            shapeClasses = "rounded-xl border-x-4 border-y-8 border-slate-700/80";
            prefix = "📱 ";
          } else if (stage.id === "ran") {
            // Cell Tower Transmitter mast
            shapeClasses = "rounded-t-2xl border-x border-t-[5px] border-sky-400 bg-sky-950/50";
            prefix = "📡 ";
          } else if (stage.id === "core") {
            // Concentric router gateway
            shapeClasses =
              "rounded-full border-2 border-dashed border-emerald-400 bg-emerald-950/40";
            prefix = "🌀 ";
          } else if (stage.id === "policy") {
            // Rules registry script document page
            shapeClasses =
              "rounded-tr-2xl rounded-bl-2xl border-l-4 border-l-amber-500 bg-[#2b1f15]/80";
            prefix = "📋 ";
          } else if (stage.id === "charging") {
            // Accounting charging function ledger
            shapeClasses = "rounded-lg border-2 border-double border-teal-400 bg-teal-950/40";
            prefix = "🪙 ";
          } else if (stage.id === "kafka") {
            // Capsule conveyor message bus
            shapeClasses =
              "rounded-full border border-orange-500/40 bg-orange-950/30 h-11 px-4 flex items-center justify-center";
            prefix = "📦 ";
          } else if (stage.id === "services") {
            // Orchestration Engine
            shapeClasses = "rounded-xl border-y-4 border-indigo-400 bg-indigo-950/40";
            prefix = "⚙️ ";
          } else if (stage.id === "store") {
            // DB canister vertical cylinder
            shapeClasses =
              "rounded-xl border-t-[6px] border-t-yellow-500 border-x border-b border-yellow-900 bg-[#1f1610]/90";
            prefix = "💾 ";
          } else if (stage.id === "billing") {
            // Document with corner fold-over
            shapeClasses =
              "rounded-tr-2xl rounded-l border-r-4 border-b-2 border-r-violet-400 bg-[#1c1230]/90";
            prefix = "🧾 ";
          }

          if (scenario.id === "service-integration" && stage.id === "ue") {
            prefix = "🔗 ";
            nodeCode = "api";
          } else if (scenario.id === "billing-aggregation" && stage.id === "charging") {
            prefix = "🧾 ";
            nodeCode = "cdr";
          }

          return (
            <button
              key={stage.id}
              type="button"
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 motion-reduce:transition-none ${inRoute ? "cursor-pointer" : "cursor-default opacity-35"}`}
              disabled={!inRoute}
              aria-current={active ? "step" : undefined}
              aria-label={`${stageView.label}: ${stageView.signal}${inRoute ? "" : `, ${bypassNotes?.[stage.id] ?? "bypassed"}`}`}
              onClick={() => {
                if (inRoute) {
                  onStageSelect(routeIndex);
                }
              }}
              style={scenePointStyle(position, canvas.width, canvas.height)}
            >
              {active ? (
                <span className="absolute inset-[-0.6rem] animate-ping rounded-2xl bg-amber-400/20 motion-reduce:animate-none" />
              ) : null}

              <span
                className={`relative grid min-h-12 min-w-24 place-items-center border-2 px-3 text-[0.68rem] leading-none font-bold uppercase tracking-wider shadow-lg transition-all duration-300 ${shapeClasses} ${
                  active
                    ? "border-amber-200 bg-stone-900/90 text-stone-300 shadow-amber-500/40 font-black scale-105"
                    : completed
                      ? "border-emerald-300 bg-emerald-800 text-white shadow-emerald-500/25"
                      : "border-stone-700 bg-stone-900/90 text-stone-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[0.58rem] opacity-75 font-mono tracking-widest leading-none mb-0.5">
                    {prefix}
                    {nodeCode}
                  </span>
                  <span className="leading-tight text-[0.65rem] font-bold">{stageView.label}</span>
                </div>
              </span>

              {/* Subtitle labels under the buttons - beautifully compact to avoid overlaps */}
              <div className="mt-1.5 flex flex-col items-center justify-center min-h-[1.5rem]">
                {inRoute ? (
                  <span className="block max-w-[110px] text-[0.58rem] font-bold text-stone-400 leading-tight">
                    {stageView.signal}
                  </span>
                ) : (
                  <span className="block max-w-[110px] text-[0.55rem] font-extrabold text-amber-400/90 bg-amber-950/50 border border-amber-900/30 px-1.5 py-0.5 rounded leading-none">
                    {bypassNotes?.[stage.id] ?? "bypassed"}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
