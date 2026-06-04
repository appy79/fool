import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "lightsout",
  title: "Seldon's Grid",
  shortLabel: "Lights",
  description: "Toggle the lattice until every node goes dark.",
  Icon,
  defaultSize: { w: 480, h: 600 },
  order: 160,
};
