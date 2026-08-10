import { X } from "lucide-react";
import { getBody, BODIES } from "@/lib/planets";
import { useSimStore } from "@/store/sim-store";
import { cn } from "@/lib/utils";

export function InfoPanel() {
  const selectedId = useSimStore((s) => s.selectedId);
  const selectBody = useSimStore((s) => s.selectBody);
  const clearSelection = useSimStore((s) => s.clearSelection);
  const body = selectedId ? getBody(selectedId) : null;

  if (!body) {
    return (
      <div
        className={cn(
          "ss-panel pointer-events-auto w-full max-w-sm p-2.5 sm:p-4",
        )}
      >
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
              Catalog
            </p>
            <h2 className="text-sm font-semibold tracking-tight text-fg sm:text-base">
              Select a body
            </h2>
          </div>
          <p className="hidden text-[11px] text-fg-muted sm:block">
            Click a planet · drag to orbit · scroll to zoom
          </p>
        </div>
        <ul className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 sm:mt-3 sm:grid sm:grid-cols-3 sm:overflow-visible">
          {BODIES.map((b) => (
            <li key={b.id} className="shrink-0 sm:shrink">
              <button
                type="button"
                onClick={() => selectBody(b.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md border border-border",
                  "bg-bg-subtle px-2.5 py-2 text-left text-xs font-medium text-fg",
                  "transition-colors duration-150 hover:border-border-strong",
                  "active:scale-[0.98] sm:w-full",
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: b.color }}
                  aria-hidden
                />
                {b.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const f = body.facts;

  return (
    <div
      className={cn(
        "ss-panel pointer-events-auto w-full max-w-sm overflow-hidden",
      )}
      role="dialog"
      aria-label={`${body.name} information`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border px-3 py-2 sm:gap-3 sm:px-5 sm:py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full ring-2 ring-border sm:size-3"
              style={{ backgroundColor: body.color }}
              aria-hidden
            />
            <h2 className="truncate text-sm font-semibold tracking-tight text-fg sm:text-lg">
              {body.name}
            </h2>
            <span className="hidden truncate text-xs text-fg-muted sm:inline">
              · {f.type}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-fg-muted sm:hidden">{f.type}</p>
        </div>
        <button
          type="button"
          onClick={clearSelection}
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-md",
            "border border-border text-fg-muted transition-colors",
            "hover:border-border-strong hover:text-fg active:scale-[0.98]",
          )}
          aria-label="Close info panel"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div className="space-y-2 px-3 py-2 sm:space-y-4 sm:px-5 sm:py-4">
        <p className="hidden text-sm leading-relaxed text-fg-muted sm:block">
          {f.summary}
        </p>

        <dl className="grid grid-cols-3 gap-x-2 gap-y-2 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-3">
          <Fact label="Diameter" value={f.diameterKm} />
          <Fact label="Distance" value={f.distanceAu} />
          <Fact label="Orbit" value={f.orbitalPeriod} />
          <Fact label="Day" value={f.dayLength} className="hidden sm:block" />
          <Fact label="Moons" value={f.moons} />
          <Fact
            label="Temp"
            value={f.temperature}
            className="hidden sm:block"
          />
        </dl>
      </div>
    </div>
  );
}

function Fact({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
        {label}
      </dt>
      <dd className="mt-0.5 font-mono text-[11px] tabular-nums text-fg sm:text-xs">
        {value}
      </dd>
    </div>
  );
}
