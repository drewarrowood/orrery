import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BODIES, PLANETS } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";
import { Starfield } from "./starfield";
import { OrbitTrail } from "./orbit-trail";
import { BodyMesh } from "./body-mesh";
import { CameraRig } from "./camera-rig";

export function SolarScene() {
  const simTimeRef = useRef(0);
  const positionsRef = useRef(new Map<string, THREE.Vector3>());
  const showTrails = useSimStore((s) => s.showTrails);

  const registerPosition = (id: string, pos: THREE.Vector3) => {
    let stored = positionsRef.current.get(id);
    if (!stored) {
      stored = new THREE.Vector3();
      positionsRef.current.set(id, stored);
    }
    stored.copy(pos);
  };

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const { paused, speed } = useSimStore.getState();
    if (!paused) {
      simTimeRef.current += d * speed;
    }
  });

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 90, 280]} />

      <ambientLight intensity={0.12} />
      <pointLight
        position={[0, 0, 0]}
        intensity={2.8}
        distance={200}
        decay={1.2}
        color="#ffd9a0"
      />
      <directionalLight
        position={[40, 60, 20]}
        intensity={0.15}
        color="#a8c4e8"
      />

      <Starfield />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[54, 64]} />
        <meshBasicMaterial
          color="#0a0a12"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {showTrails &&
        PLANETS.map((p) => (
          <OrbitTrail
            key={`trail-${p.id}`}
            radius={p.orbitRadius}
            color={p.color}
            opacity={0.22}
          />
        ))}

      {BODIES.map((body) => (
        <BodyMesh
          key={body.id}
          body={body}
          simTimeRef={simTimeRef}
          registerPosition={registerPosition}
        />
      ))}

      <CameraRig positionsRef={positionsRef} />
    </>
  );
}
