// Local Pages preview + existing Playwright/Chrome. No real API submissions.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const origin = 'http://127.0.0.1:8787';
const guides = ['/garment-stories/epidiorthosi-tzin', '/garment-stories/metapoiiseis-rouxon', '/garment-stories/metapoiiseis-nyfikou'];
const fixturePhone = '+1 202 555 0100'; // Synthetic; never the production number.
const routes = ['/', '/garment-stories', '/garment-stories-ai-old-clothes', '/condition', ...guides, '/missing'];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    let phoneRequests = 0, mode = 'success', release;
    const errors = [];
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/api/phone' && url.origin === origin) {
        phoneRequests++;
        if (mode === 'network') return route.abort();
        if (mode === 'pending') await new Promise(resolve => {
          const timer = setTimeout(resolve, 5000); // Also release if an assertion fails.
          release = () => { clearTimeout(timer); resolve(); };
        });
        return route.fulfill({ status: mode === 'missing' ? 503 : 200, contentType: 'application/json', body: JSON.stringify(mode === 'missing'
          ? { ok: false, error: 'Phone temporarily unavailable' } : mode === 'invalid'
          ? { ok: true, phone: '<img src=x>' } : { ok: true, phone: fixturePhone }) });
      }
      if (url.origin === origin) return route.continue();
      return route.fulfill({ contentType: 'text/plain', body: '' });
    });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    let navReference;
    for (const width of [320, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(origin + route);
        // Exercise native lazy loading before checking ratios or taking full-page screenshots.
        for (const img of await page.locator('img[loading="lazy"]').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(el => el.decode());
        }
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        const nav = await page.locator('.links a').evaluateAll(links => links.map(a => [a.id, new URL(a.href).pathname + new URL(a.href).hash]));
        navReference ||= nav;
        assert.deepEqual(nav, navReference, `Navigation structure: ${route}`);
        assert.equal(await page.locator('#lang-toggle').count(), 1);
        assert.equal(await page.locator('#mobile-lang-toggle').count(), 1);
        for (const lang of ['el', 'en']) {
          if (await page.locator('html').getAttribute('lang') !== lang) {
            if (width < 768) {
              await page.locator('#menu-toggle').click();
              await page.locator('#mobile-lang-toggle').click();
              assert.equal(await page.locator('#menu-toggle').getAttribute('aria-expanded'), 'false');
            } else await page.locator('#lang-toggle').click();
          }
          assert.equal(await page.locator('html').getAttribute('lang'), lang);
          assert.equal(new URL(page.url()).pathname, route, 'Language change must keep the current URL');
          assert.equal(await page.evaluate(() => localStorage.getItem('miranda-lang')), lang);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${route}/${width}/${lang} overflow`);
          assert.equal(await page.locator('#nav-home').innerText(), lang === 'en' ? 'Home' : 'Αρχική');
          assert.equal((await page.locator(`#nav-stories [data-lang="${lang}"]`).textContent()).trim(), lang === 'en' ? 'Garment Stories' : 'Μικρό περιοδικό');
          const blue = await page.locator('main a').evaluateAll(links => links.filter(a => a.getClientRects().length && ['rgb(0, 0, 238)', 'rgb(85, 26, 139)'].includes(getComputedStyle(a).color)).map(a => a.getAttribute('href')));
          assert.deepEqual(blue, [], `${route}: unstyled content links`);
          if (guides.includes(route)) {
            assert.deepEqual(await page.locator('.links a[aria-current]').evaluateAll(links => links.map(a => a.id)), ['nav-stories']);
            assert.deepEqual(await page.locator('#mobile-menu a[aria-current]').evaluateAll(links => links.map(a => a.id)), ['mobile-nav-stories']);
            const back = page.locator('.guide-back');
            assert.equal(await back.getAttribute('href'), 'https://mirandas.gr/garment-stories');
            assert.equal(await back.innerText(), lang === 'en' ? 'Back to Garment Stories' : 'Πίσω στο Μικρό περιοδικό');
            assert.equal(await back.evaluate(el => el.getBoundingClientRect().top < document.querySelector('h1').getBoundingClientRect().top), true);
            const visible = await page.locator('article').innerText();
            assert.match(visible, lang === 'en' ? /Send photos for an assessment/ : /Στείλτε φωτογραφίες για εκτίμηση/);
            if (lang === 'en') assert.doesNotMatch(visible, /[Α-ω]/);
            assert.equal(await page.locator('article img').evaluateAll(imgs => imgs.every(img => {
              const box = img.getBoundingClientRect();
              return img.complete && img.naturalWidth > 0 && Math.abs(box.width / box.height - img.naturalWidth / img.naturalHeight) < .01;
            })), true, `Loaded guide images keep their ratio: ${route}/${width}/${lang}`);
          }
          for (const pill of await page.locator('.guide-pills .guide-link, .guide-back').all()) {
            assert.equal(await pill.evaluate(el => {
              const box = el.getBoundingClientRect(), style = getComputedStyle(el);
              return box.height >= 44 && box.width <= innerWidth && el.scrollWidth <= el.clientWidth + 1 &&
                style.fontWeight === '400' && style.boxShadow === 'none';
            }), true, `Compact, readable touch target: ${route}/${width}/${lang}`);
            await pill.focus();
            await page.keyboard.press('Shift');
            assert.equal(await pill.evaluate(el => el.matches(':focus-visible') && getComputedStyle(el).outlineWidth === '2px'), true);
          }
          if (process.env.REVIEW_DIR && [390,1280].includes(width)) {
            fs.mkdirSync(process.env.REVIEW_DIR, { recursive: true });
            await page.screenshot({ path: path.join(process.env.REVIEW_DIR, `${route === '/' ? 'home' : route.slice(1).replaceAll('/', '-')}-${width}-${lang}.png`), fullPage: true, animations: 'disabled' });
          }
          if (guides.includes(route)) {
            await page.locator('.guide-back').click();
            await page.waitForURL('https://mirandas.gr/garment-stories');
            await page.goto(origin + route);
            // The back-link check reloads the guide; load its lazy images again for the next language.
            for (const img of await page.locator('img[loading="lazy"]').all()) {
              await img.scrollIntoViewIfNeeded();
              await img.evaluate(el => el.decode());
            }
            await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          }
        }
      }
    }
    console.log('PASS: navigation, both languages, layout and image checks. Testing contact interactions.');
    assert.equal(phoneRequests, 0, 'No automatic phone request on any page/language');
    for (const width of [390,1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ['/', ...guides]) {
        await page.goto(origin + route);
        const button = page.locator('[data-phone-reveal]');
        assert.equal(await page.locator('a[href^="tel:"]').count(), 0);
        const before = phoneRequests;
        release = null;
        mode = 'pending';
        await button.click();
        await page.waitForFunction(() => document.querySelector('[data-phone-reveal]').disabled);
        for (let i = 0; !release && i < 100; i++) await page.waitForTimeout(10);
        assert.ok(release, 'Reveal request must reach the endpoint');
        await button.evaluate(el => { el.click(); el.click(); });
        assert.equal(phoneRequests, before + 1, 'Repeated clicks must share the pending request');
        const reading = await page.evaluateHandle(() => {
          const line = document.querySelector('.nav').offsetHeight + 16;
          return [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main figure')]
            .find(el => { const r = el.getBoundingClientRect(); return r.height && r.bottom > line && r.top < innerHeight; });
        });
        const y = await reading.evaluate(el => el.getBoundingClientRect().top);
        // Activate without scrolling to the nav, as a keyboard/user-state regression.
        await page.locator('#lang-toggle').evaluate(el => el.click());
        const position = await reading.evaluate(el => {
          const box = el.getBoundingClientRect();
          return { top: box.top, visible: box.bottom > 0 && box.top < innerHeight,
            atEnd: scrollY + innerHeight >= document.documentElement.scrollHeight - 2 };
        });
        assert.ok(Math.abs(position.top - y) < 100 || (position.atEnd && position.visible), `Language toggle must retain the reading block (allowing the end of a shorter page): ${route}/${width}, ${JSON.stringify({ y, ...position })}`);
        await reading.dispose();
        assert.equal(new URL(page.url()).pathname, route);
        const lang = await page.locator('html').getAttribute('lang');
        assert.equal(await page.locator('.phone-status').innerText(), lang === 'en' ? 'Loading phone number…' : 'Φόρτωση τηλεφώνου…');
        mode = 'success'; release();
        await page.waitForSelector('a[href^="tel:"]');
        assert.equal(await page.locator('a[href^="tel:"]').innerText(), fixturePhone);
        await page.locator('#lang-toggle').evaluate(el => el.click());
        assert.equal(await page.locator('a[href^="tel:"]').getAttribute('href'), 'tel:+12025550100');
        assert.equal(phoneRequests, before + 1);
      }
      for (const failure of ['missing', 'network', 'invalid']) {
        await page.goto(origin + '/');
        mode = failure;
        await page.locator('[data-phone-reveal]').click();
        await page.waitForSelector('.phone-reveal[data-state="error"]');
        assert.equal(await page.locator('[data-phone-reveal]').isEnabled(), true);
        assert.equal(await page.locator('a[href^="tel:"]').count(), 0);
        await page.locator('#lang-toggle').evaluate(el => el.click());
        assert.match(await page.locator('.phone-status').innerText(), /contact form|φόρμα επικοινωνίας/);
        mode = 'success';
        await page.locator('[data-phone-reveal]').click();
        await page.waitForSelector('a[href^="tel:"]');
      }
      await page.goto(origin + '/');
      const map = page.locator('#contact-map iframe');
      assert.equal(await map.count(), 1);
      assert.equal(await map.isVisible(), true);
      assert.equal(await page.locator('#map-toggle').count(), 0);
      assert.match(await map.getAttribute('src'), /^https:\/\/www\.google\.com\/maps\/embed\?pb=/);
      assert.equal(await map.getAttribute('loading'), 'lazy');
      assert.equal(await map.getAttribute('referrerpolicy'), 'strict-origin-when-cross-origin');
      assert.equal(await map.getAttribute('allowfullscreen'), '');
      assert.equal(await map.evaluate(el => {
        const box = el.getBoundingClientRect();
        return box.width <= 340 && Math.abs(box.width / box.height - 4 / 3) < .01;
      }), true);
      assert.equal(await page.locator('a[href="https://maps.app.goo.gl/izdkuL9PTM4MSUpm9"]').isVisible(), true);
      for (const lang of ['el', 'en']) {
        if (await page.locator('html').getAttribute('lang') !== lang) {
          await page.locator('#lang-toggle').evaluate(el => el.click());
        }
        assert.match(await map.getAttribute('title'), lang === 'en' ? /^Map: Miranda’s/ : /^Χάρτης: Miranda’s/);
      }
      if (process.env.REVIEW_DIR) {
        await page.locator('#contact').screenshot({ path: path.join(process.env.REVIEW_DIR, `contact-map-${width}.png`) });
      }
    }
    await page.goto(origin + '/');
    const spacing = await page.evaluate(() => document.querySelector('.service-links h3').getBoundingClientRect().top - document.querySelector('#projects .card-grid').getBoundingClientRect().bottom);
    assert.ok(spacing >= 40);
    assert.deepEqual(await page.locator('.guide-pills a').evaluateAll(links => links.map(a => new URL(a.href).pathname)), guides);
    await page.goto(origin + '/garment-stories');
    assert.deepEqual(await page.locator('.story-guides a').evaluateAll(links => links.map(a => new URL(a.href).pathname)), guides);
    await page.goto(origin + '/condition');
    assert.equal(await page.locator('.no-script-note').count(), 0, 'Fallback must not render with JS');
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    await noJS.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.fulfill({ body: '' }));
    const fallback = await noJS.newPage();
    await fallback.goto(origin + '/condition');
    assert.equal(await fallback.locator('.no-script-note').isVisible(), true);
    assert.equal(await fallback.locator('.no-script-note a').getAttribute('href'), '/#contact');
    for (const route of guides) {
      await fallback.goto(origin + route);
      assert.match(await fallback.locator('h1').innerText(), /Σεπόλια/);
      assert.equal(await fallback.locator('[data-phone-reveal]').isVisible(), false);
      assert.equal(await fallback.locator('#nav-stories').getAttribute('aria-current'), 'page');
      assert.equal(await fallback.locator('.guide-back').innerText(), 'Πίσω στο Μικρό περιοδικό');
    }
    await fallback.goto(origin + '/');
    assert.equal(await fallback.locator('#contact-map iframe').isVisible(), true);
    assert.match(await fallback.locator('#contact-map iframe').getAttribute('title'), /^Χάρτης: Miranda’s/);
    await noJS.close();
    assert.deepEqual(errors, []);
    console.log('PASS: 64 page/viewport/language cases, matching navigation, translations, no overflow/default-blue links, natural image ratios; phone success/missing-secret/network/invalid/retry/repeated-click/language tests on desktop and mobile; responsive lazy map/accessibility/directions, guide spacing/destinations, and JS/no-JS fallback. No page errors. External services mocked.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
