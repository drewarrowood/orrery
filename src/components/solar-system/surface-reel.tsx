"use client";

import { useEffect, useMemo, useState } from "react";
import { Film, X } from "lucide-react";
import {
  clipsForBody,
  surfaceClipUrl,
  type SurfaceClip,
} from "@/lib/surface-videos";
import { getBody } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";
import { cn } from "@/lib/utils";

export function SurfaceReel() {
  const bodyId = useSimStore((s) => s.surfaceReelId);
  const openSurfaceReel = useSimStore((s) => s.openSurfaceReel);
  const clips = useMemo(
    () => (bodyId ? clipsForBody(bodyId) : []),
    [bodyId],
  );
  const [active, setActive] = useState<SurfaceClip | null>(null);

  useEffect(() => {
    if (clips.length) setActive(clips[0]!);
    else setActive(null);
  }, [clips]);

  useEffect(() => {
    if (!bodyId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Escape") openSurfaceReel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bodyId, openSurfaceReel]);

  if (!bodyId || !active) return null;

  const body = getBody(bodyId);
  const src = surfaceClipUrl(active.file);

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-40 flex items-end justify-center bg-black/70 p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Planetary surface run"
      onClick={() => openSurfaceReel(null)}
    >
      <div
        className={cn(
          "ss-panel w-full max-w-lg overflow-hidden",
          "max-h-[min(90dvh,720px)]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-fg-subtle">
              <Film className="size-3" strokeWidth={2} aria-hidden />
              Surface run
            </p>
            <h2 className="mt-0.5 text-base font-semibold tracking-tight text-fg">
              {active.title}
            </h2>
            <p className="text-xs text-fg-muted">
              {body?.name ?? bodyId} · {active.caption}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openSurfaceReel(null)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg"
            aria-label="Close surface reel"
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="bg-black">
          <video
            key={src}
            className="aspect-video w-full object-cover"
            src={src}
            controls
            autoPlay
            playsInline
            loop
            preload="metadata"
          />
        </div>

        {clips.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto border-t border-border p-3">
            {clips.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(c)}
                className={cn(
                  "shrink-0 rounded-md border px-2.5 py-1.5 text-xs font-medium",
                  c.id === active.id
                    ? "border-accent-dim bg-bg-subtle text-accent"
                    : "border-border text-fg-muted hover:text-fg",
                )}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
