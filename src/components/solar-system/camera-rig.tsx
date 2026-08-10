import { useEffect, useRef, type MutableRefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { getBody } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";

interface CameraRigProps {
  positionsRef: MutableRefObject<Map<string, THREE.Vector3>>;
}

type ControlsHandle = {
  target: THREE.Vector3;
  update: () => void;
};

const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_POS = new THREE.Vector3(0, 28, 58);

export function CameraRig({ positionsRef }: CameraRigProps) {
  const controlsRef = useRef<ControlsHandle | null>(null);
  const { camera } = useThree();
  const selectedId = useSimStore((s) => s.selectedId);
  const centerId = useSimStore((s) => s.centerId);
  const frameMode = useSimStore((s) => s.frameMode);
  const focusNonce = useSimStore((s) => s.focusNonce);

  const animating = useRef(false);
  const fromPos = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());
  const fromTarget = useRef(new THREE.Vector3());
  const toTarget = useRef(new THREE.Vector3());
  const t = useRef(0);
  const lastNonce = useRef(-1);
  const offset = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.copy(DEFAULT_POS);
    camera.lookAt(DEFAULT_TARGET);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.copy(DEFAULT_TARGET);
      controls.update();
    }
  }, [camera]);

  useEffect(() => {
    if (focusNonce === lastNonce.current) return;
    lastNonce.current = focusNonce;

    const controls = controlsRef.current;
    if (!controls) return;

    fromPos.current.copy(camera.position);
    fromTarget.current.copy(controls.target);

    const focusId =
      frameMode === "centered" && centerId ? centerId : selectedId;

    if (!focusId) {
      toTarget.current.copy(DEFAULT_TARGET);
      toPos.current.copy(DEFAULT_POS);
    } else {
      const body = getBody(focusId);
      const pos = positionsRef.current.get(focusId) ?? DEFAULT_TARGET;
      if (!body) return;

      toTarget.current.copy(pos);
      // Pull back in centered/epicycle mode so relative paths stay readable
      const dist =
        frameMode === "centered"
          ? Math.max(body.radius * 22, 48)
          : Math.max(body.radius * 6.5, 3.5);
      dir.current.subVectors(camera.position, pos);
      if (dir.current.lengthSq() < 0.001) {
        dir.current.set(0.45, 0.55, 0.85);
      }
      dir.current.normalize();
      dir.current.y = Math.max(0.35, Math.abs(dir.current.y));
      dir.current.normalize();
      toPos.current.copy(pos).addScaledVector(dir.current, dist);
    }

    t.current = 0;
    animating.current = true;
  }, [selectedId, centerId, frameMode, focusNonce, camera, positionsRef]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const d = Math.min(delta, 0.1);

    const trackId =
      frameMode === "centered" && centerId ? centerId : selectedId;

    if (trackId && !animating.current) {
      const pos = positionsRef.current.get(trackId);
      if (pos) {
        offset.current.subVectors(camera.position, controls.target);
        const alpha = 1 - Math.exp(-4 * d);
        controls.target.lerp(pos, alpha);
        camera.position.copy(controls.target).add(offset.current);
        controls.update();
      }
      return;
    }

    if (!animating.current) return;

    t.current = Math.min(1, t.current + d * 1.35);
    const k = t.current * t.current * (3 - 2 * t.current);

    camera.position.lerpVectors(fromPos.current, toPos.current, k);
    controls.target.lerpVectors(fromTarget.current, toTarget.current, k);
    controls.update();

    if (t.current >= 1) {
      animating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef as never}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minDistance={2}
      maxDistance={220}
      maxPolarAngle={Math.PI * 0.92}
      enablePan
      rotateSpeed={0.55}
      zoomSpeed={0.85}
    />
  );
}
