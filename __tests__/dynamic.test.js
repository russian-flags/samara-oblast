import assert from "node:assert/strict";
import {
  getFlagModuleLoader,
  loadFlag,
  loadFlagImage,
  loadFlagModule,
  preloadFlag,
} from "../dist/dynamic.js";
import { installTestImage } from "./helpers/test-image.js";

const ImageCtor = installTestImage();

assert.equal(loadFlag, loadFlagImage);

const samaraLoader = getFlagModuleLoader("samara");
assert.equal(typeof samaraLoader, "function");
assert.equal(getFlagModuleLoader(" SAMARA "), samaraLoader);
assert.equal(getFlagModuleLoader("Самара"), samaraLoader);
assert.equal(getFlagModuleLoader("Samara"), samaraLoader);
assert.equal(getFlagModuleLoader("Togliatti"), getFlagModuleLoader("tolyatti"));
assert.equal(getFlagModuleLoader("bezencuk"), undefined);
assert.equal(getFlagModuleLoader("unknown"), undefined);

assert.doesNotThrow(() => preloadFlag("samara"));
assert.doesNotThrow(() => preloadFlag("unknown"));

const samaraModule = await loadFlagModule("Samara");
assert.equal(samaraModule.default, samaraModule.createImage);
assert.equal(typeof samaraModule.createImage, "function");
assert.ok(samaraModule.src.endsWith("/flags/samara.svg"));

const moduleImage = samaraModule.createImage({ className: "module-image" });
assert.ok(moduleImage instanceof ImageCtor);
assert.equal(moduleImage.className, "module-image");
assert.ok(moduleImage.src.endsWith("/flags/samara.svg"));

const loadedImage = await loadFlagImage("SAMARA", {
  alt: "Lazy Samara",
  className: "loaded-image",
});
assert.ok(loadedImage instanceof ImageCtor);
assert.equal(loadedImage.alt, "Lazy Samara");
assert.equal(loadedImage.className, "loaded-image");
assert.equal(loadedImage.loading, "lazy");
assert.equal(loadedImage.decoding, "async");
assert.ok(loadedImage.src.endsWith("/flags/samara.svg"));

const aliasImage = await loadFlag("samara", { alt: "Alias Samara" });
assert.ok(aliasImage instanceof ImageCtor);
assert.equal(aliasImage.alt, "Alias Samara");

await assert.rejects(
  () => loadFlagModule("unknown"),
  /Unknown Samara Oblast settlement: unknown/
);
await assert.rejects(
  () => loadFlagImage("unknown"),
  /Unknown Samara Oblast settlement: unknown/
);
