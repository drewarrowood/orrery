/**
 * Checkable orbital relations used by the teach layer.
 * Run: node --experimental-strip-types --no-warnings scripts/check-kepler.ts
 * (path aliases are inlined here so the script does not need the Vite bundler)
 */
import { BODIES, YEAR_SECONDS, getBody, type CelestialBody } from "../src/lib/planets.ts";

function keplerRatio(periodYears: number, semiMajorAu: number): number {
  return (periodYears * periodYears) / (semiMajorAu ** 3);
}

function drawnKeplerRatio(body: CelestialBody): number {
  const earth = getBody("earth")!;
  const drawnAu = body.orbitRadius / earth.orbitRadius;
  return (body.periodYears ** 2) / drawnAu ** 3;
}

function synodicYears(a: number, b: number): number {
  return 1 / Math.abs(1 / a - 1 / b);
}

function heliocentric(body: CelestialBody, simSeconds: number) {
  if (body.orbitRadius <= 0 || body.periodYears <= 0) return { x: 0, z: 0 };
  const angle = (simSeconds / (body.periodYears * YEAR_SECONDS)) * Math.PI * 2;
  return {
    x: Math.cos(angle) * body.orbitRadius,
    z: Math.sin(angle) * body.orbitRadius,
  };
}

function relativeLongitude(target: CelestialBody, center: CelestialBody, t: number) {
  const p = heliocentric(target, t);
  const c = heliocentric(center, t);
  return Math.atan2(p.z - c.z, p.x - c.x);
}

function wrapPi(d: number) {
  let x = d;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

function ratePerYear(target: CelestialBody, center: CelestialBody, t: number) {
  const dt = 0.04;
  return (wrapPi(relativeLongitude(target, center, t + dt) - relativeLongitude(target, center, t)) / dt) * YEAR_SECONDS;
}

const failures: string[] = [];
function expect(cond: boolean, message: string) {
  if (!cond) failures.push(message);
}

const earth = getBody("earth")!;
const mars = getBody("mars")!;
const neptune = getBody("neptune")!;
const sun = getBody("sun")!;

for (const body of BODIES) {
  if (body.kind !== "planet") continue;
  const ratio = keplerRatio(body.periodYears, body.semiMajorAu);
  expect(
    Math.abs(ratio - 1) < 0.01,
    `${body.id} P²/a³ = ${ratio} (expected within 1% of 1)`,
  );
  const predicted = body.semiMajorAu ** 1.5;
  expect(
    Math.abs(predicted - body.periodYears) / body.periodYears < 0.01,
    `${body.id} a^(3/2) = ${predicted} vs P = ${body.periodYears}`,
  );
}

const drawnNep = drawnKeplerRatio(neptune);
expect(drawnNep > 50, `Neptune drawn P²/a³ should show the squeeze, got ${drawnNep}`);

const syn = synodicYears(earth.periodYears, mars.periodYears);
expect(syn > 2.1 && syn < 2.2, `Earth–Mars synodic period ${syn}`);

const dist0 = Math.hypot(
  heliocentric(earth, 0).x - heliocentric(sun, 0).x,
  heliocentric(earth, 0).z - heliocentric(sun, 0).z,
);
const dist1 = Math.hypot(
  heliocentric(earth, 40).x - heliocentric(sun, 40).x,
  heliocentric(earth, 40).z - heliocentric(sun, 40).z,
);
expect(Math.abs(dist0 - earth.orbitRadius) < 1e-9, "Sun–Earth distance is the drawn radius");
expect(Math.abs(dist0 - dist1) < 1e-6, "Circular model keeps Sun–Earth distance constant");

// At opposition (same mean longitude) an outer planet is retrograde if the
// inner body's tangential speed is greater. Sample a grid and require Mars,
// as seen from Earth, to be retrograde somewhere and prograde somewhere.
let sawRetro = false;
let sawPro = false;
for (let i = 0; i < 400; i++) {
  const t = i * 0.2;
  const rate = ratePerYear(mars, earth, t);
  if (rate < -0.05) sawRetro = true;
  if (rate > 0.05) sawPro = true;
}
expect(sawRetro, "Mars as seen from Earth is retrograde during part of the synodic cycle");
expect(sawPro, "Mars as seen from Earth is prograde during part of the synodic cycle");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("kepler checks ok");
console.log(
  BODIES.filter((b) => b.kind === "planet")
    .map((b) => `${b.id} real ${keplerRatio(b.periodYears, b.semiMajorAu).toFixed(4)} drawn ${drawnKeplerRatio(b).toFixed(1)}`)
    .join("\n"),
);
console.log(`earth-mars synodic ${syn.toFixed(3)} yr`);
