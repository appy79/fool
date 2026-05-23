import type { LabMetric } from "../types";

export default function MetricGrid({ metrics }: { metrics: readonly LabMetric[] }) {
  return (
    <div className="grid min-w-0 gap-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="min-w-0 max-w-full overflow-hidden rounded-2xl border border-border/70 bg-background/65 p-3 dark:bg-card/35">
          <p className="max-w-full whitespace-normal break-words font-mono text-[0.68rem] font-semibold uppercase leading-5 tracking-[0.16em] text-muted-foreground [overflow-wrap:anywhere]">
            {metric.label}
          </p>
          <p className="mt-2 max-w-full whitespace-normal break-words text-lg font-semibold leading-snug text-foreground [overflow-wrap:anywhere] sm:text-xl">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}
