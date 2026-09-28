# Orbital — static browser orrery

Same deploy model as [live-and-let-live](https://github.com/drewarrowood/live-and-let-live):  
**plain files on `main` — no server.**

**Live (after Pages is on):** https://drewarrowood.github.io/orrery/

## What the picture is teaching

Orbits are circles (the zero-eccentricity limit of Kepler's ellipse) with real sidereal periods. Drawn distances are compressed so Neptune fits; the law checks use AU, not those inches.

**Teach** walks the relations with numbers computed in the page:

- Kepler's first law, and the real eccentricities the circles leave out
- Kepler's third law: P²/a³ from the periods and the real semi-major axes, next to the same ratio on the squeezed drawing
- Kepler's second law: equal-time wedges on Earth's circle stay equal angles
- Newton: v = √(GM/a) is why P² = a³, shown as v/v⊕ = 1/√a
- Centering a body subtracts its heliocentric position. Distance Sun–Earth stays the drawn radius
- Epicycles are that subtraction. A negative longitude rate is retrograde; the synodic period is 1/|1/P₁ − 1/P₂|
- Sun, Earth, and Jupiter as origins: the loops change, the force does not

Center any body, Holst planet radio, and surface runs stay where they were.

## On a phone

Drag turns the sky, pinch zooms, tap a body. Controls are a two-row dock with 44px targets. The radio and the lesson open on demand so they don't cover the system. Safe areas are padded; the page itself does not scroll sideways.

## Turn on public hosting (one time)

`live-and-let-live` is already set to: **branch `main` · folder `/`**.  
Do the same for this repo.

### Exact path in GitHub

1. Sign in as **drewarrowood**
2. Open: https://github.com/drewarrowood/orrery
3. Click the **Settings** tab (repo menu bar — not your profile settings)
4. Left sidebar, under **Code and automation**, click **Pages**
   - Direct link: https://github.com/drewarrowood/orrery/settings/pages
5. **Build and deployment**
   - **Source:** Deploy from a branch  
   - **Branch:** `main`  
   - **Folder:** `/ (root)`  
   - Click **Save**
6. Wait ~1 minute. Visit: https://drewarrowood.github.io/orrery/

If the left sidebar has no **Pages** item:
- Confirm you’re on **this repo’s** Settings (URL contains `/orrery/settings`), not account settings
- Confirm you’re logged in as **drewarrowood** (owner)
- On mobile: use desktop site / wider window — Pages is easy to miss in the hamburger menu

## Local

```bash
npm install && npm run dev     # develop
npm run build                  # → dist/
# publish static root:
npm run deploy:pages           # rebuilds docs/, then copy dist → root assets if you prefer
```

Or open `index.html` via any static host — videos/audio live under `assets/`.
