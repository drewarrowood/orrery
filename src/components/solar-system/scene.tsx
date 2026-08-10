import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BODIES, PLANETS } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";
import { Starfield } from "./starfield";
import { OrbitTrail } from "./orbit-trail";
import { BodyMesh } from "./body-mesh";
import { CameraRig } from "./camera-rig";
import { EpicycleTrails } from "./epicycle-trails";

export function SolarScene() {
  const simTimeRef = useRef(0);
  const heliocentricRef = useRef(new Map<string, THREE.Vector3>());
  const displayRef = useRef(new Map<string, THREE.Vector3>());
  const centerOffsetRef = useRef(new THREE.Vector3());
  const sunLightRef = useRef<THREE.PointLight>(null);
  const showTrails = useSimStore((s) => s.showTrails);

  const registerHeliocentric = (id: string, pos: THREE.Vector3) => {
    let stored = heliocentricRef.current.get(id);
    if (!stored) {
      stored = new THREE.Vector3();
      heliocentricRef.current.set(id, stored);
    }
    stored.copy(pos);
  };

  const registerDisplay = (id: string, pos: THREE.Vector3) => {
    let stored = displayRef.current.get(id);
    if (!stored) {
      stored = new THREE.Vector3();
      displayRef.current.set(id, stored);
    }
    stored.copy(pos);
  };

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const { paused, speed, frameMode, centerId } = useSimStore.getState();
    if (!paused) {
      simTimeRef.current += d * speed;
    }

    // Resolve frame origin: body-centered or sun
    if (frameMode === "centered" && centerId) {
      const c = heliocentricRef.current.get(centerId);
      if (c) centerOffsetRef.current.copy(c);
    } else {
      centerOffsetRef.current.set(0, 0, 0);
    }

    // Keep sun light attached to the sun in display space
    if (sunLightRef.current) {
      const sun = heliocentricRef.current.get("sun");
      if (sun) {
        sunLightRef.current.position
          .copy(sun)
          .sub(centerOffsetRef.current);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#050508"]} />
      <fog attach="fog" args={["#050508", 90, 320]} />

      <ambientLight intensity={0.12} />
      <pointLight
        ref={sunLightRef}
        position={[0, 0, 0]}
        intensity={2.8}
        distance={220}
        decay={1.2}
        color="#ffd9a0"
      />
      <directionalLight
        position={[40, 60, 20]}
        intensity={0.15}
        color="#a8c4e8"
      />

      <Starfield />

      {showTrails &&
        PLANETS.map((p) => (
          <OrbitTrail
            key={`trail-${p.id}`}
            radius={p.orbitRadius}
            color={p.color}
            opacity={0.2}
            centerOffsetRef={centerOffsetRef}
          />
        ))}

      <EpicycleTrails heliocentricRef={heliocentricRef} />

      {BODIES.map((body) => (
        <BodyMesh
          key={body.id}
          body={body}
          simTimeRef={simTimeRef}
          registerHeliocentric={registerHeliocentric}
          registerDisplay={registerDisplay}
          centerOffsetRef={centerOffsetRef}
        />
      ))}

      <CameraRig positionsRef={displayRef} />
    </>
  );
}
