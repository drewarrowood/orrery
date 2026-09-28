#!/usr/bin/env node
/**
 * Copy Vite dist/ → docs/ for GitHub Pages (branch main, folder /docs).
 * Same zero-server model as live-and-let-live.
 */
import {
  cpSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
  existsSync,
  readFileSync,
} from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const docs = join(root, "docs");

if (!existsSync(dist)) {
  console.error("dist/ missing — run npm run build first");
  process.exit(1);
}

rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });
cpSync(dist, docs, { recursive: true });
// Disable Jekyll so _assets and media paths are served as-is
writeFileSync(join(docs, ".nojekyll"), "");

// Pages workflow uploads the repo root. Mirror the built shell and bundles
// there too, without deleting media already under assets/.
const distIndex = readFileSync(join(dist, "index.html"));
writeFileSync(join(root, "index.html"), distIndex);
const rootAssets = join(root, "assets");
mkdirSync(rootAssets, { recursive: true });
for (const name of readdirSync(rootAssets)) {
  if (/\.(?:js|css|map)$/.test(name)) unlinkSync(join(rootAssets, name));
}
cpSync(join(dist, "assets"), rootAssets, { recursive: true });
console.log("Published static site → docs/ and repo root");
