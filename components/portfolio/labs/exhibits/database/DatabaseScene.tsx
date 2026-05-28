import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";

type DatabaseSceneProps = {
  accessModule: {
    id: string;
    name: string;
    stages: readonly string[];
    bars: readonly number[];
    statLabels: readonly string[];
  };
  activeStage: number;
};

const canvas = { width: 920, height: 500 };

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function stageState(activeStage: number, index: number) {
  if (index === activeStage) {
    return "active";
  }

  if (index < activeStage) {
    return "complete";
  }

  return "pending";
}

function stageClass(activeStage: number, index: number) {
  const state = stageState(activeStage, index);

  return cx(
    "min-w-[7.2rem] rounded-2xl border px-3 py-2 text-center transition-all duration-500",
    state === "active" && "scale-105 border-emerald-300 bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/25",
    state === "complete" && "border-amber-400/50 bg-amber-950/40 text-amber-100",
    state === "pending" && "border-zinc-800 bg-zinc-950/85 text-zinc-500"
  );
}

function nodeClass(active: boolean, complete = false, tone: "emerald" | "amber" | "sky" | "violet" | "rose" = "emerald") {
  const activeClasses = {
    amber: "border-amber-300 bg-amber-400 text-zinc-950 shadow-amber-400/30",
    emerald: "border-emerald-300 bg-emerald-400 text-zinc-950 shadow-emerald-400/30",
    rose: "border-rose-300 bg-rose-500 text-white shadow-rose-500/30",
    sky: "border-sky-300 bg-sky-400 text-zinc-950 shadow-sky-400/30",
    violet: "border-violet-300 bg-violet-400 text-zinc-950 shadow-violet-400/30",
  };

  return cx(
    "rounded-2xl border px-3 py-2 text-center text-[0.62rem] font-black uppercase leading-tight tracking-[0.14em] shadow-lg transition-all duration-500",
    active && `scale-105 ${activeClasses[tone]} animate-pulse motion-reduce:animate-none`,
    !active && complete && "border-amber-400/40 bg-amber-950/40 text-amber-100",
    !active && !complete && "border-zinc-800 bg-zinc-950/85 text-zinc-500"
  );
}

function connectorClass(active: boolean, complete = false) {
  return cx(
    "h-1 flex-1 rounded-full transition-all duration-500",
    active ? "bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.55)]" : complete ? "bg-amber-400/60" : "bg-zinc-800"
  );
}

function PipelineTrace({ stages, activeStage }: { stages: readonly string[]; activeStage: number }) {
  return (
    <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/80 p-3">
      <div className="mb-2 flex items-center justify-between text-[0.62rem] font-black uppercase tracking-[0.2em] text-zinc-500">
        <span>Query Execution Trace</span>
        <span className="text-emerald-300">
          Stage {activeStage + 1}/{stages.length}
        </span>
      </div>
      <div className="flex items-center gap-2 overflow-hidden">
        {stages.map((stage, index) => (
          <div key={stage} className="flex min-w-0 flex-1 items-center gap-2">
            <div className={stageClass(activeStage, index)}>
              <span className="block text-[0.52rem] opacity-70">0{index + 1}</span>
              <span className="block truncate text-[0.62rem]">{stage}</span>
            </div>
            {index < stages.length - 1 ? <div className={connectorClass(activeStage >= index + 1, activeStage > index + 1)} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function FullScanVisual({ activeStage }: { activeStage: number }) {
  const pages = ["Page 01", "Page 02", "Page 03", "Page 04", "Page 05", "Page 06"];

  return (
    <div className="grid h-full grid-cols-[0.9fr_1.4fr_0.9fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 0, activeStage > 0, "sky")}>SQL Request</div>
        <div className={connectorClass(activeStage >= 1, activeStage > 1)} />
        <div className={nodeClass(activeStage === 1, activeStage > 1, "amber")}>Planner chooses scan</div>
        <p className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-3 text-[0.68rem] leading-5 text-rose-100/80">
          No selective index: executor must inspect the relation page by page.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-rose-300">Buffer Pool And Heap Pages</span>
          <span className="rounded-full border border-rose-400/30 px-2 py-1 text-[0.56rem] font-black uppercase tracking-widest text-rose-200">O(n)</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {pages.map((page, index) => {
            const readingPages = activeStage === 2 || activeStage === 3;
            const filtered = activeStage >= 4 && index % 2 === 0;
            const touched = activeStage > 2 || (readingPages && index <= Math.min(activeStage + 1, pages.length - 1));

            return (
              <div
                key={page}
                className={cx(
                  "relative min-h-20 rounded-xl border p-3 text-center transition-all duration-500",
                  readingPages && touched && "scale-105 border-rose-300 bg-rose-500/20 text-rose-100 shadow-lg shadow-rose-500/20",
                  filtered && "border-emerald-300 bg-emerald-500/20 text-emerald-100",
                  !readingPages && !filtered && touched && "border-amber-400/40 bg-amber-950/40 text-amber-100",
                  !touched && "border-zinc-800 bg-zinc-950 text-zinc-600"
                )}
              >
                <div className="absolute left-2 right-2 top-2 h-2 rounded-full border border-current opacity-30" />
                <p className="mt-4 text-[0.62rem] font-black uppercase tracking-wider">{page}</p>
                <p className="mt-1 text-[0.55rem] uppercase tracking-widest opacity-70">{filtered ? "match kept" : touched ? "tuple scan" : "waiting"}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 4, activeStage > 4, "rose")}>WHERE filter</div>
        <div className={connectorClass(activeStage >= 5, activeStage > 5)} />
        <div className={nodeClass(activeStage === 5, false, "emerald")}>Rows returned</div>
      </div>
    </div>
  );
}

function IndexedVisual({ activeStage }: { activeStage: number }) {
  return (
    <div className="grid h-full grid-cols-[1.05fr_1.35fr_0.95fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 0, activeStage > 0, "sky")}>Indexed predicate</div>
        <div className={connectorClass(activeStage >= 1, activeStage > 1)} />
        <div className={nodeClass(activeStage === 1, activeStage > 1, "amber")}>B-tree lookup</div>
        <p className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3 text-[0.68rem] leading-5 text-emerald-100/80">
          The index narrows the search to exact row IDs instead of scanning every heap page.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-amber-300">B-tree Traversal</div>
        <div className="grid h-[148px] grid-rows-3 gap-3">
          {["Root key range", "Branch page", "Leaf: row id 84"].map((label, index) => (
            <div key={label} className={nodeClass(activeStage === 1, activeStage > 1, index === 2 ? "emerald" : "amber")}>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 2, activeStage > 2, "emerald")}>Heap pointer fetch</div>
        <div className="grid grid-cols-2 gap-2">
          {["Skipped", "Skipped", "Row 84", "Skipped"].map((label, index) => (
            <div
              key={`${label}-${index}`}
              className={cx(
                "rounded-xl border px-2 py-3 text-center text-[0.55rem] font-black uppercase tracking-wider transition-all duration-500",
                label === "Row 84" && activeStage >= 2
                  ? "border-emerald-300 bg-emerald-500/20 text-emerald-100"
                  : "border-zinc-800 bg-zinc-950 text-zinc-600 opacity-55"
              )}
            >
              {label}
            </div>
          ))}
        </div>
        <div className={nodeClass(activeStage === 3, false, "emerald")}>Rows returned</div>
      </div>
    </div>
  );
}

function ParallelVisual({ activeStage }: { activeStage: number }) {
  return (
    <div className="grid h-full grid-cols-[0.85fr_1.55fr_0.9fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 0, activeStage > 0, "sky")}>Coordinator query</div>
        <div className={connectorClass(activeStage >= 1, activeStage > 1)} />
        <div className={nodeClass(activeStage === 1, activeStage > 1, "amber")}>Partition split</div>
      </div>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-4">
        <div className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-sky-300">Worker Lanes</div>
        <div className="grid grid-cols-3 gap-3">
          {["Worker 1\nblocks 0-33", "Worker 2\nblocks 34-66", "Worker 3\nblocks 67-99"].map((label, index) => (
            <div key={label} className={cx(nodeClass(activeStage === 2, activeStage > 2, "sky"), "min-h-28 whitespace-pre-line")}>
              {label}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div className={cx("h-full rounded-full transition-all duration-700", activeStage >= 2 ? "w-full bg-sky-300" : "w-0 bg-sky-300")} />
              </div>
              <span className="mt-2 block text-[0.52rem] opacity-70">segment {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 3, activeStage > 3, "violet")}>Gather merge</div>
        <p className="rounded-2xl border border-violet-500/20 bg-violet-950/20 p-3 text-[0.68rem] leading-5 text-violet-100/80">
          Parallel work speeds reads, then the coordinator can become the merge bottleneck.
        </p>
        <div className={nodeClass(activeStage === 4, false, "emerald")}>Rows returned</div>
      </div>
    </div>
  );
}

function CacheVisual({ activeStage }: { activeStage: number }) {
  return (
    <div className="grid h-full grid-cols-[0.95fr_1.25fr_1fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 0, activeStage > 0, "sky")}>App request</div>
        <div className={nodeClass(activeStage === 0, activeStage > 0, "amber")}>Hash cache key</div>
        <div className={nodeClass(activeStage === 1, activeStage > 1, "rose")}>Redis miss</div>
      </div>

      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-300">Read-Through Cache Fill</span>
          <span className="rounded-full border border-emerald-300/40 px-2 py-1 text-[0.56rem] font-black uppercase tracking-widest text-emerald-200">next read is hot</span>
        </div>
        <div className={cx(nodeClass(activeStage === 3, activeStage > 3, "emerald"), "min-h-24")}>
          Populate Redis
          <span className="mt-2 block text-[0.55rem] tracking-widest opacity-75">set key + TTL after DB fetch</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["key:user:42", "payload", "ttl:45s"].map((label, index) => (
            <div
              key={label}
              className={cx(
                "rounded-xl border px-2 py-2 text-center text-[0.55rem] font-black uppercase tracking-wider transition-all duration-500",
                activeStage >= 3 || index === 0
                  ? "border-emerald-400/20 bg-zinc-950/70 text-emerald-100"
                  : "border-zinc-800 bg-zinc-950/70 text-zinc-600"
              )}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <div className={nodeClass(activeStage === 2, activeStage > 2, "rose")}>Primary DB fetch</div>
        <p className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-3 text-[0.68rem] leading-5 text-rose-100/75">
          The first read pays database cost; the cached value protects repeated reads.
        </p>
        <div className={nodeClass(activeStage === 4, false, "emerald")}>Response returned</div>
      </div>
    </div>
  );
}

export default function DatabaseScene({ accessModule, activeStage }: DatabaseSceneProps) {
  const renderAccessPath = () => {
    if (accessModule.id === "baseline") {
      return <FullScanVisual activeStage={activeStage} />;
    }

    if (accessModule.id === "indexed") {
      return <IndexedVisual activeStage={activeStage} />;
    }

    if (accessModule.id === "parallel") {
      return <ParallelVisual activeStage={activeStage} />;
    }

    return <CacheVisual activeStage={activeStage} />;
  };

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

        <div className="relative space-y-5">
          <PipelineTrace stages={accessModule.stages} activeStage={activeStage} />

          <div className="h-[238px] rounded-3xl border border-zinc-800 bg-zinc-950/70 p-4">
            {renderAccessPath()}
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-3 gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4">
          {accessModule.statLabels.map((label, index) => (
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
