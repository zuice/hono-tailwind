import path from "node:path"
import { type Context, type Next } from "hono"

import { processCss } from "@/process-css"
import type { Options } from "@/types"

const defaultOptions: Options = {
  input: path.join(import.meta.dir, "templates", "main.css"),
  configPath: path.join(import.meta.dir, "templates", "tailwind.config.js"),
  outputPath: path.join("dist", "output.css"),
}

export function tailwind(options?: Options) {
  // TODO: Change these for user-configurable paths
  const output = processCss({ ...defaultOptions, ...options })

  return async (c: Context, next: Next) => {
    const style = await output

    c.set("tailwind", style)

    return await next()
  }
}
