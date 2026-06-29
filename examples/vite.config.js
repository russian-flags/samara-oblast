import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { cp } from "node:fs/promises";
import { defineConfig } from "vite";

const exampleRoot = fileURLToPath(new URL(".", import.meta.url));
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  root: repoRoot,
  plugins: [
    {
      name: "copy-local-flag-assets",
      async closeBundle() {
        await cp(join(repoRoot, "assets"), join(exampleRoot, "dist", "assets"), {
          force: true,
          recursive: true,
        });
      },
    },
  ],
  build: {
    emptyOutDir: true,
    outDir: join(exampleRoot, "dist"),
    rollupOptions: {
      input: join(exampleRoot, "index.html"),
    },
  },
  optimizeDeps: {
    exclude: ["@russian-flags/samara-oblast"],
  },
});
