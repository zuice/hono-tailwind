import { build } from "bun";
import fs from "fs";
import path from "path";

const srcDir = "src";
const distDir = "dist";

async function runBuild() {
	// Ensure the dist directory exists
	if (!fs.existsSync(distDir)) {
		fs.mkdirSync(distDir);
	}

	// Build the project
	const result = await build({
		entrypoints: ["./src/index.ts"],
		outdir: "./dist",
		minify: true,
		target: "node",
		format: "esm",
	});

	if (!result.success) {
		console.error("Build failed:", result.logs);
		return;
	}

	console.log("Build completed successfully!");

	// Generate declaration files
	const { stdout, stderr } = await Bun.spawn([
		"bun",
		"tsc",
		"--emitDeclarationOnly",
	]);
	console.log(await new Response(stdout).text());
	console.error(await new Response(stderr).text());
}

runBuild().catch(console.error);
