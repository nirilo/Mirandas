// Run against `wrangler pages dev static --port 8787`; no API submissions.
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const origin = 'http://127.0.0.1:8787';
const root = new URL('../static/', import.meta.url);
const pages = (await readdir(root)).filter(name => name.endsWith('.html') && name !== '404.html');
const redirects = (await readFile(new URL('_redirects', root), 'utf8'))
  .split(/\r?\n/).filter(line => line.trim() && !line.startsWith('#'))
  .map(line => line.split(/\s+/));
let checks = 0;
for (const method of ['GET', 'HEAD']) {
  for (const name of pages) {
    const clean = name === 'index.html' ? '/' : '/' + name.slice(0, -5);
    const response = await fetch(origin + clean, { method, redirect: 'manual' });
    assert.equal(response.status, 200, `${method} ${clean}`);
    assert.ok(response.headers.get('content-type').includes('text/html'));
    if (method === 'GET') {
      assert.equal(await response.text(), await readFile(new URL(name, root), 'utf8'));
    }
    const redirected = await fetch(`${origin}/${name}?source=legacy`, { method, redirect: 'manual' });
    assert.equal(redirected.status, 308, name);
    assert.equal(new URL(redirected.headers.get('location'), origin).href, origin + clean + '?source=legacy');
    checks += 2;
  }
  for (const [from, to, status] of redirects) {
    const response = await fetch(origin + from + '?source=legacy', { method, redirect: 'manual' });
    assert.equal(response.status, Number(status), from);
    assert.equal(new URL(response.headers.get('location'), origin).href, origin + to + '?source=legacy');
    checks++;
  }
  for (const [name, type] of [['robots.txt', 'text/plain'], ['sitemap.xml', 'application/xml'], ['styles.css', 'text/css'], ['main.js', 'javascript'], ['assets/logo/thereallogo.svg', 'image/svg+xml'], ['assets/images/denim_after.webp', 'image/webp']]) {
    const response = await fetch(origin + '/' + name, { method, redirect: 'manual' });
    assert.equal(response.status, 200, name);
    assert.ok(response.headers.get('content-type').includes(type), name);
    if (method === 'GET') {
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(new URL(name, root)));
    }
    checks++;
  }
  for (const route of ['/missing', '/missing.html', '/nested/missing', '/api/evaluate', '/api/contact']) {
    const response = await fetch(origin + route, { method, redirect: 'manual' });
    assert.equal(response.status, 404, route);
    checks++;
  }
}
console.log(`PASS: ${checks} real Pages GET/HEAD responses, HTML/file contents, legacy redirects, query strings and 404s; API Worker remains separate.`);
