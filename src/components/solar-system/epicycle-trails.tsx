import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BODIES, getBody } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";

const HISTORY = 480;
const SAMPLE_EVERY = 2;

interface EpicycleTrailsProps {
  heliocentricRef: MutableRefObject<Map<string, THREE.Vector3>>;
}

/**
 * Relative paths of all bodies vs the current center (Ptolemaic "epicycles"
 * as seen from a chosen world). When centered on Earth you see the classic
 * retrograde loops of the outer planets.
 */
export function EpicycleTrails({ heliocentricRef }: EpicycleTrailsProps) {
  const show = useSimStore((s) => s.showEpicycles);
  const centerId = useSimStore((s) => s.centerId);
  const frameMode = useSimStore((s) => s.frameMode);

  const buffers = useRef(
    new Map<string, { pts: Float32Array; head: number; filled: number }>(),
  );
  const lines = useRef(new Map<string, THREE.Line>());
  const groupRef = useRef<THREE.Group>(null);
  const tick = useRef(0);
  const tmp = useRef(new THREE.Vector3());
  const center = useRef(new THREE.Vector3());

  const bodyIds = useMemo(
    () => BODIES.map((b) => b.id).filter((id) => id !== "sun" || true),
    [],
  );

  // Ensure buffers
  useMemo(() => {
    for (const id of bodyIds) {
      if (!buffers.current.has(id)) {
        buffers.current.set(id, {
          pts: new Float32Array(HISTORY * 3),
          head: 0,
          filled: 0,
        });
      }
    }
  }, [bodyIds]);

  useFrame(() => {
    if (!show || frameMode !== "centered" || !centerId) {
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }
    if (groupRef.current) groupRef.current.visible = true;

    const cPos = heliocentricRef.current.get(centerId);
    if (!cPos) return;
    center.current.copy(cPos);

    tick.current += 1;
    const shouldSample = tick.current % SAMPLE_EVERY === 0;

    for (const id of bodyIds) {
      if (id === centerId) continue;
      const pos = heliocentricRef.current.get(id);
      if (!pos) continue;

      tmp.current.copy(pos).sub(center.current);

      const buf = buffers.current.get(id)!;
      if (shouldSample) {
        const i = buf.head * 3;
        buf.pts[i] = tmp.current.x;
        buf.pts[i + 1] = tmp.current.y;
        buf.pts[i + 2] = tmp.current.z;
        buf.head = (buf.head + 1) % HISTORY;
        buf.filled = Math.min(HISTORY, buf.filled + 1);
      }

      let line = lines.current.get(id);
      if (!line) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(HISTORY * 3);
        geo.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );
        geo.setDrawRange(0, 0);
        const body = getBody(id);
        const mat = new THREE.LineBasicMaterial({
          color: body?.color ?? "#888",
          transparent: true,
          opacity: 0.55,
          depthWrite: false,
        });
        line = new THREE.Line(geo, mat);
        line.frustumCulled = false;
        lines.current.set(id, line);
        groupRef.current?.add(line);
      }

      const attr = line.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      const n = buf.filled;
      for (let k = 0; k < n; k++) {
        const src = ((buf.head - n + k + HISTORY) % HISTORY) * 3;
        const dst = k * 3;
        arr[dst] = buf.pts[src];
        arr[dst + 1] = buf.pts[src + 1];
        arr[dst + 2] = buf.pts[src + 2];
      }
      attr.needsUpdate = true;
      line.geometry.setDrawRange(0, n);
    }

    // Hide line for center body
    const centerLine = lines.current.get(centerId);
    if (centerLine) centerLine.visible = false;
    for (const [id, line] of lines.current) {
      if (id !== centerId) line.visible = true;
    }
  });

  // Reset history when center changes
  const lastCenter = useRef<string | null>(null);
  useFrame(() => {
    if (centerId !== lastCenter.current) {
      lastCenter.current = centerId;
      for (const buf of buffers.current.values()) {
        buf.head = 0;
        buf.filled = 0;
      }
    }
  });

  if (!show) return null;

  return <group ref={groupRef} />;
}
