import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import '@angular/compiler';
import { loaderAttributes, loaderConfigKeys, renderLoader } from '../packages/core/dist/index.js';
import { Loader as ReactLoader, loaderFor as reactLoaderFor, renderReactLoader } from '../packages/react/dist/index.js';
import { Loader as VueLoader, loaderFor as vueLoaderFor } from '../packages/vue/dist/index.js';
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
  loading: true,
  inline: true,
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
  'wavelo-inline',
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

test('a loader that is not loading renders nothing through the components', async () => {
  assert.equal(renderToStaticMarkup(createElement(ReactLoader, { ...fullConfig, loading: false })), '');
  const vue = await renderToString(createSSRApp(VueLoader, { ...fullConfig, loading: false }));
  assert.ok(!vue.includes('wavelo-host'), `Vue emitted markup for a hidden loader: ${vue}`);
});

test('count and inline reach the markup through the components', () => {
  const counted = renderToStaticMarkup(createElement(ReactLoader, { type: 'skeleton-line', count: 3 }));
  assert.equal((counted.match(/wavelo__part/g) ?? []).length, 3);
  assert.match(counted, /wavelo-stacked/);
  const inlined = renderToStaticMarkup(createElement(ReactLoader, { type: 'skeleton-line', inline: true }));
  assert.match(inlined, /wavelo-inline/);
});

test('loaderFor binds a design and its house options once', () => {
  const ButtonSpinner = reactLoaderFor('ring', { size: 16, color: '#ffffff' });
  const html = renderToStaticMarkup(createElement(ButtonSpinner, { label: 'Saving' }));
  assert.match(html, /wavelo--ring/, 'the bound design must render');
  assert.match(html, /--wavelo-size:16px/, 'the bound option must apply');
  assert.match(html, /--wavelo-color:#ffffff/);
  assert.equal(ButtonSpinner.displayName, 'WaveloRing');
  // A call-site option still wins over the bound one.
  assert.match(renderToStaticMarkup(createElement(ButtonSpinner, { size: 40 })), /--wavelo-size:40px/);
  const Lines = reactLoaderFor('skeleton-line', { count: 3 });
  assert.match(renderToStaticMarkup(createElement(Lines, {})), /wavelo-stacked/);
  assert.equal(renderToStaticMarkup(createElement(Lines, { loading: false })), '');
});

test('Vue component declares the full configuration surface', () => {
  const expected = loaderConfigKeys.filter((key) => !key.startsWith('data-')).sort();
  assert.deepEqual(Object.keys(VueLoader.props).sort(), expected);
});

test('Vue loaderFor binds a design and its house options once', async () => {
  const ButtonSpinner = vueLoaderFor('ring', { size: 16 });
  const html = await renderToString(createSSRApp(ButtonSpinner, { label: 'Saving' }));
  assert.match(html, /wavelo--ring/);
  assert.match(html, /--wavelo-size:16px/);
  assert.match(html, /wavelo-host/, 'Vue keeps its host element while it renders');
  assert.match(await renderToString(createSSRApp(vueLoaderFor('skeleton-card', { theme: 'dark' }))), /data-wavelo-theme="dark"/);
  // A boolean option the call site never passed must stay absent: Vue casts an
  // absent Boolean prop to false, which would silently override a bound default.
  const Paused = vueLoaderFor('ring', { paused: true });
  assert.match(await renderToString(createSSRApp(Paused, {})), /--wavelo-play-state:paused/);
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
  assert.match(source, /renderLoader\(mergeWaveloConfig\(defaults, config\)\)/);
  assert.match(source, /ensureStyles\(rendered\.css\)/);
  // The component inlines the context key because a consumer's bundler resolves
  // only package imports from the shipped source; it must stay the exported one.
  const svelte = await import('../packages/svelte/dist/index.js');
  assert.equal(source.includes(`'${svelte.WAVELO_DEFAULTS_KEY}'`), true, 'the Svelte context key drifted from the exported constant');
});

test('registered defaults apply underneath a loader and lose to its own options', async () => {
  const { createWavelo } = await import('../packages/core/dist/index.js');
  const { renderReactLoader } = await import('../packages/react/dist/index.js');
  const { renderVueLoader } = await import('../packages/vue/dist/index.js');
  const { renderSvelteLoader } = await import('../packages/svelte/dist/index.js');
  const { renderAngularLoader } = await import('../packages/angular/dist/index.js');
  const defaults = { color: '#ff0000', size: 64, speed: 0.5, label: 'Loading', reducedMotion: 'never' };

  // The same defaults, applied through each documented entry point, must produce
  // the same markup.
  const expected = createWavelo(defaults).render({ type: 'ring' }).html;
  for (const [name, html] of Object.entries({
    core: expected,
    react: renderReactLoader({ type: 'ring' }, defaults).html,
    vue: renderVueLoader({ type: 'ring' }, defaults).html,
    svelte: renderSvelteLoader({ type: 'ring' }, defaults).html,
    angular: renderAngularLoader({ type: 'ring' }, defaults).html
  })) {
    assert.equal(html, expected, `${name} did not apply the registered defaults`);
  }
  assert.match(expected, /--wavelo-color:#ff0000/);
  assert.match(expected, /--wavelo-size:64px/);
  assert.match(expected, /--wavelo-duration:2s/);
  assert.match(expected, /aria-label="Loading"/);
  assert.match(expected, /data-wavelo-motion="never"/);

  // An option on the loader itself wins, and an `undefined` in its config must not
  // erase a default.
  const overridden = createWavelo(defaults).render({ type: 'ring', size: 20, color: undefined });
  assert.match(overridden.html, /--wavelo-size:20px/);
  assert.match(overridden.html, /--wavelo-color:#ff0000/, 'an explicit undefined must not clear a default colour');
});

test('the custom element observes every configuration attribute', async () => {
  const { WaveloLoaderElement } = await import('../packages/web-components/dist/index.js');
  assert.deepEqual([...WaveloLoaderElement.observedAttributes].sort(), [...loaderAttributes].sort());
});
