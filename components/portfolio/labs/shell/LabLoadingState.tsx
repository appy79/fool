export default function LabLoadingState() {
  return (
    <section
      className="scroll-mt-24 rounded-[2rem] border border-border/70 bg-card/60 p-8 shadow-sm shadow-slate-900/5 dark:bg-background/50"
      aria-busy="true"
      aria-live="polite"
    >
      <h1 className="sr-only">Loading lab program…</h1>
      <div className="space-y-3">
        <div className="h-3 w-32 rounded-full bg-muted" />
        <div className="h-8 w-72 max-w-full rounded-full bg-muted" />
        <div className="h-4 w-full max-w-2xl rounded-full bg-muted" />
      </div>
    </section>
  );
}
