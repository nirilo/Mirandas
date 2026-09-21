# Phone reveal: two-stage release

This is a manual release checklist, not an automated deployment. No deployment or production secret change was performed during implementation.

Keep Cloudflare Pages **miranda-52w**, production branch **master**, output **static**, and the separate API Worker **mirandas** on the existing `/api/*` routes. Do not change DNS, routes, custom domains, redirects, build settings or the gitignored production `wrangler.toml`. Never copy `wrangler.toml.example` over that file. No static-assets binding is used.

**Do not push the frontend changes to master before Stage A passes.** A push can trigger Pages automatically even if the commit also contains Worker changes; Pages does not deploy the separate Worker. Stage A can be deployed from this reviewed local checkout without pushing it.

## Stage A — Worker only

Deployment input: **worker.js**, using the **existing gitignored wrangler.toml** and its existing production bindings/secrets. Files in `static/` are not inputs to this Worker deployment. Tests and documentation are not deployed.

1. From the repository root, run `node scripts/check-worker.mjs` and `node --check worker.js`. Verify that you are using the existing production account/configuration and Worker name `mirandas`. Keep all existing KV/R2 bindings, AI/Turnstile secrets, admin credentials and routes.
2. When the owner authorizes release, deploy only the Worker using the installed Wrangler CLI:

   ```powershell
   wrangler deploy --config wrangler.toml --name mirandas --keep-vars
   ```

   `--keep-vars` preserves existing dashboard-managed plain variables. Existing secrets remain on the Worker. The new endpoint returns a controlled 503 until configured; the existing live frontend does not call it. Existing evaluate/contact/admin handlers remain unchanged.

3. Configure the one new **private Worker secret**, `PHONE_NUMBER`, through Wrangler's interactive secret prompt:

   ```powershell
   wrangler secret put PHONE_NUMBER --config wrangler.toml --name mirandas
   ```

   Enter the owner-confirmed business number privately at the prompt, in international format with a leading `+` and country code. Spaces, parentheses, periods and hyphens are accepted for display. Do not put the value on the command line, in a script, `[vars]`, a Pages variable, a screenshot or public documentation. Do not use terminal recording/transcription while entering it. This command creates/deploys a new Worker version with the secret; perform it only as part of the authorized Stage A release. It does not publish Pages.

4. Verify both existing public hosts without printing the response body:

   ```powershell
   node scripts/check-phone-live.mjs https://mirandas.gr
   node scripts/check-phone-live.mjs https://www.mirandas.gr
   ```

   Both must report PASS: HTTP 200, valid phone JSON, `Cache-Control: no-store` and trusted-origin behavior. The script withholds the number. Before configuring the secret, the optional `--expect-unavailable` flag checks the controlled 503 instead; this does **not** authorize Stage B. Do not remove a configured production secret just to test this case; automated Worker/browser checks already mock it.

5. On the still-current live frontend, send an owner-approved contact test, complete the real Turnstile challenge, and verify the enquiry through the existing authenticated retrieval workflow. Repeat with a small permitted photo and verify its stored attachment. Do not paste admin tokens into shared output. Perform one real Condition Rater evaluation to confirm Turnstile/AI and existing bindings still work. Local tests mock these services and cannot establish production credentials or storage health.
6. Stop if any verification fails. Keep the current Pages frontend live while fixing Stage A. Confirm the secret's actual value privately with the owner; the verification script checks format, not ownership or call routing.

Cloudflare reference: [Worker secrets and Wrangler secret deployment behavior](https://developers.cloudflare.com/workers/configuration/secrets/).

## Stage B — Pages only, after Stage A passes

Deployment input: the complete **static/** directory, published by the existing Git integration for **miranda-52w** from **master**. In this change the modified Pages files are `index.html`, the three existing service-guide HTML files, `garment-stories.html`, `condition.html`, `404.html`, `main.js` and `styles.css`. Existing assets, `_redirects`, sitemap, robots and all unchanged files remain part of that directory. No Worker code or private secret belongs in Pages output.

1. Run the validation commands in README, including the Pages/browser checks against a local Pages preview. Review the final diff and owner-edited text.
2. Only after Stage A has passed, authorize the normal reviewed commit/merge/push to **master** through the existing repository workflow. That existing integration publishes `static/`; do not add a build/deployment integration or change dashboard settings. No commit or push was performed for this task.
3. Verify `/`, `/epidiorthosi-tzin`, `/metapoiiseis-rouxon`, `/metapoiiseis-nyfikou`, `/garment-stories` and `/condition` on desktop and mobile, in both languages. Confirm the homepage/service reveal button makes **no request before clicking**, produces a callable link after clicking, and gives a useful retry message if unavailable. Check English/Greek switching while the request is pending and after success.
4. Check the map is absent from network requests until its button is used, stays compact, and the original full Google Maps link works independently. Privately confirm Google's address resolution/pin matches the atelier; no coordinates were supplied or invented.
5. Repeat a contact submission and Condition Rater check, and verify canonical/redirect/sitemap behavior. Run both phone verification commands again.

If Pages fails, use the existing Pages rollback workflow for that release while leaving the backward-compatible Stage A Worker in place. Do not roll the Worker back to a version without `/api/phone` while the new frontend is live. A rollback to older Pages content can re-expose the older static phone markup; treat that as a temporary operational rollback, not a privacy fix.

## Behavior and limitations

- `GET /api/phone` returns only `{ ok, phone }` on success. Missing/invalid configuration produces 503 with a generic error. Other methods return 405; OPTIONS uses the existing origin convention. Untrusted supplied origins are rejected. Responses are not cacheable, and the handler never logs the number.
- Reveal controls request only after a click, disable during a pending request, time out after 10 seconds, and offer an accessible translated error/retry. The revealed number remains only in the current DOM; it is not stored in local/session storage. Static HTML/JS/JSON-LD contain no business phone value. Footer numbers are removed.
- This reduces basic static scraping. A public endpoint can still be called by automated clients, including clients that omit/spoof Origin. It is not authentication or a guarantee of secrecy. Old Git history, previous deployments and third-party caches may retain earlier public copies; this task does not rewrite history or claim to remove those copies.
- No new paid API, CAPTCHA, library, tracking/fingerprinting system or infrastructure is required. `PHONE_NUMBER` is the only new required secret. Existing `AI_API_KEY`, `TURNSTILE_SECRET`, `ADMIN_TOKEN` and storage/rate-limit bindings keep their current roles.
- Owner review remains necessary for the existing `denim_after.webp` “T-Bud Co. Creative” watermark, reuse permission and whether the images represent Miranda’s work. Photographs and sizing are preserved.
