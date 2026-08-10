import { lazy, Suspense } from "react";

const SolarSystemApp = lazy(
  () => import("./components/solar-system/SolarSystemApp"),
);

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh w-full items-center justify-center bg-bg">
          <p className="text-sm text-fg-muted">Loading solar system…</p>
        </div>
      }
    >
      <SolarSystemApp />
    </Suspense>
  );
}
