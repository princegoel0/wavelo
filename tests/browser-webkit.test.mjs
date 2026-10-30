// A WebKit smoke test, mirroring the Gecko one for the same reason: the stylesheet was
// written against Chromium, and a second engine is the only evidence that the rules, not
// just the markup, travel. WebKit stands in for Safari here, which is the closest thing
// to a Safari-family check available without macOS - it is the same engine, and its
// build is the one Playwright ships.
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { webkit } from 'playwright';
import { allStyles } from '../packages/core/dist/css/index.js';
import { loaderRegistry, renderLoader } from '../packages/core/dist/index.js';

const entry = `
import * as core from '@wavelo/core';
import { defineWaveloElements } from '@wavelo/web-components';
window.Wavelo = { ...core, defineWaveloElements };
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
  browser = await webkit.launch();
  page = await browser.newPage();
});

test.after(async () => {
  await browser?.close();
});

const setContentPage = async (body, head = `<style>${allStyles}</style>`) => {
  await page.setContent(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`);
  await page.addScriptTag({ content: coreBundle });
};

// Read each property by name: a CSSStyleDeclaration's properties are not its own
// enumerable keys in every engine.
const PROPS = ['width', 'height', 'display', 'color', 'borderTopWidth', 'borderRightWidth', 'borderTopColor', 'borderRightColor', 'borderTopLeftRadius', 'backgroundColor', 'backgroundImage', 'maskImage', 'webkitMaskImage', 'animationName', 'animationDuration', 'animationPlayState', 'animationDirection', 'animationIterationCount'];

const stylesOf = (config, selector = '.wavelo') =>
  page.evaluate(
    ({ config, selector, propertyList }) => {
      document.querySelector('#case').innerHTML = window.Wavelo.renderLoader(config).html;
      const element = document.querySelector(`#case ${selector}`);
      if (!element) return { found: false, style: {} };
      const style = getComputedStyle(element);
      return { found: true, style: Object.fromEntries(propertyList.map((property) => [property, style[property]])) };
    },
    { config, selector, propertyList: PROPS }
  );

test('WebKit applies the sheet: geometry, border and layout come from the rules', async () => {
  await setContentPage('<div id="case"></div>');
  const ring = await stylesOf({ type: 'ring', label: 'Loading', size: 48 });
  assert.equal(ring.found, true);
  assert.equal(ring.style.borderTopWidth, '3px', 'the stroke default did not reach WebKit');
  assert.equal(ring.style.borderRightWidth, '3px');
  assert.equal(ring.style.borderRightColor, 'rgba(0, 0, 0, 0)', 'the open end of the ring did not reach WebKit');
  assert.equal(ring.style.borderTopLeftRadius, '50%', 'the ring is not round');
  assert.equal(ring.style.display, 'inline-flex');
  assert.equal(ring.style.width, '48px');
  assert.match(ring.style.animationName, /wavelo-spin/);
});

test('paused, direction, theme and reducedMotion behave the same in WebKit', async () => {
  await setContentPage('<div id="case"></div>');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', paused: true })).style.animationPlayState, 'paused');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', direction: 'reverse' })).style.animationDirection, 'reverse');
  const dark = (await stylesOf({ type: 'skeleton-card', label: 'Loading', theme: 'dark' })).style;
  assert.equal(dark.color, 'rgb(165, 180, 252)', 'the dark theme palette did not reach WebKit');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', reducedMotion: 'always' })).style.animationIterationCount, '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading' })).style.animationIterationCount, '1', 'the OS preference was ignored');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', reducedMotion: 'never' })).style.animationIterationCount, 'infinite', 'never must opt out');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('a page can set the tokens and WebKit inherits them', async () => {
  await setContentPage('<div id="case" style="--wavelo-size:64px;--wavelo-stroke:9px;--wavelo-duration:3s"></div>');
  const style = (await stylesOf({ type: 'ring', label: 'Loading' })).style;
  assert.equal(style.width, '64px', 'an ancestor token did not reach the loader');
  assert.equal(style.borderTopWidth, '9px');
  assert.equal(style.animationDuration, '3s');
});

// The two modern-CSS features the library's headline claims rest on, measured here
// rather than assumed: a conic gradient carved by a mask, and a registered custom
// property interpolated by a transition.
test('mask, conic-gradient and @property carry into WebKit', async () => {
  await setContentPage('<div id="case"></div>');
  const gauge = (await stylesOf({ type: 'progress-half-ring', label: 'Loading', value: 60, max: 100 })).style;
  assert.match(gauge.backgroundImage, /conic-gradient/, 'the gauge lost its conic fill');
  const mask = gauge.maskImage || gauge.webkitMaskImage;
  assert.match(mask, /radial-gradient/, `the gauge reached WebKit unmasked, so it would draw a half disc: ${mask}`);
  const counted = await page.evaluate(() => {
    document.querySelector('#case').innerHTML = window.Wavelo.renderLoader({ type: 'progress-count', value: 60, max: 100, label: 'Loading' }).html;
    return getComputedStyle(document.querySelector('#case .wavelo')).counterReset;
  });
  assert.match(counted, /wavelo-count 60/, `the registered integer did not reach the counter in WebKit: ${counted}`);
});

// Measured on WebKit 27.2: `animation-timeline: scroll()` and `view()` are both
// supported, so these two designs take the enhancement here rather than the document-clock
// fallback that Firefox 157 takes. Both paths are now measured on a real engine; if a
// future WebKit drops the support, this fails and the claim in COMPATIBILITY.md has to be
// re-read rather than quietly left true.
test('the timeline designs run on a ScrollTimeline and a ViewTimeline in WebKit', async () => {
  const expected = { 'progress-scroll': 'ScrollTimeline', 'progress-view': 'ViewTimeline' };
  for (const [type, timeline] of Object.entries(expected)) {
    await page.setContent(`<!doctype html><html><head><style>${allStyles}</style></head><body><div id="case">${renderLoader({ type, label: 'Loading' }).html}</div><div style="height:400vh"></div></body></html>`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.evaluate(() => new Promise((settle) => requestAnimationFrame(() => requestAnimationFrame(settle))));
    const read = await page.evaluate(() => {
      const root = document.querySelector('#case .wavelo');
      const animated = [root, ...root.querySelectorAll('.wavelo__part')].find((element) => getComputedStyle(element).animationName !== 'none');
      const animation = document.getAnimations().find((entry) => entry.effect?.target === animated);
      return {
        name: animated ? getComputedStyle(animated).animationName : 'none',
        timeline: animation?.timeline?.constructor?.name ?? 'no animation',
        onDocumentClock: animation ? animation.timeline === document.timeline : false,
        filled: animated ? animated.getBoundingClientRect().width : 0
      };
    });
    assert.notEqual(read.name, 'none', `${type} declared no animation in WebKit`);
    assert.equal(read.timeline, timeline, `${type} is not driven by a ${timeline} in WebKit: ${read.timeline}`);
    assert.equal(read.onDocumentClock, false, `${type} fell back to the document clock although WebKit supports ${timeline}`);
    assert.ok(read.filled > 0, `${type} drew no fill at half scroll in WebKit`);
  }
});

test('every design paints something visible in WebKit', async () => {
  const body = loaderRegistry
    .map((design) => `<div data-id="${design.id}">${renderLoader({ type: design.id, label: design.name }).html}</div>`)
    .join('');
  await setContentPage(body);
  const invisible = await page.evaluate(() => {
    const hidden = [];
    for (const wrap of document.querySelectorAll('[data-id]')) {
      const root = wrap.querySelector('.wavelo');
      const elements = [root, ...root.querySelectorAll('.wavelo__part')];
      const painted = elements.some((element) => {
        const style = getComputedStyle(element);
        const box = element.getBoundingClientRect();
        const drawn = (value) => value && value !== 'none' && value !== 'rgba(0, 0, 0, 0)' && value !== 'transparent';
        return box.width > 0 && box.height > 0 && (drawn(style.backgroundColor) || drawn(style.backgroundImage) || drawn(style.borderTopColor) || drawn(style.fill) || Number.parseFloat(style.borderTopWidth) > 0);
      });
      if (!painted) hidden.push(wrap.dataset.id);
    }
    return hidden;
  });
  assert.deepEqual(invisible, [], 'these designs rendered nothing visible in WebKit');
});

test('the custom element defines and renders in WebKit', async () => {
  await setContentPage('<wavelo-loader id="element" type="three-dots" label="Loading" paused></wavelo-loader>');
  const read = await page.evaluate(() => {
    window.Wavelo.defineWaveloElements();
    const element = document.getElementById('element');
    const loader = element.querySelector('.wavelo');
    const before = loader.className;
    element.setAttribute('type', 'ring');
    return { before, after: element.querySelector('.wavelo').className, paused: getComputedStyle(element.querySelector('.wavelo')).animationPlayState, sheets: document.querySelectorAll('style[data-wavelo-style]').length };
  });
  assert.match(read.before, /wavelo--three-dots/);
  assert.match(read.after, /wavelo--ring/, 'the element did not re-render on an attribute change');
  assert.equal(read.paused, 'paused');
  assert.ok(read.sheets >= 1, 'the element rendered without injecting its stylesheet');
});
