# Orbital — static browser orrery

**Center any body · epicycles · Holst planet radio · surface runs**

Pure **static** web app — **no backend, no install, no server process**. Same model as
[live-and-let-live](https://github.com/drewarrowood/live-and-let-live).

**Live:** [drewarrowood.github.io/orrery](https://drewarrowood.github.io/orrery/)  
**Repo:** [github.com/drewarrowood/orrery](https://github.com/drewarrowood/orrery)

## One-click deploy (GitHub Pages)

### Option A — Actions (recommended)

1. Open repo **Settings → Pages**
2. **Build and deployment → Source: GitHub Actions**
3. Push to `main` (workflow `.github/workflows/pages.yml` builds & publishes)

### Option B — prebuilt `/docs` folder (no build on GitHub)

1. **Settings → Pages → Source: Deploy from a branch**
2. Branch: `main` · Folder: `/docs` · Save

The `docs/` folder is a complete static site (HTML + JS + audio + videos). Open
`docs/index.html` locally or host it anywhere.

## Local

```bash
npm install
npm run dev          # http://localhost:8080
npm run build        # → dist/
npm run preview      # production static on :8080
npm run deploy:pages # build + copy → docs/
```

## Why videos work now

| Before (SSR / Vercel server) | Now (static Pages) |
| --- | --- |
| Server framework + large media | Plain files under `assets/` |
| Absolute `/assets/...` paths break under `/orrery/` | Relative `./assets/...` |
| Heavy unoptimized MP4s | Small H.264 + `faststart` |

## Features

| Feature | How |
| --- | --- |
| Center frame | Dropdown or **Center + epicycles** |
| Epicycles | Relative trails — speed up from Earth for retrograde |
| Planet radio | Holst *The Planets* (public domain) |
| Surface runs | Mars, Earth/Moon, Venus, Jupiter |
| Camera | Drag · zoom · click focus |

## License

MIT (code). Audio: public-domain Holst — see `assets/audio/COPYING.txt`.
