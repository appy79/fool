import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";

type DatabaseSceneProps = {
  accessModule: {
    id: string;
    stages: readonly string[];
    bars: readonly number[];
  };
  activeStage: number;
};

const canvas = { width: 920, height: 380 };

export default function DatabaseScene({ accessModule, activeStage }: DatabaseSceneProps) {
  return (
    <LabSceneFrame className="bg-zinc-950 p-0">
      <ScaledSceneCanvas
        className="bg-zinc-950"
        height={canvas.height}
        innerClassName="relative p-5"
        role="group"
        aria-label={`Database access pattern visualization for ${accessModule.name}`}
        width={canvas.width}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(34,197,94,0.09)_1px,transparent_1px),linear-gradient(0deg,rgba(251,191,36,0.09)_1px,transparent_1px)] bg-[size:42px_42px]" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative mb-4 grid grid-cols-4 gap-3">
          {accessModule.id === "baseline" ? (
            <>
              {["scan page", "scan page", "scan page", "scan page"].map((label, index) => (
                <div key={`${label}-${index}`} className={`rounded-2xl border border-rose-300/30 bg-rose-500/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-rose-100 ${activeStage >= 1 ? "animate-pulse motion-reduce:animate-none" : ""}`}>
                  {label} {index + 1}
                </div>
              ))}
            </>
          ) : accessModule.id === "indexed" ? (
            <>
              <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">B-tree root</div>
              <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">index leaf</div>
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">row pointer</div>
              <div className="rounded-2xl border border-zinc-600 bg-zinc-900/80 p-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">skipped pages</div>
            </>
          ) : accessModule.id === "parallel" ? (
            <>
              {["partition 1", "partition 2", "partition 3", "merge"].map((label, index) => (
                <div key={label} className={`rounded-2xl border p-3 text-xs font-bold uppercase tracking-[0.18em] ${index === 3 ? "border-violet-300/40 bg-violet-400/10 text-violet-100" : "border-sky-300/40 bg-sky-400/10 text-sky-100"} ${activeStage >= 2 ? "animate-pulse motion-reduce:animate-none" : ""}`}>
                  {label}
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">key hash</div>
              <div className="rounded-2xl border border-emerald-300/40 bg-emerald-400/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-100">redis hit</div>
              <div className="rounded-2xl border border-zinc-600 bg-zinc-900/80 p-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">db bypass</div>
              <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-100">ttl risk</div>
            </>
          )}
        </div>
        <div className="relative grid grid-cols-5 gap-4">
          {accessModule.stages.map((stage, index) => {
            const active = index === activeStage;
            const completed = index < activeStage;

            return (
              <div
                key={stage}
                className={`relative min-h-36 rounded-3xl border p-4 transition ${
                  active
                    ? "border-emerald-200 bg-emerald-300 text-slate-950 shadow-xl shadow-emerald-500/20"
                    : completed
                      ? "border-amber-300/40 bg-amber-300/10 text-slate-100"
                      : "border-zinc-700 bg-zinc-900/90 text-zinc-300"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">
                  Stage {index + 1}
                </span>
                <p className="mt-4 text-lg font-semibold">{stage}</p>
                {active ? (
                  <span className="absolute right-4 top-4 h-3 w-3 animate-ping rounded-full bg-white motion-reduce:animate-none" />
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-4">
          {["Latency cost", "Buffer pressure", "Read throughput"].map((label, index) => (
            <div key={label}>
              <div className="flex justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>{label}</span>
                <span>{accessModule.bars[index]}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  role="progressbar"
                  aria-label={label}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={accessModule.bars[index]}
                  className={`h-full rounded-full transition-all duration-700 motion-reduce:transition-none ${index === 0 ? "bg-rose-400" : index === 1 ? "bg-amber-300" : "bg-emerald-300"}`}
                  style={{ width: `${accessModule.bars[index]}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
