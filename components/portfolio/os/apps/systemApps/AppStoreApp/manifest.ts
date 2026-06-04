import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "appstore",
  title: "App Store",
  shortLabel: "Store",
  description: "Install and remove user modules.",
  Icon,
  defaultSize: { w: 640, h: 600 },
  order: 110,
};
