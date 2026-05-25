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
  guardrailPosition?: { x: number; y: number };
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
  guardrailPosition,
  onStageSelect,
}: TelecomSceneProps) {
  const activePosition = telecomStagePositions[activeStage.id];
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
        <div className="absolute left-[-2%] top-[-8%] h-72 w-72 rounded-full border border-dashed border-amber-500/20" />
        <div className="absolute left-[2%] top-[4%] h-44 w-44 rounded-full border border-dashed border-amber-500/25" />
        <div className="absolute right-[4%] top-[8%] flex items-end gap-2 opacity-40">
          {[0, 1, 2, 3, 4].map((bar) => (
            <span key={bar} className="w-3 rounded-full bg-emerald-400/25" style={{ height: 70 + bar * 20 }} />
          ))}
        </div>

        {scenario.id === "data-session" ? (
          <div className={`absolute left-[39%] top-[8%] rounded-2xl border border-amber-300 bg-amber-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-amber-100 transition ${activeIndex >= 3 ? "opacity-100" : "opacity-30"}`}>
            Policy + quota gate
          </div>
        ) : null}
        {scenario.id === "billing-aggregation" ? (
          <div className={`absolute left-[62%] top-[8%] rounded-2xl border border-emerald-300 bg-emerald-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-100 transition ${activeIndex >= 3 ? "opacity-100" : "opacity-30"}`}>
            Batch window open
          </div>
        ) : null}
        {scenario.id === "service-integration" ? (
          <div className={`absolute left-[75%] top-[8%] rounded-2xl border border-indigo-300 bg-indigo-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-indigo-100 transition ${activeIndex >= 3 ? "opacity-100" : "opacity-30"}`}>
            Provision + audit
          </div>
        ) : null}

        <div className="absolute bottom-[8%] left-[4%] z-20 w-[29%] rounded-2xl border border-amber-500/70 bg-stone-950/70 p-3">
          <div className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-stone-300">Active stage output</div>
          <div className="mt-1 text-sm font-black text-amber-100">{activeOutput}</div>
        </div>

        {guardrailReached && guardrailPosition && scenario.guardrail ? (
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-[5.4rem] whitespace-nowrap rounded-2xl border border-violet-200 bg-violet-950 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-violet-100 shadow-lg shadow-violet-500/20"
            style={scenePointStyle(guardrailPosition, canvas.width, canvas.height)}
          >
            {scenario.guardrail.label}
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
                  ? "bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 shadow-[0_0_18px_rgba(34,197,94,0.55)]"
                  : current
                    ? "animate-pulse bg-sky-100 motion-reduce:animate-none"
                    : "bg-slate-800"
              }
              from={from}
              thickness={completed ? 8 : 4}
              to={to}
            />
          );
        })}

        {telecomStages.map((stage) => {
          const position = telecomStagePositions[stage.id];
          const routeIndex = scenario.route.indexOf(stage.id);
          const inRoute = routeSet.has(stage.id);
          const completed = inRoute && routeIndex < activeIndex;
          const active = stage.id === activeStage.id;

          return (
            <button
              key={stage.id}
              type="button"
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 motion-reduce:transition-none ${inRoute ? "cursor-pointer" : "cursor-default opacity-35"}`}
              disabled={!inRoute}
              aria-current={active ? "step" : undefined}
              aria-label={`${stage.label}: ${stage.signal}${inRoute ? "" : `, ${bypassNotes?.[stage.id] ?? "bypassed"}`}`}
              onClick={() => {
                if (inRoute) {
                  onStageSelect(routeIndex);
                }
              }}
              style={scenePointStyle(position, canvas.width, canvas.height)}
            >
              {active ? <span className="absolute inset-[-0.7rem] animate-ping rounded-2xl bg-amber-400/25 motion-reduce:animate-none" /> : null}
              <span
                className={`relative grid min-h-14 min-w-24 place-items-center rounded-2xl border-2 px-3 text-sm font-bold shadow-xl transition ${
                  active
                    ? "border-amber-100 bg-amber-300 text-stone-950 shadow-amber-500/35"
                    : completed
                      ? "border-emerald-300 bg-emerald-800 text-white shadow-emerald-500/25"
                      : "border-emerald-400 bg-stone-950 text-stone-100"
                }`}
              >
                {stage.label}
              </span>
              <span className="mt-1 block max-w-28 text-[0.64rem] text-stone-300">{stage.signal}</span>
              {!inRoute ? (
                <span className="mt-1 block max-w-28 text-[0.62rem] font-extrabold text-amber-300">
                  {bypassNotes?.[stage.id] ?? "bypassed"}
                </span>
              ) : null}
            </button>
          );
        })}

        {["kafka", "services", "store"].includes(activeStage.id) ? (
          <div
            className="absolute z-20 flex -translate-y-[2.2rem] gap-2 opacity-90"
            style={scenePointStyle({ x: activePosition.x + 52, y: activePosition.y }, canvas.width, canvas.height)}
          >
            {[0, 1, 2, 3].map((offset) => (
              <span key={offset} className="animate-pulse rounded-full bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)] motion-reduce:animate-none" style={{ height: 8 + offset * 2, width: 8 + offset * 2 }} />
            ))}
          </div>
        ) : null}

        <div
          className="absolute z-30 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-50 shadow-[0_0_20px_rgba(254,243,199,0.9)] transition-all duration-700 motion-reduce:transition-none"
          style={scenePointStyle(activePosition, canvas.width, canvas.height)}
        />
        <div
          className="absolute z-30 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-50/70 transition-all duration-700 motion-reduce:transition-none"
          style={scenePointStyle(activePosition, canvas.width, canvas.height)}
        />
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
