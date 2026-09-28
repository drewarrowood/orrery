import { BODIES, YEAR_SECONDS, type CelestialBody, getBody } from "@/lib/planets";

/** Kepler's third law in years and AU: P² / a³. Exactly 1 for a massless planet at 1 AU. */
export function keplerRatio(periodYears: number, semiMajorAu: number): number | null {
  if (periodYears <= 0 || semiMajorAu <= 0) return null;
  return (periodYears * periodYears) / (semiMajorAu * semiMajorAu * semiMajorAu);
}

/**
 * Same ratio using the drawn radius, scaled so Earth is 1.
 * This is NOT 1 — the picture compresses distance. Shown so the squeeze is measurable.
 */
export function drawnKeplerRatio(body: CelestialBody): number | null {
  const earth = getBody("earth");
  if (!earth || body.periodYears <= 0 || body.orbitRadius <= 0 || earth.orbitRadius <= 0) {
    return null;
  }
  const drawnAu = body.orbitRadius / earth.orbitRadius;
  return (body.periodYears * body.periodYears) / (drawnAu * drawnAu * drawnAu);
}

/** Circular-orbit speed relative to Earth from v ∝ 1/√a (real AU, not the drawing). */
export function speedRelativeToEarth(semiMajorAu: number): number | null {
  if (semiMajorAu <= 0) return null;
  return 1 / Math.sqrt(semiMajorAu);
}

/** Period the third law predicts for a massless planet, in years: a^(3/2). */
export function periodFromSemiMajor(semiMajorAu: number): number | null {
  if (semiMajorAu <= 0) return null;
  return Math.pow(semiMajorAu, 1.5);
}

/** Synodic period in years: 1 / |1/P₁ − 1/P₂|. Independent of radius. */
export function synodicYears(periodA: number, periodB: number): number | null {
  if (periodA <= 0 || periodB <= 0) return null;
  const inv = Math.abs(1 / periodA - 1 / periodB);
  if (inv < 1e-12) return null;
  return 1 / inv;
}

export interface PlanarPoint {
  x: number;
  z: number;
  /** Mean longitude in radians, matching the scene: x = cos θ, z = sin θ. */
  angle: number;
}

/** Heliocentric position in scene units. Same formula as BodyMesh. */
export function heliocentricPosition(body: CelestialBody, simSeconds: number): PlanarPoint {
  if (body.orbitRadius <= 0 || body.periodYears <= 0) {
    return { x: 0, z: 0, angle: 0 };
  }
  const angle = (simSeconds / (body.periodYears * YEAR_SECONDS)) * Math.PI * 2;
  return {
    x: Math.cos(angle) * body.orbitRadius,
    z: Math.sin(angle) * body.orbitRadius,
    angle,
  };
}

function wrapPi(d: number): number {
  let x = d;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

/**
 * Ecliptic longitude of `target` as seen from `center`, in radians.
 * Uses the drawn radii so the sign matches the loops on screen.
 * The periods are the real ones, so who laps whom is not a fiction.
 */
export function relativeLongitude(
  target: CelestialBody,
  center: CelestialBody,
  simSeconds: number,
): number {
  const t = heliocentricPosition(target, simSeconds);
  const c = heliocentricPosition(center, simSeconds);
  return Math.atan2(t.z - c.z, t.x - c.x);
}

/**
 * dλ/dt of that longitude, in radians per year.
 * Negative means retrograde (longitude decreasing).
 */
export function relativeLongitudeRatePerYear(
  target: CelestialBody,
  center: CelestialBody,
  simSeconds: number,
): number {
  const dt = 0.04;
  const a0 = relativeLongitude(target, center, simSeconds);
  const a1 = relativeLongitude(target, center, simSeconds + dt);
  const perSecond = wrapPi(a1 - a0) / dt;
  return perSecond * YEAR_SECONDS;
}

export type SkySense = "prograde" | "retrograde" | "turning";

export function skySense(ratePerYear: number): SkySense {
  const deg = ratePerYear * (180 / Math.PI);
  if (deg < -1) return "retrograde";
  if (deg > 1) return "prograde";
  return "turning";
}

export function sceneDistance(
  a: CelestialBody,
  b: CelestialBody,
  simSeconds: number,
): number {
  const pa = heliocentricPosition(a, simSeconds);
  const pb = heliocentricPosition(b, simSeconds);
  return Math.hypot(pa.x - pb.x, pa.z - pb.z);
}

export function orbitsCompleted(body: CelestialBody, simSeconds: number): number {
  if (body.periodYears <= 0) return 0;
  return simSeconds / YEAR_SECONDS / body.periodYears;
}

export function formatYears(years: number): string {
  const abs = Math.abs(years);
  if (abs >= 100) return years.toFixed(0);
  if (abs >= 10) return years.toFixed(1);
  if (abs >= 1) return years.toFixed(2);
  return years.toFixed(3);
}

export function formatRatio(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 100) return value.toFixed(0);
  if (Math.abs(value) >= 10) return value.toFixed(1);
  return value.toFixed(3);
}

export function formatDegPerYear(radPerYear: number): string {
  const deg = radPerYear * (180 / Math.PI);
  const sign = deg > 0 ? "+" : "";
  return `${sign}${deg.toFixed(0)}°/yr`;
}

export const PLANET_BODIES: CelestialBody[] = BODIES.filter((b) => b.kind === "planet");
