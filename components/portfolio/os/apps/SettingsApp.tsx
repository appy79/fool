"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useOSSettings, WALLPAPERS, type WallpaperId } from "../osSettings";
import OSWallpaper from "../wallpaper/OSWallpaper";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export default function SettingsApp() {
  const { theme, setTheme } = useTheme();
  const { wallpaper, setWallpaper, reduceMotion, setReduceMotion, clock24h, setClock24h } =
    useOSSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-6 p-5 sm:p-7">
      <header>
        <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          settings // environment
        </span>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] text-foreground">
          System preferences
        </h1>
      </header>

      <Section title="Appearance" hint="Theme follows your choice; System tracks the device.">
        <div
          role="radiogroup"
          aria-label="Theme"
          className="inline-flex rounded-lg border border-border/70 bg-card/50 p-1"
        >
          {THEME_OPTIONS.map((option) => {
            const active = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTheme(option.value)}
                className={`rounded-md px-3.5 py-1.5 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] transition focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none ${
                  active
                    ? "bg-primary/85 text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Wallpaper" hint="Applied instantly and remembered on this device.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {WALLPAPERS.map((option) => (
            <WallpaperSwatch
              key={option.id}
              id={option.id}
              label={option.label}
              description={option.description}
              active={wallpaper === option.id}
              onSelect={setWallpaper}
            />
          ))}
        </div>
      </Section>

      <Section title="Motion">
        <Toggle
          label="Reduce motion"
          description="Disable window, launch, and wallpaper animations. Your system setting is always honored too."
          checked={reduceMotion}
          onChange={setReduceMotion}
        />
      </Section>

      <Section title="Clock">
        <Toggle
          label="24-hour time"
          description="Show the menu bar and status bar clock in 24-hour format."
          checked={clock24h}
          onChange={setClock24h}
        />
      </Section>

      <Section title="About">
        <p className="text-sm leading-6 text-muted-foreground">
          A spatial operating system standing in for a portfolio. Telemetry and metrics are honest
          career peaks, not live readings.
        </p>
      </Section>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-foreground">
          {title}
        </h2>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function WallpaperSwatch({
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

function Toggle({
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
