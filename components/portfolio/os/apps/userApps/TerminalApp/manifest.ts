import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "terminal",
  title: "Terminal",
  description: "Interactive command console for the OS.",
  Icon,
  defaultSize: { w: 720, h: 480 },
  order: 50,
};
