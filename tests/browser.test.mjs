import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { allStyles } from '../packages/core/dist/css/index.js';
import { loaderRegistry, renderLoader } from '../packages/core/dist/index.js';

const entry = `
import * as core from '@wavelo/core';
import { defineWaveloElements, WaveloLoaderElement } from '@wavelo/web-components';
window.Wavelo = { ...core, defineWaveloElements, WaveloLoaderElement };
`;

const { outputFiles } = await build({
  stdin: { contents: entry, resolveDir: process.cwd(), sourcefile: 'browser-entry.ts', loader: 'ts' },
  bundle: true,
  format: 'iife',
  platform: 'browser',
  write: false,
  logLevel: 'silent'
});
const coreBundle = new TextDecoder().decode(outputFiles[0].contents);

let browser;
let page;

test.before(async () => {
  browser = await chromium.launch();
  page = await browser.newPage();
});

test.after(async () => {
  await browser?.close();
});

async function setContentPage(body, head = `<style>${allStyles}</style>`) {
  await page.setContent(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`);
  await page.addScriptTag({ content: coreBundle });
}

async function loadCases(cases, head) {
  const body = cases.map((item) => `<div data-case="${item.name}">${renderLoader(item.config).html}</div>`).join('');
  await setContentPage(body, head);
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('[data-case]')].map((wrap) => {
      const root = wrap.querySelector('.wavelo');
      const target = [...wrap.querySelectorAll('*')].find((element) => getComputedStyle(element).animationName !== 'none') ?? root;
      const style = getComputedStyle(target);
      const live = document.getAnimations().find((animation) => animation.effect?.target === target);
      return {
        case: wrap.dataset.case,
        name: style.animationName,
        playState: style.animationPlayState,
        livePlayState: live ? live.playState : 'none',
        direction: style.animationDirection,
        duration: style.animationDuration,
        iterations: style.animationIterationCount
      };
    })
  );
  return new Map(rows.map((row) => [row.case, row]));
}

test('paused stops the animation on every kind of animating element', async () => {
  const rows = await loadCases([
    { name: 'ring', config: { type: 'ring', paused: true } },
    { name: 'dots', config: { type: 'three-dots', paused: true } },
    { name: 'bars', config: { type: 'equalizer', paused: true } },
    { name: 'skeleton', config: { type: 'skeleton-card', paused: true } },
    { name: 'orbit', config: { type: 'orbiting-dots', paused: true } },
    { name: 'running', config: { type: 'ring' } }
  ]);
  for (const name of ['ring', 'dots', 'bars', 'skeleton', 'orbit']) {
    assert.equal(rows.get(name).playState, 'paused', `${name} computed play-state`);
    assert.equal(rows.get(name).livePlayState, 'paused', `${name} live animation`);
  }
  assert.equal(rows.get('running').playState, 'running');
  assert.equal(rows.get('running').livePlayState, 'running');
});

test('reverse reverses the animation without disturbing structural counter-rotation', async () => {
  const rows = await loadCases([
    { name: 'ring', config: { type: 'ring', direction: 'reverse' } },
    { name: 'dots', config: { type: 'three-dots', direction: 'reverse' } },
    { name: 'bars', config: { type: 'equalizer', direction: 'reverse' } },
    { name: 'normal', config: { type: 'ring' } },
    { name: 'dual-ring', config: { type: 'dual-ring' } }
  ]);
  for (const name of ['ring', 'dots', 'bars']) assert.equal(rows.get(name).direction, 'reverse', name);
  assert.equal(rows.get('normal').direction, 'normal');
  const pseudo = await page.evaluate(() => {
    const element = document.querySelector('[data-case="dual-ring"] .wavelo');
    return getComputedStyle(element, '::after').animationDirection;
  });
  assert.equal(pseudo, 'reverse', 'dual-ring outer layer is authored to run the other way');
});

test('reducedMotion always reduces without an OS preference, and never overrides one', async () => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const rows = await loadCases([
    { name: 'auto', config: { type: 'ring', reducedMotion: 'auto' } },
    { name: 'always', config: { type: 'ring', reducedMotion: 'always' } },
    { name: 'never', config: { type: 'ring', reducedMotion: 'never' } },
    { name: 'dots', config: { type: 'three-dots', reducedMotion: 'always' } }
  ]);
  assert.equal(rows.get('auto').duration, '1s');
  assert.equal(rows.get('never').duration, '1s');
  assert.ok(Number.parseFloat(rows.get('always').duration) <= 0.001, `always: ${rows.get('always').duration}`);
  assert.equal(rows.get('always').iterations, '1');
  const inner = await page.evaluate(() => getComputedStyle(document.querySelector('[data-case="dots"] .wavelo__part')).animationDuration);
  assert.ok(Number.parseFloat(inner) <= 0.001, `inner part: ${inner}`);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const reduced = await loadCases([
    { name: 'auto', config: { type: 'ring', reducedMotion: 'auto' } },
    { name: 'always', config: { type: 'ring', reducedMotion: 'always' } },
    { name: 'never', config: { type: 'ring', reducedMotion: 'never' } }
  ]);
  assert.ok(Number.parseFloat(reduced.get('auto').duration) <= 0.001);
  assert.ok(Number.parseFloat(reduced.get('always').duration) <= 0.001);
  assert.equal(reduced.get('never').duration, '1s', 'never must opt out of a system preference');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('theme selects the skeleton palette', async () => {
  const readPalette = async (config) => {
    await setContentPage(renderLoader({ type: 'skeleton-card', ...config }).html);
    return page.evaluate(() => getComputedStyle(document.querySelector('.wavelo__part')).backgroundImage);
  };
  const light = await readPalette({});
  assert.equal(light, await readPalette({ theme: 'light' }), 'the default theme must stay light');
  assert.match(light, /229, 231, 235/);
  const dark = await readPalette({ theme: 'dark' });
  assert.doesNotMatch(dark, /229, 231, 235/);
  assert.match(dark, /55, 65, 81/);

  await page.emulateMedia({ colorScheme: 'dark' });
  assert.match(await readPalette({ theme: 'system' }), /55, 65, 81/, 'system follows the preference');
  assert.equal(await readPalette({}), light, 'an unset theme must not react to the system preference');
  await page.emulateMedia({ colorScheme: 'light' });
});

test('a shared stylesheet slice is injected once per document, however many loaders use it', async () => {
  const hosts = Array.from({ length: 12 }, (_, index) => `<div id="host-${index}"></div>`).join('');
  await setContentPage(hosts, '');
  const counts = await page.evaluate(() => {
    const ids = ['three-dots', 'three-dots', 'bouncing-dots', 'vertical-dots', 'three-dots', 'four-dots', 'five-dots', 'three-dots', 'skeleton-card', 'progress-bar', 'ring', 'ring'];
    ids.forEach((type, index) => {
      window.Wavelo.mountLoader(document.getElementById(`host-${index}`), { type, label: 'Loading' });
    });
    return {
      loaders: document.querySelectorAll('.wavelo').length,
      headSlices: document.querySelectorAll('head style[data-wavelo-style]').length,
      bodySlices: document.querySelectorAll('body style[data-wavelo-style]').length,
      totalCssBytes: [...document.querySelectorAll('style[data-wavelo-style]')].reduce((sum, element) => sum + element.textContent.length, 0)
    };
  });
  assert.equal(counts.loaders, 12);
  assert.equal(counts.bodySlices, 0, 'mountLoader must not leave a style element inside the host');
  // eight dots-family loaders share one slice (vertical-dots is a wave design, so
  // the wave slice joins too), plus skeleton, progress and ring.
  assert.equal(counts.headSlices, 5, `expected five slices (dots, wave, skeleton, progress, ring), got ${counts.headSlices}`);
  assert.ok(counts.totalCssBytes < allStyles.length * 2, `injected CSS grew with the number of loaders: ${counts.totalCssBytes} bytes`);
});

test('the same slice requested twice adds no element', async () => {
  await setContentPage('<div id="one"></div><div id="two"></div>', '');
  const tags = await page.evaluate(() => {
    window.Wavelo.mountLoader(document.getElementById('one'), { type: 'ring', label: 'Loading' });
    window.Wavelo.mountLoader(document.getElementById('two'), { type: 'gradient-ring', label: 'Loading' });
    return document.querySelectorAll('style[data-wavelo-style]').length;
  });
  assert.equal(tags, 1, 'ring and gradient-ring share the ring slice');
});

test('a design renders the same with only the stylesheet slice its entry point ships', async () => {
  const properties = ['animationName', 'animationDuration', 'animationTimingFunction', 'animationDelay', 'width', 'height', 'borderRadius', 'borderTopWidth', 'borderRightColor', 'backgroundImage', 'transform', 'opacity', 'display', 'position', 'gap'];
  const script = `(() => {
    for (const animation of document.getAnimations()) { animation.pause(); animation.currentTime = 0; }
    const read = (element) => ${JSON.stringify(properties)}.map((property) => getComputedStyle(element)[property]).join('|');
    const shape = (root) => ({ root: read(root), parts: [...root.querySelectorAll('.wavelo__part')].map(read).join('||') });
    const scopes = [...document.querySelectorAll('[data-design] .wavelo')];
    return scopes.map(shape);
  })()`;

  await setContentPage(loaderRegistry.map((loader) => `<div data-design="${loader.id}">${renderLoader({ type: loader.id, label: loader.name }).html}</div>`).join(''));
  const shared = await page.evaluate(script);
  const byDesign = new Map(loaderRegistry.map((loader, index) => [loader.id, shared[index]]));

  for (const loader of loaderRegistry) {
    const result = renderLoader({ type: loader.id, label: loader.name });
    await page.setContent(`<!doctype html><html><head><style>${result.css}</style></head><body><div data-design="${loader.id}">${result.html}</div></body></html>`);
    const [isolated] = await page.evaluate(script);
    assert.deepEqual(isolated, byDesign.get(loader.id), `${loader.id} renders differently from its own slice alone`);
  }
});

test('the custom element renders from attributes and re-renders on change', async () => {
  await setContentPage('<wavelo-loader id="element" type="ring" label="Loading data"></wavelo-loader>', '');
  const first = await page.evaluate(() => {
    window.Wavelo.defineWaveloElements();
    const element = document.getElementById('element');
    window.Wavelo.defineWaveloElements();
    return {
      markup: element.innerHTML,
      slices: document.querySelectorAll('style[data-wavelo-style]').length,
      registered: customElements.get('wavelo-loader') === window.Wavelo.WaveloLoaderElement
    };
  });
  assert.match(first.markup, /class="wavelo wavelo--ring wavelo--ring"/);
  assert.match(first.markup, /aria-label="Loading data"/);
  assert.equal(first.registered, true, 'defining twice must not throw or re-register');

  const updated = await page.evaluate(async () => {
    const element = document.getElementById('element');
    element.setAttribute('type', 'progress-bar');
    element.setAttribute('value', '30');
    element.setAttribute('max', '60');
    element.setAttribute('paused', '');
    await new Promise((resolveFrame) => requestAnimationFrame(resolveFrame));
    const style = getComputedStyle(element.querySelector('.wavelo'));
    return {
      markup: element.innerHTML,
      role: element.querySelector('.wavelo').getAttribute('role'),
      playState: style.animationPlayState,
      slices: document.querySelectorAll('style[data-wavelo-style]').length
    };
  });
  assert.match(updated.markup, /aria-valuenow="30"/);
  assert.match(updated.markup, /wavelo--progress-bar/);
  assert.equal(updated.role, 'progressbar');
  assert.equal(updated.playState, 'paused');
  assert.equal(updated.slices, 2, 'the progress slice joins the ring slice without duplicating it');
});

test('data attributes survive the browser round trip', async () => {
  await setContentPage(renderLoader({ type: 'ring', label: 'Loading', 'data-testid': 'probe', 'data-analytics': 'section "a"' }).html);
  const attrs = await page.evaluate(() => {
    const element = document.querySelector('.wavelo');
    return { testid: element.getAttribute('data-testid'), analytics: element.getAttribute('data-analytics'), nestedScripts: element.querySelectorAll('script').length };
  });
  assert.deepEqual(attrs, { testid: 'probe', analytics: 'section "a"', nestedScripts: 0 });
});

test('documentation gallery renders and has no axe violations', async () => {
  const axe = await readFile(resolve('node_modules/axe-core/axe.min.js'), 'utf8');
  const galleryHtml = await readFile(resolve('apps/docs/dist/index.html'), 'utf8');
  assert.ok(galleryHtml.includes(`data-wavelo-style`), 'the gallery embeds one stylesheet element');
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end(galleryHtml);
  });
  await new Promise((resolveListen) => server.listen(0, resolveListen));
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const galleryPage = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  galleryPage.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  galleryPage.on('pageerror', (error) => pageErrors.push(error.message));
  await galleryPage.goto(`http://127.0.0.1:${address.port}`);
  assert.equal(await galleryPage.locator('.card').count(), loaderRegistry.length);
  assert.equal(await galleryPage.locator('.wavelo').count(), loaderRegistry.length);
  await galleryPage.emulateMedia({ reducedMotion: 'reduce' });
  const reducedDuration = await galleryPage.locator('.card .wavelo').first().evaluate((element) => getComputedStyle(element).animationDuration);
  assert.ok(Number.parseFloat(reducedDuration) <= 0.000001, `unexpected reduced-motion duration: ${reducedDuration}`);
  await galleryPage.emulateMedia({ reducedMotion: 'no-preference' });
  await galleryPage.addScriptTag({ content: axe });
  const report = await galleryPage.evaluate(async () => await window.axe.run());
  assert.deepEqual(report.violations, []);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(pageErrors, []);
  await galleryPage.close();
  server.close();
});
