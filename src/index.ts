import path from "node:path";
import type { Context, Next } from "hono";
import { html } from "hono/html";

import { processCss } from "@/process-css";
import type { Options } from "@/types";

const defaultOptions: Options = {
	input: path.join(__dirname, "templates", "main.css"),
	configPath: path.join(__dirname, "templates", "tailwind.config.js"),
	outputPath: path.join("./dist", "output.css"),
};

export function tailwind(options?: Options) {
	// TODO: Change these for user-configurable paths
	const output = processCss({ ...defaultOptions, ...options });

	return async (c: Context, next: Next) => {
		const style = html`<link rel="stylesheet" href="${await output}" />`;

		c.set("tailwind", style);

		return await next();
	};
}
