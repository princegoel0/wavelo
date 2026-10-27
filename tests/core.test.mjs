import test from 'node:test';
import assert from 'node:assert/strict';
import { getCanonicalLoaderDefinition, loaderRegistry, renderLoader, LoaderConfigurationError } from '../packages/core/dist/index.js';

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

test('deprecated catalog aliases preserve their public IDs while rendering canonical behavior', () => {
  for (const definition of loaderRegistry.filter((loader) => loader.deprecated)) {
    const result = renderLoader({ type: definition.id, label: definition.name });
    assert.equal(result.fallback, false, definition.id);
    assert.match(result.html, new RegExp(`wavelo--${definition.aliasOf}`));
    assert.equal(result.definition.id, definition.aliasOf);
  }
});

test('rendering is deterministic and accessible when labelled', () => {
  const result = renderLoader({ type: 'orbiting-dots', label: 'Loading data', size: 48 });
  assert.match(result.html, /role="status"/);
  assert.match(result.html, /aria-label="Loading data"/);
  assert.match(result.css, /prefers-reduced-motion/);
});

test('progress values use supplied measurements only', () => {
  const result = renderLoader({ type: 'progress-bar', value: 25, max: 50, label: 'Uploading' });
  assert.match(result.html, /aria-valuenow="25"/);
  assert.match(result.html, /--wavelo-progress:50%/);
});

test('unsafe configuration is rejected', () => {
  assert.throws(() => renderLoader({ type: 'inline', color: '<script>' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', style: { '--wavelo-color': 'red;' } }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', duration: 'expression(alert(1))' }), LoaderConfigurationError);
  assert.throws(() => renderLoader({ type: 'inline', max: 0 }), LoaderConfigurationError);
});

test('every registered design renders its own stable identity', () => {
  for (const definition of loaderRegistry) {
    const result = renderLoader({ type: definition.id, label: definition.name });
    assert.equal(result.fallback, false, definition.id);
    assert.match(result.html, new RegExp(`wavelo--${getCanonicalLoaderDefinition(definition).id}`));
    assert.match(result.html, /aria-label=/);
  }
});

test('reduced motion and common customization are serialized consistently', () => {
  const result = renderLoader({
    type: 'gradient-ring',
    size: '3rem',
    width: 80,
    height: 40,
    duration: '2s',
    strokeWidth: 4,
    reducedMotion: 'always',
    paused: true,
    style: { '--wavelo-color': '#123456' }
  });
  assert.match(result.html, /data-wavelo-motion="always"/);
  assert.match(result.html, /--wavelo-width:80px/);
  assert.match(result.html, /--wavelo-duration:2s/);
  assert.match(result.html, /--wavelo-play-state:paused/);
  assert.match(result.html, /--wavelo-color:#123456/);
});

test('documented individual loader exports are importable', async () => {
  for (const [entry, id] of [
    ['orbit', 'orbiting-dots'],
    ['pulse', 'pulsing-dots'],
    ['spinner', 'circular'],
    ['skeleton', 'skeleton-card'],
    ['progress', 'progress-bar']
  ]) {
    const module = await import(`../packages/core/dist/loaders/${entry}.js`);
    const result = module[entry]({ label: id });
    assert.equal(result.definition.id, id === 'circular' ? 'ring' : id);
    assert.equal(result.fallback, false);
  }
});

test('every registered loader has a working modular entry point', async () => {
  for (const definition of loaderRegistry) {
    const exportName = definition.id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const module = await import(`../packages/core/dist/loaders/${definition.id}.js`);
    assert.equal(typeof module[exportName], 'function', definition.id);
    const result = module[exportName]({ label: definition.name });
    assert.equal(result.definition.id, definition.aliasOf ?? definition.id);
    assert.equal(result.fallback, false);
  }
});

test('Web Components package can be imported during SSR', async () => {
  const module = await import('../packages/web-components/dist/index.js');
  assert.equal(typeof module.defineWaveloElements, 'function');
  module.defineWaveloElements();
});
