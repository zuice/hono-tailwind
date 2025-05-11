import type { MiddlewareHandler } from "hono";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

const TAILWIND_INPUT = `
@import "tailwindcss";
`;

let cachedCss: string | null = null;

export function tailwind(): MiddlewareHandler {
  return async (c, next) => {
    if (c.req.method === "GET" && c.req.path === "/tailwind.css") {
      if (!cachedCss) {
        const base = `${process.cwd()}/src/index.ts`;
        const result = await postcss([
          tailwindcss({ base, optimize: { minify: false } }),
        ]).process(TAILWIND_INPUT, {
          // this needs to be something random for the entire thign to work :)
          from: "fake-css-file.css",
        });
        cachedCss = result.css;
      }
      return c.text(cachedCss, 200, {
        "Content-Type": "text/css; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      });
    }
    await next();
  };
}
