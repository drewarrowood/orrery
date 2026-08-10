import { create } from "zustand";

export interface SimState {
  paused: boolean;
  /** Simulation multiplier — 1 = default pace */
  speed: number;
  showTrails: boolean;
  showLabels: boolean;
  selectedId: string | null;
  /** Bumps when a new focus request is issued (re-focus same body) */
  focusNonce: number;
  togglePaused: () => void;
  setPaused: (paused: boolean) => void;
  setSpeed: (speed: number) => void;
  setShowTrails: (show: boolean) => void;
  setShowLabels: (show: boolean) => void;
  selectBody: (id: string | null) => void;
  focusBody: (id: string) => void;
  clearSelection: () => void;
}

export const useSimStore = create<SimState>((set) => ({
  paused: false,
  speed: 1,
  showTrails: true,
  showLabels: true,
  selectedId: null,
  focusNonce: 0,
  togglePaused: () => set((s) => ({ paused: !s.paused })),
  setPaused: (paused) => set({ paused }),
  setSpeed: (speed) => set({ speed: Math.min(20, Math.max(0.05, speed)) }),
  setShowTrails: (showTrails) => set({ showTrails }),
  setShowLabels: (showLabels) => set({ showLabels }),
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
  clearSelection: () => set({ selectedId: null }),
}));
