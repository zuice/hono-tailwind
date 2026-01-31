import type { MiddlewareHandler } from "hono";
import path from "node:path";
import fs from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";

export interface TailwindOptions {
  /**
   * Path to the input CSS file.
   * If not provided, a default Tailwind CSS input will be used.
   * @default undefined
   */
  in?: string;
  /**
   * Path to the output CSS file.
   * If provided, the generated CSS will be written to this file.
   * In production, the middleware will attempt to serve this file from disk.
   * @default undefined
   */
  out?: string;
  /**
   * Whether to minify the output CSS.
   * Defaults to true if 'out' is provided (production), false otherwise.
   */
  minify?: boolean;
  /**
   * Custom Cache-Control header for production.
   * @default "public, max-age=3600"
   */
  cacheControl?: string;
}

/** @deprecated Use TailwindOptions instead */
export type Config = TailwindOptions;

const DEFAULT_INPUT = '@import "tailwindcss";';

/**
 * Builds the Tailwind CSS.
 */
export async function buildCss(options?: TailwindOptions): Promise<string> {
  const inputPath = options?.in ? path.resolve(process.cwd(), options.in) : "virtual.css";
  const inputCss = options?.in ? await readFile(inputPath, "utf-8") : DEFAULT_INPUT;

  const shouldMinify = options?.minify ?? !!options?.out;

  const result = await postcss([
    tailwindcss({ optimize: { minify: shouldMinify } }),
  ]).process(inputCss, { from: inputPath });

  if (options?.out) {
    const outputPath = path.resolve(process.cwd(), options.out);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, result.css, "utf-8");
  }

  return result.css;
}

/**
 * Hono middleware for Tailwind CSS.
 */
export function tailwind(options?: TailwindOptions): MiddlewareHandler {
  const isProd = !!options?.out;
  const cacheControl = options?.cacheControl ?? (isProd ? "public, max-age=3600" : "no-store");
  
  // Memory cache for production fallback and request coalescing
  let cachedPromise: Promise<{ css: string; etag: string }> | null = null;

  const getCssWithEtag = async () => {
    const css = await buildCss(options);
    const etag = `"${createHash("sha1").update(css).digest("hex")}"`;
    return { css, etag };
  };

  return async (c, next) => {
    const method = c.req.method;
    if (method !== "GET" && method !== "HEAD") return await next();

    let css: string;
    let etag: string;

    // 1. Production: Try serving from static file first
    if (isProd && options?.out) {
      const outPath = path.resolve(process.cwd(), options.out);
      if (fs.existsSync(outPath)) {
        css = await readFile(outPath, "utf-8");
        etag = `"${createHash("sha1").update(css).digest("hex")}"`;
      } else {
        // Fallback to memory cache if file doesn't exist yet
        if (!cachedPromise) {
          cachedPromise = getCssWithEtag();
        }
        ({ css, etag } = await cachedPromise);
      }
    } else {
      // 2. Development or Dynamic: Use request coalescing
      // In dev, we reset the promise on every request if it's not currently building
      // but if multiple requests come in at once, they share the same build.
      if (!cachedPromise) {
        cachedPromise = getCssWithEtag();
        // Reset after completion in dev so next request triggers a new build
        if (!isProd) {
          cachedPromise.finally(() => {
            cachedPromise = null;
          });
        }
      }
      ({ css, etag } = await cachedPromise);
    }

    // 3. ETag / 304 Handling
    if (c.req.header("If-None-Match") === etag) {
      return c.body(null, 304);
    }

    c.header("Content-Type", "text/css; charset=utf-8");
    c.header("Cache-Control", cacheControl);
    c.header("ETag", etag);

    if (method === "HEAD") {
      return c.body(null, 200);
    }

    return c.body(css);
  };
}
