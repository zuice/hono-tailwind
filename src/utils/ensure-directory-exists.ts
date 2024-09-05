import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDirectoryExists(filePath: string): Promise<void> {
	const directory = path.dirname(filePath);

	await fs.mkdir(directory, { recursive: true });
}
