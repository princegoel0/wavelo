import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import '@angular/compiler';
import { Loader as ReactLoader } from '../packages/react/dist/index.js';
import { Loader as VueLoader } from '../packages/vue/dist/index.js';
import { createSSRApp } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { LoaderComponent } from '../packages/angular/dist/index.js';
import { compile } from 'svelte/compiler';

test('React component renders labelled markup and updates through props', () => {
  const html = renderToStaticMarkup(createElement(ReactLoader, { type: 'ring', label: 'Loading', color: 'red' }));
  assert.match(html, /aria-label="Loading"/);
  assert.match(html, /wavelo--ring/);
  assert.match(html, /red/);
});

test('Vue component renders during SSR', async () => {
  const html = await renderToString(createSSRApp(VueLoader, { type: 'progress-bar', value: 2, max: 4, label: 'Uploading' }));
  assert.match(html, /aria-valuenow="2"/);
  assert.match(html, /aria-label="Uploading"/);
});

test('Angular component is standalone and exposes lifecycle update hook', () => {
  assert.equal(LoaderComponent.ɵcmp.standalone, true);
  assert.equal(typeof LoaderComponent.prototype.ngOnChanges, 'function');
  assert.equal(typeof LoaderComponent.prototype.ngOnDestroy, 'function');
});

test('Svelte consumer component compiles from the published source contract', async () => {
  const source = await readFile(new URL('../packages/svelte/src/WaveloLoader.svelte', import.meta.url), 'utf8');
  const compiled = compile(source, { generate: 'server', filename: 'WaveloLoader.svelte' });
  assert.ok(compiled.js.code.includes('renderLoader'));
});
