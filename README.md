# hono-tailwind

TailwindCSS middleware for Hono.

## Usage

### Quick Start

```bash
npm i -S hono-tailwind tailwindcss
```

```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { tailwind } from "hono-tailwind";

const app = new Hono();

app.use("/tailwind.css", tailwind());
app.get("/", (c) =>
  c.html(`
    <!doctype html>
    <html>
      <head>
        <link rel="stylesheet" href="/tailwind.css">
      </head>
      <body class="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-4xl font-bold text-blue-600">Hello Tailwind + Hono!</h1>
      </body>
    </html>
  `),
);

serve({ fetch: app.fetch, port: 3000 });
```

### Custom CSS

```css
/* src/tailwind.css */
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
}
```

```ts
app.use("/tailwind.css", tailwind({
  in: "src/tailwind.css",
}));
```

### Production Build

```ts
app.use("/tailwind.css", tailwind({
  in: "src/tailwind.css",
  out: "dist/tailwind.css",
  minify: true,
  cacheControl: "public, max-age=86400",
}));
```

## API

### `tailwind(options?)`

Hono middleware that serves Tailwind CSS.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `in` | `string` | `undefined` | Path to input CSS file (relative to cwd) |
| `out` | `string` | `undefined` | Path to write output CSS file (production mode) |
| `minify` | `boolean` | `true` if `out` set, `false` otherwise | Minify output CSS |
| `cacheControl` | `string` | `"public, max-age=3600"` (prod) / `"no-store"` (dev) | Cache-Control header |

### `buildCss(options?)`

Build CSS and return as string. Useful for inline styles or custom processing.

```ts
import { buildCss } from "hono-tailwind";

const css = await buildCss({ in: "src/tailwind.css" });
```

## Features

- **ETag support** - Returns 304 Not Modified for unchanged CSS
- **Request coalescing** - Multiple simultaneous requests share a single build
- **Dev mode** - Rebuilds on every request for fast feedback
- **Production mode** - Serves from disk when `out` is set, with in-memory fallback
- **HEAD requests** - Properly handles HEAD method
