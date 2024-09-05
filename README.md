# hono-tailwind 🔥 (WIP)

This project is a [TailwindCSS](https://tailwindcss.com/) middleware for [Hono](https://github.com/honojs/hono).

### Usage (Subject to change)

1. Install the package

```bash
bun add hono-tailwind
```

2. Add the middleware to your Hono app

It requires no config, so you can just throw it in to hack around and it will work.
```ts
import { hono } from "hono";
import { tailwind } from "hono-tailwind";
import { serveStatic } from "hono/bun";

const app = hono();

app.use(tailwind());
app.get("/", (c) => c.html(html`<h1 class="text-red-500 font-bold">Hello World</h1>`));
app.get("./dist/output.css", serveStatic({ root: "./" }));
```

Here's what the middleware will look like fully configured:
```ts
import { hono } from "hono";
import { tailwind } from "hono-tailwind";

const app = hono();

app.use(tailwind({
  input: "./src/static/main.css",
  configPath: "./tailwind.config.js",
  outputPath: "./dist/output.css",
}, app));
```

Finally, if you'd like to not pass your app into the middleware, you can just serve it yourself. Just remember to pass in the path to your CSS OUTPUT file.
```ts
import { hono } from "hono";
import { tailwind } from "hono-tailwind";

const app = hono();

app.use(tailwind({
  input: "./src/static/main.css",
  configPath: "./tailwind.config.js",
  outputPath: "./dist/output.css",
}));
// however you want to do it
app.get("/dist/output.css", serveStatic({ root: "./" }));
```

### Goals

- [x] Be able to use TailwindCSS in Hono just by adding this as a middleware.
- [x] In development, use in-memory CSS and append it into the Head of your HTML.
- [x] Build CSS into a single file that then gets imported automagically in production environments.
- [x] All in all let the user be completely hands-off with the whole TailwindCSS build process.
- [x] Potentially be able to get started with 0 config (just add the middleware and boom tailwind is in).
- [ ] Be able to take in a path to an HTML file and use that as the users' base HTML.
- [ ] Take in a path to your TailwindCSS entrypoint css file.
- [ ] Support more than just Bun. The serve static middleware is specific to Bun currently.
- [ ] Support more renderers than just the default one. For example, if you are using React renderer (third-party middleware), I don't think this will work - requires testing.
- [ ] Support a PostCSS config file.

### Motivation

I really love working with Hono, but installing TailwindCSS is a pain. I also do not want to run a separate process alongside my server, as that is tedious. In my future projects with Hono, I want to be able to add this middleware and just get started designing with TailwindCSS.
