import type { MiddlewareHandler } from "hono";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import path from "node:path";
import { writeFile } from "node:fs/promises";

const TAILWIND_INPUT = `
@import "tailwindcss";
`;

let cachedCss: string | null = null;

interface HonoTailwindConfig {
  out?: string;
}

export function tailwind(config?: HonoTailwindConfig): MiddlewareHandler {
  if (config?.out) {
    console.info(
      "Attempting to write CSS file to:",
      path.join(process.cwd(), config?.out),
    );
  }

  return async (c, next) => {
    if (c.req.method === "GET" && c.req.path === "/tailwind.css") {
      if (!cachedCss) {
        const base = `${process.cwd()}/src/index.ts`;
        const result = await postcss([
          tailwindcss({ base, optimize: { minify: false } }),
        ]).process(TAILWIND_INPUT, {
          // this needs to be something random for the entire thign to work :)
          from: "fake-css-file.css",
          to: config?.out ?? undefined,
        });
        cachedCss = result.css;

        // Write to file if config.out is set
        if (config?.out) {
          const outPath = path.join(process.cwd(), config.out);
          await writeFile(outPath, cachedCss, "utf8");
          console.info("CSS written to:", outPath);
        }
      }

      return c.text(cachedCss, 200, {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      });
    }
    await next();
  };
}
