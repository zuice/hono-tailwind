import path from "node:path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { writeFile } from "node:fs/promises";

import { Config } from "./types/config.js";

const TAILWIND_INPUT = `
@import "tailwindcss";
`;

export async function buildCss(config?: Config) {
  let cachedCss: string | null = null;

  console.log("Building CSS");

  const base = config?.base
    ? path.resolve(config.base)
    : path.join(process.cwd(), "src");
  const result = await postcss([
    tailwindcss({ base, optimize: { minify: false } }),
  ]).process(TAILWIND_INPUT, {
    from: "virtual-css.css",
  });
  cachedCss = result.css;

  if (config?.out) {
    const outPath = path.join(process.cwd(), config.out);
    await writeFile(outPath, cachedCss, "utf8");
    console.info("CSS written to:", outPath);
  }

  return cachedCss;
}
