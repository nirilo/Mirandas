# Miranda static site

This folder contains a static, responsive recreation of the Miranda atelier site plus the AI Fabric Condition Rater (no build tools).

## Files
- `index.html` — main site (hero, about, before/after gallery, projects, contact form).
- `styles.css` — shared theme, layout, stickers, responsive rules.
- `main.js` — gallery switching, contact form feedback, EN/EL language toggle.
- `condition.html` — AI Fabric Condition Rater wizard.
- `condition.css` — wizard/progress/results styling.
- `condition.js` — in-browser compression, previews, wizard flow, API call to `/api/evaluate`.

## Assets
Images are included under `static/assets/images/` (WebP for smaller repo size).
Copy existing public assets into `static/assets/` to see images:
- Stickers: `front/public/stickers/*` → `static/assets/stickers/`
- Gallery images: `front/public/images/*` → `static/assets/images/`
- The condition page reuses these assets and fonts.

## Running (no npm)
- Open `index.html` directly or serve the `static/` folder with any simple server.
- Open `condition.html` for the AI Fabric Condition Rater flow.
- The condition wizard expects an API at `/api/evaluate` (see worker notes).

## Notes
- Language switcher (EN/EL) updates all text.
- Contact form is static; it shows confirmation and selected file names. Wire it to your backend/AI intake when ready.
- Background uses soft linen + stickers; keep assets in place for it to render.

## Worker backend (serverless, single file)
- File: `worker.js` (Cloudflare Worker–style, no dependencies).
- Endpoint: `POST /api/evaluate` expecting multipart/form-data:
  - `photo1`, `photo2`, `photo3` (images)
  - `itemType` ("clothing" | "curtain" | "other fabric")
- Response JSON:
```
{
  "stage": 1|2|3|4|5|null,
  "label": "string",
  "confidence": 0-1,
  "confidence_label": "low|medium|high",
  "issues_detected": ["string", ...],
  "repair_needed": true|false,
  "notes": "string"
}
```
- Logic: rejects non-fabric items, enforces payload limits, processes images in-memory only, discards after response.
- AI: calls a vision model with a rubric; if `AI_API_KEY` is missing, returns a mock response so the UI still works.

### Deploy / run (no npm steps)
1) Cloudflare Dashboard: create a Worker, paste `worker.js`, set env var `AI_API_KEY`, deploy.
2) Cloudflare CLI (if already installed): `wrangler dev worker.js --local` or `wrangler deploy worker.js`.
3) Map `/api/evaluate` to the Worker (route) so `condition.html` can POST to it.
