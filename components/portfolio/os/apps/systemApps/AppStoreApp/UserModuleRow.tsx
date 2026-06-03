import type { AppDefinition } from "../../../osStore";

export function UserModuleRow({
  app,
  installed,
  onOpen,
  onInstall,
  onUninstall,
}: {
  app: AppDefinition;
  installed: boolean;
  onOpen: (id: string) => void;
  onInstall: (id: string) => void;
  onUninstall: (id: string) => void;
}) {
  return (
    <li className="flex flex-wrap items-center gap-3 border border-border/70 bg-card/50 p-3.5">
      <span className="flex min-w-[11rem] flex-1 items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border/60 bg-gradient-to-b from-card/85 to-background/40 text-primary">
          <app.Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-semibold text-foreground">{app.title}</span>
            {installed ? (
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-primary">
                Installed
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-sm text-muted-foreground">
            {app.description ?? "User module"}
          </span>
        </span>
      </span>
      <div className="flex shrink-0 items-center gap-2">
        {installed ? (
          <>
            <button
              type="button"
              onClick={() => onOpen(app.id)}
              className="border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => onUninstall(app.id)}
              className="border border-destructive/55 px-3 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-destructive transition hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
            >
              Uninstall
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onInstall(app.id)}
            className="border border-primary/50 bg-primary/10 px-3.5 py-1.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-foreground transition hover:border-primary hover:bg-primary/15 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          >
            Install
          </button>
        )}
      </div>
    </li>
  );
}
