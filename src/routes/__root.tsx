import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "@/styles.css?url";

const APP_NAME = "Orbital";
const APP_DESCRIPTION =
  "Explore a 3D solar system with orbiting planets, adjustable speed, trails, and click-to-focus camera.";

export const Route = createRootRoute({
  head: () => {
    const host =
      typeof process !== "undefined"
        ? process.env.VITE_PUBLIC_HOSTNAME
        : undefined;
    const ogImage = host ? `https://${host}/og.jpg` : undefined;

    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
        },
        { title: `${APP_NAME} — 3D Solar System` },
        { name: "description", content: APP_DESCRIPTION },
        { name: "theme-color", content: "#050508" },
        { property: "og:title", content: `${APP_NAME} — 3D Solar System` },
        { property: "og:description", content: APP_DESCRIPTION },
        { property: "og:type", content: "website" },
        ...(ogImage
          ? [
              { property: "og:image", content: ogImage },
              { property: "og:image:width", content: "1200" },
              { property: "og:image:height", content: "630" },
              { name: "twitter:card", content: "summary_large_image" },
              { name: "twitter:image", content: ogImage },
            ]
          : [{ name: "twitter:card", content: "summary" }]),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      ],
    };
  },
  errorComponent: AppErrorComponent,
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-bg text-fg antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
