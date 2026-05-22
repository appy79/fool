import type { LabMetric } from "./types";

export default function MetricGrid({ metrics }: { metrics: readonly LabMetric[] }) {
  return (
    <div className="grid gap-3">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-3xl border border-border/70 bg-secondary/45 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {metric.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
