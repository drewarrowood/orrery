"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { BookOpen, Radio } from "lucide-react";
import { SolarScene } from "./scene";
import { ControlsPanel } from "./controls-panel";
import { InfoPanel } from "./info-panel";
import { PlanetRadio } from "./planet-radio";
import { SurfaceReel } from "./surface-reel";
import { TeachOverlay } from "./teach-overlay";
import { useSimStore } from "@/store/sim-store";
import { getBody } from "@/lib/planets";
import { TEACH_STEPS } from "@/lib/teach-steps";
import { useCompactViewport, useMedia } from "@/lib/use-media";
import { cn } from "@/lib/utils";

export default function SolarSystemApp() {
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(true);
  const clearSelection = useSimStore((s) => s.clearSelection);
  const togglePaused = useSimStore((s) => s.togglePaused);
  const openSurfaceReel = useSimStore((s) => s.openSurfaceReel);
  const surfaceReelId = useSimStore((s) => s.surfaceReelId);
  const frameMode = useSimStore((s) => s.frameMode);
  const centerId = useSimStore((s) => s.centerId);
  const showEpicycles = useSimStore((s) => s.showEpicycles);
  const teachOpen = useSimStore((s) => s.teachOpen);
  const teachStep = useSimStore((s) => s.teachStep);
  const setTeachOpen = useSimStore((s) => s.setTeachOpen);
  const setTeachStep = useSimStore((s) => s.setTeachStep);
  const radioOpen = useSimStore((s) => s.radioOpen);
  const setRadioOpen = useSimStore((s) => s.setRadioOpen);
  const radioPlaying = useSimStore((s) => s.radioPlaying);
  const compact = useCompactViewport();
  const wide = useMedia("(min-width: 1024px)");

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
        if (teachOpen) {
          setTeachOpen(false);
          return;
        }
        if (radioOpen) {
          setRadioOpen(false);
          return;
        }
        clearSelection();
      }
      if (teachOpen && (e.code === "ArrowRight" || e.code === "ArrowLeft")) {
        e.preventDefault();
        const dir = e.code === "ArrowRight" ? 1 : -1;
        const next = Math.max(0, Math.min(TEACH_STEPS.length - 1, teachStep + dir));
        setTeachStep(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    togglePaused,
    clearSelection,
    openSurfaceReel,
    surfaceReelId,
    teachOpen,
    teachStep,
    setTeachOpen,
    setTeachStep,
    radioOpen,
    setRadioOpen,
  ]);

  if (!ready) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-bg">
        <p className="text-sm text-fg-muted">Loading solar system…</p>
      </div>
    );
  }

  const centerName =
    frameMode === "centered" && centerId
      ? (getBody(centerId)?.name ?? "body")
      : null;
  const modeLabel = centerName
    ? `Centered on ${centerName}${showEpicycles ? " · relative loops" : ""}`
    : "Heliocentric · Sun is the force center";

  return (
    <div className="relative h-dvh w-full max-w-[100vw] overflow-hidden bg-bg">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 28, 58], fov: compact ? 50 : 45, near: 0.1, far: 600 }}
          dpr={compact ? [1, 1.5] : [1, 2]}
          gl={{
            antialias: !compact,
            alpha: false,
            powerPreference: "high-performance",
          }}
          performance={{ min: compact ? 0.6 : 0.8 }}
          onPointerMissed={() => {
            setHint(false);
            if (surfaceReelId || teachOpen) return;
            clearSelection();
          }}
          onPointerDown={() => setHint(false)}
          style={{ touchAction: "none" }}
        >
          <Suspense fallback={null}>
            <SolarScene />
          </Suspense>
        </Canvas>
      </div>

      <header
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-20",
          "flex items-start justify-between gap-2 px-3 sm:px-5",
          "pt-[max(0.5rem,env(safe-area-inset-top))]",
          "pl-[max(0.75rem,env(safe-area-inset-left))]",
          "pr-[max(0.75rem,env(safe-area-inset-right))]",
        )}
      >
        <div className="min-w-0 pt-1">
          <h1 className="text-lg font-semibold leading-none tracking-tight text-fg sm:text-2xl">
            Orbital
          </h1>
          <p className="mt-1 truncate text-[11px] text-fg-muted sm:text-xs">{modeLabel}</p>
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              if (teachOpen) setTeachOpen(false);
              else {
                if (compact) setRadioOpen(false);
                setTeachOpen(true);
              }
            }}
            aria-pressed={teachOpen}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-md border px-3 text-sm font-medium",
              teachOpen
                ? "border-accent-dim bg-bg-subtle text-accent"
                : "border-border bg-bg-panel/90 text-fg",
            )}
          >
            <BookOpen className="size-4" strokeWidth={2} aria-hidden />
            Teach
          </button>
          <button
            type="button"
            onClick={() => setRadioOpen(!radioOpen)}
            aria-pressed={radioOpen}
            aria-label={radioOpen ? "Close planet radio" : "Open planet radio"}
            className={cn(
              "inline-flex h-11 items-center gap-1.5 rounded-md border px-3 text-sm font-medium",
              radioOpen
                ? "border-accent-dim bg-bg-subtle text-accent"
                : "border-border bg-bg-panel/90 text-fg",
            )}
          >
            <Radio className="size-4" strokeWidth={2} aria-hidden />
            <span className="hidden min-[380px]:inline">Radio</span>
            {radioPlaying && (
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            )}
          </button>
        </div>
      </header>

      <div
        className={cn(
          "pointer-events-none absolute z-30",
          "inset-x-3 sm:inset-x-auto sm:right-5 sm:w-[min(20rem,calc(100vw-2.5rem))]",
          "top-[calc(env(safe-area-inset-top)+4.25rem)]",
          !radioOpen && "invisible",
        )}
      >
        <PlanetRadio />
      </div>

      {hint && compact && !teachOpen && !radioOpen && (
        <p className="pointer-events-none absolute left-1/2 top-[4.5rem] z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-bg-panel/80 px-3 py-1 text-[11px] text-fg-muted">
          Drag to turn · pinch to zoom
        </p>
      )}

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2",
          "px-2.5 sm:px-5",
          "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
          "pl-[max(0.65rem,env(safe-area-inset-left))]",
          "pr-[max(0.65rem,env(safe-area-inset-right))]",
          "lg:inset-x-auto lg:bottom-5 lg:left-5 lg:right-auto lg:w-full lg:max-w-md lg:p-0",
        )}
      >
        {!wide && teachOpen && <TeachOverlay />}
        {!wide && !teachOpen && <InfoPanel />}
        <ControlsPanel />
      </div>

      {wide && (
        <div className="pointer-events-none absolute bottom-5 right-5 z-20 w-full max-w-md">
          {teachOpen ? <TeachOverlay /> : <InfoPanel />}
        </div>
      )}

      <SurfaceReel />
    </div>
  );
}
