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
  isAtomic: boolean;
  isMultiprocessing: boolean;
  isQueue: boolean;
  isRace: boolean;
  lockHeld: boolean;
  visibleExpectedCounter: number;
  visibleObservedCounter: number;
  ownerLabel: string;
  criticalStatus: string;
};

const canvas = { width: 920, height: 480 };

type ThreadState = {
  isWaiting: boolean;
  isQueued: boolean;
  isCommitted: boolean;
  isActive: boolean;
  progressWidth: string;
  tokenLeft: string;
  statusText: string;
};

function getThreadState(modeId: string, phaseIndex: number, threadIndex: number): ThreadState {
  let isWaiting = false; // deadlocked/blocked
  let isQueued = false; // waiting turn
  let isCommitted = false; // finished/committed
  let isActive = false; // currently running/writing
  let progressWidth = "0%";
  let tokenLeft = "0%";
  let statusText = "local: -";

  if (modeId === "race") {
    if (phaseIndex === 0) {
      statusText = "local: -";
    } else if (phaseIndex === 1) {
      isActive = true;
      progressWidth = "25%";
      tokenLeft = "25%";
      statusText = "read 0";
    } else if (phaseIndex === 2) {
      isActive = true;
      progressWidth = "50%";
      tokenLeft = "50%";
      statusText = "local 1";
    } else if (phaseIndex >= 3) {
      isActive = true;
      isCommitted = true;
      progressWidth = "100%";
      tokenLeft = "calc(100% - 1rem)";
      statusText = "writes 1";
    }
  } else if (modeId === "mutex") {
    if (phaseIndex === 0) {
      isQueued = true;
      statusText = "local: -";
    } else {
      const activeThreadIndex = phaseIndex - 1;
      if (threadIndex < activeThreadIndex) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "committed";
      } else if (threadIndex === activeThreadIndex && phaseIndex < 5) {
        isActive = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = `lock acquired: writes ${threadIndex + 1}`;
      } else if (phaseIndex === 5) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "committed";
      } else {
        isQueued = true;
        statusText = "waiting turn";
      }
    }
  } else if (modeId === "atomic") {
    if (phaseIndex === 0) {
      isQueued = true;
      statusText = "local: -";
    } else {
      const activeThreadIndex = phaseIndex - 1;
      if (threadIndex < activeThreadIndex) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "committed";
      } else if (threadIndex === activeThreadIndex && phaseIndex < 5) {
        isActive = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = `atomic add: writes ${threadIndex + 1}`;
      } else if (phaseIndex === 5) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "committed";
      } else {
        isQueued = true;
        statusText = "retry-spinning";
      }
    }
  } else if (modeId === "semaphore") {
    if (phaseIndex === 0) {
      isQueued = true;
      statusText = "local: -";
    } else if (phaseIndex === 1) {
      if (threadIndex < 2) {
        isActive = true;
        progressWidth = "60%";
        tokenLeft = "60%";
        statusText = "permit checked out";
      } else {
        isQueued = true;
        statusText = "waiting turn";
      }
    } else if (phaseIndex === 2) {
      if (threadIndex < 2) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "committed";
      } else {
        isQueued = true;
        statusText = "waiting turn";
      }
    } else if (phaseIndex === 3) {
      if (threadIndex < 2) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "committed";
      } else {
        isActive = true;
        progressWidth = "60%";
        tokenLeft = "60%";
        statusText = "permit checked out";
      }
    } else if (phaseIndex >= 4) {
      isCommitted = true;
      progressWidth = "100%";
      tokenLeft = "calc(100% - 1rem)";
      statusText = "committed";
    }
  } else if (modeId === "queue") {
    if (phaseIndex === 0) {
      isQueued = true;
      statusText = "local: -";
    } else if (phaseIndex === 1) {
      isActive = true;
      progressWidth = "40%";
      tokenLeft = "40%";
      statusText = "enqueued +1";
    } else if (phaseIndex === 2) {
      if (threadIndex < 2) {
        isCommitted = true;
        progressWidth = "100%";
        tokenLeft = "calc(100% - 1rem)";
        statusText = "drained";
      } else {
        isActive = true;
        progressWidth = "40%";
        tokenLeft = "40%";
        statusText = "in queue";
      }
    } else if (phaseIndex >= 3) {
      isCommitted = true;
      progressWidth = "100%";
      tokenLeft = "calc(100% - 1rem)";
      statusText = "drained";
    }
  } else if (modeId === "deadlock") {
    if (threadIndex >= 2) {
      isWaiting = true;
      statusText = "not started";
    } else if (phaseIndex === 0) {
      isQueued = true;
      statusText = "local: -";
    } else if (phaseIndex === 1) {
      if (threadIndex === 0) {
        isActive = true;
        progressWidth = "35%";
        tokenLeft = "35%";
        statusText = "locks X";
      } else {
        isQueued = true;
        statusText = "ready";
      }
    } else if (phaseIndex === 2) {
      if (threadIndex === 0) {
        isActive = true;
        progressWidth = "35%";
        tokenLeft = "35%";
        statusText = "has X";
      } else if (threadIndex === 1) {
        isActive = true;
        progressWidth = "35%";
        tokenLeft = "35%";
        statusText = "locks Y";
      }
    } else if (phaseIndex >= 3) {
      isWaiting = true;
      progressWidth = "35%";
      tokenLeft = "35%";
      statusText = threadIndex === 0 ? "waits Y" : "waits X";
    }
  } else if (modeId === "multiprocessing") {
    if (phaseIndex === 0) {
      statusText = "local: -";
    } else if (phaseIndex === 1) {
      isActive = true;
      progressWidth = "25%";
      tokenLeft = "25%";
      statusText = "forked process";
    } else if (phaseIndex === 2) {
      isActive = true;
      progressWidth = "60%";
      tokenLeft = "60%";
      statusText = "private memory";
    } else if (phaseIndex === 3) {
      isActive = true;
      progressWidth = "85%";
      tokenLeft = "85%";
      statusText = "parallel compute";
    } else if (phaseIndex >= 4) {
      isCommitted = true;
      progressWidth = "100%";
      tokenLeft = "calc(100% - 1rem)";
      statusText = "merged";
    }
  }

  return { isWaiting, isQueued, isCommitted, isActive, progressWidth, tokenLeft, statusText };
}

export default function ConcurrencyScene({
  mode,
  phaseIndex,
  isRunning,
  activeWorkerCount,
  deadlocked,
  isAtomic,
  isMultiprocessing,
  isQueue,
  isRace,
  lockHeld,
  visibleExpectedCounter,
  visibleObservedCounter,
  ownerLabel,
  criticalStatus,
}: ConcurrencySceneProps) {
  const counterConsistent = visibleObservedCounter === visibleExpectedCounter;
  const isSemaphore = mode.id === "semaphore";

  const gridColsClass =
    mode.phases.length === 3
      ? "grid-cols-3"
      : mode.phases.length === 5
        ? "grid-cols-5"
        : "grid-cols-6";

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

        <div className={`relative grid ${gridColsClass} gap-3`}>
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

        <div className="relative mt-6 grid grid-cols-[1fr_13rem_13rem] gap-4">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => {
              const active = index < activeWorkerCount;
              const tState = getThreadState(mode.id, phaseIndex, index);

              return (
                <div
                  key={index}
                  className={`grid grid-cols-[5rem_1fr_6rem] items-center gap-3 transition ${active ? "opacity-100" : "opacity-25"}`}
                >
                  {/* Thread core - Circular and glowing instead of rectangly */}
                  <div
                    className={`rounded-full h-14 w-14 flex flex-col justify-center items-center border text-center shadow-lg transition-all duration-300 relative ${
                      tState.isWaiting
                        ? "border-red-400 bg-red-950 text-red-200 shadow-red-500/25 scale-105"
                        : tState.isQueued
                          ? "border-indigo-400/40 bg-indigo-950/40 text-indigo-300/60"
                          : tState.isCommitted
                            ? "border-emerald-500 bg-emerald-950/80 text-emerald-300 shadow-emerald-500/20"
                            : "border-orange-500 bg-[#1f172a] text-orange-200 shadow-orange-500/20 scale-105"
                    }`}
                  >
                    <div className="text-[0.5rem] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Core
                    </div>
                    <div className="text-sm font-black mt-0.5 leading-none">T{index + 1}</div>
                  </div>

                  {/* Thread Track - pipeline layout with pulse wire backing */}
                  <div className="relative h-4 overflow-hidden rounded-full bg-slate-950 border border-slate-900/40 shadow-inner">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(249,115,22,0.04)_8px,rgba(249,115,22,0.04)_16px)]" />
                    <div
                      className={`absolute top-1/2 h-1 -translate-y-1/2 rounded-full transition-all duration-500 motion-reduce:transition-none ${
                        tState.isWaiting
                          ? "bg-red-400"
                          : tState.isCommitted
                            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                            : "bg-orange-300 shadow-[0_0_8px_rgba(253,186,116,0.5)]"
                      }`}
                      style={{ left: 0, width: active ? tState.progressWidth : "0%" }}
                    />
                    {active && !tState.isQueued ? (
                      <span
                        className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full shadow-lg transition-all duration-500 motion-reduce:transition-none ${
                          tState.isWaiting
                            ? "bg-rose-400 shadow-rose-400/40"
                            : tState.isCommitted
                              ? "bg-emerald-300 shadow-emerald-400/40"
                              : "bg-orange-100 shadow-orange-200/40"
                        } ${isRunning ? "animate-pulse motion-reduce:animate-none" : ""}`}
                        style={{ left: tState.tokenLeft }}
                      />
                    ) : null}
                  </div>

                  {/* Status/Register values */}
                  <div
                    className={`text-[0.68rem] font-black uppercase tracking-wider transition-colors ${
                      tState.isWaiting
                        ? "text-red-400"
                        : tState.isCommitted
                          ? "text-emerald-400"
                          : tState.isActive
                            ? "text-orange-300"
                            : "text-slate-500"
                    }`}
                  >
                    {active ? tState.statusText : "-"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Critical Section / Synchronization Gate - Circular/vortex spinning gate instead of standard box */}
          <div className="flex justify-center items-center">
            <div
              className={`rounded-full h-48 w-42 flex flex-col justify-center items-center border p-4 text-center shadow-2xl relative transition-all duration-500 overflow-hidden ${
                deadlocked
                  ? "border-red-400 bg-gradient-to-br from-red-950 via-red-900 to-black text-red-100 shadow-red-500/20 scale-[1.02]"
                  : lockHeld || isAtomic || isQueue || isMultiprocessing
                    ? "border-violet-400 bg-gradient-to-br from-violet-950 via-slate-950 to-violet-900 text-violet-100 shadow-violet-500/20 scale-[1.02]"
                    : "border-violet-800 bg-gradient-to-br from-[#120d1c] via-[#1c122a] to-black text-violet-300/80"
              }`}
            >
              <div className="absolute inset-1 rounded-full border border-dashed border-current/10 pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-dashed border-current/5 pointer-events-none" />

              <div className="relative z-10">
                <div className="text-[0.58rem] font-black uppercase tracking-[0.2em] text-slate-400">
                  {isAtomic
                    ? "Atomic Add"
                    : isQueue
                      ? "Queue"
                      : isMultiprocessing
                        ? "IPC Merge"
                        : isSemaphore
                          ? "Permit Pool"
                          : "Sync Gate"}
                </div>
                <div className="mt-2 text-[0.68rem] text-slate-300 font-bold">
                  owner: <span className="text-amber-400 font-black">{ownerLabel}</span>
                </div>
                <div
                  className={`mt-2 text-[0.62rem] leading-snug font-black uppercase tracking-wider ${deadlocked ? "text-red-200 animate-pulse motion-reduce:animate-none" : "text-slate-400"}`}
                >
                  {criticalStatus}
                </div>

                {mode.id === "mutex" && lockHeld ? (
                  <div className="mt-2 scale-90 rounded-full border border-violet-400/40 bg-violet-900/90 px-2.5 py-0.5 text-[0.55rem] font-black tracking-widest animate-pulse text-violet-200 motion-reduce:animate-none">
                    LOCKED
                  </div>
                ) : null}
                {isSemaphore && lockHeld ? (
                  <div className="mt-2 scale-90 rounded-full border border-indigo-400/40 bg-indigo-900/90 px-2.5 py-0.5 text-[0.55rem] font-black tracking-widest text-indigo-200">
                    2 PERMITS OUT
                  </div>
                ) : null}
                {isAtomic && phaseIndex > 0 ? (
                  <div className="mt-2 scale-90 rounded-full border border-amber-400/40 bg-amber-950 px-2.5 py-0.5 text-[0.55rem] font-black text-amber-200 tracking-widest">
                    LINEARIZED
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Shared register display with angled corner HUD brackets */}
          <div
            className={`rounded-3xl border-2 p-5 text-center shadow-xl flex flex-col justify-center items-center relative transition-all duration-500 ${
              counterConsistent
                ? "border-amber-400/60 bg-gradient-to-b from-[#261f12] to-[#12100d] text-amber-100 shadow-amber-500/5"
                : "border-rose-400/60 bg-gradient-to-b from-rose-950/45 to-[#1a1012] text-rose-100 shadow-rose-500/10"
            }`}
          >
            {/* Cybernetic HUD Corner Brackets */}
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-current/30 rounded-tl-sm" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-current/30 rounded-tr-sm" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-current/30 rounded-bl-sm" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-current/30 rounded-br-sm" />

            <div className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-500">
              {isSemaphore
                ? "Completed Work"
                : isMultiprocessing
                  ? "Merged Result"
                  : "Shared Register"}
            </div>
            <div
              className={`mt-3 text-5xl font-black font-mono tracking-tight transition-all ${counterConsistent ? "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]" : "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.35)]"}`}
            >
              {visibleObservedCounter}
            </div>
            <div className="mt-2 text-[0.62rem] font-bold text-slate-500 uppercase tracking-widest">
              Expected: {visibleExpectedCounter}
            </div>

            <div
              className={`mt-4 text-[0.62rem] font-black leading-snug transition-colors uppercase tracking-wider ${isRace && phaseIndex >= 3 ? "text-rose-400 animate-pulse font-extrabold motion-reduce:animate-none" : "text-slate-500"}`}
            >
              {isRace && phaseIndex >= 3
                ? "LOST UPDATES: COLLIDED"
                : deadlocked
                  ? "BLOCKED: CIRCULAR WAIT"
                  : isSemaphore
                    ? "CAPACITY BOUNDED"
                    : "REGISTERS IN SYNC"}
            </div>
          </div>
        </div>

        <div className="relative mt-4 gap-3">
          {isQueue ? (
            <div className="rounded-2xl border border-orange-500/40 bg-[#1f172a]/60 p-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div>
                <div className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  Memory Buffer (Work Queue)
                </div>
                <div className="mt-3 flex gap-1.5 h-10 items-center p-1 bg-slate-950/80 rounded-xl border border-slate-900 overflow-hidden relative">
                  {phaseIndex === 0 ? (
                    <span className="text-[0.62rem] text-slate-600 uppercase font-bold tracking-widest pl-2">
                      Queue Empty
                    </span>
                  ) : phaseIndex === 1 ? (
                    ["T4", "T3", "T2", "T1"].map((task) => (
                      <span
                        key={task}
                        className="flex h-7 w-12 rounded-lg bg-orange-500/20 border border-orange-500/50 text-[0.62rem] font-mono font-black text-orange-200 items-center justify-center animate-pulse motion-reduce:animate-none"
                      >
                        {task}
                      </span>
                    ))
                  ) : phaseIndex === 2 ? (
                    ["T4", "T3"].map((task) => (
                      <span
                        key={task}
                        className="flex h-7 w-12 rounded-lg bg-orange-500/20 border border-orange-500/50 text-[0.62rem] font-mono font-black text-orange-200 items-center justify-center animate-pulse motion-reduce:animate-none"
                      >
                        {task}
                      </span>
                    ))
                  ) : (
                    <span className="text-[0.62rem] text-slate-600 uppercase font-bold tracking-widest pl-2">
                      Queue Empty
                    </span>
                  )}
                </div>
              </div>

              {/* Conveyor connection arrow */}
              <div className="flex flex-col items-center justify-center text-orange-400/40 font-mono text-[0.62rem]">
                <span className="uppercase font-bold tracking-wider mb-1">DRAIN</span>
                <span className="animate-pulse text-sm motion-reduce:animate-none">➔</span>
              </div>

              <div>
                <div className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
                  Single-Threaded Reducer
                </div>
                <div className="mt-3 flex gap-1.5 h-10 items-center p-1 bg-slate-950/80 rounded-xl border border-slate-900 overflow-hidden">
                  {phaseIndex === 0 || phaseIndex >= 4 ? (
                    <span className="text-[0.62rem] text-slate-600 uppercase font-bold tracking-widest pl-2">
                      Idle
                    </span>
                  ) : phaseIndex === 1 ? (
                    <span className="text-[0.62rem] text-amber-500/80 uppercase font-black tracking-widest pl-2 animate-pulse motion-reduce:animate-none">
                      Waiting for Drain
                    </span>
                  ) : phaseIndex === 2 ? (
                    ["T1", "T2"].map((task) => (
                      <span
                        key={task}
                        className="flex h-7 w-14 rounded-lg bg-emerald-500/20 border border-emerald-500 text-[0.62rem] font-mono font-black text-emerald-200 items-center justify-center animate-bounce"
                      >
                        {task}
                      </span>
                    ))
                  ) : (
                    ["T3", "T4"].map((task) => (
                      <span
                        key={task}
                        className="flex h-7 w-14 rounded-lg bg-emerald-500/20 border border-emerald-500 text-[0.62rem] font-mono font-black text-emerald-200 items-center justify-center animate-bounce"
                      >
                        {task}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {isMultiprocessing ? (
            <div className="rounded-2xl border border-violet-300 bg-slate-950 p-3 text-violet-100">
              <div className="text-sm font-black">each process owns private memory</div>
              <div className="text-xs text-slate-400">
                merge happens through IPC/result collection
              </div>
            </div>
          ) : null}
          {deadlocked ? (
            <div className="rounded-2xl border border-red-300 bg-red-950 p-3 text-red-100">
              <div className="text-sm font-black">circular wait</div>
              <div className="text-xs text-red-200">A waits on Y while B waits on X.</div>
            </div>
          ) : null}
          {isRace ? (
            <div
              className={`rounded-2xl border border-rose-300 bg-rose-950 p-3 text-rose-100 transition ${phaseIndex >= 1 ? "opacity-100" : "opacity-30"}`}
            >
              <div className="text-sm font-black">stale reads collide here</div>
              <div className="text-xs text-rose-200">
                workers read the same base value before writing.
              </div>
            </div>
          ) : null}
        </div>
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
