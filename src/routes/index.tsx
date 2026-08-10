import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const SolarSystemApp = lazy(
  () => import("@/components/solar-system/SolarSystemApp"),
);

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [{ title: "Orbital — 3D Solar System" }],
  }),
});

function HomePage() {
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
