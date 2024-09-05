import fs from "node:fs/promises";
import autoprefixer from "autoprefixer";
import postcss from "postcss";
import tailwindcss from "tailwindcss";

import type { Options } from "@/types";
import { ensureDirectoryExists } from "@/utils/ensure-directory-exists";

export async function processCss({
	input,
	configPath,
	outputPath,
}: Options): Promise<string> {
	// in theory this should not throw because we pass the deafult in anyways
	if (!input) throw new Error("No input path for your CSS provided.");

	const css = await fs.readFile(input, "utf8");
	const plugins = [
		tailwindcss(configPath ? { config: configPath } : ""),
		autoprefixer,
	];

	const result = await postcss(plugins).process(css, {
		from: input,
		to: outputPath,
	});

	if (!outputPath) throw new Error("No output path for your CSS provided.");

	await ensureDirectoryExists(outputPath);
	await fs.writeFile(outputPath, result.css);

	return outputPath;
}
