import type { FlagImageOptions } from "../types.js";
import { createFlagImage } from "../image.js";

export const src = new URL("../flags/otradnyy.svg", import.meta.url).href;

export function createImage(options?: FlagImageOptions): HTMLImageElement {
  return createFlagImage(src, "Флаг Отрадный", options);
}

export default createImage;
