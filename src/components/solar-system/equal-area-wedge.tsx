import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getBody, YEAR_SECONDS } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";
import { TEACH_STEPS } from "@/lib/teach-steps";

const SEGMENTS = 20;
/** Equal time span of each wedge, in years. Area equality is then equal angle. */
const WEDGE_YEARS = 0.08;

interface EqualAreaWedgeProps {
  simTimeRef: MutableRefObject<number>;
  centerOffsetRef: MutableRefObject<THREE.Vector3>;
}

/**
 * Two successive equal-time sectors on Earth's circular orbit.
 * On a circle, equal time ⇒ equal angle ⇒ equal area (Kepler's second law).
 */
export function EqualAreaWedge({ simTimeRef, centerOffsetRef }: EqualAreaWedgeProps) {
  const teachOpen = useSimStore((s) => s.teachOpen);
  const teachStep = useSimStore((s) => s.teachStep);
  const visible = teachOpen && TEACH_STEPS[teachStep]?.wedge === true;

  const recentGeo = useMemo(() => sectorGeometry(), []);
  const priorGeo = useMemo(() => sectorGeometry(), []);
  const radiusLine = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
    const material = new THREE.LineBasicMaterial({
      color: "#e8e8ed",
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(g, material);
  }, []);

  const recentRef = useRef<THREE.Mesh>(null);
  const priorRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const show = recentRef.current && priorRef.current;
    if (!show) return;
    const on = useSimStore.getState().teachOpen && TEACH_STEPS[useSimStore.getState().teachStep]?.wedge;
    recentRef.current!.visible = !!on;
    priorRef.current!.visible = !!on;
    radiusLine.visible = !!on;
    if (!on) return;

    const earth = getBody("earth");
    if (!earth) return;
    const t = simTimeRef.current;
    const angle = (t / (earth.periodYears * YEAR_SECONDS)) * Math.PI * 2;
    const delta = WEDGE_YEARS * Math.PI * 2;
    const origin = centerOffsetRef.current;

    writeSector(recentGeo, -origin.x, -origin.z, earth.orbitRadius, angle - delta, angle);
    writeSector(priorGeo, -origin.x, -origin.z, earth.orbitRadius, angle - 2 * delta, angle - delta);

    const pos = radiusLine.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    arr[0] = -origin.x;
    arr[1] = 0.05;
    arr[2] = -origin.z;
    arr[3] = -origin.x + Math.cos(angle) * earth.orbitRadius;
    arr[4] = 0.05;
    arr[5] = -origin.z + Math.sin(angle) * earth.orbitRadius;
    pos.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <group>
      <mesh ref={priorRef} geometry={priorGeo}>
        <meshBasicMaterial
          color="#c8d4e8"
          transparent
          opacity={0.28}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={recentRef} geometry={recentGeo}>
        <meshBasicMaterial
          color="#7eb8ff"
          transparent
          opacity={0.42}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <primitive object={radiusLine} />
    </group>
  );
}

function sectorGeometry(): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(SEGMENTS * 9), 3),
  );
  return geo;
}

function writeSector(
  geo: THREE.BufferGeometry,
  cx: number,
  cz: number,
  radius: number,
  a0: number,
  a1: number,
) {
  const attr = geo.getAttribute("position") as THREE.BufferAttribute;
  const arr = attr.array as Float32Array;
  for (let i = 0; i < SEGMENTS; i++) {
    const t0 = a0 + ((a1 - a0) * i) / SEGMENTS;
    const t1 = a0 + ((a1 - a0) * (i + 1)) / SEGMENTS;
    const o = i * 9;
    arr[o] = cx;
    arr[o + 1] = 0.03;
    arr[o + 2] = cz;
    arr[o + 3] = cx + Math.cos(t0) * radius;
    arr[o + 4] = 0.03;
    arr[o + 5] = cz + Math.sin(t0) * radius;
    arr[o + 6] = cx + Math.cos(t1) * radius;
    arr[o + 7] = 0.03;
    arr[o + 8] = cz + Math.sin(t1) * radius;
  }
  attr.needsUpdate = true;
  geo.computeBoundingSphere();
}
