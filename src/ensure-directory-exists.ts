import path from "node:path";
import fs from "node:fs/promises";

export async function ensureDirectoryExists(filePath: string): Promise<void> {
  const dirname = path.dirname(filePath);

  try {
    await fs.mkdir(dirname, { recursive: true });
  } catch (error) {
    throw error;
  }
}
