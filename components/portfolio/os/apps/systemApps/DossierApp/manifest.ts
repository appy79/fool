import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "dossier",
  title: "Dossier",
  shortLabel: "Dossier",
  description: "A 30-second brief — who I am, the numbers, résumé, and how to reach me.",
  Icon,
  defaultSize: { w: 600, h: 660 },
  order: 15,
};
