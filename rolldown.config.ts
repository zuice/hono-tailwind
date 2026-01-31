import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
    entryFileNames: "[name].js",
  },
  external: [
    "hono",
    "postcss",
    "@tailwindcss/postcss",
    "node:fs",
    "node:fs/promises",
    "node:path",
    "node:crypto",
  ],
});
