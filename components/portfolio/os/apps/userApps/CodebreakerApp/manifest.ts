import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "codebreaker",
  title: "Codebreaker",
  description: "Crack the hidden 4-glyph vault code.",
  Icon,
  defaultSize: { w: 520, h: 660 },
  order: 170,
};
