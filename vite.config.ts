import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * GitHub Pages serves the built index.html (hashed assets, no TSX entry).
 * Rewrite that shell back to src/main.tsx before Vite collects modules,
 * so `npm run dev` and `npm run build` keep working after a static publish.
 */
function orreryHtmlEntry(): Plugin {
  return {
    name: "orrery-html-entry",
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        if (html.includes("/src/main.tsx")) return html;
        const stripped = html
          .replace(/<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>\s*<\/script>/gi, "")
          .replace(/<link\b[^>]*\brel=["']stylesheet["'][^>]*>/gi, "")
          .replace(
            /href=(["'])(?:\.\/)?(?:assets\/)?favicon[^"']*\1/,
            "href=$1./favicon.svg$1",
          );
        return stripped.replace(
          "</body>",
          '    <script type="module" src="/src/main.tsx"></script>\n  </body>',
        );
      },
    },
  };
}

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/**
 * Pure static SPA — no SSR, no Nitro, no server.
 * Builds to dist/ for GitHub Pages (like live-and-let-live).
 *
 * base './' so media works under https://user.github.io/orrery/ and local preview.
 */
export default defineConfig({
  base: "./",
  plugins: [orreryHtmlEntry(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1200,
  },
  publicDir: "public",
});
