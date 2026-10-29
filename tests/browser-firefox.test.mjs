// A Gecko smoke test, not a second copy of the Chromium suite. Its job is to answer
// one question the Chromium-only evidence cannot: does the stylesheet work in an
// engine we did not write it against? So it checks that the rules apply, that the
// documented fallbacks are what a browser without scroll-driven animations actually
// gets, and that every design still paints - and it stops there.
import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { firefox } from 'playwright';
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
  browser = await firefox.launch();
  page = await browser.newPage();
});

test.after(async () => {
  await browser?.close();
});

const setContentPage = async (body, head = `<style>${allStyles}</style>`) => {
  await page.setContent(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`);
  await page.addScriptTag({ content: coreBundle });
};

// Gecko's CSSStyleDeclaration keeps its properties on the prototype, so spreading it
// yields nothing. Ask for each one by name.
const PROPS = ['width', 'height', 'display', 'color', 'borderTopWidth', 'borderRightWidth', 'borderTopColor', 'borderRightColor', 'borderTopLeftRadius', 'animationName', 'animationDuration', 'animationPlayState', 'animationDirection', 'animationIterationCount'];

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

test('Gecko applies the sheet: geometry, border and layout come from the rules', async () => {
  await setContentPage('<div id="case"></div>');
  const ring = await stylesOf({ type: 'ring', label: 'Loading', size: 48 });
  assert.equal(ring.found, true);
  assert.equal(ring.style.borderTopWidth, '3px', 'the stroke default did not reach Gecko');
  // The ring's open end is a transparent side, not a missing one - the same thing
  // the Chromium name-contract test measures.
  assert.equal(ring.style.borderRightWidth, '3px');
  assert.equal(ring.style.borderRightColor, 'rgba(0, 0, 0, 0)', 'the open end of the ring did not reach Gecko');
  assert.equal(ring.style.borderTopLeftRadius, '50%', 'the ring is not round');
  assert.equal(ring.style.display, 'inline-flex');
  assert.equal(ring.style.width, '48px');
  assert.match(ring.style.animationName, /wavelo-spin/);
});

test('paused, direction, theme and reducedMotion behave the same in Gecko', async () => {
  await setContentPage('<div id="case"></div>');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', paused: true })).style.animationPlayState, 'paused');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', direction: 'reverse' })).style.animationDirection, 'reverse');
  const dark = (await stylesOf({ type: 'skeleton-card', label: 'Loading', theme: 'dark' })).style;
  assert.equal(dark.color, 'rgb(165, 180, 252)', 'the dark theme palette did not reach Gecko');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', reducedMotion: 'always' })).style.animationIterationCount, '1');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading' })).style.animationIterationCount, '1', 'the OS preference was ignored');
  assert.equal((await stylesOf({ type: 'ring', label: 'Loading', reducedMotion: 'never' })).style.animationIterationCount, 'infinite', 'never must opt out');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

test('a page can set the tokens and Gecko inherits them', async () => {
  await setContentPage('<div id="case" style="--wavelo-size:64px;--wavelo-stroke:9px;--wavelo-duration:3s"></div>');
  const style = (await stylesOf({ type: 'ring', label: 'Loading' })).style;
  assert.equal(style.width, '64px', 'an ancestor token did not reach the loader');
  assert.equal(style.borderTopWidth, '9px');
  assert.equal(style.animationDuration, '3s');
});

test('the timeline designs animate in Gecko one way or the other, never not at all', async () => {
  for (const type of ['progress-scroll', 'progress-view']) {
    await setContentPage(`<div id="case">${renderLoader({ type, label: 'Loading' }).html}</div>`);
    const read = await page.evaluate(() => {
      const root = document.querySelector('#case .wavelo');
      const animated = [root, ...root.querySelectorAll('.wavelo__part')].find((element) => getComputedStyle(element).animationName !== 'none');
      const animations = document.getAnimations().filter((animation) => animation.effect?.target === animated);
      return {
        name: animated ? getComputedStyle(animated).animationName : 'none',
        onDocumentClock: animations.some((animation) => animation.timeline === document.timeline),
        onOtherTimeline: animations.some((animation) => animation.timeline !== document.timeline)
      };
    });
    assert.notEqual(read.name, 'none', `${type} declared no animation in Gecko`);
    assert.ok(
      read.onDocumentClock || read.onOtherTimeline,
      `${type} has an animation name but no running timeline in Gecko - neither the enhancement nor its fallback is in effect`
    );
  }
});

test('every design paints something visible in Gecko', async () => {
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
  assert.deepEqual(invisible, [], 'these designs rendered nothing visible in Gecko');
});

test('the custom element defines and renders in Gecko', async () => {
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
