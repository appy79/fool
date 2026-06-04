import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "life",
  title: "Psychohistory Sim",
  shortLabel: "Life Sim",
  description: "Conway's Game of Life — paint cells and watch worlds evolve.",
  Icon,
  defaultSize: { w: 720, h: 640 },
  order: 130,
  dividerBefore: true,
};
