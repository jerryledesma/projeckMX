# Traveling Seven: Mexico — setup guide

The site is a single self-contained `index.html`. Two one-time steps make La Boleta
fully automated: deploy the Apps Script backend, then host the site.

## 1. La Boleta backend — ✅ DONE (deployed 2026-07-13)

The Apps Script web app is deployed from Jerry's Google account and its `/exec`
URL is wired into `build/src.html` (`BOLETA_API`). The `ideas` and `votes` tabs
create themselves on first use. Open the Sheet any time to watch the family's
votes arrive as rows.

**To redeploy after editing Code.gs**: in the Apps Script editor use
Deploy → Manage deployments → edit (pencil) → Version: New version → Deploy.
The URL stays the same, so no site change is needed. (A brand-new deployment
mints a different URL — then update `BOLETA_API` in `build/src.html`, run
`python3 build/build.py`, commit and push.)

<details><summary>Original setup steps (for reference)</summary>

1. Go to [sheets.new](https://sheets.new) and create a blank spreadsheet.
2. In the Sheet: **Extensions → Apps Script**; paste in
   [`apps-script/Code.gs`](apps-script/Code.gs). Save.
3. **Deploy → New deployment → Web app**: Execute as **Me**, access **Anyone**.
4. Authorize, copy the **Web app URL** (ends in `/exec`), paste into
   `BOLETA_API` in `build/src.html`, rebuild.

</details>

## 2. Host the site — Netlify

Code lives at https://github.com/jerryledesma/projeckMX. In Netlify choose
**Import from Git**, pick the `projeckMX` repo, leave the build command empty,
and set the publish directory to `/` (root) — `index.html` is committed
pre-built. Every push then redeploys automatically.

Note: votes cast on the old claude.ai artifact preview stay on that page (its
sandbox can't reach Google, and browser storage doesn't cross sites). Once the
Netlify link goes out, everyone should vote there.

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
