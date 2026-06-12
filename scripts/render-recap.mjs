#!/usr/bin/env node
/**
 * Render an anniversary recap from a saved props JSON.
 *
 * Usage:
 *   node scripts/render-recap.mjs ./public/recaps/<jobId>/props.json
 *   node scripts/render-recap.mjs ./public/recaps/<jobId>/props.json --vertical
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const propsPath = process.argv[2];
const vertical = process.argv.includes("--vertical");

if (!propsPath) {
  console.error("Usage: node scripts/render-recap.mjs <props.json> [--vertical]");
  process.exit(1);
}

const outDir = path.dirname(path.resolve(propsPath));
const suffix = vertical ? "vertical" : "widescreen";
const output = path.join(outDir, `recap-${suffix}.mp4`);
const composition = vertical ? "AnniversaryRecapVertical" : "AnniversaryRecap";

const args = [
  "remotion",
  "render",
  path.join("remotion", "index.ts"),
  composition,
  output,
  `--props=${path.resolve(propsPath)}`,
];

const child = spawn("npx", args, { cwd: root, stdio: "inherit", shell: true });
child.on("close", (code) => process.exit(code ?? 0));
