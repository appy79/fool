export const copy = {
  eyebrow: "settings // environment",
  title: "System preferences",
  appearance: {
    title: "Appearance",
    hint: "Theme follows your choice; System tracks the device.",
  },
  accent: {
    title: "Accent",
    hint: "Recolors the Prime Radiant highlight across the whole OS.",
  },
  wallpaper: {
    title: "Wallpaper",
    hint: "Applied instantly and remembered on this device.",
  },
  density: {
    title: "Density",
    hint: "Scales the interface — compact fits more, roomy reads easier.",
  },
  dock: {
    title: "Dock position",
    hint: "Park the dock along the bottom or down the left edge.",
  },
  scroll: {
    title: "Overflow",
    toggleLabel: "Allow horizontal scroll in apps",
    toggleHint:
      "Apps clip sideways by default for a tidy layout. Turn this on if any content is ever cut off, so you can always scroll to reach it.",
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
