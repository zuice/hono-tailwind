import type { MiddlewareHandler } from "hono";
import path from "node:path";
import { readFile } from "node:fs/promises";
import fs from "node:fs";

import { Config } from "./types/config.js";
import { buildCss } from "./build-css.js";
import { buildHeaders } from "./build-headers.js";

export function tailwind(config?: Config): MiddlewareHandler {
  const cachedCss = buildCss(config);
  const isProduction = !!config?.out;

  return async (c, next) => {
    if (c.req.method === "GET") {
      if (isProduction) {
        const outPath = path.join(process.cwd(), config?.out || "");
        if (fs.existsSync(outPath)) {
          const css = await readFile(outPath, "utf8");

          return c.text(css, 200, buildHeaders(isProduction));
        }
      }

      return c.text(await cachedCss!, 200, buildHeaders(isProduction));
    }
    await next();
  };
}
