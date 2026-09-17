// No dependencies, no live API calls: node scripts/check-worker.mjs
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = await readFile(path.join(root, 'worker.js'), 'utf8');
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const records = new Map();
const rateCounts = new Map();
const env = {
  TURNSTILE_SECRET: 'test-only',
  AI_API_KEY: 'test-only',
  EVALUATE_RATE_LIMIT_KV: { get: async (key) => rateCounts.get(key), put: async (key, value) => rateCounts.set(key, value) },
  CONTACT_KV: { put: async (key, value) => records.set(key, JSON.parse(value)) },
};
const call = (url, init) => worker.fetch(new Request(url, init), env, {});
let checks = 0;
const expect = (actual, expected) => { assert.equal(actual, expected); checks++; };
// Direct non-API calls must never serve assets or redirect either hostname.
for (const host of ['mirandas.gr', 'www.mirandas.gr']) {
  for (const protocol of ['https:', 'http:']) {
    for (const route of ['/', '/index.html', '/index', '/condition', '/condition/', '/condition.html', '/robots.txt', '/sitemap.xml', '/styles.css', '/main.js', '/assets/logo/thereallogo.svg', '/epidiorthosi-tzin.html', '/metapoiiseis-rouxon.html', '/metapoiiseis-nyfikou.html', '/missing.html', '/api/missing']) {
      for (const method of ['GET', 'HEAD']) {
        const response = await call(`${protocol}//${host}${route}?source=old`, { method });
        expect(response.status, 404);
        expect(response.headers.get('location'), null);
        expect(response.headers.get('content-type'), 'application/json');
      }
    }
  }
  const origin = `https://${host}`;
  for (const route of ['/api/evaluate', '/api/contact']) {
    expect((await call(origin + route)).status, 405);
    expect((await call(origin + route, { method: 'POST', body: '{}' })).status, 400);
    expect((await call(origin + route, { method: 'POST', body: new FormData() })).status, 400);
    const options = await call(origin + route, { method: 'OPTIONS', headers: { Origin: origin } });
    expect(options.status, 204);
    expect(options.headers.get('location'), null);
    expect(options.headers.get('Access-Control-Allow-Origin'), origin);
    const untrusted = await call(origin + route, { method: 'OPTIONS', headers: { Origin: 'https://untrusted.example' } });
    expect(untrusted.headers.get('Access-Control-Allow-Origin'), null);
  }
  for (const route of ['/api/contact/list', '/api/contact/get', '/api/contact/file']) {
    expect((await call(origin + route)).status, 401);
    expect((await call(origin + route + '?token=wrong')).status, 401);
  }
}
// Mock external Turnstile and AI calls; exercise real validation and persistence code.
let turnstileSuccess = true;
globalThis.fetch = async (url) => {
  if (url === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
    return Response.json({ success: turnstileSuccess });
  }
  assert.equal(url, 'https://api.openai.com/v1/chat/completions');
  return Response.json({ choices: [{ message: { content: JSON.stringify({ score: 2, issues: ['Seam tear'], repair_needed: true, confidence: 0.8 }) } }] });
};
const form = new FormData();
form.set('cf-turnstile-response', 'test-token');
expect((await call('https://mirandas.gr/api/contact', { method: 'POST', body: form })).status, 400);
form.set('name', 'Test'); form.set('email', 'invalid'); form.set('details', 'AI estimate: 2/5; seam tear; clothing');
expect((await call('https://mirandas.gr/api/contact', { method: 'POST', body: form })).status, 400);
form.set('email', 'test@example.com');
const contact = await call('https://mirandas.gr/api/contact', { method: 'POST', body: form });
expect(contact.status, 200);
expect(records.size, 1);
expect([...records.values()][0].details, form.get('details'));
turnstileSuccess = false;
expect((await call('https://mirandas.gr/api/contact', { method: 'POST', body: form })).status, 403);
expect(records.size, 1);
turnstileSuccess = true;
const callWithEnv = (bindings, body) => worker.fetch(new Request('https://www.mirandas.gr/api/contact', { method: 'POST', body }), bindings, {});
expect((await callWithEnv({ ...env, CONTACT_KV: undefined }, form)).status, 503);
form.append('photos', new File(['image'], 'test.jpg', { type: 'image/jpeg' }));
expect((await callWithEnv(env, form)).status, 503);
expect(records.size, 1);
const uploads = new Map();
env.CONTACT_UPLOADS = { put: async (key, stream) => uploads.set(key, await new Response(stream).text()) };
expect((await callWithEnv(env, form)).status, 200);
expect(uploads.size, 1);
expect([...records.values()][1].photos.length, 1);
for (let i = 0; i < 5; i++) form.append('photos', new File(['image'], `${i}.jpg`, { type: 'image/jpeg' }));
expect((await callWithEnv(env, form)).status, 400);
expect(uploads.size, 1);
form.delete('photos'); form.append('photos', new File(['text'], 'text.txt', { type: 'text/plain' }));
expect((await callWithEnv(env, form)).status, 400);
form.delete('photos'); form.append('photos', new File([], '', { type: 'application/octet-stream' }));
expect((await callWithEnv(env, form)).status, 200);
const evaluation = new FormData();
evaluation.set('cf-turnstile-response', 'test-token'); evaluation.set('itemType', 'clothing');
for (let i = 1; i <= 3; i++) evaluation.set(`photo${i}`, new File(['image'], `${i}.jpg`, { type: 'image/jpeg' }));
turnstileSuccess = false;
expect((await call('https://mirandas.gr/api/evaluate', { method: 'POST', body: evaluation })).status, 403);
turnstileSuccess = true;
const rated = await call('https://mirandas.gr/api/evaluate', { method: 'POST', body: evaluation });
expect(rated.status, 200); expect((await rated.json()).score, 2);
env.EVALUATE_RATE_LIMIT_MAX = 1;
expect((await call('https://mirandas.gr/api/evaluate', { method: 'POST', body: evaluation })).status, 429);
// Existing admin routes still retrieve submitted enquiries and photos on both hosts.
env.ADMIN_TOKEN = 'test-admin';
env.CONTACT_KV.get = async key => records.get(key) ?? null;
env.CONTACT_KV.list = async () => ({ keys: [...records.keys()].map(name => ({ name })) });
env.CONTACT_UPLOADS.get = async key => uploads.has(key)
  ? { body: uploads.get(key), httpMetadata: { contentType: 'image/jpeg' } } : null;
const uploadedRecord = [...records.values()].find(record => record.photos.length);
for (const host of ['mirandas.gr', 'www.mirandas.gr']) {
  const base = `https://${host}/api/contact`;
  const listed = await call(base + '/list?token=test-admin');
  expect(listed.status, 200);
  expect((await listed.json()).items.length, records.size);
  const found = await call(base + '/get?token=test-admin&id=' + uploadedRecord.id);
  expect(found.status, 200);
  expect((await found.json()).record.details, uploadedRecord.details);
  const photo = await call(base + '/file?token=test-admin&key=' + encodeURIComponent(uploadedRecord.photos[0].key));
  expect(photo.status, 200);
  expect(photo.headers.get('cache-control'), 'no-store');
  expect(photo.headers.get('content-type'), 'image/jpeg');
  expect(await photo.text(), 'image');
  for (const route of ['/get?id=missing', '/file?key=missing']) {
    expect((await call(base + route + '&token=test-admin')).status, 404);
  }
  for (const route of ['/get', '/file']) {
    expect((await call(base + route + '?token=test-admin')).status, 400);
  }
  expect((await call(base + '/unknown')).status, 404);
}
console.log(`PASS: ${checks} Worker routing, method, Turnstile gate, validation and contact persistence checks (mock Turnstile/AI/storage; no assets binding).`);
