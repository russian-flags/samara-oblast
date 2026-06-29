import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = resolve(root, "src");
const distDir = resolve(root, "dist");
const assetsDir = resolve(root, "assets");
const publicAssetFileName = "index.svg";

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(dir, entry.name);
      return entry.isDirectory() ? listFiles(path) : path;
    })
  );
  return files.flat();
}

const entries = (await listFiles(srcDir)).filter((file) => extname(file) === ".ts" && !file.endsWith(".d.ts"));

function sourceAssetForSlug(slug) {
  const candidate = resolve(assetsDir, slug, publicAssetFileName);
  return existsSync(candidate) ? candidate : undefined;
}

async function copyFlags() {
  const entries = await readdir(assetsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const source = sourceAssetForSlug(entry.name);
    if (!source) {
      continue;
    }

    const target = resolve(distDir, "flags", `${entry.name}.svg`);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target, { force: true });
  }
}

await build({
  entryPoints: entries,
  outdir: distDir,
  outbase: srcDir,
  bundle: false,
  format: "esm",
  platform: "neutral",
  target: "es2020",
  sourcemap: false,
  logLevel: "info",
});

await copyFlags();

await writeFile(resolve(distDir, "svg.d.ts"), "declare const src: string;\nexport default src;\n", "utf8");
