import { useSimStore } from "@/store/sim-store";

export interface TeachStep {
  id: string;
  /** Named law or relation. Shown as the step's eyebrow. */
  law: string;
  title: string;
  paragraphs: string[];
  frame: "heliocentric" | { center: string };
  epicycles: boolean;
  trails: boolean;
  /** Sim speed applied when the step opens. The slider still works after that. */
  speed: number;
  /** Body to frame in heliocentric mode. Ignored when frame is a center. */
  focusId: string | null;
  /** Draw the equal-area wedges (circular limit of Kepler's second law). */
  wedge: boolean;
}

export const TEACH_STEPS: TeachStep[] = [
  {
    id: "ellipses",
    law: "Kepler's first law",
    title: "Ellipses, drawn as circles",
    paragraphs: [
      "A planet's orbit is an ellipse with the Sun at one focus. A circle is that ellipse at eccentricity 0, and that is what is drawn here.",
      "The numbers are the real eccentricities. Venus, Earth, and Jupiter are nearly circles. Mercury at 0.206 is the orbit this picture simplifies away. The Sun stays the focus.",
    ],
    frame: "heliocentric",
    epicycles: false,
    trails: true,
    speed: 1,
    focusId: null,
    wedge: false,
  },
  {
    id: "periods",
    law: "Kepler's third law",
    title: "Farther out, a much longer year",
    paragraphs: [
      "P²/a³ = 1 when P is in years and a is in AU. The first number on each chip is that ratio, computed from the period moving the planet and its real semi-major axis.",
      "The drawing squeezes distance. Neptune is drawn at about 3.6 times Earth's radius, not 30. The second number puts that drawn radius in place of AU, and it is not 1. The lap counts share one clock.",
    ],
    frame: "heliocentric",
    epicycles: false,
    trails: true,
    speed: 2,
    focusId: null,
    wedge: false,
  },
  {
    id: "areas",
    law: "Kepler's second law",
    title: "Equal areas, steady angle",
    paragraphs: [
      "The line from the Sun to a planet sweeps equal areas in equal times. On a circle, area = ½ a² Δθ, so equal areas are equal angles: a steady angular speed, 360°/P per year.",
      "The two wedges are successive equal spans of time on Earth. They keep the same angle as Earth moves. A real ellipse speeds up at perihelion. A circle has no perihelion.",
    ],
    frame: "heliocentric",
    epicycles: false,
    trails: true,
    speed: 1,
    focusId: null,
    wedge: true,
  },
  {
    id: "newton",
    law: "Newton's gravitation",
    title: "Gravity is what sets the year",
    paragraphs: [
      "The Sun accelerates a planet by GM/a², inward. A circular orbit needs v²/a inward, so v = √(GM/a) and the period is P = 2π √(a³/GM).",
      "In years and AU, GM = 4π², which is P² = a³ again. The speeds below are v/v⊕ = 1/√a from the real AU. Changing the picture's origin does not move this force.",
    ],
    frame: "heliocentric",
    epicycles: false,
    trails: true,
    speed: 1,
    focusId: null,
    wedge: false,
  },
  {
    id: "origin",
    law: "Change of origin",
    title: "Center a body means subtract it",
    paragraphs: [
      "Centering a body subtracts its heliocentric position from every world. Earth at the origin is r − r = 0. That is a choice of coordinates, not a new source of gravity.",
      "The Sun is drawn at −r_Earth, so it appears to circle Earth. The distance below stays equal to Earth's drawn radius for the whole orbit. The force is still the Sun's.",
    ],
    frame: { center: "earth" },
    epicycles: true,
    trails: true,
    speed: 2,
    focusId: null,
    wedge: false,
  },
  {
    id: "epicycles",
    law: "Relative motion",
    title: "Epicycles are the subtracted path",
    paragraphs: [
      "Each trail is r_planet − r_center: one circle minus another. That difference is an epicycle. Longitude is the direction of the relative vector. A negative rate is retrograde, and the trail folds into a loop.",
      "The gap between loops is the synodic period 1/|1/P₁ − 1/P₂|. It depends only on the two periods. Ptolemy's epicycles describe this relative path. They are not extra wheels, and the Sun is still the center of force.",
    ],
    frame: { center: "earth" },
    epicycles: true,
    trails: true,
    speed: 5,
    focusId: null,
    wedge: false,
  },
  {
    id: "origins",
    law: "The loops follow the origin",
    title: "Move the origin, the loops change",
    paragraphs: [
      "The same orbits, three origins. Jupiter subtracts a different vector than Earth, so Saturn's loop changes. The Sun subtracts a fixed point, so the relative trails fall back to circles.",
      "Nothing about GM/a² changed between these buttons. The shape you see is a property of the coordinate origin.",
    ],
    frame: { center: "earth" },
    epicycles: true,
    trails: true,
    speed: 5,
    focusId: null,
    wedge: false,
  },
];

export function applyTeachStep(index: number) {
  const step = TEACH_STEPS[index];
  if (!step) return;
  const api = useSimStore.getState();
  const base = {
    showEpicycles: step.epicycles,
    showTrails: step.trails,
    showLabels: true,
    speed: step.speed,
    paused: false,
    focusNonce: api.focusNonce + 1,
    surfaceReelId: null as string | null,
  };

  if (step.frame === "heliocentric") {
    useSimStore.setState({
      ...base,
      frameMode: "heliocentric",
      centerId: null,
      selectedId: step.focusId,
    });
    return;
  }

  useSimStore.setState({
    ...base,
    frameMode: "centered",
    centerId: step.frame.center,
    selectedId: step.frame.center,
  });
}
