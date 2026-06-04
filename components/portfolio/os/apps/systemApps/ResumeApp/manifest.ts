import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "resume",
  title: "Resume",
  Icon,
  defaultSize: { w: 560, h: 440 },
  order: 90,
  dividerBefore: true,
};
