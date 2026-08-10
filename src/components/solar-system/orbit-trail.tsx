import { useMemo } from "react";
import * as THREE from "three";

const SEGMENTS = 128;

interface OrbitTrailProps {
  radius: number;
  color?: string;
  opacity?: number;
}

export function OrbitTrail({
  radius,
  color = "#3a3a4a",
  opacity = 0.45,
}: OrbitTrailProps) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const a = (i / SEGMENTS) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </lineLoop>
  );
}
