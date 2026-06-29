import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = resolve(root, "dist");

if (!dist.startsWith(root)) {
  throw new Error(`Refusing to remove path outside project: ${dist}`);
}

await rm(dist, { force: true, recursive: true });
