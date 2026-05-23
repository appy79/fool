type LabProgressBarProps = {
  percent: number;
  variant?: "primary" | "destructive";
};

export default function LabProgressBar({ percent, variant = "primary" }: LabProgressBarProps) {
  return (
    <div className="overflow-hidden rounded-full border border-border/70 bg-secondary/40">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${variant === "destructive" ? "bg-destructive" : "bg-primary"}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
