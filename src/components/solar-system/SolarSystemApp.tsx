"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SolarScene } from "./scene";
import { ControlsPanel } from "./controls-panel";
import { InfoPanel } from "./info-panel";
import { PlanetRadio } from "./planet-radio";
import { SurfaceReel } from "./surface-reel";
import { useSimStore } from "@/store/sim-store";
import { cn } from "@/lib/utils";

export default function SolarSystemApp() {
  const [ready, setReady] = useState(false);
  const clearSelection = useSimStore((s) => s.clearSelection);
  const togglePaused = useSimStore((s) => s.togglePaused);
  const openSurfaceReel = useSimStore((s) => s.openSurfaceReel);
  const surfaceReelId = useSimStore((s) => s.surfaceReelId);
  const frameMode = useSimStore((s) => s.frameMode);
  const centerId = useSimStore((s) => s.centerId);
  const showEpicycles = useSimStore((s) => s.showEpicycles);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        togglePaused();
      }
      if (e.code === "Escape") {
        if (surfaceReelId) {
          openSurfaceReel(null);
          return;
        }
        clearSelection();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePaused, clearSelection, openSurfaceReel, surfaceReelId]);

  if (!ready) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-bg">
        <p className="text-sm text-fg-muted">Loading solar system…</p>
      </div>
    );
  }

  const modeLabel =
    frameMode === "centered" && centerId
      ? `Centered on ${centerId}${showEpicycles ? " · epicycles" : ""}`
      : "Heliocentric";

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg touch-none">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 28, 58], fov: 45, near: 0.1, far: 600 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onPointerMissed={() => {
            if (!surfaceReelId) clearSelection();
          }}
          style={{ touchAction: "none" }}
        >
          <Suspense fallback={null}>
            <SolarScene />
          </Suspense>
        </Canvas>
      </div>

      <header
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-10",
          "p-3 sm:p-5",
          "pt-[max(0.75rem,env(safe-area-inset-top))]",
        )}
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-fg-subtle">
          Exploration
        </p>
        <h1 className="text-lg font-semibold tracking-tight text-fg sm:text-2xl">
          Orbital
        </h1>
        <p className="mt-0.5 text-xs text-fg-muted">
          {modeLabel}
          <span className="hidden sm:inline">
            {" "}
            · center any body · epicycles · planet radio
          </span>
        </p>
      </header>

      {/* Radio — top right on desktop, floats above panels on mobile */}
      <div
        className={cn(
          "pointer-events-none absolute z-20",
          "right-2.5 top-14 sm:right-5 sm:top-5",
          "pt-[max(0,env(safe-area-inset-top))]",
        )}
      >
        <div className="pointer-events-auto">
          <PlanetRadio />
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute z-10",
          "inset-x-0 bottom-0 flex flex-col gap-2 p-2.5",
          "pb-[max(0.65rem,env(safe-area-inset-bottom))]",
          "sm:gap-3 sm:p-5",
          "lg:inset-x-auto lg:bottom-5 lg:left-5 lg:right-auto lg:w-full lg:max-w-md lg:p-0",
        )}
      >
        <div className="order-1 lg:hidden">
          <InfoPanel />
        </div>
        <div className="order-2">
          <ControlsPanel />
        </div>
      </div>

      <div
        className={cn(
          "pointer-events-none absolute z-10 hidden lg:block",
          "bottom-5 right-5 w-full max-w-sm",
        )}
      >
        <InfoPanel />
      </div>

      <SurfaceReel />
    </div>
  );
}
