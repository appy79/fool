import type { MotifKind } from "./types";

export default function NodeMotif({ active, kind }: { active: boolean; kind: MotifKind }) {
  const motion = (className: string) => (active ? `${className} motion-reduce:animate-none` : "");

  if (kind === "events") {
    return (
      <div className="mx-auto grid max-w-[88px] grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }, (_, index) => (
          <span
            key={index}
            className={`size-2 rounded-full transition-colors duration-500 ${active ? "bg-primary/60" : "bg-primary/25"} ${motion("project-dot-chase")}`}
            style={{ animationDelay: `${index * 0.08}s` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "stack") {
    return (
      <div className="mx-auto grid w-full max-w-[112px] gap-1">
        {[1, 0.78, 0.92].map((width, index) => (
          <span
            key={index}
            className={`h-2 rounded-sm border-l-2 transition-colors duration-500 ${active ? "border-primary/70 bg-primary/35" : "border-primary/40 bg-primary/20"} ${motion("project-line-scan")}`}
            style={{ animationDelay: `${index * 0.14}s`, width: `${width * 100}%` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "rows") {
    return (
      <div className="mx-auto grid w-full max-w-[112px] gap-1.5">
        {[1, 0.66, 0.86].map((width, index) => (
          <span
            key={index}
            className={`h-1.5 rounded-full transition-colors duration-500 ${active ? "bg-primary/45" : "bg-primary/22"} ${motion("project-line-scan")}`}
            style={{ animationDelay: `${index * 0.16}s`, width: `${width * 100}%` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "bars") {
    return (
      <div className="mx-auto flex h-12 items-end justify-center gap-1.5">
        {[18, 28, 38, 46].map((height, index) => (
          <span
            key={height}
            className={`w-3.5 rounded-t-md transition-colors duration-500 ${active ? "bg-primary/50" : "bg-primary/25"} ${motion("project-bar-rise")}`}
            style={{ animationDelay: `${index * 0.12}s`, height }}
          />
        ))}
      </div>
    );
  }

  if (kind === "grid") {
    return (
      <div className="mx-auto grid max-w-[92px] grid-cols-2 gap-1.5">
        {Array.from({ length: 4 }, (_, index) => (
          <span
            key={index}
            className={`aspect-square rounded-md border transition-colors duration-500 ${active ? "border-primary/55 bg-primary/25" : "border-primary/30 bg-primary/12"} ${motion("project-worker-tick")}`}
            style={{ animationDelay: `${index * 0.12}s` }}
          />
        ))}
      </div>
    );
  }

  if (kind === "gauge") {
    return (
      <div className="mx-auto grid h-11 w-20 place-items-center overflow-hidden rounded-t-full border border-primary/45 bg-primary/12">
        <span
          className={`h-1 w-9 origin-left rounded-full bg-primary shadow-[0_0_12px_color-mix(in_oklch,var(--primary)_45%,transparent)] motion-reduce:rotate-[18deg] motion-reduce:animate-none ${active ? "project-gauge-sweep" : "rotate-[18deg]"}`}
        />
      </div>
    );
  }

  if (kind === "ring") {
    return (
      <div
        className={`mx-auto grid size-12 place-items-center rounded-full border-[6px] border-primary/55 bg-primary/10 shadow-[0_0_20px_color-mix(in_oklch,var(--primary)_30%,transparent)] transition-transform duration-500 motion-reduce:animate-none ${active ? "scale-105 animate-pulse" : "scale-100"}`}
      >
        <span className="size-4 rounded-full bg-background/80" />
      </div>
    );
  }

  // check
  return (
    <svg className="mx-auto h-10 w-10 text-primary" fill="none" viewBox="0 0 36 36">
      <circle
        cx="18"
        cy="18"
        r="15"
        stroke="currentColor"
        strokeOpacity={active ? 0.5 : 0.3}
        strokeWidth="2"
      />
      <path
        className={active ? "project-check-draw" : ""}
        d="M11 18.5 L16 23.5 L25 13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        style={{ strokeDasharray: 40, strokeDashoffset: active ? 40 : 0 }}
      />
    </svg>
  );
}
