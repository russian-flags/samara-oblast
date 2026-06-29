import type { FlagImageAttributeValue, FlagImageOptions } from "./types.js";

function applyAttribute(image: HTMLImageElement, name: string, value: FlagImageAttributeValue): void {
  if (value === undefined || value === null || value === false) {
    image.removeAttribute(name);
    return;
  }

  image.setAttribute(name, value === true ? "" : String(value));
}

export function createFlagImage(src: string, defaultAlt: string, options: FlagImageOptions = {}): HTMLImageElement {
  const {
    alt = defaultAlt,
    decoding = "async",
    loading = "lazy",
    className,
    title,
    id,
    width,
    height,
    style,
    dataset,
    attributes,
  } = options;

  const image = new Image();
  image.src = src;
  image.alt = alt;
  image.decoding = decoding;
  image.loading = loading;

  if (className !== undefined) image.className = className;
  if (title !== undefined) image.title = title;
  if (id !== undefined) image.id = id;
  if (width !== undefined) image.width = width;
  if (height !== undefined) image.height = height;

  if (style) {
    for (const [name, value] of Object.entries(style)) {
      if (value !== undefined && value !== null) {
        image.style.setProperty(name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`), String(value));
      }
    }
  }

  if (dataset) {
    for (const [name, value] of Object.entries(dataset)) {
      if (value === undefined || value === null || value === false) {
        delete image.dataset[name];
      } else {
        image.dataset[name] = value === true ? "" : String(value);
      }
    }
  }

  if (attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      applyAttribute(image, name, value);
    }
  }

  return image;
}
