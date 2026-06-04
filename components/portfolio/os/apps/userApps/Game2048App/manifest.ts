import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "game2048",
  title: "Trantor 2048",
  shortLabel: "2048",
  description: "Slide and merge tiers to reach 2048.",
  Icon,
  defaultSize: { w: 520, h: 660 },
  order: 140,
};
