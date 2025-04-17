import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
  },
});
