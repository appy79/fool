export const copy = {
  eyebrow: "settings // environment",
  title: "System preferences",
  appearance: {
    title: "Appearance",
    hint: "Theme follows your choice; System tracks the device.",
  },
  wallpaper: {
    title: "Wallpaper",
    hint: "Applied instantly and remembered on this device.",
  },
  motion: {
    title: "Motion",
    toggleLabel: "Reduce motion",
    toggleHint:
      "Disable window, launch, and wallpaper animations. Your system setting is always honored too.",
  },
  clock: {
    title: "Clock",
    toggleLabel: "24-hour time",
    toggleHint: "Show the menu bar and status bar clock in 24-hour format.",
  },
  about: {
    title: "About",
    body: "A spatial operating system standing in for a portfolio. Telemetry and metrics are honest career peaks, not live readings.",
  },
};

export const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;
