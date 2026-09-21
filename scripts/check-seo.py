"""Dependency-free checks: python scripts/check-seo.py"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
from urllib.robotparser import RobotFileParser
import json
import re
import tomllib
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'static'
ORIGIN = 'https://mirandas.gr'
VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path, self.stack, self.nodes, self.ids, self.jsonld = path, [], [], set(), []
        self.ld = None
        self.feed(path.read_text(encoding='utf-8'))
        assert not self.stack, (path, 'Unclosed tags', self.stack)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        assert len(a) == len(attrs), (self.path, 'Duplicate attributes', self.getpos())
        if 'id' in a:
            assert a['id'] not in self.ids, (self.path, 'Duplicate ID', a['id'])
            self.ids.add(a['id'])
        if tag == 'img':
            assert 'alt' in a, (self.path, 'Image needs alt', a)
        self.nodes.append((tag, a))
        if tag not in VOID:
            self.stack.append(tag)
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.ld = ''

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_data(self, data):
        if self.ld is not None:
            self.ld += data

    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1] == tag, (self.path, 'Bad nesting', tag, self.stack, self.getpos())
        self.stack.pop()
        if tag == 'script' and self.ld is not None:
            self.jsonld.append(json.loads(self.ld))
            self.ld = None

pages = {p.relative_to(ROOT).as_posix(): Page(p) for p in ROOT.rglob('*.html') if p.name != '404.html'}
urls = {name: ORIGIN + ('/' if name == 'index.html' else '/' + Path(name).with_suffix('').as_posix()) for name in pages}
not_found = Page(ROOT / '404.html')
assert any(tag == 'meta' and a.get('name') == 'robots' and a.get('content') == 'noindex' for tag, a in not_found.nodes)
sitemap = ET.parse(ROOT / 'sitemap.xml')
locs = [e.text for e in sitemap.findall('{*}url/{*}loc')]
assert len(locs) == len(set(locs))
assert set(locs) == set(urls.values()), ('Sitemap mismatch', locs)
robots = RobotFileParser()
robots.parse((ROOT / 'robots.txt').read_text().splitlines())
assert robots.site_maps() == [ORIGIN + '/sitemap.xml']
assert not robots.can_fetch('Googlebot', ORIGIN + '/api/contact/list')
descriptions, titles, headings = set(), set(), set()
link_count = 0
for name, page in pages.items():
    source = page.path.read_text(encoding='utf-8')
    assert '\ufffd' not in source, (name, 'Invalid Unicode')
    assert not re.search(r'\?{4,}', source), (name, 'Possible encoding loss')
    title = re.findall(r'<title>(.*?)</title>', source)
    assert len(title) == 1 and title[0] not in titles, (name, 'Duplicate title')
    titles.add(title[0])
    assert sum(tag == 'h1' for tag, _ in page.nodes) == 1, (name, 'Expected one H1')
    heading = ' '.join(re.sub('<[^>]+>', '', re.search(r'<h1\b[^>]*>(.*?)</h1>', source, re.S)[1]).split())
    assert heading and heading not in headings, (name, 'Duplicate H1')
    headings.add(heading)
    previous = 0
    for tag, _ in page.nodes:
        if re.fullmatch('h[1-6]', tag):
            level = int(tag[1])
            assert level <= previous + 1, (name, 'Skipped heading level', tag)
            previous = level
    assert any(tag == 'main' and a.get('id') == 'main-content' and a.get('tabindex') == '-1' for tag, a in page.nodes)
    assert ('html', {'lang': 'el'}) in page.nodes, (name, 'Greek default missing')
    canonical = [a['href'] for tag, a in page.nodes if tag == 'link' and a.get('rel') == 'canonical']
    assert canonical == [urls[name]], (name, canonical)
    assert robots.can_fetch('Googlebot', urls[name])
    meta = {a.get('name', a.get('property')): a.get('content') for tag, a in page.nodes if tag == 'meta'}
    assert meta['description'] and meta['description'] not in descriptions
    descriptions.add(meta['description'])
    assert meta['og:url'] == urls[name]
    for key in ['og:title', 'og:description', 'og:type', 'twitter:card']:
        assert meta.get(key), (name, key)
    assert 'noindex' not in meta.get('robots', '').lower()
    for tag, a in page.nodes:
        assert 'hreflang' not in a, (name, 'Same-URL language switching must not use hreflang')
        refs = [a[key] for key in ['href', 'src'] if key in a]
        if a.get('property') == 'og:image': refs.append(a['content'])
        for ref in refs:
            url = urlsplit(urljoin(urls[name], ref))
            if url.netloc not in ['mirandas.gr', 'www.mirandas.gr'] or url.scheme not in ['http', 'https']: continue
            assert url.scheme == 'https' and url.netloc == 'mirandas.gr', (name, 'Noncanonical origin', ref)
            target = unquote(url.path).lstrip('/') or 'index.html'
            if target != 'index.html' and not Path(target).suffix:
                target += '.html'  # Native Pages clean-URL resolution.
            assert (ROOT / target).is_file(), (name, 'Missing file', ref)
            if tag == 'a' and target in pages:
                assert url.path == urlsplit(urls[target]).path, (name, 'Noncanonical internal link', ref)
            if url.fragment and target in pages:
                assert unquote(url.fragment) in pages[target].ids, (name, 'Missing anchor', ref)
            link_count += 1
    for data in page.jsonld:
        assert data['@context'] == 'https://schema.org'
        assert data['@type'] in ['LocalBusiness', 'BlogPosting']
        assert data['url'] == urls[name]
        assert 'telephone' not in data, (name, 'Phone must not be exposed in structured data')
    assert not any(tag == 'a' and a.get('href', '').startswith('tel:') for tag, a in page.nodes), (name, 'Phone must be revealed only after interaction')
    assert {'lang-toggle', 'mobile-lang-toggle'} <= page.ids, (name, 'Shared language controls missing')

slugs = ['epidiorthosi-tzin', 'metapoiiseis-rouxon', 'metapoiiseis-nyfikou']
services = ['garment-stories/' + slug + '.html' for slug in slugs]
service_urls = {'/' + Path(name).with_suffix('').as_posix() for name in services}
home_links = {a.get('href') for tag, a in pages['index.html'].nodes if tag == 'a'}
assert service_urls <= home_links, 'Orphan service page'
assert all(urls[name] in locs for name in services)
story_links = {a.get('href') for tag, a in pages['garment-stories.html'].nodes if tag == 'a'}
assert service_urls <= story_links, 'Journal guide links missing'
for name in services:
    assert any(a.get('data-lang') == 'en' for _, a in pages[name].nodes), (name, 'English guide content missing')
    assert not (ROOT / Path(name).name).exists(), (name, 'Duplicate old guide file')
    back = [a for tag, a in pages[name].nodes if tag == 'a' and 'guide-back' in a.get('class', '').split()]
    assert len(back) == 1 and back[0]['href'] == ORIGIN + '/garment-stories', (name, 'Back pill destination')
    for nav_id in ['nav-stories', 'mobile-nav-stories']:
        assert any(a.get('id') == nav_id and a.get('aria-current') == 'page' for _, a in pages[name].nodes), (name, nav_id)
    for tag, a in pages[name].nodes:
        for key in ['href', 'src', 'srcset']:
            ref = a.get(key, '')
            assert not ref or ref.startswith(('/', '#', 'https://')), (name, 'Fragile relative reference', ref)
assert 'phoneParts' not in (ROOT / 'main.js').read_text(encoding='utf-8'), 'Do not embed phone fragments in client JavaScript'
for config in ['wrangler.toml.example', 'wrangler.toml']:
    path = ROOT.parent / config
    if not path.exists(): continue  # Local deployment config is intentionally gitignored.
    settings = tomllib.loads(path.read_text(encoding='utf-8'))
    assert settings['name'] == 'mirandas', (config, 'Wrong Worker target')
    assert settings['main'] == 'worker.js'
    assert 'assets' not in settings, (config, 'API Worker must not serve static assets')
    assert 'pages_build_output_dir' not in settings, (config, 'Keep Pages separate from the API Worker config')
assert 'ASSETS' not in (ROOT.parent / 'worker.js').read_text(encoding='utf-8')
assert not (ROOT / '_worker.js').exists(), 'Pages must serve static files directly'
redirects = [line.split() for line in (ROOT / '_redirects').read_text().splitlines() if line.strip() and not line.startswith('#')]
for source, destination, status in redirects:
    assert status == '301'
    assert source != destination and not source.startswith('/api/')
    assert ORIGIN + destination in urls.values(), ('Noncanonical redirect target', destination)
assert ['/condition/', '/condition', '301'] in redirects
for slug in slugs:
    target = '/garment-stories/' + slug
    for source in ['/' + slug, '/' + slug + '/', '/' + slug + '.html', target + '/']:
        assert [source, target, '301'] in redirects, ('Missing direct guide redirect', source)
for stylesheet in ROOT.glob('*.css'):
    for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', stylesheet.read_text(encoding='utf-8')):
        if not ref.startswith(('data:', 'http:', 'https:')):
            assert (stylesheet.parent / ref).is_file(), (stylesheet.name, 'Missing CSS asset', ref)
assert '\n\n## SEO and local enquiries\n' in (ROOT.parent / 'README.md').read_text(encoding='utf-8')
print(f'PASS: {len(pages)} HTML pages, {len(locs)} sitemap URLs, {link_count} local references, JSON-LD, metadata, robots and service discovery.')
