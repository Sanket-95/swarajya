import { defineConfig } from "vite";

// Keep the dev server light for the baseline machine (SETUP_PROMPT.md §5):
// no heavy plugins, no warmup, cheap source maps.
export default defineConfig({
  publicDir: "../../public",
  server: {
    port: 5173,
    open: true,
  },
  css: { devSourcemap: false },
  build: {
    target: "es2022",
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1024,
  },
});
