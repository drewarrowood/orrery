# Orbital — static browser orrery

Same deploy model as [live-and-let-live](https://github.com/drewarrowood/live-and-let-live):  
**plain files on `main` — no server.**

**Live (after Pages is on):** https://drewarrowood.github.io/orrery/

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
