import { create } from "zustand";

export type FrameMode = "heliocentric" | "centered";

export interface SimState {
  paused: boolean;
  /** Simulation multiplier — 1 = default pace */
  speed: number;
  showTrails: boolean;
  showLabels: boolean;
  /** Draw relative epicycle paths of other bodies */
  showEpicycles: boolean;
  /** heliocentric = Sun-centered; centered = selected body at origin */
  frameMode: FrameMode;
  selectedId: string | null;
  /** Body used as origin when frameMode is centered (defaults to selected) */
  centerId: string | null;
  /** Bumps when a new focus request is issued (re-focus same body) */
  focusNonce: number;
  /** Surface reel open for body id */
  surfaceReelId: string | null;
  radioOpen: boolean;
  togglePaused: () => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  setShowTrails: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;
  setShowEpicycles: (show: boolean) => void;
  setFrameMode: (mode: FrameMode) => void;
  selectBody: (id: string | null) => void;
  focusBody: (id: string) => void;
  centerOnBody: (id: string) => void;
  clearSelection: () => void;
  openSurfaceReel: (id: string | null) => void;
  setRadioOpen: (open: boolean) => void;
}

export const useSimStore = create<SimState>((set) => ({
  paused: false,
  speed: 1,
  showTrails: true,
  showLabels: true,
  showEpicycles: false,
  frameMode: "heliocentric",
  selectedId: null,
  centerId: null,
  focusNonce: 0,
  surfaceReelId: null,
  radioOpen: true,
  togglePaused: () => set((s) => ({ paused: !s.paused })),
  setPaused: (paused) => set({ paused }),
  setSpeed: (speed) => set({ speed: Math.min(20, Math.max(0.05, speed)) }),
  setShowTrails: (showTrails) => set({ showTrails }),
  setShowLabels: (showLabels) => set({ showLabels }),
  setShowEpicycles: (showEpicycles) => set({ showEpicycles }),
  setFrameMode: (frameMode) => set({ frameMode }),
  selectBody: (id) =>
    set((s) => ({
      selectedId: id,
      focusNonce: id ? s.focusNonce + 1 : s.focusNonce,
    })),
  focusBody: (id) =>
    set((s) => ({
      selectedId: id,
      focusNonce: s.focusNonce + 1,
    })),
  centerOnBody: (id) =>
    set((s) => ({
      selectedId: id,
      centerId: id,
      frameMode: "centered",
      showEpicycles: true,
      focusNonce: s.focusNonce + 1,
    })),
  clearSelection: () =>
    set({
      selectedId: null,
      centerId: null,
      frameMode: "heliocentric",
      surfaceReelId: null,
    }),
  openSurfaceReel: (surfaceReelId) => set({ surfaceReelId }),
  setRadioOpen: (radioOpen) => set({ radioOpen }),
}));
