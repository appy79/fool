import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "notes",
  title: "Notes",
  description: "A local scratchpad — your notes stay in this browser.",
  Icon,
  defaultSize: { w: 560, h: 520 },
  order: 60,
};
