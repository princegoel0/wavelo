import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { configFromAttributes, getCanonicalLoaderDefinition, loaderAttributes, loaderConfigKeys, loaderRegistry, presetRegistry, renderLoader, renderStylesheets, LoaderConfigurationError } from '../packages/core/dist/index.js';

test('catalog has distinct metadata and required categories', () => {
  assert.ok(new Set(loaderRegistry.map((loader) => loader.id)).size >= 60);
  const active = loaderRegistry.filter((loader) => !loader.deprecated);
  assert.ok(active.length >= 60);
  assert.equal(new Set(active.map((loader) => loader.visualSignature)).size, active.length);
  for (const loader of loaderRegistry.filter((loader) => loader.deprecated)) {
    assert.ok(loader.aliasOf);
    assert.ok(loaderRegistry.some((candidate) => candidate.id === loader.aliasOf && !candidate.deprecated));
  }
  for (const category of ['spinner', 'dots', 'bars', 'skeleton', 'progress', 'application']) {
    assert.ok(loaderRegistry.some((loader) => loader.category === category));
  }
});

test('the generated ID list matches the catalog', async () => {
  const { loaderIds } = await import('../packages/core/dist/ids.js');
  assert.deepEqual([...loaderIds].sort(), loaderRegistry.map((loader) => loader.id).sort());
});

test('every catalog ID renders its own design', () => {
  // The catalog used to carry 12 deprecated aliases that borrowed another
  // design's appearance while keeping a name that promised something else:
  // "Four dots" rendered three, "Thick stroke" rendered a 3px ring, "Dot matrix"
  // rendered three dots in a row. Every ID now has its own implementation, and
  // the browser suite asserts that no two designs render identically.
  assert.equal(loaderRegistry.filter((loader) => loader.deprecated).length, 0);
  assert.equal(loaderRegistry.filter((loader) => loader.aliasOf).length, 0);
  assert.equal(new Set(loaderRegistry.map((loader) => loader.id)).size, loaderRegistry.length);
  const markup = new Set(loaderRegistry.map((loader) => renderLoader({ type: loader.id, label: loader.name }).html));
  assert.equal(markup.size, loaderRegistry.length, 'two IDs render identical markup');
  for (const definition of loaderRegistry) {
    const result = renderLoader({ type: definition.id, label: definition.name });
    assert.equal(result.definition.id, definition.id);
    assert.equal(result.fallback, false, definition.id);
  }
});

test('designs whose names promise a count render that many parts', () => {
  const counts = {
    'three-dots': 3,
    'four-dots': 4,
    'five-dots': 5,
    'dot-matrix': 9,
    'grid-pulse': 4,
    'expanding-dot': 1,
    'audio-waveform': 7,
    'dotted-circle': 8,
    helix: 6,
    'skeleton-card': 3,
    'skeleton-table': 6,
    'progress-steps': 5
  };
  for (const [id, expected] of Object.entries(counts)) {
    const result = renderLoader({ type: id, value: 50, max: 100, label: id });
    const actual = (result.html.match(/wavelo__part/g) ?? []).length;
    assert.equal(actual, expected, `${id} renders ${actual} parts, its name promises ${expected}`);
  }
  assert.match(renderLoader({ type: 'svg-star', label: 'star' }).html, /<svg[^>]*class="wavelo__part"/);
});

test('rendering is deterministic and accessible when labelled', () => {
  const result = renderLoader({ type: 'orbiting-dots', label: 'Loading data', size: 48 });
  assert.match(result.html, /role="status"/);
  assert.match(result.html, /aria-label="Loading data"/);
  assert.equal(result.html, renderLoader({ type: 'orbiting-dots', label: 'Loading data', size: 48 }).html);
  assert.match(result.css, /prefers-reduced-motion/);
});

test('an unlabelled design is hidden from assistive technology', () => {
  const result = renderLoader({ type: 'ring' });
  assert.match(result.html, /aria-hidden="true"/);
  assert.doesNotMatch(result.html, /role=/);
});

test('progress values use supplied measurements only', () => {
  const result = renderLoader({ type: 'progress-bar', value: 25, max: 50, label: 'Uploading' });
  assert.match(result.html, /aria-valuenow="25"/);
  assert.match(result.html, /aria-valuemax="50"/);
  assert.match(result.html, /role="progressbar"/);
  assert.match(result.html, /--wavelo-progress:50%/);
});

test('unsafe configuration is rejected', () => {
  assert.throws(() => renderLoader({ type: 'inline', color: '<script>' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', style: { '--wavelo-color': 'red;' } }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', duration: 'expression(alert(1))' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', max: 0 }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', theme: 'sepia' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', ['data-on click']: 'x' }), LoaderConfigurationError);
});

test('configuration values cannot break out of an attribute', () => {
  const result = renderLoader({ type: 'inline', label: '"><script>alert(1)</script>', 'data-note': '"a\'b"' });
  assert.doesNotMatch(result.html, /<script/);
  assert.match(result.html, /aria-label="&quot;&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;"/);
  assert.match(result.html, /data-note="&quot;a&#39;b&quot;"/);
});

test('every supported configuration key reaches the rendered element', () => {
  const cases = [
    ['size', { size: 48 }, '--wavelo-size:48px'],
    ['width', { width: 44 }, '--wavelo-width:44px'],
    ['height', { height: 22 }, '--wavelo-height:22px'],
    ['color', { color: '#010203' }, '--wavelo-color:#010203'],
    ['secondaryColor', { secondaryColor: '#020304' }, '--wavelo-secondary-color:#020304'],
    ['backgroundColor', { backgroundColor: '#030405' }, '--wavelo-background:#030405'],
    ['speed', { speed: 2 }, '--wavelo-duration:0.5s'],
    ['duration', { duration: '2s' }, '--wavelo-duration:2s'],
    ['strokeWidth', { strokeWidth: 7 }, '--wavelo-stroke:7px'],
    ['theme', { theme: 'dark' }, 'data-wavelo-theme="dark"'],
    ['direction', { direction: 'reverse' }, '--wavelo-direction:reverse'],
    ['paused', { paused: true }, '--wavelo-play-state:paused'],
    ['label', { label: 'Working' }, 'aria-label="Working"'],
    ['className', { className: 'demo-case' }, 'demo-case'],
    ['style', { style: { '--wavelo-radius': '9px' } }, '--wavelo-radius:9px'],
    ['reducedMotion', { reducedMotion: 'never' }, 'data-wavelo-motion="never"'],
    ['data-testid', { 'data-testid': 'loader' }, 'data-testid="loader"'],
    ['data-*', { 'data-analytics': 'section-a' }, 'data-analytics="section-a"'],
    ['value', { value: 25 }, 'aria-valuenow="25"'],
    ['max', { value: 25, max: 50 }, 'aria-valuemax="50"']
  ];
  for (const [key, config, marker] of cases) {
    const result = renderLoader({ type: 'progress-bar', max: 100, label: 'Loading', ...config });
    assert.ok(result.html.includes(marker), `${key} did not reach the markup: ${result.html}`);
  }
});

test('loaderConfigKeys covers the whole documented configuration surface', () => {
  assert.deepEqual([...loaderConfigKeys].sort(), [
    'backgroundColor', 'className', 'color', 'count', 'data-testid', 'decorative', 'describedBy', 'direction',
    'duration', 'height', 'inline', 'label', 'labelledBy', 'loading', 'max', 'paused', 'reducedMotion',
    'secondaryColor', 'size', 'speed', 'strokeWidth', 'style', 'theme', 'type', 'value', 'valueText', 'width'
  ]);
  assert.equal(loaderAttributes.length, loaderConfigKeys.length);
  assert.ok(loaderAttributes.includes('secondary-color'));
  assert.ok(loaderAttributes.includes('data-testid'));
  assert.ok(loaderAttributes.includes('labelled-by'), 'the accessibility keys need attribute forms');
  assert.ok(loaderAttributes.includes('value-text'));
  assert.ok(loaderAttributes.includes('loading'), 'visibility binding needs an attribute form');
  assert.ok(loaderAttributes.includes('count'));
  assert.ok(loaderAttributes.includes('inline'));
});

test('an unknown type renders the default design and reports the substitution', () => {
  const result = renderLoader({ type: 'definitely-not-a-design', label: 'Loading' });
  assert.equal(result.fallback, true);
  assert.equal(result.definition.id, 'inline');
  assert.match(result.html, /data-wavelo-fallback="definitely-not-a-design"/, 'the substitution must be visible in the markup');
  assert.equal(renderLoader({ label: 'Loading' }).fallback, false);
  assert.doesNotMatch(renderLoader({ label: 'Loading' }).html, /data-wavelo-fallback/, 'no type asked, nothing to report');
  assert.doesNotMatch(renderLoader({ type: 'inline', label: 'Loading' }).html, /data-wavelo-fallback/, 'the default design by name is not a substitution');
  assert.doesNotMatch(renderLoader({ type: 'download-progress', label: 'Loading' }).html, /data-wavelo-fallback/, 'a preset that resolved must not be flagged');
  // The requested value is whatever the caller typed, so it goes through the same
  // escaping as every other attribute rather than into the markup raw.
  assert.match(renderLoader({ type: '"><script', label: 'Loading' }).html, /data-wavelo-fallback="&quot;&gt;&lt;script"/);
});

test('every registered design renders its own stable identity', () => {
  for (const definition of loaderRegistry) {
    const result = renderLoader({ type: definition.id, label: definition.name });
    assert.equal(result.fallback, false, definition.id);
    assert.match(result.html, new RegExp(`wavelo--${getCanonicalLoaderDefinition(definition).id}`));
    assert.match(result.html, /aria-label=/);
  }
});

test('each design ships only its own stylesheet slice', () => {
  const ring = renderLoader({ type: 'ring' });
  const card = renderLoader({ type: 'skeleton-card' });
  assert.ok(ring.css.length < card.css.length + 4000, 'ring slice unexpectedly large');
  assert.doesNotMatch(ring.css, /\.wavelo--skeleton-card/);
  assert.doesNotMatch(card.css, /\.wavelo--ring\{/);
  assert.match(ring.css, /\.wavelo\{/);
  assert.match(card.css, /\.wavelo\{/);
});

test('every determinate design exposes progressbar semantics, and only those do', () => {
  const determinate = loaderRegistry.filter((loader) => loader.kind === 'progress');
  assert.equal(determinate.length, 7);
  for (const definition of determinate) {
    const result = renderLoader({ type: definition.id, value: 40, max: 80, label: 'Working' });
    assert.match(result.html, /role="progressbar"/, definition.id);
    assert.match(result.html, /aria-valuenow="40"/, definition.id);
    assert.match(result.html, /aria-valuemax="80"/, definition.id);
    assert.ok(definition.supportsProgress, `${definition.id} must advertise progress support`);
  }
  for (const definition of loaderRegistry.filter((loader) => loader.kind !== 'progress').slice(0, 20)) {
    const result = renderLoader({ type: definition.id, value: 40, max: 80, label: 'Working' });
    assert.doesNotMatch(result.html, /role="progressbar"/, definition.id);
  }
});

test('progress steps fill whole steps in proportion to the value', () => {
  const filled = (config) => {
    const result = renderLoader({ type: 'progress-steps', max: 100, label: 'Working', ...config });
    return (result.html.match(/data-wavelo-step="filled"/g) ?? []).length;
  };
  assert.equal(filled({ value: 0 }), 0);
  assert.equal(filled({ value: 25 }), 2);
  assert.equal(filled({ value: 50 }), 3);
  assert.equal(filled({ value: 75 }), 4);
  assert.equal(filled({ value: 100 }), 5);
  assert.equal(renderLoader({ type: 'progress-steps', label: 'Working' }).html.match(/data-wavelo-step="filled"/g).length, 2);
  assert.equal((renderLoader({ type: 'progress-steps', value: 100, max: 100, label: 'L' }).html.match(/wavelo__part/g) ?? []).length, 5);
});

test('the progress family renders seven distinguishable designs', () => {
  const ids = loaderRegistry.filter((loader) => loader.kind === 'progress').map((loader) => loader.id);
  const rendered = ids.map((id) => renderLoader({ type: id, value: 60, max: 100, label: 'Working' }));
  assert.equal(new Set(rendered.map((result) => result.html)).size, ids.length, 'two progress designs render identical markup');
  // Designs that must differ from the plain bar each need their own rule; the
  // plain bar itself is styled by the shared `.wavelo--progress` rules.
  const css = rendered[0].css;
  // A ring is a circle: both of its axes follow `size`, so a width or height that
  // would turn it into an ellipse is not read.
  assert.match(css, /\.wavelo--progress-ring\{[^}]*width:var\(--wavelo-size,2\.5rem\);height:var\(--wavelo-size,2\.5rem\)/);
  assert.match(css, /\.wavelo--progress-steps[^}]*data-wavelo-step="filled"/);
  assert.match(css, /\.wavelo--progress-upload[^}]*wavelo-upload/);
  assert.match(css, /\.wavelo--page-transition[^}]*wavelo-transition/);
  assert.match(css, /\.wavelo--segmented-bar[^}]*repeating-linear-gradient/);
  assert.match(css, /\.wavelo--progress-top\{[^}]*position:fixed/);
});

test('unset colours are not emitted as self-referencing variables', () => {
  // `--wavelo-color: var(--wavelo-color, #6366f1)` on the element that declares
  // it is a cycle: CSS resolves it as invalid and every design inherits the page
  // colour instead. Defaults belong to the stylesheet rules that consume them.
  const plain = renderLoader({ type: 'ring', label: 'Loading' });
  assert.doesNotMatch(plain.html, /--wavelo-color:/);
  assert.doesNotMatch(plain.html, /--wavelo-secondary-color:/);
  assert.doesNotMatch(plain.html, /--wavelo-background:/);
  assert.match(plain.css, /color:var\(--wavelo-color,#6366f1\)/);

  const coloured = renderLoader({ type: 'ring', color: '#010203', secondaryColor: '#040506', backgroundColor: '#070809', label: 'Loading' });
  assert.match(coloured.html, /--wavelo-color:#010203/);
  assert.match(coloured.html, /--wavelo-secondary-color:#040506/);
  assert.match(coloured.html, /--wavelo-background:#070809/);
});

test('generated loader modules match the catalog exactly', async () => {
  const files = await readdir(new URL('../packages/core/dist/loaders/', import.meta.url));
  const modules = files.filter((name) => name.endsWith('.js') && name !== 'index.js').map((name) => name.replace('.js', ''));
  assert.deepEqual(modules.sort(), loaderRegistry.map((loader) => loader.id).sort());
});

test('every registered loader has a working modular entry point', async () => {
  for (const definition of loaderRegistry) {
    const exportName = definition.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const module = await import(`../packages/core/dist/loaders/${definition.id}.js`);
    assert.equal(typeof module[exportName], 'function', definition.id);
    const result = module[exportName]({ label: definition.name });
    assert.equal(result.definition.id, definition.aliasOf ?? definition.id);
    assert.equal(result.fallback, false);
    const dynamic = renderLoader({ type: definition.id, label: definition.name });
    assert.equal(result.html, dynamic.html, `${definition.id} differs between entry points`);
    assert.equal(result.css, dynamic.css, `${definition.id} styles differ between entry points`);
  }
});

test('Web Components package can be imported during SSR', async () => {
  const module = await import('../packages/web-components/dist/index.js');
  assert.equal(typeof module.defineWaveloElements, 'function');
  module.defineWaveloElements();
});

test('pattern presets render the design they name', () => {
  const patterns = presetRegistry.filter((preset) => preset.id !== preset.type);
  assert.ok(patterns.length > 0, 'the catalog must carry pattern presets');
  for (const preset of patterns) {
    const result = renderLoader({ type: preset.id, label: 'Loading' });
    assert.equal(result.definition.id, preset.type, `${preset.id} rendered ${result.definition.id}, not ${preset.type}`);
    assert.equal(result.resolution, 'preset', `${preset.id} resolution`);
    assert.equal(result.fallback, false, `${preset.id} was advertised as a preset but reported a fallback`);
  }
});

test('an unknown ID is a fallback, which is not the same as a preset hit', () => {
  const unknown = renderLoader({ type: 'not-a-design-at-all', label: 'Loading' });
  assert.equal(unknown.resolution, 'default');
  assert.equal(unknown.fallback, true);
  const preset = renderLoader({ type: 'download-progress', label: 'Loading' });
  assert.equal(preset.fallback, false, 'a preset must not be reported as a substitution');
});

test('the advertised options are what the design actually reads', () => {
  const options = (id) => loaderRegistry.find((loader) => loader.id === id).options;
  // Keys the stylesheet never reads for that design.
  assert.ok(!options('skeleton-card').includes('strokeWidth'), 'skeleton-card advertises a stroke it never uses');
  assert.ok(!options('ring').includes('secondaryColor'), 'ring advertises a secondary colour it never uses');
  assert.ok(!options('progress-bar').includes('duration'), 'a static track must not advertise a clock control');
  assert.ok(!options('progress-scroll').includes('duration'), 'a scroll-driven fill is not governed by the clock');
  assert.ok(!options('progress-scroll').includes('speed'));
  assert.ok(options('dot-matrix').includes('width'), 'a grid of dots may be rectangular');
  assert.ok(!options('progress-ring').includes('width'), 'a ring stays a circle: both of its axes follow size');
  assert.ok(!options('progress-top').includes('size'), 'progress-top pins its own box');
  // No design may cap a size the caller gave it: these were floors and ceilings.
  assert.ok(options('progress-bar').includes('height'), 'a bar must take the height asked for');
  assert.ok(options('skeleton-line').includes('height'), 'a skeleton line must take the height asked for');
  assert.ok(options('skeleton-card').includes('height'), 'a card must take the height asked for');
  // Keys that do work, so the removal above cannot be blanket trimming.
  assert.ok(options('circular').includes('secondaryColor'));
  assert.ok(options('ring').includes('strokeWidth'));
  assert.ok(options('skeleton-card').includes('theme'));
  assert.ok(options('progress-scroll').includes('paused'), 'paused must still freeze a scroll-driven fill');
  assert.ok(options('progress-scroll').includes('direction'), 'reverse must still invert a scroll-driven fill');
  for (const loader of loaderRegistry) {
    for (const key of loader.options) assert.ok(loaderConfigKeys.includes(key), `${loader.id} advertises unknown key ${key}`);
    assert.ok(loader.options.includes('label') && loader.options.includes('style'), `${loader.id} lost a structural key`);
  }
});

test('style carries any CSS declaration and rejects what it cannot apply', () => {
  const raw = renderLoader({ type: 'ring', label: 'Loading', style: { position: 'fixed', marginTop: '1rem' } });
  assert.match(raw.html, /position:fixed/, 'a plain CSS property must reach the element');
  assert.match(raw.html, /margin-top:1rem/, 'camelCase keys are kebab-cased for CSS');
  assert.match(renderLoader({ type: 'ring', label: 'Loading', style: { '--wavelo-radius': '2px' } }).html, /--wavelo-radius:2px/);
  assert.equal(renderLoader({ type: 'ring', label: 'Loading', style: { '--wavelo-size': '3rem' } }).config.style['--wavelo-size'], '3rem');
  assert.throws(() => renderLoader({ type: 'ring', style: { 'not a property': 'x' } }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'ring', style: { color: 'red;color:blue' } }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'ring', style: { background: 'url(https://example.com/x.png)' } }), LoaderConfigurationError);
});

test('colours and dimensions accept the grammar developers actually reach for', () => {
  const color = (value) => renderLoader({ type: 'ring', color: value }).config.color;
  assert.equal(color('oklch(70% 0.15 130)'), 'oklch(70% 0.15 130)');
  assert.equal(color('color-mix(in srgb, red, blue)'), 'color-mix(in srgb, red, blue)');
  assert.equal(color('hwb(120 30% 40%)'), 'hwb(120 30% 40%)');
  assert.throws(() => color('red;color: blue'), LoaderConfigurationError);
  assert.throws(() => color('url(https://example.com/x)'), LoaderConfigurationError);
  const size = (value) => renderLoader({ type: 'ring', size: value }).config.size;
  assert.equal(size('calc(100% - 4px)'), 'calc(100% - 4px)');
  assert.equal(size('20ch'), '20ch');
  assert.equal(size('100svh'), '100svh');
  assert.equal(size('auto'), 'auto');
  assert.equal(size('50cqi'), '50cqi');
  assert.throws(() => size('20parsecs'), LoaderConfigurationError);
});

test('paused reads the same through the config and the attribute paths', () => {
  for (const value of ['false', '0', false]) {
    assert.equal(renderLoader({ type: 'ring', paused: value }).config.paused, false, `paused ${JSON.stringify(value)}`);
  }
  for (const value of ['', true, 'true']) {
    assert.equal(renderLoader({ type: 'ring', paused: value }).config.paused, true, `paused ${JSON.stringify(value)}`);
  }
  // The custom element path coerces to a boolean first; both must agree.
  assert.equal(configFromAttributes({ paused: '' }).paused, true);
  assert.equal(configFromAttributes({ paused: 'false' }).paused, false);
  assert.equal(renderLoader({ type: 'ring', ...configFromAttributes({ paused: '' }) }).config.paused, renderLoader({ type: 'ring', paused: '' }).config.paused);
});

test('the accessibility options reach the markup, and foreign aria keys are refused', () => {
  const attrs = (config) => renderLoader({ type: 'ring', ...config }).html;
  assert.match(attrs({ label: 'Loading' }), /aria-label="Loading"/);
  assert.match(attrs({ label: 'Loading' }), /role="status"/);
  assert.match(attrs({ labelledBy: 'caption' }), /aria-labelledby="caption"/);
  assert.doesNotMatch(attrs({ labelledBy: 'caption' }), /aria-label=/);
  assert.match(attrs({ labelledBy: 'caption' }), /role="status"/, 'a referenced label still names the loader');
  assert.match(attrs({ label: 'Loading', describedBy: 'hint extra' }), /aria-describedby="hint extra"/);
  assert.match(attrs({ label: 'Loading', decorative: true }), /aria-hidden="true"/);
  assert.doesNotMatch(attrs({ label: 'Loading', decorative: true }), /role=|aria-label/, 'a decorative loader announces nothing');
  const named = renderLoader({ type: 'progress-bar', label: 'Uploading', value: 70, max: 100, valueText: '70 of 100 MB' });
  assert.match(named.html, /role="progressbar"/);
  assert.match(named.html, /aria-valuenow="70"/);
  assert.match(named.html, /aria-valuetext="70 of 100 MB"/);
  assert.doesNotMatch(renderLoader({ type: 'ring', label: 'Loading', valueText: 'ignored' }).html, /aria-valuetext/, 'only a determinate design can carry a value text');
  assert.throws(() => renderLoader({ type: 'ring', 'aria-label': 'sneaky' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'ring', role: 'progressbar' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'ring', labelledBy: 'id; background:url(x)' }), LoaderConfigurationError);
});

test('loading binds visibility, and a loader that is not loading costs nothing', () => {
  const hidden = renderLoader({ type: 'ring', label: 'Loading', loading: false });
  assert.equal(hidden.html, '', 'a hidden loader must emit no markup');
  assert.equal(hidden.css, '', 'a hidden loader must not ask for a stylesheet');
  assert.equal(hidden.config.loading, false);
  // The design and how it was resolved survive, so a caller can still report a typo.
  assert.equal(hidden.definition.id, 'ring');
  assert.equal(renderLoader({ type: 'no-such-design', loading: false }).fallback, true);
  assert.equal(renderLoader({ type: 'ring', loading: true }).config.loading, true);
  assert.equal(renderLoader({ type: 'ring' }).config.loading, true, 'absent means loading');
  for (const value of ['false', '0', false]) {
    assert.equal(renderLoader({ type: 'ring', loading: value }).config.loading, false, `loading ${JSON.stringify(value)}`);
  }
  for (const value of ['', true, 'true']) {
    assert.equal(renderLoader({ type: 'ring', loading: value }).config.loading, true, `loading ${JSON.stringify(value)}`);
  }
  assert.equal(configFromAttributes({ loading: '' }).loading, true);
  assert.equal(configFromAttributes({ loading: 'false' }).loading, false);
  assert.equal(renderStylesheets(['']), '', 'the empty slice must not reach the document head');
});

test('count repeats the tracks of the designs that are built from them', () => {
  const tracks = (config) => (renderLoader(config).html.match(/wavelo__part/g) ?? []).length;
  assert.equal(tracks({ type: 'skeleton-line' }), 0, 'a single line is painted by the element itself');
  assert.equal(tracks({ type: 'skeleton-line', count: 3 }), 3);
  assert.match(renderLoader({ type: 'skeleton-line', count: 3 }).html, /wavelo-stacked/);
  assert.doesNotMatch(renderLoader({ type: 'skeleton-line', count: 1 }).html, /wavelo-stacked/, 'one line needs no stack');
  assert.equal(tracks({ type: 'skeleton-table' }), 6, 'the design keeps its own track count');
  assert.equal(tracks({ type: 'skeleton-table', count: 2 }), 2);
  assert.equal(tracks({ type: 'skeleton-card', count: 1 }), 1);
  assert.equal(tracks({ type: 'progress-steps', count: 4 }), 4);
  assert.equal(tracks({ type: 'ring', count: 4 }), 1, 'a ring is not a row of tracks');
  const options = (id) => loaderRegistry.find((loader) => loader.id === id).options;
  for (const id of ['ring', 'skeleton-avatar', 'image-placeholder', 'three-dots', 'dot-matrix']) {
    assert.ok(!options(id).includes('count'), `${id} advertises a count of tracks it cannot draw`);
  }
  for (const id of ['skeleton-line', 'skeleton-card', 'skeleton-table', 'skeleton-dashboard', 'progress-steps']) {
    assert.ok(options(id).includes('count'), `${id} lost its track count`);
  }
  assert.throws(() => renderLoader({ type: 'skeleton-line', count: 2.5 }), LoaderConfigurationError, 'half a track is a mistake');
  assert.throws(() => renderLoader({ type: 'skeleton-line', count: 0 }), LoaderConfigurationError);
});

test('inline puts the box on the text line where a text line exists', () => {
  const html = (config) => renderLoader(config).html;
  assert.match(html({ type: 'skeleton-line', inline: true }), /wavelo-inline/);
  assert.doesNotMatch(html({ type: 'skeleton-line' }), /wavelo-inline/);
  assert.match(html({ type: 'skeleton-line', inline: true, count: 2 }), /wavelo-inline wavelo-stacked/);
  assert.equal(configFromAttributes({ inline: '' }).inline, true);
  assert.equal(configFromAttributes({ inline: 'false' }).inline, false);
  const options = (id) => loaderRegistry.find((loader) => loader.id === id).options;
  // A fixed overlay is not on anybody's text line, and the measured table has to say so.
  assert.ok(!options('fullscreen').includes('inline'), 'fullscreen advertises an inline it cannot use');
  for (const id of ['ring', 'skeleton-card', 'progress-scroll']) {
    assert.ok(options(id).includes('inline'), `${id} lost its inline alignment`);
  }
});
