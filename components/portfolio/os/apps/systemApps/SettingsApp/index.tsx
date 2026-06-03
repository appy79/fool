"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useOSSettings, WALLPAPERS } from "../../../osSettings";
import { copy, THEME_OPTIONS } from "./data";
import { Section } from "./Section";
import { Toggle } from "./Toggle";
import { WallpaperSwatch } from "./WallpaperSwatch";

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
    <div className="space-y-6 p-4 @lg:p-7">
      <header>
        <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-primary">
          {copy.eyebrow}
        </span>
        <h1 className="mt-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground @sm:text-2xl">
          {copy.title}
        </h1>
      </header>

      <Section title={copy.appearance.title} hint={copy.appearance.hint}>
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

      <Section title={copy.wallpaper.title} hint={copy.wallpaper.hint}>
        <div className="grid grid-cols-1 gap-3 @xs:grid-cols-2 @lg:grid-cols-3">
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

      <Section title={copy.motion.title}>
        <Toggle
          label={copy.motion.toggleLabel}
          description={copy.motion.toggleHint}
          checked={reduceMotion}
          onChange={setReduceMotion}
        />
      </Section>

      <Section title={copy.clock.title}>
        <Toggle
          label={copy.clock.toggleLabel}
          description={copy.clock.toggleHint}
          checked={clock24h}
          onChange={setClock24h}
        />
      </Section>

      <Section title={copy.about.title}>
        <p className="text-sm leading-6 text-muted-foreground">{copy.about.body}</p>
      </Section>
    </div>
  );
}
