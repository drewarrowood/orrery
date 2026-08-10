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
  registerHeliocentric: (id: string, pos: THREE.Vector3) => void;
  registerDisplay: (id: string, pos: THREE.Vector3) => void;
  centerOffsetRef: MutableRefObject<THREE.Vector3>;
}

export function BodyMesh({
  body,
  simTimeRef,
  registerHeliocentric,
  registerDisplay,
  centerOffsetRef,
}: BodyMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const helio = useRef(new THREE.Vector3());
  const selectedId = useSimStore((s) => s.selectedId);
  const centerId = useSimStore((s) => s.centerId);
  const showLabels = useSimStore((s) => s.showLabels);
  const selectBody = useSimStore((s) => s.selectBody);
  const isSelected = selectedId === body.id;
  const isCenter = centerId === body.id;
  const isSun = body.kind === "star";

  const ringGeo = useMemo(() => {
    if (!body.rings) return null;
    return new THREE.RingGeometry(
      body.radius * body.rings.inner,
      body.radius * body.rings.outer,
      64,
    );
  }, [body]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const g = groupRef.current;
    const m = meshRef.current;
    if (!g) return;

    if (body.orbitRadius > 0 && body.periodYears > 0) {
      const angle =
        (simTimeRef.current / (body.periodYears * YEAR_SECONDS)) * Math.PI * 2;
      helio.current.set(
        Math.cos(angle) * body.orbitRadius,
        0,
        Math.sin(angle) * body.orbitRadius,
      );
    } else {
      helio.current.set(0, 0, 0);
    }

    registerHeliocentric(body.id, helio.current);

    g.position
      .copy(helio.current)
      .sub(centerOffsetRef.current);

    registerDisplay(body.id, g.position);

    if (m) {
      const { paused, speed } = useSimStore.getState();
      if (!paused) {
        const spinRate =
          (Math.PI * 2) / Math.max(body.spinDays, 0.2) / YEAR_SECONDS;
        m.rotation.y += spinRate * d * speed;
      }
    }

    if (matRef.current && !isSun) {
      matRef.current.emissiveIntensity =
        isSelected || isCenter ? 0.22 : 0.04;
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
        <sphereGeometry
          args={[body.radius, isSun ? 48 : 32, isSun ? 48 : 32]}
        />
        <meshStandardMaterial
          ref={matRef}
          color={body.color}
          emissive={isSun ? (body.emissive ?? body.color) : body.color}
          emissiveIntensity={
            isSun
              ? (body.emissiveIntensity ?? 1.4)
              : isSelected || isCenter
                ? 0.22
                : 0.04
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

      {(isSelected || isCenter) && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[body.radius * 1.35, body.radius * 1.5, 48]} />
          <meshBasicMaterial
            color={isCenter ? "#c8d4e8" : "#7eb8ff"}
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
              isSelected || isCenter
                ? "ss-label ss-label--selected"
                : "ss-label"
            }
          >
            {body.name}
            {isCenter ? " · center" : ""}
          </div>
        </Html>
      )}
    </group>
  );
}
