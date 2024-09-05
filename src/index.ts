import path from "node:path";
import type { Context, Hono, Next } from "hono";
import { serveStatic } from "hono/bun";
import { html } from "hono/html";

import type { Options } from "@/types";
import { processCss } from "@/process-css";

const defaultOptions: Options = {
	input: path.join(__dirname, "templates", "main.css"),
	configPath: path.join(__dirname, "templates", "tailwind.config.js"),
	outputPath: path.join("./dist", "output.css"),
};

export function tailwind(options?: Options, app?: Hono) {
	// TODO: Change these for user-configurable paths
	const output = processCss(options ?? defaultOptions);

	if (app) {
		// Serve the CSS file we built
		const currentOptions = options ?? defaultOptions;

		if (currentOptions.outputPath) {
			app.get(currentOptions.outputPath, serveStatic({ root: "./" }));
		}
	}

	return async (c: Context, next: Next) => {
		const style = html`<link rel="stylesheet" href="${await output}" />`;

		// Only do this if the user has not set their base HTML
		c.setRenderer((children) =>
			c.html(html`
       <html>
         <head>
           ${style}
         </head>
         <body>
          ${children}
         </body>
       </html>
      `),
		);

		return await next();
	};
}
