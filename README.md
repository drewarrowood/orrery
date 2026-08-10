# Orbital — static browser orrery

**Center any body · epicycles · Holst planet radio · surface runs**

Pure **static** web app — no backend, no install. Same deploy model as
[live-and-let-live](https://github.com/drewarrowood/live-and-let-live): open in a
browser or host on **GitHub Pages**.

**Live (GitHub Pages):** https://drewarrowood.github.io/orrery/

## One-click deploy (GitHub Pages)

1. Push this repo to GitHub (already at [drewarrowood/orrery](https://github.com/drewarrowood/orrery)).
2. **Settings → Pages → Source: GitHub Actions** (the workflow in `.github/workflows/pages.yml` builds and publishes on every push to `main`).
3. Or publish the prebuilt folder: **Settings → Pages → Deploy from branch `main` / folder `/docs`**.

No server process. Videos and audio are ordinary static files under `assets/`.

## Local

```bash
npm install
npm run dev        # http://localhost:8080
npm run build      # → dist/
npm run preview    # serve production build on :8080
npm run deploy:pages  # build + copy to docs/ for branch Pages
```

Or open the built `docs/index.html` after `npm run deploy:pages` via any static host.

## Features

| Feature | How |
| --- | --- |
| Center frame | Dropdown or **Center + epicycles** on a body |
| Epicycles | Relative trails — speed up to see retrograde from Earth |
| Planet radio | Holst *The Planets* (public domain) |
| Surface runs | Mars, Earth/Moon, Venus, Jupiter short films |
| Camera | Drag orbit · scroll zoom · click focus |

## Media (static paths)

```
public/assets/audio/          →  Holst MP3s + playlist.json
public/assets/video/surfaces/ →  H.264 surface runs (faststart)
```

All URLs are **relative** (`./assets/...`) so they work on GitHub Pages under
`/orrery/` and on any static host.

## License

MIT (code). Audio: public-domain Holst pack — see `assets/audio/COPYING.txt`.
