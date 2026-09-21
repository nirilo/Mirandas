// Run manually ONLY after Stage A. Never print the response body or secret.
const origin = process.argv[2];
if (!['https://mirandas.gr', 'https://www.mirandas.gr'].includes(origin)) {
  console.error('Usage: node scripts/check-phone-live.mjs https://mirandas.gr [--expect-unavailable]');
  process.exit(1);
}
try {
  const unavailable = process.argv.includes('--expect-unavailable');
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  for (const headers of [{}, { Origin: origin }]) {
    const response = await fetch(origin + '/api/phone', { headers, redirect: 'manual', cache: 'no-store' });
    check(response.status === (unavailable ? 503 : 200), 'Unexpected status; keep Stage B blocked.');
    check(response.headers.get('cache-control')?.includes('no-store'), 'Missing no-store header.');
    check(response.headers.get('content-type')?.includes('application/json'), 'Expected JSON response.');
    if (headers.Origin) check(response.headers.get('access-control-allow-origin') === origin, 'Origin response mismatch.');
    const data = await response.json();
    if (unavailable) check(data.ok === false && !('phone' in data), 'Missing-secret response must not contain a number.');
    else check(data.ok === true && typeof data.phone === 'string' && /^\+[1-9]\d{7,14}$/.test(data.phone.replace(/[\s().-]/g, '')), 'Phone response is not valid.');
  }
  console.log(unavailable ? 'PASS: controlled unavailable response; Stage B remains blocked.' : 'PASS: phone endpoint, JSON, no-store and origin checks. Secret value withheld.');
} catch (_) {
  console.error('FAIL: phone endpoint verification. Check Worker deployment, PHONE_NUMBER and response headers privately; do not publish Stage B.');
  process.exitCode = 1;
}
