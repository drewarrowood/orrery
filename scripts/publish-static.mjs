#!/usr/bin/env node
/**
 * Copy Vite dist/ → docs/ for GitHub Pages (branch main, folder /docs).
 * Same zero-server model as live-and-let-live.
 */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
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
console.log("Published static site → docs/ (GitHub Pages: main / docs)");
