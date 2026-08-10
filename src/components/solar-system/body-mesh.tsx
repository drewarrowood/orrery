import { useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ThreeEvent } from "@react-three/fiber";
import type { CelestialBody } from "@/lib/planets";
import { YEAR_SECONDS } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";

interface BodyMeshProps {
  body: CelestialBody;
  simTimeRef: MutableRefObject<number>;
  registerPosition: (id: string, pos: THREE.Vector3) => void;
}

export function BodyMesh({ body, simTimeRef, registerPosition }: BodyMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const selectedId = useSimStore((s) => s.selectedId);
  const showLabels = useSimStore((s) => s.showLabels);
  const selectBody = useSimStore((s) => s.selectBody);
  const isSelected = selectedId === body.id;
  const isSun = body.kind === "star";

  const ringGeo = useMemo(() => {
    if (!body.rings) return null;
    const geo = new THREE.RingGeometry(
      body.radius * body.rings.inner,
      body.radius * body.rings.outer,
      64,
    );
    return geo;
  }, [body]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const g = groupRef.current;
    const m = meshRef.current;
    if (!g) return;

    if (body.orbitRadius > 0 && body.periodYears > 0) {
      const angle =
        (simTimeRef.current / (body.periodYears * YEAR_SECONDS)) * Math.PI * 2;
      g.position.x = Math.cos(angle) * body.orbitRadius;
      g.position.z = Math.sin(angle) * body.orbitRadius;
      g.position.y = 0;
    } else {
      g.position.set(0, 0, 0);
    }

    registerPosition(body.id, g.position);

    if (m) {
      const { paused, speed } = useSimStore.getState();
      if (!paused) {
        const spinRate =
          (Math.PI * 2) / Math.max(body.spinDays, 0.2) / YEAR_SECONDS;
        m.rotation.y += spinRate * d * speed;
      }
    }

    if (matRef.current && !isSun) {
      matRef.current.emissiveIntensity = isSelected ? 0.18 : 0.04;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    selectBody(body.id);
  };

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        rotation={[0, 0, THREE.MathUtils.degToRad(body.axialTilt)]}
        onClick={handleClick}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
        castShadow={!isSun}
        receiveShadow
      >
        <sphereGeometry args={[body.radius, isSun ? 48 : 32, isSun ? 48 : 32]} />
        <meshStandardMaterial
          ref={matRef}
          color={body.color}
          emissive={isSun ? (body.emissive ?? body.color) : body.color}
          emissiveIntensity={
            isSun ? (body.emissiveIntensity ?? 1.4) : isSelected ? 0.18 : 0.04
          }
          roughness={isSun ? 0.4 : 0.72}
          metalness={isSun ? 0.1 : 0.08}
        />
      </mesh>

      {isSun && (
        <mesh scale={1.35}>
          <sphereGeometry args={[body.radius, 32, 32]} />
          <meshBasicMaterial
            color={body.emissive ?? body.color}
            transparent
            opacity={0.12}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {body.rings && ringGeo && (
        <mesh
          rotation={[
            Math.PI / 2,
            0,
            THREE.MathUtils.degToRad(body.axialTilt * 0.4),
          ]}
          onClick={handleClick}
        >
          <primitive object={ringGeo} attach="geometry" />
          <meshBasicMaterial
            color={body.rings.color}
            transparent
            opacity={body.rings.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[body.radius * 1.35, body.radius * 1.5, 48]} />
          <meshBasicMaterial
            color="#7eb8ff"
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {showLabels && (
        <Html
          position={[0, body.radius + 0.35, 0]}
          center
          distanceFactor={28}
          style={{ pointerEvents: "none" }}
          zIndexRange={[10, 0]}
        >
          <div
            className={
              isSelected ? "ss-label ss-label--selected" : "ss-label"
            }
          >
            {body.name}
          </div>
        </Html>
      )}
    </group>
  );
}
