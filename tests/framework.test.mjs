import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import '@angular/compiler';
import { loaderAttributes, loaderConfigKeys, renderLoader } from '../packages/core/dist/index.js';
import { Loader as ReactLoader, renderReactLoader } from '../packages/react/dist/index.js';
import { Loader as VueLoader } from '../packages/vue/dist/index.js';
import { LoaderComponent } from '../packages/angular/dist/index.js';
import { compile } from 'svelte/compiler';

const fullConfig = {
  type: 'progress-bar',
  size: 48,
  width: 90,
  height: 12,
  color: '#112233',
  secondaryColor: '#445566',
  backgroundColor: '#778899',
  speed: 2,
  duration: '3s',
  strokeWidth: 5,
  theme: 'dark',
  direction: 'reverse',
  paused: true,
  label: 'Working',
  className: 'adapter-case',
  style: { '--wavelo-radius': '9px' },
  reducedMotion: 'never',
  'data-testid': 'adapter',
  value: 30,
  max: 60,
  'data-analytics': 'adapter-section'
};

const expectedMarkers = [
  '--wavelo-size:48px',
  '--wavelo-width:90px',
  '--wavelo-height:12px',
  '--wavelo-color:#112233',
  '--wavelo-secondary-color:#445566',
  '--wavelo-background:#778899',
  '--wavelo-duration:3s',
  '--wavelo-stroke:5px',
  'data-wavelo-theme="dark"',
  '--wavelo-direction:reverse',
  '--wavelo-play-state:paused',
  'aria-label="Working"',
  'adapter-case',
  '--wavelo-radius:9px',
  'data-wavelo-motion="never"',
  'data-testid="adapter"',
  'aria-valuenow="30"',
  'aria-valuemax="60"',
  'data-analytics="adapter-section"'
];

function assertCarriesEveryKey(html, adapter) {
  for (const marker of expectedMarkers) {
    assert.ok(html.includes(marker), `${adapter} dropped ${marker}`);
  }
}

test('React component renders every configuration key without inlining styles', () => {
  const html = renderToStaticMarkup(createElement(ReactLoader, fullConfig));
  assertCarriesEveryKey(html, 'React');
  assert.match(html, /class="wavelo-host"/);
  assert.doesNotMatch(html, /<style/);
  assert.equal(renderToStaticMarkup(createElement(ReactLoader, fullConfig)), html);
});

test('React server helper returns the design slice for head injection', () => {
  const result = renderReactLoader({ type: 'ring', label: 'Loading' });
  assert.equal(result.css, renderLoader({ type: 'ring', label: 'Loading' }).css);
  assert.match(result.css, /\.wavelo\{/);
  assert.doesNotMatch(result.css, /\.wavelo--skeleton-card/);
});

test('Vue component declares the full configuration surface', () => {
  const expected = loaderConfigKeys.filter((key) => !key.startsWith('data-')).sort();
  assert.deepEqual(Object.keys(VueLoader.props).sort(), expected);
});

test('Vue component renders every configuration key without inlining styles', async () => {
  const html = await renderToString(createSSRApp(VueLoader, fullConfig));
  assertCarriesEveryKey(html, 'Vue');
  assert.doesNotMatch(html, /<style/);
});

test('Angular component declares the full configuration surface', () => {
  const declared = Object.keys(LoaderComponent.ɵcmp.declaredInputs);
  for (const key of loaderConfigKeys) {
    if (key === 'style') continue; // bound as waveloStyle, which Angular reserves otherwise
    assert.ok(declared.includes(key), `Angular input missing: ${key}`);
  }
  assert.ok(declared.includes('style'));
  assert.equal(LoaderComponent.ɵcmp.declaredInputs.style, 'waveloStyle');
  assert.equal(LoaderComponent.ɵcmp.standalone, true);
  assert.equal(typeof LoaderComponent.prototype.ngOnChanges, 'function');
  assert.equal(typeof LoaderComponent.prototype.ngOnDestroy, 'function');
});

test('Svelte component compiles for client and server without legacy syntax', async () => {
  const source = await readFile(new URL('../packages/svelte/src/WaveloLoader.svelte', import.meta.url), 'utf8');
  const client = compile(source, { generate: 'client', filename: 'WaveloLoader.svelte' });
  const server = compile(source, { generate: 'server', filename: 'WaveloLoader.svelte' });
  assert.deepEqual(client.warnings, []);
  assert.deepEqual(server.warnings, []);
  // The component forwards its props object to the core renderer, so it accepts
  // every key by construction rather than by an enumerated list.
  assert.match(source, /const config: LoaderConfig = \$props\(\)/);
  assert.match(source, /renderLoader\(config\)/);
  assert.match(source, /ensureStyles\(rendered\.css\)/);
});

test('the custom element observes every configuration attribute', async () => {
  const { WaveloLoaderElement } = await import('../packages/web-components/dist/index.js');
  assert.deepEqual([...WaveloLoaderElement.observedAttributes].sort(), [...loaderAttributes].sort());
});
