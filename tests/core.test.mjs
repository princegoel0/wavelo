import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { getCanonicalLoaderDefinition, loaderAttributes, loaderConfigKeys, loaderRegistry, renderLoader, LoaderConfigurationError } from '../packages/core/dist/index.js';

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
    'backgroundColor', 'className', 'color', 'data-testid', 'direction', 'duration', 'height', 'label', 'max',
    'paused', 'reducedMotion', 'secondaryColor', 'size', 'speed', 'strokeWidth', 'style', 'theme', 'type', 'value', 'width'
  ]);
  assert.equal(loaderAttributes.length, loaderConfigKeys.length);
  assert.ok(loaderAttributes.includes('secondary-color'));
  assert.ok(loaderAttributes.includes('data-testid'));
});

test('an unknown type renders the default design and reports the substitution', () => {
  const result = renderLoader({ type: 'definitely-not-a-design', label: 'Loading' });
  assert.equal(result.fallback, true);
  assert.equal(result.definition.id, 'inline');
  assert.equal(renderLoader({ label: 'Loading' }).fallback, false);
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
  assert.match(css, /\.wavelo--progress-ring\{[^}]*min-width:0/);
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
