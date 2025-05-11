# hono-tailwind 🔥 (WIP)

This project is a [TailwindCSS](https://tailwindcss.com/) middleware for [Hono](https://github.com/honojs/hono). This is just a way of doing it without Vite, and it will just compile your TailwindCSS on every request.

For now this is really only recommended in development until I make a way to save the file to your system.

### Usage (Subject to change)

1. Install the package

```bash
npm i -S hono-tailwind
```

2. Add the middleware to your Hono app

```ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { tailwind } from "hono-tailwind-2";

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
        <div>
          <h1 class="text-4xl font-bold text-blue-600">Hello Tailwind + Hono!</h1>
          <p class="mt-4 text-lg text-gray-700">If this is styled, it works 🎉</p>
        </div>
      </body>
    </html>
  `),
);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
```

### To Do

[ ] Set up a way for the user to configure their own tailwind
[ ] Set up a way to export the generated tailwind css file
