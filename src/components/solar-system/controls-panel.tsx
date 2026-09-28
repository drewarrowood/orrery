import { Pause, Play, RotateCcw, Eye, EyeOff, Orbit, Gauge, Crosshair, Waypoints } from "lucide-react";
import { useSimStore } from "@/store/sim-store";
import { BODIES, getBody } from "@/lib/planets";
import { cn } from "@/lib/utils";

export function ControlsPanel() {
  const paused = useSimStore((s) => s.paused);
  const speed = useSimStore((s) => s.speed);
  const showTrails = useSimStore((s) => s.showTrails);
  const showLabels = useSimStore((s) => s.showLabels);
  const showEpicycles = useSimStore((s) => s.showEpicycles);
  const frameMode = useSimStore((s) => s.frameMode);
  const centerId = useSimStore((s) => s.centerId);
  const togglePaused = useSimStore((s) => s.togglePaused);
  const setSpeed = useSimStore((s) => s.setSpeed);
  const setShowTrails = useSimStore((s) => s.setShowTrails);
  const setShowLabels = useSimStore((s) => s.setShowLabels);
  const setShowEpicycles = useSimStore((s) => s.setShowEpicycles);
  const setFrameMode = useSimStore((s) => s.setFrameMode);
  const centerOnBody = useSimStore((s) => s.centerOnBody);
  const clearSelection = useSimStore((s) => s.clearSelection);

  const fillPct = ((speed - 0.05) / (12 - 0.05)) * 100;
  const centered = frameMode === "centered";
  const centerName = centered ? (getBody(centerId ?? "")?.name ?? "body") : "Sun";

  return (
    <div
      className="ss-panel pointer-events-auto flex w-full max-w-md flex-col gap-2 p-2.5 sm:gap-3 sm:p-4"
      role="toolbar"
      aria-label="Simulation controls"
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={togglePaused}
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
            "bg-fg text-bg-elevated transition-opacity duration-150",
            "hover:opacity-90 active:scale-[0.98]",
          )}
          aria-pressed={paused}
          aria-label={paused ? "Resume simulation" : "Pause simulation"}
        >
          {paused ? (
            <Play className="size-4" strokeWidth={2} aria-hidden />
          ) : (
            <Pause className="size-4" strokeWidth={2} aria-hidden />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            clearSelection();
            setSpeed(1);
            setFrameMode("heliocentric");
            setShowEpicycles(false);
            if (paused) togglePaused();
          }}
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md",
            "border border-border bg-bg-subtle text-fg",
            "transition-colors duration-150 hover:border-border-strong active:scale-[0.98]",
          )}
          aria-label="Reset view and frame"
        >
          <RotateCcw className="size-4" strokeWidth={2} aria-hidden />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Gauge className="size-3.5 shrink-0 text-fg-muted" strokeWidth={2} aria-hidden />
          <input
            id="sim-speed"
            type="range"
            min={0.05}
            max={12}
            step={0.05}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="ss-range min-w-0 flex-1"
            style={{ ["--ss-fill" as string]: `${fillPct}%` }}
            aria-label="Simulation speed"
            aria-valuemin={0.05}
            aria-valuemax={12}
            aria-valuenow={speed}
            aria-valuetext={`${formatSpeed(speed)} times normal speed`}
          />
          <button
            type="button"
            className="inline-flex h-11 w-12 shrink-0 items-center justify-end font-mono text-xs tabular-nums text-fg"
            onClick={() => setSpeed(1)}
            aria-label="Reset speed to 1×"
          >
            {formatSpeed(speed)}×
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <label htmlFor="center-body" className="sr-only">
          Center frame
        </label>
        <div className="relative min-w-0 flex-1">
          <Crosshair
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-muted"
            strokeWidth={2}
            aria-hidden
          />
          <select
            id="center-body"
            className={cn(
              "h-11 w-full rounded-md border border-border bg-bg-subtle pl-8 pr-2 text-base text-fg sm:text-sm",
              "outline-none transition-colors hover:border-border-strong focus:border-accent",
            )}
            value={centered && centerId ? centerId : ""}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                setFrameMode("heliocentric");
                setShowEpicycles(false);
                clearSelection();
                return;
              }
              centerOnBody(v);
            }}
            aria-label="Center on celestial body"
          >
            <option value="">Sun — force center</option>
            {BODIES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
                {b.kind === "star" ? " — rest frame" : ""}
              </option>
            ))}
          </select>
        </div>
        <ToggleChip
          active={showTrails}
          onClick={() => setShowTrails(!showTrails)}
          label="Orbits"
          icon={<Orbit className="size-3.5" strokeWidth={2} aria-hidden />}
        />
        <ToggleChip
          active={showEpicycles}
          onClick={() => {
            const next = !showEpicycles;
            setShowEpicycles(next);
            if (next && !centered && centerId) {
              setFrameMode("centered");
            }
          }}
          label="Loops"
          icon={<Waypoints className="size-3.5" strokeWidth={2} aria-hidden />}
        />
        <ToggleChip
          active={showLabels}
          onClick={() => setShowLabels(!showLabels)}
          label="Names"
          icon={
            showLabels ? (
              <Eye className="size-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <EyeOff className="size-3.5" strokeWidth={2} aria-hidden />
            )
          }
        />
      </div>

      <p className="hidden text-[11px] leading-snug text-fg-subtle sm:block">
        {centered
          ? `Centered on ${centerName}: its position is subtracted from the others. Loops are that relative path. The Sun stays the center of force.`
          : "Heliocentric: the Sun is the origin and the force center. Center another body to subtract its motion."}
      </p>
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={cn(
        "inline-flex h-11 shrink-0 flex-col items-center justify-center rounded-md border px-1.5 min-[400px]:px-2",
        "text-[10px] font-medium leading-none transition-colors duration-150 active:scale-[0.98]",
        active
          ? "border-accent-dim bg-bg-subtle text-accent"
          : "border-border bg-transparent text-fg-muted",
      )}
    >
      {icon}
      <span className="mt-0.5">{label}</span>
    </button>
  );
}

function formatSpeed(speed: number): string {
  if (speed < 0.1) return speed.toFixed(2);
  if (speed < 10) return speed.toFixed(1);
  return String(Math.round(speed));
}
