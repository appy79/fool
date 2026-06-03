import { type WallpaperId } from "../../../osSettings";
import OSWallpaper from "../../../wallpaper/OSWallpaper";

export function WallpaperSwatch({
  id,
  label,
  description,
  active,
  onSelect,
}: {
  id: WallpaperId;
  label: string;
  description: string;
  active: boolean;
  onSelect: (id: WallpaperId) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${label} wallpaper`}
      onClick={() => onSelect(id)}
      className={`group overflow-hidden rounded-xl border text-left transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
        active
          ? "border-primary ring-1 ring-primary/40"
          : "border-border/70 hover:border-primary/55"
      }`}
    >
      {/* Real, static preview of the wallpaper variant (animations neutralized to save cost). */}
      <span className="os-reduce-motion relative block h-20 w-full overflow-hidden">
        <OSWallpaper variant={id} />
        {active ? (
          <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-primary/90 px-1.5 py-0.5 font-mono text-[0.5rem] font-bold uppercase tracking-[0.1em] text-primary-foreground">
            on
          </span>
        ) : null}
      </span>
      <span className="block px-3 py-2">
        <span className="block text-xs font-semibold text-foreground">{label}</span>
        <span className="mt-0.5 block text-[0.66rem] leading-4 text-muted-foreground">
          {description}
        </span>
      </span>
    </button>
  );
}
