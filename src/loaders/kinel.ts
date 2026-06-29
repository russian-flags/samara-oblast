import type { FlagImageOptions } from "../types.js";
import { createFlagImage } from "../image.js";

export const src = new URL("../flags/kinel.svg", import.meta.url).href;

export function createImage(options?: FlagImageOptions): HTMLImageElement {
  return createFlagImage(src, "Флаг Кинель", options);
}

export default createImage;
