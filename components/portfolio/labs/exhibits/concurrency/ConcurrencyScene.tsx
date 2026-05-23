import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";

type ConcurrencySceneProps = {
  mode: {
    id: string;
    phases: readonly string[];
    workers: number;
  };
  phaseIndex: number;
  isRunning: boolean;
  activeWorkerCount: number;
  deadlocked: boolean;
  finalPhaseIndex: number;
  isAtomic: boolean;
  isMultiprocessing: boolean;
  isMutexLike: boolean;
  isQueue: boolean;
  isRace: boolean;
  lockHeld: boolean;
  visibleExpectedCounter: number;
  visibleObservedCounter: number;
  localReadValue: number;
  localComputedValue: number;
  ownerLabel: string;
  criticalStatus: string;
};

const canvas = { width: 920, height: 430 };

function getWorkerText(
  phaseIndex: number,
  isRace: boolean,
  modeId: string,
  localReadValue: number,
  localComputedValue: number,
) {
  if (phaseIndex === 0) {
    return "local: -";
  }

  if (phaseIndex === 1) {
    return `read ${localReadValue}`;
  }

  if (phaseIndex === 2) {
    return `local ${localComputedValue}`;
  }

  if (isRace) {
    return `writes ${localComputedValue}`;
  }

  if (modeId === "deadlock") {
    return "waiting";
  }

  if (modeId === "multiprocessing") {
    return "merged result";
  }

  return "committed";
}

export default function ConcurrencyScene({
  mode,
  phaseIndex,
  isRunning,
  activeWorkerCount,
  deadlocked,
  finalPhaseIndex,
  isAtomic,
  isMultiprocessing,
  isMutexLike,
  isQueue,
  isRace,
  lockHeld,
  visibleExpectedCounter,
  visibleObservedCounter,
  localReadValue,
  localComputedValue,
  ownerLabel,
  criticalStatus,
}: ConcurrencySceneProps) {
  const tokenTarget = phaseIndex === 0 ? "read" : phaseIndex === 1 ? "compute" : phaseIndex === 2 ? "critical" : "counter";
  const counterConsistent = visibleObservedCounter === visibleExpectedCounter;

  return (
    <LabSceneFrame className="p-0">
      <ScaledSceneCanvas
        aria-label="Memory concurrency race visualizer"
        className="bg-[#120f18]"
        innerClassName="p-4"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(249,115,22,0.09)_1px,transparent_1px),linear-gradient(0deg,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:58px_58px]" />
        <div className="pointer-events-none absolute right-10 top-16 h-56 w-56 rounded-full bg-orange-900/25 blur-3xl" />

        <div className="relative grid grid-cols-4 gap-3">
          {mode.phases.map((label, index) => (
            <div
              key={label}
              className={`rounded-2xl border px-3 py-2 text-center text-[0.68rem] font-black uppercase tracking-[0.12em] transition ${
                phaseIndex === index
                  ? "border-orange-100 bg-orange-400 text-stone-950 shadow-lg shadow-orange-500/25"
                  : index < phaseIndex
                    ? "border-orange-800 bg-orange-950 text-orange-100"
                    : "border-violet-900 bg-[#1f172a] text-violet-100"
              }`}
            >
              {label.length > 18 ? `${label.slice(0, 17)}...` : label}
            </div>
          ))}
        </div>

        <div className="relative mt-6 grid grid-cols-[1fr_9rem_13rem] gap-4">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => {
              const active = index < activeWorkerCount;
              const waiting = deadlocked && index < 2;
              const serialized = isMutexLike && index > (mode.id === "semaphore" ? 1 : 0) && phaseIndex > 0 && phaseIndex < finalPhaseIndex;
              const localText = getWorkerText(phaseIndex, isRace, mode.id, localReadValue, localComputedValue);

              return (
                <div key={index} className={`grid grid-cols-[7rem_1fr_6rem] items-center gap-3 transition ${active ? "opacity-100" : "opacity-25"}`}>
                  <div
                    className={`rounded-2xl border p-3 text-center shadow-lg ${
                      waiting
                        ? "border-red-200 bg-red-900 text-red-100"
                        : serialized
                          ? "border-indigo-200 bg-indigo-950 text-indigo-100"
                          : "border-orange-400 bg-[#1f172a] text-slate-100"
                    }`}
                  >
                    <div className="text-sm font-black">T{index + 1}</div>
                    <div className="text-[0.68rem] text-slate-400">{serialized ? "waiting turn" : localText}</div>
                  </div>
                  <div className="relative h-4 overflow-hidden rounded-full bg-slate-900">
                    <div
                      className={`absolute top-1/2 h-1 -translate-y-1/2 rounded-full transition-all duration-500 ${
                        waiting ? "bg-red-400" : isRace && phaseIndex >= 3 ? "bg-rose-400" : "bg-orange-300"
                      }`}
                      style={{ left: 0, width: tokenTarget === "read" ? "22%" : tokenTarget === "compute" ? "45%" : tokenTarget === "critical" ? "70%" : "100%" }}
                    />
                    {active && !serialized ? (
                      <span
                        className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full shadow-lg transition-all duration-500 ${
                          waiting ? "bg-rose-400 shadow-rose-400/40" : phaseIndex >= 3 && isRace ? "bg-rose-400 shadow-rose-400/40" : "bg-orange-100 shadow-orange-200/40"
                        } ${isRunning ? "animate-pulse" : ""}`}
                        style={{ left: tokenTarget === "read" ? "22%" : tokenTarget === "compute" ? "45%" : tokenTarget === "critical" ? "70%" : "calc(100% - 1rem)" }}
                      />
                    ) : null}
                  </div>
                  <div className="text-xs font-bold text-slate-400">
                    {waiting ? "blocked" : serialized ? "queued" : tokenTarget}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`rounded-3xl border p-4 text-center shadow-xl ${
              deadlocked
                ? "border-red-200 bg-red-950 text-red-100"
                : lockHeld || isAtomic || isQueue || isMultiprocessing
                  ? "border-violet-200 bg-violet-950 text-violet-100"
                  : "border-violet-700 bg-[#1f172a] text-violet-100"
            }`}
          >
            <div className="text-xs font-black uppercase tracking-[0.16em]">
              {isAtomic ? "Atomic CAS" : isQueue ? "Queue" : isMultiprocessing ? "IPC Merge" : "Critical"}
            </div>
            <div className="mt-4 text-sm text-slate-300">owner: {ownerLabel}</div>
            <div className={`mt-2 text-sm font-black ${deadlocked ? "text-red-100" : "text-slate-300"}`}>{criticalStatus}</div>
            {mode.id === "mutex" ? <div className="mt-4 rounded-xl border border-indigo-200/40 bg-indigo-900 px-3 py-2 text-xs font-black">LOCKED</div> : null}
            {mode.id === "semaphore" ? <div className="mt-4 rounded-xl border border-indigo-200/40 bg-indigo-900 px-3 py-2 text-xs font-black">2 permits</div> : null}
            {isAtomic ? <div className="mt-4 rounded-xl border border-amber-200/40 bg-amber-950 px-3 py-2 text-xs font-black text-amber-100">cache-line sync</div> : null}
          </div>

          <div
            className={`rounded-3xl border p-5 text-center shadow-xl ${
              counterConsistent ? "border-amber-300 bg-[#1f172a] text-amber-100" : "border-rose-300 bg-rose-950 text-rose-100"
            }`}
          >
            <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Shared Counter</div>
            <div className={`mt-3 text-5xl font-black ${counterConsistent ? "text-amber-300" : "text-rose-300"}`}>
              {visibleObservedCounter}
            </div>
            <div className="mt-2 text-sm text-slate-400">expected {visibleExpectedCounter}</div>
            <div className={`mt-4 text-sm font-bold ${isRace && phaseIndex >= 3 ? "text-rose-200" : "text-slate-400"}`}>
              {isRace && phaseIndex >= 3 ? "lost updates: stale +1 writes collide" : deadlocked ? "no commit: circular wait" : "commit target"}
            </div>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-3">
          {isQueue ? (
            <div className="rounded-2xl border border-orange-400 bg-[#1f172a] p-3">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Reducer queue</div>
              <div className="mt-3 flex gap-2">
                {[0, 1, 2, 3].map((item) => (
                  <span key={item} className={`h-6 w-8 rounded-lg bg-orange-400 ${phaseIndex > 0 ? "animate-pulse" : ""} ${phaseIndex > 1 ? "opacity-90" : "opacity-45"}`} />
                ))}
              </div>
            </div>
          ) : null}
          {isMultiprocessing ? (
            <div className="rounded-2xl border border-violet-300 bg-slate-950 p-3 text-violet-100">
              <div className="text-sm font-black">each process owns private memory</div>
              <div className="text-xs text-slate-400">merge happens through IPC/result collection</div>
            </div>
          ) : null}
          {deadlocked ? (
            <div className="rounded-2xl border border-red-300 bg-red-950 p-3 text-red-100">
              <div className="text-sm font-black">circular wait</div>
              <div className="text-xs text-red-200">A waits on Y while B waits on X.</div>
            </div>
          ) : null}
          {isRace ? (
            <div className={`rounded-2xl border border-rose-300 bg-rose-950 p-3 text-rose-100 transition ${phaseIndex >= 1 ? "opacity-100" : "opacity-30"}`}>
              <div className="text-sm font-black">stale reads collide here</div>
              <div className="text-xs text-rose-200">workers read the same base value before writing.</div>
            </div>
          ) : null}
        </div>
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
