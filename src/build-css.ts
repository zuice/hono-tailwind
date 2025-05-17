import path from "node:path";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import { readFile, writeFile } from "node:fs/promises";

import { Config } from "./types/config.js";

const TAILWIND_INPUT = `
@import "tailwindcss";
`;

export async function buildCss(config?: Config) {
  let inputCss = "";

  if (config?.in) {
    inputCss = await readFile(
      path.join(process.cwd(), config.in),
      "utf8",
    );
  } else {
    inputCss = TAILWIND_INPUT;
  }

  const result = await postcss([
    tailwindcss({ optimize: { minify: false } }),
  ]).process(inputCss, {
    from: "virtual-css.css",
  });

  const css = result.css;

  if (config?.out) {
    const outPath = path.join(process.cwd(), config.out);
    await writeFile(outPath, css, "utf8");
  }

  return css;
}
