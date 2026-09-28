import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getBody, YEAR_SECONDS } from "@/lib/planets";
import {
  drawnKeplerRatio,
  formatDegPerYear,
  formatRatio,
  formatYears,
  keplerRatio,
  orbitsCompleted,
  PLANET_BODIES,
  relativeLongitudeRatePerYear,
  sceneDistance,
  skySense,
  speedRelativeToEarth,
  synodicYears,
} from "@/lib/mechanics";
import { applyTeachStep, TEACH_STEPS } from "@/lib/teach-steps";
import { useSimStore } from "@/store/sim-store";
import { cn } from "@/lib/utils";

export function TeachOverlay() {
  const teachOpen = useSimStore((s) => s.teachOpen);
  const teachStep = useSimStore((s) => s.teachStep);
  const setTeachOpen = useSimStore((s) => s.setTeachOpen);
  const setTeachStep = useSimStore((s) => s.setTeachStep);
  const simSeconds = useSimStore((s) => s.simSeconds);

  useEffect(() => {
    if (!teachOpen) return;
    applyTeachStep(teachStep);
  }, [teachOpen, teachStep]);

  if (!teachOpen) return null;

  const step = TEACH_STEPS[teachStep] ?? TEACH_STEPS[0]!;
  const last = teachStep >= TEACH_STEPS.length - 1;
  const years = simSeconds / YEAR_SECONDS;

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(TEACH_STEPS.length - 1, next));
    setTeachStep(clamped);
  };

  return (
    <section
      className="ss-panel ss-scroll-y pointer-events-auto max-h-[min(42dvh,22rem)] w-full overflow-y-auto overscroll-contain p-3 sm:max-h-[min(48dvh,26rem)] sm:p-4 lg:max-w-md"
      aria-label="Teach the orbit"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-accent">
            {step.law}
            <span className="ml-2 font-mono normal-case tracking-normal text-fg-subtle">
              t = {formatYears(years)} yr
            </span>
          </p>
          <h2 className="mt-0.5 text-sm font-semibold tracking-tight text-fg sm:text-base">
            {step.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setTeachOpen(false)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg"
          aria-label="Close teach mode"
        >
          <X className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mt-2 space-y-1.5">
        {step.paragraphs.map((p) => (
          <p key={p} className="text-[13px] leading-snug text-fg-muted">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-2.5">
        <TeachReadout stepId={step.id} simSeconds={simSeconds} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(teachStep - 1)}
          disabled={teachStep === 0}
          className={cn(
            "inline-flex h-11 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium text-fg",
            "disabled:opacity-40",
          )}
        >
          <ChevronLeft className="size-4" strokeWidth={2} aria-hidden />
          Back
        </button>

        <div className="flex items-center" role="tablist" aria-label="Teach steps">
          {TEACH_STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === teachStep}
              aria-label={s.law}
              onClick={() => go(i)}
              className="inline-flex size-6 items-center justify-center"
            >
              <span
                className={cn(
                  "block size-1.5 rounded-full",
                  i === teachStep ? "bg-accent" : "bg-border-strong",
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            if (last) {
              setTeachOpen(false);
              return;
            }
            go(teachStep + 1);
          }}
          className="inline-flex h-11 items-center gap-1 rounded-md bg-fg px-3 text-sm font-medium text-bg-elevated"
        >
          {last ? "Done" : "Next"}
          {!last && <ChevronRight className="size-4" strokeWidth={2} aria-hidden />}
        </button>
      </div>
    </section>
  );
}

function TeachReadout({ stepId, simSeconds }: { stepId: string; simSeconds: number }) {
  if (stepId === "ellipses") return <EccentricityRow />;
  if (stepId === "periods") return <PeriodRow simSeconds={simSeconds} />;
  if (stepId === "areas") return <AreaReadout simSeconds={simSeconds} />;
  if (stepId === "newton") return <NewtonRow />;
  if (stepId === "origin") return <OriginReadout simSeconds={simSeconds} />;
  if (stepId === "epicycles" || stepId === "origins") {
    return <RelativeReadout simSeconds={simSeconds} allowOriginButtons={stepId === "origins"} />;
  }
  return null;
}

function EccentricityRow() {
  return (
    <div className="ss-scroll-x flex gap-1.5 overflow-x-auto pb-1">
      {PLANET_BODIES.map((b) => (
        <div key={b.id} className="shrink-0 rounded-md border border-border bg-bg-subtle px-2 py-1.5">
          <p className="text-xs font-medium text-fg">{b.name}</p>
          <p className="font-mono text-[11px] tabular-nums text-accent">e = {b.eccentricity.toFixed(3)}</p>
        </div>
      ))}
    </div>
  );
}

function PeriodRow({ simSeconds }: { simSeconds: number }) {
  const mercury = getBody("mercury");
  const neptune = getBody("neptune");
  return (
    <div className="space-y-2">
      <div className="ss-scroll-x flex gap-1.5 overflow-x-auto pb-1">
        {PLANET_BODIES.map((b) => {
          const real = keplerRatio(b.periodYears, b.semiMajorAu);
          const drawn = drawnKeplerRatio(b);
          return (
            <div key={b.id} className="w-[7.5rem] shrink-0 rounded-md border border-border bg-bg-subtle px-2 py-1.5">
              <p className="text-xs font-medium text-fg">{b.name}</p>
              <p className="font-mono text-[11px] tabular-nums text-accent">real {formatRatio(real)}</p>
              <p className="font-mono text-[11px] tabular-nums text-fg-muted">drawn {formatRatio(drawn)}</p>
              <p className="font-mono text-[10px] tabular-nums text-fg-subtle">
                {formatYears(b.periodYears)} yr · {formatYears(b.semiMajorAu)} AU
              </p>
            </div>
          );
        })}
      </div>
      {mercury && neptune && (
        <p className="font-mono text-[11px] tabular-nums text-fg">
          Laps — Mercury {orbitsCompleted(mercury, simSeconds).toFixed(2)} · Neptune{" "}
          {orbitsCompleted(neptune, simSeconds).toFixed(3)}
        </p>
      )}
    </div>
  );
}

function AreaReadout({ simSeconds }: { simSeconds: number }) {
  const earth = getBody("earth");
  if (!earth) return null;
  const delta = 0.08;
  const deg = delta * 360;
  const rad = delta * Math.PI * 2;
  const area = 0.5 * earth.semiMajorAu * earth.semiMajorAu * rad;
  const swept = (simSeconds / YEAR_SECONDS) * 360;
  return (
    <div className="rounded-md border border-border bg-bg-subtle px-2.5 py-2">
      <p className="font-mono text-[11px] tabular-nums text-fg">
        Each wedge = {delta.toFixed(2)} yr = {deg.toFixed(1)}°
      </p>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-fg-muted">
        Area ½ a² Δθ = {area.toFixed(3)} AU² · both wedges match
      </p>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-accent">
        Earth has swept {(swept % 360).toFixed(1)}° of this lap · ω = 360°/yr
      </p>
    </div>
  );
}

function NewtonRow() {
  return (
    <div className="ss-scroll-x flex gap-1.5 overflow-x-auto pb-1">
      {PLANET_BODIES.map((b) => {
        const v = speedRelativeToEarth(b.semiMajorAu);
        return (
          <div key={b.id} className="shrink-0 rounded-md border border-border bg-bg-subtle px-2 py-1.5">
            <p className="text-xs font-medium text-fg">{b.name}</p>
            <p className="font-mono text-[11px] tabular-nums text-accent">
              v/v⊕ {v == null ? "—" : v.toFixed(2)}
            </p>
            <p className="font-mono text-[10px] text-fg-subtle">1/√a</p>
          </div>
        );
      })}
    </div>
  );
}

function OriginReadout({ simSeconds }: { simSeconds: number }) {
  const sun = getBody("sun");
  const earth = getBody("earth");
  if (!sun || !earth) return null;
  const dist = sceneDistance(sun, earth, simSeconds);
  return (
    <div className="rounded-md border border-border bg-bg-subtle px-2.5 py-2 font-mono text-[11px] tabular-nums">
      <p className="text-fg">
        |r_Sun − r_Earth| = {dist.toFixed(2)} scene units
      </p>
      <p className="mt-0.5 text-fg-muted">
        Earth's drawn radius = {earth.orbitRadius.toFixed(2)} · real a = {earth.semiMajorAu.toFixed(3)} AU
      </p>
      <p className="mt-0.5 text-accent">
        {Math.abs(dist - earth.orbitRadius) < 0.02 ? "Distance held constant" : "Distance drifted"}
      </p>
    </div>
  );
}

function RelativeReadout({
  simSeconds,
  allowOriginButtons,
}: {
  simSeconds: number;
  allowOriginButtons: boolean;
}) {
  const frameMode = useSimStore((s) => s.frameMode);
  const centerId = useSimStore((s) => s.centerId);
  const focusNonce = useSimStore((s) => s.focusNonce);

  const center =
    frameMode === "centered" && centerId ? getBody(centerId) : getBody("sun");
  const originName = frameMode === "heliocentric" || !centerId ? "Sun" : (center?.name ?? "Sun");

  const targets = PLANET_BODIES.filter((b) => b.id !== center?.id);

  const setOrigin = (id: string) => {
    const api = useSimStore.getState();
    if (id === "sun") {
      useSimStore.setState({
        frameMode: "heliocentric",
        centerId: null,
        selectedId: "sun",
        showEpicycles: true,
        showTrails: true,
        focusNonce: api.focusNonce + 1,
      });
      return;
    }
    useSimStore.setState({
      frameMode: "centered",
      centerId: id,
      selectedId: id,
      showEpicycles: true,
      showTrails: true,
      focusNonce: api.focusNonce + 1,
    });
  };

  return (
    <div className="space-y-2">
      {allowOriginButtons && (
        <div className="flex gap-1.5">
          {["sun", "earth", "jupiter"].map((id) => {
            const body = getBody(id);
            const active =
              id === "sun" ? frameMode === "heliocentric" : centerId === id && frameMode === "centered";
            return (
              <button
                key={id}
                type="button"
                onClick={() => setOrigin(id)}
                className={cn(
                  "h-10 flex-1 rounded-md border text-xs font-medium",
                  active
                    ? "border-accent-dim bg-bg-subtle text-accent"
                    : "border-border bg-bg-subtle text-fg",
                )}
              >
                {body?.name ?? id}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[11px] text-fg-subtle">
        Origin: {originName}
        {center && center.kind === "planet" ? "" : frameMode === "heliocentric" ? " · circles, no moving origin" : ""}
      </p>
      <div className="ss-scroll-x flex gap-1.5 overflow-x-auto pb-1">
        {frameMode === "centered" && center && center.periodYears > 0
          ? targets.map((b) => {
              const rate = relativeLongitudeRatePerYear(b, center, simSeconds);
              const sense = skySense(rate);
              const syn = synodicYears(center.periodYears, b.periodYears);
              return (
                <div
                  key={`${b.id}-${focusNonce}`}
                  className="w-[8.25rem] shrink-0 rounded-md border border-border bg-bg-subtle px-2 py-1.5"
                >
                  <p className="text-xs font-medium text-fg">{b.name}</p>
                  <p
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      sense === "retrograde" ? "text-sun" : "text-accent",
                    )}
                  >
                    {sense} {formatDegPerYear(rate)}
                  </p>
                  <p className="font-mono text-[10px] tabular-nums text-fg-subtle">
                    synodic {syn == null ? "—" : `${formatYears(syn)} yr`}
                  </p>
                </div>
              );
            })
          : (
            <p className="text-[12px] leading-snug text-fg-muted">
              Heliocentric: each trail is a circle about the force center. Relative longitude rate is just 360°/P.
            </p>
          )}
      </div>
    </div>
  );
}
