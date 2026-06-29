import type { FlagImageOptions } from "../types.js";
import { createFlagImage } from "../image.js";

export const src = new URL("../flags/novokuybyshevsk.svg", import.meta.url).href;

export function createImage(options?: FlagImageOptions): HTMLImageElement {
  return createFlagImage(src, "Флаг Новокуйбышевск", options);
}

export default createImage;
