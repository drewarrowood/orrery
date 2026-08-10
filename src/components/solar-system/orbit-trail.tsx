import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SEGMENTS = 128;

interface OrbitTrailProps {
  radius: number;
  color?: string;
  opacity?: number;
  /** When set, orbit circle is drawn around this offset (display space) */
  centerOffsetRef?: MutableRefObject<THREE.Vector3>;
}

export function OrbitTrail({
  radius,
  color = "#3a3a4a",
  opacity = 0.45,
  centerOffsetRef,
}: OrbitTrailProps) {
  const line = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const a = (i / SEGMENTS) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(pts);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    });
    return new THREE.Line(geometry, material);
  }, [radius, color, opacity]);

  useFrame(() => {
    if (!centerOffsetRef) return;
    line.position.set(
      -centerOffsetRef.current.x,
      -centerOffsetRef.current.y,
      -centerOffsetRef.current.z,
    );
  });

  return <primitive object={line} />;
}
