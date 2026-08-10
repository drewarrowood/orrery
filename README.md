# Orbital — interactive orrery

**Center on any body · cycles & epicycles · Holst planet radio · surface runs**

An enhanced version of [drewarrowood/orrery](https://github.com/drewarrowood/orrery) — same 3D solar system explorer, plus a body-centered reference frame, relative epicycle trails (classic retrograde loops when centered on Earth), a public-domain **Planet Radio** (Holst *The Planets*), and short **surface run** films.

Deployed like [live-and-let-live](https://github.com/drewarrowood/live-and-let-live): open in the browser, no install.

## Features

- **Center frame** — put the Sun or any planet at the origin; the rest of the system moves relative to it
- **Epicycles** — paint relative paths of other bodies; speed up time to watch outer-planet retrograde loops from Earth
- **Planet radio** — Holst *The Planets* (public-domain composition + recording). Auto-cues Mars/Venus/Mercury/Jupiter/Uranus when you select that body
- **Surface runs** — short cinematic skims for Mars, Earth (+ Moon), Venus, Jupiter
- Orbit trails, labels, pause / speed, click-to-focus camera
- Mobile-friendly overlays

## Controls

| Action | How |
| --- | --- |
| Orbit camera | Drag |
| Zoom | Scroll / pinch |
| Focus | Click a body or catalog chip |
| **Center + epicycles** | Info panel button, or **Center frame** dropdown |
| Toggle epicycles | Epicycles chip in the control bar |
| Surface run | **Surface run** on a body that has a clip |
| Radio | Top-right **Planet radio** (expand, play, shuffle) |
| Pause | Pause button or `Space` |
| Clear / heliocentric | Reset or `Esc` |

## Stack

- React 19 + TypeScript + Vite + TanStack Start
- Three.js via React Three Fiber + Drei
- Tailwind CSS v4 + Zustand

## Quick start

```bash
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

## Public domain audio

`public/assets/audio/` — Gustav Holst, *The Planets*, Op. 32 (1914–16). Composition is public domain in the US; this recording is the public-domain pack from [OpenGameArt](https://opengameart.org/content/holst-the-planets-suite). See `playlist.json` and `COPYING.txt`.

## License

MIT (code). Audio and media retain their own public-domain / source notices.
