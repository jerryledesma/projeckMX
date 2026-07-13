# Traveling Seven: Mexico — setup guide

The site is a single self-contained `index.html`. Two one-time steps make La Boleta
fully automated: deploy the Apps Script backend, then host the site.

## 1. Deploy the La Boleta backend (~10 min, your Google account)

1. Go to [sheets.new](https://sheets.new) and create a blank spreadsheet.
   Name it something like `La Boleta — Traveling Seven`.
2. In the Sheet: **Extensions → Apps Script**.
3. Delete the placeholder code and paste in the contents of
   [`apps-script/Code.gs`](apps-script/Code.gs). Save (⌘S).
4. Click **Deploy → New deployment**. Click the gear next to "Select type" and
   choose **Web app**. Set:
   - Description: `la boleta`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, authorize when prompted (it only touches this one spreadsheet),
   and copy the **Web app URL** (ends in `/exec`).
6. Give that URL to Claude (or paste it yourself into `build/src.html`, line
   `var BOLETA_API = "";`, then run `python3 build/build.py`).

The `ideas` and `votes` tabs create themselves on first use. Open the Sheet any
time to watch the family's votes arrive as rows.

## 2. Host the site (free)

**GitHub Pages** — from `~/dev/projectmx`: create a repo, push, then in the repo's
Settings → Pages choose "Deploy from a branch" → `main` → `/ (root)`. The site
lands at `https://<you>.github.io/projectmx/`.

**Netlify** — drag the `projectmx` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
Instant URL, no repo needed.

Either way, votes cast on the artifact preview before hosting are queued on each
person's device and sync up the first time they open the hosted site.

## Editing the site

- Source of truth: `build/src.html` (fonts are injected from `build/fonts-inline.css`).
- Rebuild after any edit: `python3 build/build.py` → regenerates `index.html`.
- Never edit `index.html` directly; it gets overwritten.

## Notes

- **Weather**: the site calls Open-Meteo (free, no key) on every load; when the
  trip dates fall inside the 16-day forecast window (from ~July 26) the day cards
  switch from typical-August climate to the live forecast automatically.
- **Recommended itinerary**: the "Ver itinerario recomendado" toggle in Los Días
  currently shows Jerry's starter draft; once ballots close, that view gets rebuilt
  from the vote winners.
