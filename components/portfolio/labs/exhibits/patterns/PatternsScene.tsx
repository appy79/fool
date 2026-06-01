import LabSceneFrame from "../../shared/LabSceneFrame";
import ScaledSceneCanvas from "../../shared/ScaledSceneCanvas";

type PatternSceneProps = {
  pattern: {
    id: string;
    parts: readonly string[];
  };
  activePart: number;
};

const canvas = { width: 980, height: 560 };

type Tone = "amber" | "cyan" | "emerald" | "rose" | "violet" | "slate";

const toneClasses: Record<Tone, { active: string; done: string; idle: string }> = {
  amber: {
    active: "border-amber-200 bg-amber-400 text-stone-950 shadow-amber-400/40",
    done: "border-amber-400/50 bg-amber-950/60 text-amber-100",
    idle: "border-amber-900/50 bg-stone-950/80 text-amber-200/55",
  },
  cyan: {
    active: "border-cyan-200 bg-cyan-300 text-slate-950 shadow-cyan-400/40",
    done: "border-cyan-400/50 bg-cyan-950/60 text-cyan-100",
    idle: "border-cyan-900/50 bg-slate-950/80 text-cyan-200/55",
  },
  emerald: {
    active: "border-emerald-200 bg-emerald-300 text-slate-950 shadow-emerald-400/40",
    done: "border-emerald-400/50 bg-emerald-950/60 text-emerald-100",
    idle: "border-emerald-900/50 bg-slate-950/80 text-emerald-200/55",
  },
  rose: {
    active: "border-rose-200 bg-rose-400 text-slate-950 shadow-rose-400/40",
    done: "border-rose-400/50 bg-rose-950/60 text-rose-100",
    idle: "border-rose-900/50 bg-slate-950/80 text-rose-200/55",
  },
  violet: {
    active: "border-violet-200 bg-violet-300 text-slate-950 shadow-violet-400/40",
    done: "border-violet-400/50 bg-violet-950/60 text-violet-100",
    idle: "border-violet-900/50 bg-slate-950/80 text-violet-200/55",
  },
  slate: {
    active: "border-slate-200 bg-slate-200 text-slate-950 shadow-slate-200/30",
    done: "border-slate-500 bg-slate-800 text-slate-100",
    idle: "border-slate-800 bg-slate-950/80 text-slate-500",
  },
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isActive(activePart: number, step: number) {
  return activePart === step;
}

function isDone(activePart: number, step: number) {
  return activePart > step;
}

function cardClass(activePart: number, step: number, tone: Tone) {
  return cx(
    "relative rounded-2xl border p-3 shadow-lg transition-all duration-500",
    isActive(activePart, step) && `scale-[1.04] ${toneClasses[tone].active} animate-pulse motion-reduce:animate-none`,
    isDone(activePart, step) && toneClasses[tone].done,
    activePart < step && toneClasses[tone].idle
  );
}

function FlowLine({ active }: { active: boolean }) {
  return (
    <div className={cx("h-1 rounded-full transition-all duration-500", active ? "bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.45)]" : "bg-stone-800")} />
  );
}

function StepStrip({ parts, activePart }: { parts: readonly string[]; activePart: number }) {
  return (
    <div className="absolute left-6 right-6 top-5 z-20 rounded-3xl border border-amber-900/40 bg-stone-950/85 p-3">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${parts.length}, minmax(0, 1fr))` }}>
        {parts.map((part, index) => (
          <div
            key={part}
            className={cx(
              "rounded-2xl border px-2 py-2 text-center text-[0.56rem] font-black uppercase leading-tight tracking-[0.12em] transition-all duration-500",
              index === activePart && "scale-105 border-amber-200 bg-amber-300 text-stone-950 shadow-lg shadow-amber-400/30",
              index < activePart && "border-orange-400/40 bg-orange-950/60 text-orange-100",
              index > activePart && "border-stone-800 bg-stone-950 text-stone-500"
            )}
          >
            <span className="block text-[0.48rem] opacity-70">0{index + 1}</span>
            {part}
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({
  activePart,
  body,
  label,
  step,
  title,
  tone,
}: {
  activePart: number;
  body: string;
  label: string;
  step: number;
  title: string;
  tone: Tone;
}) {
  return (
    <div className={cardClass(activePart, step, tone)}>
      <div className="text-[0.55rem] font-black uppercase tracking-[0.2em] opacity-70">{label}</div>
      <div className="mt-1 text-sm font-black uppercase leading-tight tracking-wide">{title}</div>
      <div className="mt-2 text-[0.68rem] font-semibold leading-5 opacity-80">{body}</div>
    </div>
  );
}

function StrategyView({ activePart }: { activePart: number }) {
  const selected = activePart >= 3;

  return (
    <div className="absolute bottom-8 left-7 right-7 top-32 grid grid-cols-[1fr_1.15fr_1.45fr_1fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <Card activePart={activePart} step={0} tone="slate" label="caller" title="no algorithm switch" body="The caller sends a normal request and avoids if/else chains for every behavior." />
        <FlowLine active={activePart >= 1} />
        <Card activePart={activePart} step={1} tone="amber" label="context" title="selection policy" body="The context reads request shape, feature flags, tenant, or config to pick a strategy key." />
      </div>

      <div className="flex flex-col justify-center">
        <Card activePart={activePart} step={2} tone="cyan" label="registry" title="strategy interface" body="A dependency-injected registry resolves a concrete class behind one callable contract." />
      </div>

      <div className="rounded-3xl border border-orange-900/50 bg-orange-950/20 p-4">
        <div className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.22em] text-orange-200/80">Concrete Strategies</div>
        <div className="grid gap-3">
          {[
            ["FastAlgorithm", "low latency, approximate score"],
            ["AccurateAlgorithm", "slower, exact calculation"],
            ["CachedAlgorithm", "reuse previous result when safe"],
          ].map(([name, body], index) => {
            const chosen = selected && index === 1;

            return (
              <div
                key={name}
                className={cx(
                  "rounded-2xl border px-3 py-2 transition-all duration-500",
                  chosen ? "scale-[1.03] border-amber-200 bg-amber-300 text-stone-950 shadow-lg shadow-amber-400/30" : activePart >= 2 ? "border-orange-400/30 bg-stone-950/80 text-orange-100" : "border-stone-800 bg-stone-950/70 text-stone-600"
                )}
              >
                <div className="text-xs font-black uppercase tracking-wider">{name}</div>
                <div className="text-[0.64rem] font-semibold opacity-75">{body}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <Card activePart={activePart} step={4} tone="emerald" label="context" title="normalize return" body="The context accepts the common result type regardless of the selected implementation." />
        <FlowLine active={activePart >= 5} />
        <Card activePart={activePart} step={5} tone="emerald" label="result" title="stable caller contract" body="The caller receives one response shape and remains closed to algorithm churn." />
      </div>
    </div>
  );
}

function AdapterView({ activePart }: { activePart: number }) {
  return (
    <div className="absolute bottom-8 left-7 right-7 top-32 grid grid-cols-[1fr_1.35fr_1fr] gap-5">
      <div className="rounded-3xl border border-emerald-900/40 bg-emerald-950/15 p-4">
        <div className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-emerald-200/75">Modern Boundary</div>
        <div className="mt-5 space-y-3">
          <Card activePart={activePart} step={0} tone="emerald" label="target" title="request DTO" body="Client code calls the clean interface used by the current system." />
          <Card activePart={activePart} step={5} tone="emerald" label="target" title="response model" body="The response returns in the same modern contract." />
        </div>
      </div>

      <div className="rounded-3xl border border-amber-900/50 bg-amber-950/20 p-4">
        <div className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-amber-200/80">Adapter Translation Pipeline</div>
        <div className="mt-4 grid gap-3">
          <Card activePart={activePart} step={1} tone="amber" label="boundary" title="implements target" body="The adapter is substitutable anywhere the target interface is expected." />
          <Card activePart={activePart} step={2} tone="cyan" label="map out" title="field + protocol mapping" body="Names, IDs, envelope shape, auth headers, and error expectations are transformed." />
          <Card activePart={activePart} step={4} tone="violet" label="map back" title="normalize legacy response" body="Legacy status, nulls, and errors become the target response model." />
        </div>
      </div>

      <div className="rounded-3xl border border-rose-900/50 bg-rose-950/20 p-4">
        <div className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-rose-200/75">Legacy Boundary</div>
        <div className="mt-5 space-y-3">
          <Card activePart={activePart} step={3} tone="rose" label="legacy" title="SOAP/RPC payload" body="The incompatible request shape exists only behind the adapter." />
          <div className={cx("rounded-2xl border p-3 text-center transition-all duration-500", activePart >= 3 ? "border-rose-300 bg-rose-950/70 text-rose-100" : "border-stone-800 bg-stone-950 text-stone-600")}>
            <div className="text-[0.55rem] font-black uppercase tracking-[0.18em] opacity-70">contained dependency</div>
            <div className="mt-1 text-sm font-black uppercase">Legacy SOA</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ObserverView({ activePart }: { activePart: number }) {
  const subscribers = [
    ["Audit", "append immutable audit row"],
    ["Email", "send notification asynchronously"],
    ["Cache", "update read model/projection"],
  ];

  return (
    <div className="absolute bottom-8 left-7 right-7 top-32 grid grid-cols-[0.9fr_1.1fr_1.7fr_1fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <Card activePart={activePart} step={0} tone="slate" label="publisher" title="domain event" body="Publisher creates one event describing what happened." />
        <Card activePart={activePart} step={1} tone="amber" label="publish" title="emit once" body="Publisher does not know which consumers exist." />
      </div>

      <div className="flex flex-col justify-center">
        <Card activePart={activePart} step={2} tone="cyan" label="subject / bus" title="fan-out queue" body="The subject or event bus gives each subscriber an independent delivery lane." />
      </div>

      <div className="rounded-3xl border border-cyan-900/50 bg-cyan-950/15 p-4">
        <div className="mb-3 text-[0.62rem] font-black uppercase tracking-[0.2em] text-cyan-100/80">Subscriber Lanes</div>
        <div className="grid gap-3">
          {subscribers.map(([name, body]) => (
            <div
              key={name}
              className={cx(
                "grid grid-cols-[5rem_1fr_4rem] items-center gap-3 rounded-2xl border p-3 transition-all duration-500",
                activePart >= 3 ? "border-cyan-300/60 bg-cyan-950/50 text-cyan-100" : "border-stone-800 bg-stone-950/70 text-stone-600"
              )}
            >
              <div className="text-xs font-black uppercase tracking-wider">{name}</div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-900">
                <div className={cx("h-full rounded-full transition-all duration-700", activePart >= 3 ? "w-full bg-cyan-300" : "w-0 bg-cyan-300")} />
              </div>
              <div className={cx("rounded-full border px-2 py-1 text-center text-[0.52rem] font-black uppercase", activePart >= 4 ? "border-emerald-300 bg-emerald-950 text-emerald-100" : "border-stone-800 text-stone-600")}>
                {activePart >= 4 ? "ack" : "wait"}
              </div>
              <div className="col-span-3 text-[0.64rem] font-semibold opacity-75">{body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <Card activePart={activePart} step={4} tone="emerald" label="reliability" title="ack / retry" body="Consumers retry idempotently when side effects fail." />
        <Card activePart={activePart} step={5} tone="emerald" label="effects" title="eventual completion" body="Side effects settle independently from the publisher." />
      </div>
    </div>
  );
}

function BreakerView({ activePart }: { activePart: number }) {
  const breakerRules = [
    { activeAt: 2, label: "failure count >= threshold" },
    { activeAt: 5, label: "cooldown timer elapsed" },
    { activeAt: 5, label: "probe success closes / failure reopens" },
  ];

  return (
    <div className="absolute bottom-8 left-7 right-7 top-32 grid grid-cols-[1fr_1.55fr_1fr] gap-5">
      <div className="flex flex-col justify-center gap-3">
        <Card activePart={activePart} step={0} tone="slate" label="service" title="incoming request" body="The service needs data from a dependency that may be slow or failing." />
        <Card activePart={activePart} step={1} tone="emerald" label="closed" title="pass-through calls" body="Closed state forwards calls and records failures, timeouts, and latency." />
      </div>

      <div className="rounded-3xl border border-violet-900/50 bg-violet-950/20 p-4">
        <div className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-violet-100/80">Circuit Breaker State Machine</div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className={cardClass(activePart, 1, "emerald")}>
            <div className="text-xs font-black uppercase">Closed</div>
            <div className="mt-2 text-[0.62rem] font-semibold">calls pass, counters watch</div>
          </div>
          <div className={cardClass(activePart, 3, "rose")}>
            <div className="text-xs font-black uppercase">Open</div>
            <div className="mt-2 text-[0.62rem] font-semibold">fail fast, stop load</div>
          </div>
          <div className={cardClass(activePart, 5, "amber")}>
            <div className="text-xs font-black uppercase">Half-open</div>
            <div className="mt-2 text-[0.62rem] font-semibold">limited recovery probe</div>
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          {breakerRules.map((rule) => (
            <div key={rule.label} className={cx("rounded-xl border px-3 py-2 text-[0.62rem] font-black uppercase tracking-wider transition-all duration-500", activePart >= rule.activeAt ? "border-violet-300/50 bg-violet-950/70 text-violet-100" : "border-stone-800 bg-stone-950 text-stone-600")}>
              {rule.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center gap-3">
        <Card activePart={activePart} step={2} tone="rose" label="dependency" title="timeouts / errors" body="Failures accumulate before the breaker opens." />
        <Card activePart={activePart} step={4} tone="emerald" label="fallback" title="degraded response" body="Users get a controlled result while the dependency recovers." />
        <Card activePart={activePart} step={5} tone="amber" label="probe" title="one guarded call" body="A small test call decides whether traffic can resume." />
      </div>
    </div>
  );
}

function PatternImplementationView({ patternId, activePart }: { patternId: string; activePart: number }) {
  if (patternId === "adapter") {
    return <AdapterView activePart={activePart} />;
  }

  if (patternId === "observer") {
    return <ObserverView activePart={activePart} />;
  }

  if (patternId === "breaker") {
    return <BreakerView activePart={activePart} />;
  }

  return <StrategyView activePart={activePart} />;
}

export default function PatternsScene({ pattern, activePart }: PatternSceneProps) {
  return (
    <LabSceneFrame className="p-0 border-amber-950/40 shadow-inner">
      <ScaledSceneCanvas
        aria-label="Design pattern implementation animation"
        className="bg-[#130d08]"
        role="img"
        width={canvas.width}
        height={canvas.height}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(245,158,11,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:54px_54px]" />
        <div className="pointer-events-none absolute left-[8%] top-[14%] h-36 w-36 rounded-full border-[10px] border-dashed border-amber-600/10" />
        <div className="pointer-events-none absolute right-[8%] bottom-[10%] h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />

        <StepStrip parts={pattern.parts} activePart={activePart} />
        <PatternImplementationView patternId={pattern.id} activePart={activePart} />
      </ScaledSceneCanvas>
    </LabSceneFrame>
  );
}
