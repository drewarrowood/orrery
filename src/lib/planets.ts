/** Stylized solar system data — distances/sizes tuned for visual clarity. */

export type BodyKind = "star" | "planet" | "dwarf";

export interface CelestialBody {
  id: string;
  name: string;
  kind: BodyKind;
  /** Visual radius in scene units */
  radius: number;
  /** Orbital radius from parent (0 for sun) */
  orbitRadius: number;
  /** Orbital period in Earth-years (visual base unit) */
  periodYears: number;
  /** Axial tilt in degrees (visual only) */
  axialTilt: number;
  /** Self-rotation period relative to Earth day (smaller = faster spin) */
  spinDays: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  /** Optional ring system */
  rings?: {
    inner: number;
    outer: number;
    color: string;
    opacity: number;
  };
  /** Real-world facts for the info panel */
  facts: {
    type: string;
    diameterKm: string;
    distanceAu: string;
    orbitalPeriod: string;
    dayLength: string;
    moons: string;
    temperature: string;
    summary: string;
  };
}

export const BODIES: CelestialBody[] = [
  {
    id: "sun",
    name: "Sun",
    kind: "star",
    radius: 2.8,
    orbitRadius: 0,
    periodYears: 0,
    axialTilt: 7.25,
    spinDays: 25,
    color: "#ffb84d",
    emissive: "#ff9a1f",
    emissiveIntensity: 1.4,
    facts: {
      type: "G-type main-sequence star",
      diameterKm: "1,392,700 km",
      distanceAu: "—",
      orbitalPeriod: "—",
      dayLength: "~25 days (equator)",
      moons: "—",
      temperature: "5,500 °C (surface)",
      summary:
        "The star at the center of our solar system. Its gravity holds the planets in orbit and its light powers life on Earth.",
    },
  },
  {
    id: "mercury",
    name: "Mercury",
    kind: "planet",
    radius: 0.28,
    orbitRadius: 7.5,
    periodYears: 0.24,
    axialTilt: 0.03,
    spinDays: 58.6,
    color: "#9a9aa3",
    facts: {
      type: "Terrestrial planet",
      diameterKm: "4,879 km",
      distanceAu: "0.39 AU",
      orbitalPeriod: "88 Earth days",
      dayLength: "176 Earth days",
      moons: "0",
      temperature: "−180 to 430 °C",
      summary:
        "The smallest planet and closest to the Sun. Extreme temperature swings and a heavily cratered surface.",
    },
  },
  {
    id: "venus",
    name: "Venus",
    kind: "planet",
    radius: 0.42,
    orbitRadius: 10.5,
    periodYears: 0.62,
    axialTilt: 177.4,
    spinDays: 243,
    color: "#e8c97a",
    facts: {
      type: "Terrestrial planet",
      diameterKm: "12,104 km",
      distanceAu: "0.72 AU",
      orbitalPeriod: "225 Earth days",
      dayLength: "243 Earth days (retrograde)",
      moons: "0",
      temperature: "~465 °C",
      summary:
        "Earth's sister in size, wrapped in a toxic atmosphere. The hottest planet thanks to a runaway greenhouse effect.",
    },
  },
  {
    id: "earth",
    name: "Earth",
    kind: "planet",
    radius: 0.44,
    orbitRadius: 14,
    periodYears: 1,
    axialTilt: 23.4,
    spinDays: 1,
    color: "#4a90d9",
    facts: {
      type: "Terrestrial planet",
      diameterKm: "12,742 km",
      distanceAu: "1.00 AU",
      orbitalPeriod: "365.25 days",
      dayLength: "24 hours",
      moons: "1 (Moon)",
      temperature: "−88 to 58 °C",
      summary:
        "Our home world — liquid water, a protective atmosphere, and the only known place with life.",
    },
  },
  {
    id: "mars",
    name: "Mars",
    kind: "planet",
    radius: 0.32,
    orbitRadius: 18,
    periodYears: 1.88,
    axialTilt: 25.2,
    spinDays: 1.03,
    color: "#c45c3e",
    facts: {
      type: "Terrestrial planet",
      diameterKm: "6,779 km",
      distanceAu: "1.52 AU",
      orbitalPeriod: "687 Earth days",
      dayLength: "24.6 hours",
      moons: "2 (Phobos, Deimos)",
      temperature: "−140 to 20 °C",
      summary:
        "The red planet. Polar ice caps, ancient riverbeds, and the tallest volcano in the solar system.",
    },
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kind: "planet",
    radius: 1.35,
    orbitRadius: 26,
    periodYears: 11.86,
    axialTilt: 3.1,
    spinDays: 0.41,
    color: "#d4a574",
    facts: {
      type: "Gas giant",
      diameterKm: "139,820 km",
      distanceAu: "5.20 AU",
      orbitalPeriod: "11.9 Earth years",
      dayLength: "9.9 hours",
      moons: "95+",
      temperature: "−110 °C (cloud tops)",
      summary:
        "The largest planet. A swirling hydrogen-helium giant with the Great Red Spot — a storm larger than Earth.",
    },
  },
  {
    id: "saturn",
    name: "Saturn",
    kind: "planet",
    radius: 1.15,
    orbitRadius: 34,
    periodYears: 29.46,
    axialTilt: 26.7,
    spinDays: 0.45,
    color: "#e6d5a8",
    rings: {
      inner: 1.5,
      outer: 2.4,
      color: "#c4b48a",
      opacity: 0.75,
    },
    facts: {
      type: "Gas giant",
      diameterKm: "116,460 km",
      distanceAu: "9.58 AU",
      orbitalPeriod: "29.5 Earth years",
      dayLength: "10.7 hours",
      moons: "146+",
      temperature: "−140 °C (cloud tops)",
      summary:
        "Famous for its spectacular ring system of ice and rock. Less dense than water — it would float in a giant bathtub.",
    },
  },
  {
    id: "uranus",
    name: "Uranus",
    kind: "planet",
    radius: 0.72,
    orbitRadius: 42,
    periodYears: 84.01,
    axialTilt: 97.8,
    spinDays: 0.72,
    color: "#7ec8d4",
    rings: {
      inner: 1.1,
      outer: 1.5,
      color: "#8ab8c0",
      opacity: 0.35,
    },
    facts: {
      type: "Ice giant",
      diameterKm: "50,724 km",
      distanceAu: "19.2 AU",
      orbitalPeriod: "84 Earth years",
      dayLength: "17.2 hours",
      moons: "28",
      temperature: "−195 °C",
      summary:
        "An ice giant tilted nearly on its side. Pale blue-green methane atmosphere and a faint ring system.",
    },
  },
  {
    id: "neptune",
    name: "Neptune",
    kind: "planet",
    radius: 0.7,
    orbitRadius: 50,
    periodYears: 164.8,
    axialTilt: 28.3,
    spinDays: 0.67,
    color: "#4169e1",
    facts: {
      type: "Ice giant",
      diameterKm: "49,244 km",
      distanceAu: "30.1 AU",
      orbitalPeriod: "165 Earth years",
      dayLength: "16.1 hours",
      moons: "16",
      temperature: "−200 °C",
      summary:
        "The farthest known planet. Deep blue and home to the fastest winds in the solar system — over 2,000 km/h.",
    },
  },
];

export const PLANETS = BODIES.filter((b) => b.kind === "planet");
export const SUN = BODIES.find((b) => b.id === "sun")!;

export function getBody(id: string): CelestialBody | undefined {
  return BODIES.find((b) => b.id === id);
}

/** Seconds of sim time for one Earth-year at speed = 1 */
export const YEAR_SECONDS = 18;
