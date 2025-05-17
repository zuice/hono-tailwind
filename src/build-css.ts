import path from "node:path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { writeFile } from "node:fs/promises";

import { Config } from "./types/config.js";

const TAILWIND_INPUT = `
@import "tailwindcss";
`;

export async function buildCss(config?: Config) {
  const base = config?.base
    ? path.resolve(config.base)
    : path.join(process.cwd(), "src");
  const result = await postcss([
    tailwindcss({ base, optimize: { minify: false } }),
  ]).process(TAILWIND_INPUT, {
    from: "virtual-css.css",
  });
  const css = result.css;

  if (config?.out) {
    const outPath = path.join(process.cwd(), config.out);
    await writeFile(outPath, css, "utf8");
  }

  return css;
}
