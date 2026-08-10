import {
  Pause,
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Orbit,
  Gauge,
} from "lucide-react";
import { useSimStore } from "@/store/sim-store";
import { cn } from "@/lib/utils";

export function ControlsPanel() {
  const paused = useSimStore((s) => s.paused);
  const speed = useSimStore((s) => s.speed);
  const showTrails = useSimStore((s) => s.showTrails);
  const showLabels = useSimStore((s) => s.showLabels);
  const togglePaused = useSimStore((s) => s.togglePaused);
  const setSpeed = useSimStore((s) => s.setSpeed);
  const setShowTrails = useSimStore((s) => s.setShowTrails);
  const setShowLabels = useSimStore((s) => s.setShowLabels);
  const clearSelection = useSimStore((s) => s.clearSelection);

  const fillPct = ((speed - 0.05) / (12 - 0.05)) * 100;

  return (
    <div
      className={cn(
        "ss-panel pointer-events-auto flex w-full max-w-md flex-col gap-2.5 p-2.5 sm:gap-3 sm:p-4",
      )}
      role="toolbar"
      aria-label="Simulation controls"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={togglePaused}
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2.5 sm:h-11 sm:min-w-11 sm:px-3",
              "bg-fg text-bg-elevated text-sm font-medium transition-opacity duration-150",
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
            <span className="hidden sm:inline">
              {paused ? "Resume" : "Pause"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              clearSelection();
              setSpeed(1);
              if (paused) togglePaused();
            }}
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-md px-2.5 sm:h-11 sm:min-w-11 sm:px-3",
              "border border-border bg-bg-subtle text-fg text-sm font-medium",
              "transition-colors duration-150 hover:border-border-strong active:scale-[0.98]",
            )}
            aria-label="Reset view and speed"
          >
            <RotateCcw className="size-4" strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <ToggleChip
            active={showTrails}
            onClick={() => setShowTrails(!showTrails)}
            label="Trails"
            icon={<Orbit className="size-3.5" strokeWidth={2} aria-hidden />}
          />
          <ToggleChip
            active={showLabels}
            onClick={() => setShowLabels(!showLabels)}
            label="Labels"
            icon={
              showLabels ? (
                <Eye className="size-3.5" strokeWidth={2} aria-hidden />
              ) : (
                <EyeOff className="size-3.5" strokeWidth={2} aria-hidden />
              )
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:gap-2">
        <div className="flex items-center justify-between gap-2">
          <label
            htmlFor="sim-speed"
            className="flex items-center gap-1.5 text-xs font-medium text-fg-muted"
          >
            <Gauge className="size-3.5" strokeWidth={2} aria-hidden />
            Speed
          </label>
          <span className="font-mono text-xs tabular-nums text-fg">
            {formatSpeed(speed)}×
          </span>
        </div>
        <input
          id="sim-speed"
          type="range"
          min={0.05}
          max={12}
          step={0.05}
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className={cn(
            "h-2 w-full cursor-pointer appearance-none rounded-full",
            "bg-bg-subtle accent-accent",
          )}
          style={{
            background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${fillPct}%, var(--color-bg-subtle) ${fillPct}%, var(--color-bg-subtle) 100%)`,
          }}
          aria-valuemin={0.05}
          aria-valuemax={12}
          aria-valuenow={speed}
          aria-valuetext={`${formatSpeed(speed)} times normal speed`}
        />
        <div className="flex justify-between text-[10px] text-fg-subtle">
          <span>Slow</span>
          <button
            type="button"
            className="text-fg-muted underline-offset-2 hover:text-fg hover:underline"
            onClick={() => setSpeed(1)}
          >
            1×
          </button>
          <span>Fast</span>
        </div>
      </div>
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
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium",
        "transition-colors duration-150 active:scale-[0.98]",
        active
          ? "border-accent-dim bg-bg-subtle text-accent"
          : "border-border bg-transparent text-fg-muted hover:text-fg",
      )}
    >
      {icon}
      <span className="sm:inline">{label}</span>
    </button>
  );
}

function formatSpeed(speed: number): string {
  if (speed < 0.1) return speed.toFixed(2);
  if (speed < 10) return speed.toFixed(1);
  return String(Math.round(speed));
}
