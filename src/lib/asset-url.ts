/**
 * Resolve static media paths relative to the deployed site root.
 * Works on GitHub Pages (/orrery/), local preview, and file:// when base is './'.
 */
export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL || "./";
  // Ensure single slash join even when base is './' or '/orrery/'
  if (base.endsWith("/")) return `${base}${clean}`;
  return `${base}/${clean}`;
}
