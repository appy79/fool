export function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border border-border/70 bg-card/50 p-4">
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{label}</p>
        {description ? (
          <p className="mt-0.5 text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
          checked ? "border-primary bg-primary/80" : "border-border bg-muted/60"
        }`}
      >
        <span
          className={`size-5 rounded-full bg-background shadow transition-transform ${
            checked ? "translate-x-[1.4rem]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
