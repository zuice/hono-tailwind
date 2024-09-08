# hono-tailwind 🔥 (WIP)

This project is a [TailwindCSS](https://tailwindcss.com/) middleware for [Hono](https://github.com/honojs/hono). This is just a way of doing it without Vite, so for now mostly SSR projects will benefit from this.

### Usage (Subject to change)

1. Install the package

```bash
bun add hono-tailwind
```

2. Add the middleware to your Hono app

```ts
import { Hono } from "hono";
import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";
import { serveStatic } from "hono/bun";
import { tailwind } from "hono-tailwind";

const app = new Hono();

app.use(tailwind());
app.use(
	jsxRenderer(
		({ children }, c) => html`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hono + Tailwind</title>
        <link rel="stylesheet" href={c.get("tailwind")} />
      </head>
      <body>
        ${children}
      </html>
    `,
	),
);
app.get("/", (c) => {
    return c.render(
        <>
            <p class="text-red-500">Hello, World!</p>
            <p class="text-green-500">Another</p>
        </>,
    );
});
app.get("/dist/output.css", serveStatic({ root: "./" }));
```

### Motivation

I really love working with Hono, but installing TailwindCSS is a pain. I also do not want to run a separate process alongside my server, as that is tedious. In my future projects with Hono, I want to be able to add this middleware and just get started designing with TailwindCSS.
