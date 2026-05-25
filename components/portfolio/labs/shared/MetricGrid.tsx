import type { LabMetric } from "../types";

export default function MetricGrid({ metrics }: { metrics: readonly LabMetric[] }) {
  return (
    <div className="grid min-w-0 divide-y divide-border/70 border-y border-border/70">
      {metrics.map((metric) => (
        <div key={metric.label} className="grid min-w-0 max-w-full gap-1 overflow-hidden py-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-4">
          <p className="max-w-full whitespace-normal break-words font-mono text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.16em] text-muted-foreground [overflow-wrap:anywhere]">
            {metric.label}
          </p>
          <p className="max-w-full whitespace-normal break-words text-base font-semibold leading-snug text-foreground [overflow-wrap:anywhere]">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
