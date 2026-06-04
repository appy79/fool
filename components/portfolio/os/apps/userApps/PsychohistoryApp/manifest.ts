import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "forecast",
  title: "Psychohistory",
  shortLabel: "Forecast",
  description: "A playful Foundation-style projection toy.",
  Icon,
  defaultSize: { w: 560, h: 540 },
  order: 80,
};
