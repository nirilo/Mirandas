// Optional browser checks using an existing Playwright installation; no downloads.
// Set PLAYWRIGHT_MODULE to its module directory if it is not locally installed.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const origin = 'http://127.0.0.1:8787';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    await context.route('**/*', route => {
      const url = new URL(route.request().url());
      if (url.origin === origin) return route.continue();
      // Simulate the real widget's occupied space without contacting Turnstile.
      if (url.hostname === 'challenges.cloudflare.com') return route.fulfill({ contentType: 'text/javascript', body: `
        window.turnstile = { getResponse: () => 'test-token', reset: () => {} };
        function mockWidget() { document.querySelectorAll('.cf-turnstile').forEach(el => {
          const iframe = document.createElement('iframe');
          iframe.title = 'Mock security check'; iframe.style.border = '0';
          iframe.width = el.dataset.size === 'compact' ? '150' : '300';
          iframe.height = el.dataset.size === 'compact' ? '140' : '65';
          el.append(iframe);
          const token = document.createElement('input'); token.type='hidden';
          token.name='cf-turnstile-response'; token.value='test-token'; el.append(token);
        }); }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mockWidget); else mockWidget();
      ` });
      return route.fulfill({ body: '', contentType: 'text/plain' });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const routes = ['/', '/condition.html', '/garment-stories.html', '/garment-stories-ai-old-clothes.html', '/garment-stories/epidiorthosi-tzin.html', '/garment-stories/metapoiiseis-rouxon.html', '/garment-stories/metapoiiseis-nyfikou.html'];
    for (const width of [320, 360, 390, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        assert.equal((await page.goto(origin + route)).status(), 200);
        await page.waitForLoadState('load');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `Overflow: ${route} at ${width}`);
        assert.equal(await page.locator('#mobile-menu').evaluate(el => getComputedStyle(el).display), 'none');
        await page.locator('.skip-link').focus(); await page.keyboard.press('Enter');
        assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
        if (width === 360) {
          await page.locator('#menu-toggle').click();
          const first = page.locator('#mobile-menu a').first();
          assert.equal(await first.evaluate(el => el === document.activeElement), true);
          await page.keyboard.press('Shift+Tab');
          await page.keyboard.press('Tab');
          assert.equal(await first.evaluate(el => el === document.activeElement), true);
          await page.keyboard.press('Escape');
          assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
          if (await page.locator('#mobile-lang-toggle').count()) {
            await page.locator('#menu-toggle').click();
            await page.locator('#mobile-lang-toggle').click();
            assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
          }
        }
      }
    }
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(origin + '/');
    if (await page.locator('html').getAttribute('lang') !== 'el') await page.locator('#lang-toggle').click();
    await page.locator('#lang-toggle').click();
    assert.match(await page.locator('#contact-address').innerText(), /88 Avlonos/);
    await page.locator('#lang-toggle').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'el');
    await page.locator('#work').scrollIntoViewIfNeeded();
    await page.locator('#ba-next').click();
    await page.waitForFunction(() => document.querySelector('#after-img').src.endsWith('dress_after.webp'));
    for (const [route, type] of [['/robots.txt', 'text/plain'], ['/sitemap.xml', 'application/xml'], ['/styles.css', 'text/css'], ['/main.js', 'javascript']]) {
      const response = await page.request.get(origin + route);
      assert.equal(response.status(), 200); assert.ok(response.headers()['content-type'].includes(type));
      assert.equal(response.headers()['x-robots-tag'], undefined);
    }
    assert.equal((await page.request.get(origin + '/not-a-page.html')).status(), 404);
    for (const [from, to, status] of [['/index.html', '/', 308], ['/condition.html', '/condition', 308], ['/condition/', '/condition', 301], ['/index', '/', 301]]) {
      const response = await page.request.get(origin + from, { maxRedirects: 0 });
      assert.equal(response.status(), status); assert.equal(new URL(response.headers().location, origin).href, origin + to);
    }
    let contactAttempts = 0;
    let submission = '';
    await page.route('**/api/contact', route => {
      submission = route.request().postData(); contactAttempts++;
      return route.fulfill({ status: contactAttempts === 1 ? 400 : 200, contentType: 'application/json', body: JSON.stringify({ ok: contactAttempts > 1 }) });
    });
    await page.route('**/api/evaluate', route => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ score: 2, issues: ['Seam tear', '<img src=x onerror=alert(1)>'], repair_needed: true, confidence: .8 }) }));
    await page.goto(origin + '/condition.html');
    await page.evaluate(async () => {
      state.photos = [1, 2, 3].map(i => new File(['image'], `${i}.jpg`, { type: 'image/jpeg' }));
      state.current = 3; showStep(3); await evaluate();
    });
    assert.equal(await page.locator('#result-issues-list img').count(), 0);
    assert.equal(contactAttempts, 0, 'Evaluation must not submit an enquiry');
    await page.locator('#lang-toggle').click();
    const summary = await page.locator('#condition-summary').inputValue();
    assert.match(summary, /2\/5/); assert.match(summary, /Seam tear/); assert.match(summary, /Clothing/);
    await page.locator('#result-contact').click(); await page.waitForURL('**/#contact');
    assert.equal(await page.locator('textarea[name=details]').inputValue(), summary);
    assert.equal(contactAttempts, 0, 'Summary transfer must not submit');
    assert.equal(await page.evaluate(() => sessionStorage.getItem('miranda-condition-enquiry')), null);
    await page.locator('input[name=name]').fill('Test'); await page.locator('input[name=email]').fill('test@example.com');
    await page.locator('#form-submit').click();
    await page.waitForFunction(() => !document.querySelector('#form-submit').disabled);
    assert.equal(await page.locator('textarea[name=details]').inputValue(), summary);
    await page.locator('#form-submit').click();
    await page.waitForFunction(() => document.querySelector('textarea[name=details]').value === '');
    assert.match(submission, /2\/5/); assert.match(submission, /cf-turnstile-response/);
    // Normal contact without a transferred summary also remains usable.
    await page.locator('input[name=name]').fill('Test'); await page.locator('input[name=email]').fill('test@example.com');
    await page.locator('textarea[name=details]').fill('Normal enquiry'); await page.locator('#form-submit').click();
    await page.waitForFunction(() => document.querySelector('textarea[name=details]').value === '');
    assert.match(submission, /Normal enquiry/);
    await page.goto(origin + '/condition.html');
    await page.evaluate(() => renderResult({ score: null, issues: [], repair_needed: false }));
    assert.equal(await page.locator('#result-contact').isVisible(), false);
    await page.evaluate(() => renderResult({ score: 5, issues: [], repair_needed: false }));
    assert.match(await page.locator('#result-contact').getAttribute('class'), /btn-secondary/);
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
    await page.locator('#result-contact').click();
    assert.equal(await page.locator('#enquiry-storage-fallback').isVisible(), true);
    assert.match(page.url(), /\/condition$/);
    assert.deepEqual(errors, []);
    console.log('PASS: 35 page/viewport cases including widget sizing; skip links, menu keyboard/focus, languages, gallery, local asset/redirect/404 responses, normal contact and condition handoff/retry/blocked-storage checks. No page errors. APIs/Turnstile mocked.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
