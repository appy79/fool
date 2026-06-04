import Icon from "./icon";
import type { AppManifest } from "../../appManifest";

export const manifest: AppManifest = {
  id: "cipher",
  title: "Cipher",
  description: "Decrypt the 5-letter key in six tries.",
  Icon,
  defaultSize: { w: 480, h: 680 },
  order: 180,
};
