import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.resolve(rootDir, "artifacts/abh-studio/dist/public");
const destDir = path.resolve(rootDir, "dist");

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log(`Successfully synced build bundle from ${srcDir} to ${destDir}`);
} else {
  console.warn(`Source build directory does not exist: ${srcDir}`);
}
