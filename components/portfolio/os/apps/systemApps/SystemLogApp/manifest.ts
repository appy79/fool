import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "log",
  title: "System Log",
  shortLabel: "Log",
  Icon,
  defaultSize: { w: 760, h: 600 },
  order: 40,
};
