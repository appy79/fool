import type { AppDefinition } from "../../../osStore";

export function SystemModuleRow({
  app,
  onOpen,
}: {
  app: AppDefinition;
  onOpen: (app: AppDefinition) => void;
}) {
  return (
    <li className="flex min-w-0 items-center gap-3 border border-border/60 bg-card/40 p-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/60 bg-card/50 text-primary">
        <app.Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground">{app.title}</span>
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.14em] text-muted-foreground">
          system · required
        </span>
      </span>
      <button
        type="button"
        onClick={() => onOpen(app)}
        className="shrink-0 border border-border/70 px-2.5 py-1 font-mono text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
      >
        Open
      </button>
    </li>
  );
}
