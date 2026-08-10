import { assetUrl } from "./asset-url";

export interface SurfaceClip {
  id: string;
  bodyId: string;
  title: string;
  file: string;
  caption: string;
}

export const SURFACE_CLIPS: SurfaceClip[] = [
  {
    id: "mars",
    bodyId: "mars",
    title: "Mars surface run",
    file: "mars.mp4",
    caption: "Low skimming run over rust canyons and dunes.",
  },
  {
    id: "earth",
    bodyId: "earth",
    title: "Earth limb flyover",
    file: "earth.mp4",
    caption: "Sunlit seas, islands, and cloud shadow from low orbit.",
  },
  {
    id: "venus",
    bodyId: "venus",
    title: "Venus volcanic plain",
    file: "venus.mp4",
    caption: "Amber haze and molten caldera under crushing skies.",
  },
  {
    id: "moon",
    bodyId: "earth",
    title: "Lunar crater run",
    file: "moon.mp4",
    caption: "Hard light across the Moon — companion surface of Earth.",
  },
  {
    id: "jupiter",
    bodyId: "jupiter",
    title: "Jupiter cloud skim",
    file: "jupiter.mp4",
    caption: "Racing the storm bands and a great vortex.",
  },
];

export function surfaceClipUrl(file: string): string {
  return assetUrl(`assets/video/surfaces/${file}`);
}

export function clipsForBody(bodyId: string): SurfaceClip[] {
  return SURFACE_CLIPS.filter((c) => c.bodyId === bodyId);
}

export function firstClipForBody(bodyId: string): SurfaceClip | undefined {
  return SURFACE_CLIPS.find((c) => c.bodyId === bodyId);
}
