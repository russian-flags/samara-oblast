import type { FlagImageOptions } from "../types.js";
import { createFlagImage } from "../image.js";

export const src = new URL("../flags/zhigulevsk.svg", import.meta.url).href;

export function createImage(options?: FlagImageOptions): HTMLImageElement {
  return createFlagImage(src, "Флаг Жигулёвск", options);
}

export default createImage;
