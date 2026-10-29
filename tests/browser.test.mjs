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
    // A scroll-driven animation reads its progress from its timeline, and
    // assigning it a numeric currentTime throws; pausing holds it where it is.
    for (const animation of document.getAnimations()) { animation.pause(); if (animation.timeline === document.timeline) animation.currentTime = 0; }
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

test('every determinate design reflects its value in the browser', async () => {
  const ids = loaderRegistry.filter((loader) => loader.kind === 'progress').map((loader) => loader.id);
  const values = [0, 50, 100];
  const body = ids
    .flatMap((id) => values.map((value) => `<div data-key="${id}@${value}">${renderLoader({ type: id, value, max: 100, label: 'Working' }).html}</div>`))
    .join('');
  await setContentPage(body);

  const rows = await page.evaluate(() => {
    const viewport = window.innerWidth;
    return [...document.querySelectorAll('[data-key]')].map((wrap) => {
      const root = wrap.querySelector('.wavelo');
      const parts = [...root.querySelectorAll('.wavelo__part')];
      const rootStyle = getComputedStyle(root);
      const rect = root.getBoundingClientRect();
      const animated = parts.find((part) => getComputedStyle(part).animationName !== 'none') ?? root;
      const live = document.getAnimations().find((animation) => animation.effect?.target === animated);
      return {
        key: wrap.dataset.key,
        role: root.getAttribute('role'),
        valuenow: root.getAttribute('aria-valuenow'),
        position: rootStyle.position,
        rootWidth: rect.width,
        rootHeight: rect.height,
        viewport,
        backgroundImage: rootStyle.backgroundImage,
        partCount: parts.length,
        partWidth: parts.length ? parts[0].getBoundingClientRect().width : 0,
        filled: parts.filter((part) => part.dataset.waveloStep === 'filled').length,
        animation: getComputedStyle(animated).animationName,
        playState: live ? live.playState : 'none'
      };
    });
  });
  const at = (id, value) => rows.find((row) => row.key === `${id}@${value}`);

  for (const id of ids) {
    for (const value of values) {
      const row = at(id, value);
      assert.equal(row.role, 'progressbar', `${id}@${value} role`);
      assert.equal(row.valuenow, String(value), `${id}@${value} aria-valuenow`);
    }
  }

  // The ring must be a circle: a rectangular conic gradient reads as a pie, not a ring.
  for (const value of values) {
    const row = at('progress-ring', value);
    assert.equal(row.rootWidth, row.rootHeight, `progress-ring@${value} is ${row.rootWidth}x${row.rootHeight}, not square`);
    assert.ok(row.backgroundImage.includes('conic-gradient'), `progress-ring@${value} has no conic fill`);
    assert.ok(row.backgroundImage.includes(`${value}%`), `progress-ring@${value} fill does not match the value: ${row.backgroundImage}`);
  }

  // Steps are discrete: the number of filled steps must follow the value.
  const expectedFilled = { 0: 0, 50: 3, 100: 5 };
  for (const value of values) {
    const row = at('progress-steps', value);
    assert.equal(row.partCount, 5, 'progress-steps must render five steps');
    assert.equal(row.filled, expectedFilled[value], `progress-steps@${value} filled ${row.filled} of 5`);
  }

  // Bar-shaped designs must fill in proportion to the value, not saturate early.
  for (const id of ['progress-bar', 'segmented-bar', 'progress-upload', 'page-transition']) {
    const widths = values.map((value) => at(id, value).partWidth);
    const track = at(id, 100).partWidth;
    assert.ok(widths[0] < widths[1] && widths[1] < widths[2], `${id} fill is not monotonic in value: ${widths}`);
    assert.ok(Math.abs(widths[1] - track / 2) <= 1, `${id} at 50 fills ${widths[1]}px of a ${track}px track`);
    assert.ok(Math.abs(widths[2] - track) <= 1, `${id} at 100 fills ${widths[2]}px of a ${track}px track`);
  }

  // Two designs carry motion to signal activity, and both must actually run.
  assert.equal(at('progress-upload', 50).animation, 'wavelo-upload');
  assert.equal(at('page-transition', 50).animation, 'wavelo-transition');
  for (const id of ['progress-upload', 'page-transition']) {
    assert.equal(at(id, 50).playState, 'running', `${id} animation is not running`);
  }

  // The top-of-page bar is fixed and spans the viewport, by design.
  const top = at('progress-top', 50);
  assert.equal(top.position, 'fixed');
  assert.equal(top.rootWidth, top.viewport, 'progress-top must span the viewport');
  assert.ok(Math.abs(top.partWidth - top.viewport / 2) <= 1, `progress-top at 50 fills ${top.partWidth}px of ${top.viewport}px`);
});

test('the scroll-driven bar follows the document scroll position without JavaScript', async () => {
  // The second bar sits inside an `overflow: hidden` wrapper, which is itself a
  // scroll container: a `scroll(nearest)` timeline would bind to it, find nothing
  // to scroll and go inactive. `scroll(root block)` must keep tracking the page.
  const markup = renderLoader({ type: 'progress-scroll', label: 'Reading progress' }).html;
  const body =
    `<div id="bar">${markup}</div>` +
    `<div id="boxed" style="height:6rem;display:grid;place-items:center;overflow:hidden">${markup}</div>` +
    '<div style="height:3000px"></div>';
  await setContentPage(body);
  const settle = () => page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const read = () =>
    page.evaluate(() => {
      const probe = (id) => {
        const root = document.querySelector(`#${id} .wavelo`);
        const part = root.querySelector('.wavelo__part');
        const animation = document.getAnimations().find((entry) => entry.effect?.target === part);
        return {
          track: root.getBoundingClientRect().width,
          fill: part.getBoundingClientRect().width,
          timeline: getComputedStyle(part).animationTimeline,
          clockDriven: animation ? animation.timeline === document.timeline : null,
          progress: animation ? String(animation.currentTime) : 'none',
          role: root.getAttribute('role'),
          valuenow: root.getAttribute('aria-valuenow')
        };
      };
      return { bar: probe('bar'), boxed: probe('boxed') };
    });

  const rows = [];
  for (const fraction of [0, 0.5, 1]) {
    await page.evaluate((value) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.round(value * max));
    }, fraction);
    await settle();
    rows.push(await read());
  }

  for (const placement of ['bar', 'boxed']) {
    const [top, middle, bottom] = rows.map((row) => row[placement]);
    assert.match(top.timeline, /^scroll\(/, `${placement}: the fill must be bound to a scroll timeline`);
    assert.equal(top.clockDriven, false, `${placement}: the fill must not run on the document clock`);
    assert.ok(top.fill <= 0.5, `${placement}: an unread page shows ${top.fill}px of progress`);
    assert.ok(Math.abs(middle.fill - middle.track / 2) <= 1, `${placement}: halfway down the page fills ${middle.fill}px of a ${middle.track}px track`);
    assert.ok(Math.abs(bottom.fill - bottom.track) <= 1, `${placement}: the end of the page fills ${bottom.fill}px of a ${bottom.track}px track`);
    assert.equal(bottom.progress, '100%', `${placement}: the timeline reports the end of the scroll range`);
  }
  // The percentage lives in the browser, not in JavaScript, so the markup must
  // not invent one: with no `value` the element stays a status rather than a
  // progressbar carrying a fabricated aria-valuenow.
  assert.equal(rows[0].bar.role, 'status');
  assert.equal(rows[0].bar.valuenow, null);
});

test('where scroll timelines are unsupported the same keyframes sweep on the clock', async () => {
  const result = renderLoader({ type: 'progress-scroll', label: 'Reading progress' });
  // The fallback is what a browser without `animation-timeline` sees: the same
  // slice with the progressive-enhancement block removed.
  const fallback = result.css.replace(/@supports \(animation-timeline:scroll\(\)\)\{[\s\S]*?\}\s*\}/, '');
  assert.ok(fallback.length < result.css.length, 'the slice declares no scroll-timeline enhancement to fall back from');
  assert.ok(!fallback.includes('animation-timeline'), 'the fallback still binds a scroll timeline');
  assert.ok(fallback.includes('@keyframes wavelo-scroll-fill'), 'the fallback lost its keyframes');

  await setContentPage(`<div id="bar">${result.html}</div>`, `<style>${fallback}</style>`);
  const sample = () =>
    page.evaluate(() => {
      const part = document.querySelector('#bar .wavelo__part');
      const animation = document.getAnimations().find((entry) => entry.effect?.target === part);
      return { name: getComputedStyle(part).animationName, clockDriven: animation?.timeline === document.timeline, time: Number(animation?.currentTime) };
    });
  const first = await sample();
  await page.waitForTimeout(250);
  const second = await sample();

  assert.equal(first.name, 'wavelo-scroll-fill');
  assert.equal(first.clockDriven, true, 'without a scroll timeline the sweep must run on the document clock');
  assert.ok(second.time > first.time, `the fallback sweep did not advance: ${first.time} -> ${second.time}`);
});

test('the gallery keeps its top-of-page bar inside the preview card', async () => {
  const galleryHtml = await readFile(resolve('apps/docs/dist/index.html'), 'utf8');
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    response.end(galleryHtml);
  });
  await new Promise((resolveListen) => server.listen(0, resolveListen));
  const galleryPage = await browser.newPage();
  await galleryPage.goto(`http://127.0.0.1:${server.address().port}`);
  const contained = await galleryPage.evaluate(() => {
    const element = document.querySelector('.preview .wavelo--progress-top');
    if (!element) return { found: false };
    const preview = element.closest('.preview').getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      found: true,
      position: getComputedStyle(element).position,
      inside: rect.top >= preview.top - 1 && rect.bottom <= preview.bottom + 1 && rect.left >= preview.left - 1 && rect.right <= preview.right + 1
    };
  });
  assert.equal(contained.found, true, 'the gallery has no progress-top preview');
  assert.equal(contained.position, 'relative', 'the gallery must contain the fixed bar in its preview');
  assert.equal(contained.inside, true, 'progress-top escaped its preview card');
  await galleryPage.close();
  server.close();
});

test('the default palette, gradients and overlay scrim actually paint', async () => {
  const body = [
    ['ring', { type: 'ring', label: 'Loading' }],
    ['gradient-ring', { type: 'gradient-ring', label: 'Loading' }],
    ['overlay', { type: 'overlay', label: 'Loading' }],
    ['explicit', { type: 'ring', color: '#123456', label: 'Loading' }]
  ]
    .map(([key, config]) => `<div class="case" data-key="${key}">${renderLoader(config).html}</div>`)
    .join('');
  await page.setContent(
    `<!doctype html><html><head><style>${allStyles}</style></head><body><div data-key="inherited" style="--wavelo-color:#00ff00">${renderLoader({ type: 'ring', label: 'Loading' }).html}</div>${body}</body></html>`
  );
  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('[data-key]')].map((wrap) => {
      const style = getComputedStyle(wrap.querySelector('.wavelo'));
      return { key: wrap.dataset.key, color: style.color, borderImage: style.borderImageSource, background: style.backgroundColor };
    })
  );
  const at = (key) => rows.find((row) => row.key === key);

  assert.equal(at('ring').color, 'rgb(99, 102, 241)', 'the documented default colour must paint without configuration');
  assert.equal(at('explicit').color, 'rgb(18, 52, 86)', 'an explicit colour must win');
  assert.equal(at('inherited').color, 'rgb(0, 255, 0)', 'a page-level --wavelo-color must still override the default');
  assert.match(at('gradient-ring').borderImage, /linear-gradient/, 'gradient-ring must paint a gradient by default');
  assert.notEqual(at('overlay').background, 'rgba(0, 0, 0, 0)', 'the section overlay must have a scrim');
});

test('every design paints something visible', async () => {
  await setContentPage(
    loaderRegistry
      .map((loader) => `<div data-design="${loader.id}">${renderLoader({ type: loader.id, label: loader.name }).html}</div>`)
      .join('')
  );
  const invisible = await page.evaluate(() => {
    const paints = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (rect.width < 0.5 || rect.height < 0.5) return false;
      const filled =
        style.backgroundImage !== 'none' ||
        !['rgba(0, 0, 0, 0)', 'transparent'].includes(style.backgroundColor) ||
        // SVG designs paint through `fill`, not background or border.
        !['', 'none', 'rgba(0, 0, 0, 0)', 'transparent'].includes(style.fill);
      const bordered = parseFloat(style.borderTopWidth) > 0 && style.borderTopStyle !== 'none' && !['rgba(0, 0, 0, 0)', 'transparent'].includes(style.borderTopColor);
      return filled || bordered;
    };
    const pseudoPaints = (element, which) => {
      const style = getComputedStyle(element, which);
      if (style.content === 'none') return false;
      return parseFloat(style.borderTopWidth) > 0 || style.backgroundImage !== 'none' || !['rgba(0, 0, 0, 0)', 'transparent'].includes(style.backgroundColor);
    };
    return [...document.querySelectorAll('[data-design]')]
      .filter((wrap) => {
        const root = wrap.querySelector('.wavelo');
        const parts = [...root.querySelectorAll('.wavelo__part')];
        return !(paints(root) || parts.some(paints) || pseudoPaints(root, '::before') || pseudoPaints(root, '::after'));
      })
      .map((wrap) => wrap.dataset.design);
  });
  assert.deepEqual(invisible, [], `these designs render nothing visible: ${invisible.join(', ')}`);
});

test('each design renders what its name says', async () => {
  const body = [
    'thin-line', 'thick-stroke', 'ring', 'arc', 'half-circle', 'circular', 'segmented-ring', 'monochrome',
    'gradient-ring', 'multi-arc', 'dual-ring', 'ripple-dot', 'three-dots', 'four-dots', 'five-dots',
    'dot-matrix', 'grid-pulse', 'expanding-dot', 'pulsing-dots', 'background-operation', 'audio-waveform',
    'waveform', 'gradient-bars', 'equalizer', 'rotating-square', 'rotating-diamond', 'morphing-shapes', 'svg-star'
  ]
    .map((id) => `<div data-case="${id}">${renderLoader({ type: id, label: id }).html}</div>`)
    .join('');
  await setContentPage(body);

  const rows = await page.evaluate(() =>
    [...document.querySelectorAll('[data-case]')].map((wrap) => {
      const root = wrap.querySelector('.wavelo');
      const style = getComputedStyle(root);
      const parts = [...root.querySelectorAll('.wavelo__part')];
      // A side only counts when it is actually drawn: an element with no border
      // still reports currentColor, which is not a visible side.
      const sides = ['Top', 'Right', 'Bottom', 'Left'].filter((side) => {
        const width = Number.parseFloat(style[`border${side}Width`]);
        return width > 0 && style[`border${side}Style`] !== 'none' && style[`border${side}Color`] !== 'rgba(0, 0, 0, 0)';
      });
      const pseudo = (which) => {
        const s = getComputedStyle(root, which);
        return s.content === 'none' ? null : { inset: s.inset, animation: s.animationName, direction: s.animationDirection, background: s.backgroundImage + s.backgroundColor, border: s.borderTopWidth };
      };
      return {
        id: wrap.dataset.case,
        parts: parts.length,
        svg: root.querySelectorAll('svg').length,
        sides: sides.length,
        sideNames: sides.join(''),
        borderWidth: style.borderTopWidth,
        borderStyle: style.borderTopStyle,
        borderImage: style.borderImageSource,
        backgroundImage: style.backgroundImage,
        gridColumns: style.gridTemplateColumns,
        animation: style.animationName,
        clipPath: style.clipPath,
        partBackground: parts.length ? getComputedStyle(parts[0]).backgroundImage : 'none',
        partFill: parts.length ? getComputedStyle(parts[0]).fill : '-',
        partDelays: parts.map((part) => getComputedStyle(part).animationDelay),
        partAnimations: [...new Set(parts.map((part) => getComputedStyle(part).animationName))],
        before: pseudo('::before'),
        after: pseudo('::after')
      };
    })
  );
  const at = (id) => rows.find((row) => row.id === id);

  // Stroke weights must differ, or "thin" and "thick" are just words. Border
  // widths cannot be fractional, so compare rather than pin an exact value.
  assert.equal(at('thin-line').borderWidth, '1px');
  assert.equal(at('ring').borderWidth, '3px');
  assert.ok(
    Number.parseFloat(at('thick-stroke').borderWidth) > Number.parseFloat(at('ring').borderWidth) * 2,
    `thick-stroke is ${at('thick-stroke').borderWidth}, ring is ${at('ring').borderWidth}`
  );

  // Arc length is the number of visible border sides.
  assert.equal(at('arc').sides, 1, 'arc must be a single quarter-turn side');
  assert.equal(at('half-circle').sides, 2, 'half-circle must span two sides');
  assert.equal(at('circular').sides, 4, 'circular must be a closed border');
  assert.ok(at('circular').before, 'circular must carry its sweeping accent arc');
  assert.equal(at('circular').before.animation, 'wavelo-spin');

  assert.equal(at('segmented-ring').borderStyle, 'dashed');
  assert.equal(at('segmented-ring').sides, 4, 'a segmented ring is a complete dashed circle');
  assert.match(at('monochrome').backgroundImage, /conic-gradient/, 'monochrome must be a half-filled disc');
  assert.match(at('gradient-ring').borderImage ?? '', /linear-gradient/);

  // Layered arcs: the element plus both pseudo-elements, at three insets.
  const multi = at('multi-arc');
  assert.ok(multi.before && multi.after, 'multi-arc must layer three arcs');
  assert.notEqual(multi.before.inset, multi.after.inset);
  assert.equal(at('dual-ring').sides, 0, 'dual-ring is built from its two pseudo arcs');

  // A ripple from a dot: solid centre plus an expanding ring.
  const ripple = at('ripple-dot');
  assert.equal(ripple.before.animation, 'wavelo-pulse');
  assert.match(ripple.before.background, /rgb/, 'the centre dot must be filled');
  assert.equal(ripple.after.animation, 'wavelo-ripple');

  // Counts promised by the names.
  assert.equal(at('three-dots').parts, 3);
  assert.equal(at('four-dots').parts, 4);
  assert.equal(at('five-dots').parts, 5);
  assert.equal(at('dot-matrix').parts, 9);
  assert.equal(at('grid-pulse').parts, 4);
  assert.equal(at('expanding-dot').parts, 1);
  assert.equal(at('audio-waveform').parts, 7);

  // Matrix and grid must actually be grids, not a row of dots.
  assert.equal(at('dot-matrix').gridColumns.split(' ').length, 3, 'dot-matrix must be three columns');
  assert.equal(at('grid-pulse').gridColumns.split(' ').length, 2, 'grid-pulse must be two columns');

  // "Sequential pulse" must be staggered; the generic background indicator is not.
  assert.equal(new Set(at('pulsing-dots').partDelays).size, 3, 'pulsing-dots must stagger its three parts');
  assert.equal(new Set(at('background-operation').partDelays).size, 1, 'background-operation pulses in unison');
  assert.equal(at('expanding-dot').partAnimations[0], 'wavelo-scale-dot');

  assert.equal(at('audio-waveform').partAnimations[0], 'wavelo-audio');
  assert.notEqual(at('audio-waveform').partAnimations[0], at('waveform').partAnimations[0]);
  assert.match(at('gradient-bars').partBackground, /linear-gradient/, 'gradient-bars must paint a gradient');
  assert.equal(at('equalizer').partBackground, 'none');

  assert.equal(at('rotating-diamond').animation, 'wavelo-diamond');
  assert.equal(at('morphing-shapes').animation, 'wavelo-morph');
  assert.notEqual(at('rotating-square').animation, at('rotating-diamond').animation);

  // The star is described as SVG, so it must be SVG.
  assert.equal(at('svg-star').svg, 1, 'svg-star must render an <svg> element');
  assert.equal(at('svg-star').parts, 1);
  assert.notEqual(at('svg-star').partFill, 'none');
});

test('no two designs in the catalog render identically', async () => {
  await setContentPage(
    loaderRegistry.map((loader) => `<div data-case="${loader.id}">${renderLoader({ type: loader.id, label: loader.name }).html}</div>`).join('')
  );
  const signatures = await page.evaluate(() => {
    const describe = (element, pseudo) => {
      const style = getComputedStyle(element, pseudo ?? null);
      const rect = element.getBoundingClientRect();
      return [
        Math.round(rect.width), Math.round(rect.height), style.borderRadius, style.borderTopWidth, style.borderTopStyle,
        ['Top', 'Right', 'Bottom', 'Left'].map((side) => getComputedStyle(element, pseudo ?? null)[`border${side}Color`]).join('/'),
        style.borderImageSource, style.clipPath, style.backgroundImage, style.backgroundColor, style.animationName,
        style.animationDelay, style.fill, style.display, style.gridTemplateColumns, style.transform, style.inset, style.content
      ].join('~');
    };
    return [...document.querySelectorAll('[data-case]')].map((wrap) => {
      const root = wrap.querySelector('.wavelo');
      const parts = [...root.querySelectorAll('.wavelo__part')];
      return {
        id: wrap.dataset.case,
        signature: [
          describe(root),
          parts.length,
          parts.map((part) => `${describe(part)}@${part.tagName}`).join(','),
          describe(root, '::before'),
          describe(root, '::after')
        ].join('##')
      };
    });
  });
  const groups = new Map();
  for (const row of signatures) {
    if (!groups.has(row.signature)) groups.set(row.signature, []);
    groups.get(row.signature).push(row.id);
  }
  const duplicates = [...groups.values()].filter((ids) => ids.length > 1);
  assert.deepEqual(duplicates, [], `these designs render identically: ${duplicates.map((ids) => ids.join(' == ')).join('; ')}`);
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

test('a bad attribute value keeps the last good loader on screen', async () => {
  const scoped = await browser.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  scoped.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  scoped.on('pageerror', (error) => pageErrors.push(error.message));
  await scoped.setContent(`<!doctype html><html><head><style>${allStyles}</style></head><body><wavelo-loader id="el" type="ring" label="Loading"></wavelo-loader></body></html>`);
  await scoped.addScriptTag({ content: coreBundle });
  const first = await scoped.evaluate(() => {
    window.Wavelo.defineWaveloElements();
    return document.querySelector('#el .wavelo')?.className ?? null;
  });
  assert.match(first, /wavelo--ring/, 'the element must render before the bad value arrives');

  const after = await scoped.evaluate(() => {
    const element = document.getElementById('el');
    element.setAttribute('size', 'giant');
    return {
      rendered: Boolean(element.querySelector('.wavelo')),
      className: element.querySelector('.wavelo')?.className ?? null,
      error: element.getAttribute('data-wavelo-error')
    };
  });
  assert.equal(after.rendered, true, 'an invalid attribute value must not blank the loader');
  assert.match(after.className, /wavelo--ring/, 'the loader must keep showing its last valid render');
  assert.match(after.error, /Invalid dimension/, `expected a diagnostic, got ${after.error}`);
  assert.equal(pageErrors.length, 0, `the element must not throw out of its callback: ${pageErrors.join('; ')}`);
  assert.equal(consoleErrors.length, 1, `expected exactly one console error, got ${consoleErrors.length}`);
  assert.match(consoleErrors[0], /Invalid dimension/);

  // And it recovers: a corrected value replaces the diagnostic.
  const recovered = await scoped.evaluate(() => {
    const element = document.getElementById('el');
    element.setAttribute('size', '48');
    return { style: element.querySelector('.wavelo').getAttribute('style'), error: element.getAttribute('data-wavelo-error') };
  });
  assert.match(recovered.style, /--wavelo-size:48px/);
  assert.equal(recovered.error, null, 'the diagnostic attribute must clear once the value is valid');
  await scoped.close();
});

test('the style attribute configures custom properties without stealing host styling', async () => {
  const scoped = await browser.newPage();
  await scoped.setContent(`<!doctype html><html><head><style>${allStyles}</style></head><body>
    <wavelo-loader id="token" type="skeleton-line" label="Loading" style="--wavelo-radius:2px"></wavelo-loader>
    <wavelo-loader id="host" type="skeleton-line" label="Loading" style="margin-top:1rem"></wavelo-loader>
  </body></html>`);
  await scoped.addScriptTag({ content: coreBundle });
  const read = await scoped.evaluate(() => {
    window.Wavelo.defineWaveloElements();
    const token = document.getElementById('token');
    const host = document.getElementById('host');
    return {
      tokenOnInner: (token.querySelector('.wavelo').getAttribute('style') ?? '').includes('--wavelo-radius:2px'),
      hostMargin: getComputedStyle(host).marginTop,
      // A host property that is not a --wavelo-* token stays host styling and is
      // not fed to the renderer, where it would be rejected.
      hostInnerHasMargin: (host.querySelector('.wavelo').getAttribute('style') ?? '').includes('margin'),
      hostHasStyleAttribute: host.querySelector('.wavelo').hasAttribute('style')
    };
  });
  assert.equal(read.tokenOnInner, true, 'a --wavelo-* property in the attribute must reach the rendered element');
  assert.equal(read.hostMargin, '16px', 'ordinary host styling in the same attribute must still apply');
  assert.equal(read.hostInnerHasMargin, false, 'non-token declarations must not be treated as configuration');
  assert.equal(read.hostHasStyleAttribute, false, 'a loader with nothing configured must not carry a style attribute');
  await scoped.close();
});

test('a determinate value animates because the progress token is registered', async () => {
  await setContentPage(
    `<div id="before">${renderLoader({ type: 'progress-bar', label: 'Working', value: 10 }).html}</div>` +
    `<div id="moving">${renderLoader({ type: 'progress-bar', label: 'Working', value: 10 }).html}</div>`
  );
  const transitioned = await page.evaluate(() => {
    // The library registers the property; the transition it declares is what a
    // value change animates through.
    return getComputedStyle(document.querySelector('#before .wavelo')).transitionProperty.includes('--wavelo-progress');
  });
  assert.equal(transitioned, true, 'the base sheet must transition --wavelo-progress');

  const samples = await page.evaluate(async () => {
    const element = document.querySelector('#moving .wavelo');
    const read = () => Number.parseFloat(getComputedStyle(element).getPropertyValue('--wavelo-progress'));
    element.style.setProperty('transition', '--wavelo-progress 800ms linear');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const start = read();
    element.style.setProperty('--wavelo-progress', '90%');
    await new Promise((resolve) => setTimeout(resolve, 200));
    const middle = read();
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { start, middle, end: read() };
  });
  assert.ok(Math.abs(samples.start - 10) < 1, `expected to start at 10%, saw ${samples.start}`);
  assert.ok(samples.middle > 15 && samples.middle < 85, `the value did not interpolate: ${samples.middle}`);
  assert.ok(samples.end > 89, `the value never reached the target: ${samples.end}`);
});

test('the accessibility options work through element attributes', async () => {
  await setContentPage(
    '<p id="caption">Uploading your archive</p>' +
    '<wavelo-loader id="named" type="progress-bar" labelled-by="caption" described-by="caption" value="70" max="100" value-text="70 of 100 MB"></wavelo-loader>' +
    '<wavelo-loader id="quiet" type="ring" label="Loading" decorative></wavelo-loader>'
  );
  const read = await page.evaluate(() => {
    window.Wavelo.defineWaveloElements();
    const named = document.getElementById('named').querySelector('.wavelo');
    const quiet = document.getElementById('quiet').querySelector('.wavelo');
    const pick = (element) => ['role', 'aria-labelledby', 'aria-describedby', 'aria-valuenow', 'aria-valuetext', 'aria-label', 'aria-hidden'].reduce((all, name) => {
      const value = element.getAttribute(name);
      if (value !== null) all[name] = value;
      return all;
    }, {});
    return { named: pick(named), quiet: pick(quiet), captionText: document.getElementById('caption').textContent };
  });
  assert.equal(read.named.role, 'progressbar');
  assert.equal(read.named['aria-labelledby'], 'caption', 'a referenced caption names the bar');
  assert.equal(read.named['aria-describedby'], 'caption');
  assert.equal(read.named['aria-valuenow'], '70');
  assert.equal(read.named['aria-valuetext'], '70 of 100 MB', 'the reading must survive the attribute path');
  assert.equal(read.named['aria-label'], undefined);
  assert.deepEqual(read.quiet, { 'aria-hidden': 'true' }, 'a decorative loader exposes nothing else');
  assert.equal(read.captionText, 'Uploading your archive');
});

test('a counted skeleton line becomes a stack of tracks that each paint', async () => {
  await setContentPage(
    '<div id="stack">' + renderLoader({ type: 'skeleton-line', count: 3, label: 'Loading' }).html + '</div>' +
    '<div id="plain">' + renderLoader({ type: 'skeleton-line', label: 'Loading' }).html + '</div>' +
    '<div id="spinner">' + renderLoader({ type: 'ring', inline: true, label: 'Loading' }).html + '</div>' +
    '<div id="inline-line">' + renderLoader({ type: 'skeleton-line', inline: true, label: 'Loading' }).html + '</div>'
  );
  const read = await page.evaluate(() => {
    const box = (id) => {
      const element = document.querySelector(`#${id} .wavelo`);
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return {
        display: style.display,
        verticalAlign: style.verticalAlign,
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    };
    const tracks = [...document.querySelectorAll('#stack .wavelo__part')].map((part) => {
      const style = getComputedStyle(part);
      const rect = part.getBoundingClientRect();
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        gradient: style.backgroundImage.includes('linear-gradient'),
        animates: style.animationName !== 'none'
      };
    });
    return { stack: box('stack'), tracks, plain: box('plain'), spinner: box('spinner'), inlineLine: box('inline-line') };
  });
  assert.equal(read.stack.display, 'grid', 'a counted line stacks its tracks');
  assert.equal(read.tracks.length, 3);
  for (const track of read.tracks) {
    assert.ok(track.gradient, 'a track must paint the skeleton gradient itself');
    assert.ok(track.animates, 'a track must shimmer');
    assert.equal(track.height, 12, 'each track is the height of the line it replaces');
  }
  assert.ok(read.tracks[2].width < read.tracks[0].width, 'the last line ends the block short');
  assert.equal(read.plain.display, 'block', 'one line is still the painted box itself');
  assert.equal(read.plain.height, 12);
  assert.equal(read.spinner.verticalAlign, 'middle', 'a spinner in a sentence sits on the line');
  assert.equal(read.inlineLine.display, 'inline-block');
  assert.ok(read.inlineLine.width <= 100 && read.inlineLine.height <= 17, `an inline line must be text-sized, saw ${read.inlineLine.width}x${read.inlineLine.height}`);
});

test('a loader that is not loading adds nothing to the document', async () => {
  await setContentPage('<div id="hidden"></div><div id="shown"></div>');
  const read = await page.evaluate(() => {
    const sheets = () => document.querySelectorAll('style[data-wavelo-style]').length;
    const before = sheets();
    window.Wavelo.mountLoader(document.getElementById('hidden'), { type: 'ring', label: 'Loading', loading: false });
    const afterHidden = sheets();
    window.Wavelo.mountLoader(document.getElementById('shown'), { type: 'ring', label: 'Loading' });
    return {
      hiddenHtml: document.getElementById('hidden').innerHTML,
      hiddenSheets: afterHidden - before,
      shownHtml: document.getElementById('shown').innerHTML,
      sheets: sheets() - before,
      emptySheet: document.querySelector('style[data-wavelo-style="811c9dc5"]') !== null
    };
  });
  assert.equal(read.hiddenHtml, '', 'nothing is mounted for a loader that is not loading');
  assert.equal(read.hiddenSheets, 0, 'a hidden loader must not add a stylesheet');
  assert.equal(read.sheets, 1, 'the visible loader still gets its one slice');
  assert.match(read.shownHtml, /wavelo--ring/);
  assert.equal(read.emptySheet, false, 'the empty slice must never be injected');
});

test('the custom element reads loading, count and inline from attributes', async () => {
  await setContentPage('<wavelo-loader id="line" type="skeleton-line" count="4" inline></wavelo-loader>');
  const read = await page.evaluate(() => {
    window.Wavelo.defineWaveloElements();
    const element = document.getElementById('line');
    const tracks = () => element.querySelectorAll('.wavelo__part').length;
    const shown = {
      tracks: tracks(),
      inline: element.querySelector('.wavelo').classList.contains('wavelo-inline'),
      display: getComputedStyle(element.querySelector('.wavelo')).display
    };
    element.setAttribute('loading', 'false');
    const hidden = { tracks: tracks(), html: element.innerHTML, emptySlices: document.querySelectorAll('style[data-wavelo-style="811c9dc5"]').length };
    element.removeAttribute('loading');
    return { shown, hidden, restored: tracks() };
  });
  assert.equal(read.shown.tracks, 4, 'the count attribute must set the track count');
  assert.equal(read.shown.inline, true);
  assert.equal(read.shown.display, 'inline-grid', 'an inline stack stays inline and keeps its rows');
  assert.equal(read.hidden.tracks, 0);
  assert.equal(read.hidden.html, '');
  assert.equal(read.hidden.emptySlices, 0, 'hiding through the attribute must not inject the empty slice');
  assert.equal(read.restored, 4, 'removing the attribute brings the loader back');
});

test('a configured size is kept, and the new tokens reach the rules that read them', async () => {
  await setContentPage(
    '<div id="tall">' + renderLoader({ type: 'progress-bar', label: 'Loading', height: 32, value: 50 }).html + '</div>' +
    '<div id="styled">' + renderLoader({ type: 'progress-bar', label: 'Loading', style: { '--wavelo-radius': '2px' } }).html + '</div>' +
    '<div id="paced">' + renderLoader({ type: 'ring', label: 'Loading', style: { '--wavelo-ease': 'steps(4, end)' } }).html + '</div>' +
    '<div id="layered">' + renderLoader({ type: 'progress-top', label: 'Loading', style: { '--wavelo-height': '9px', '--wavelo-z-index': '3' } }).html + '</div>' +
    '<div id="plain-top">' + renderLoader({ type: 'progress-top', label: 'Loading' }).html + '</div>' +
    '<div id="dark">' + renderLoader({ type: 'ring', label: 'Loading', theme: 'dark' }).html + '</div>' +
    '<div id="light">' + renderLoader({ type: 'ring', label: 'Loading' }).html + '</div>' +
    '<div id="dark-scrim">' + renderLoader({ type: 'overlay', label: 'Loading', theme: 'dark' }).html + '</div>' +
    '<div id="light-scrim">' + renderLoader({ type: 'overlay', label: 'Loading' }).html + '</div>'
  );
  const read = await page.evaluate(() => {
    const at = (id) => {
      const element = document.querySelector(`#${id} .wavelo`);
      const style = getComputedStyle(element);
      const part = element.querySelector('.wavelo__part');
      return {
        height: Math.round(element.getBoundingClientRect().height),
        radius: style.borderTopLeftRadius,
        ease: style.animationTimingFunction,
        z: style.zIndex,
        color: style.color,
        paint: style.backgroundImage + '|' + style.backgroundColor,
        fill: part ? Math.round(part.getBoundingClientRect().width) : null
      };
    };
    return Object.fromEntries(['tall', 'styled', 'paced', 'layered', 'plain-top', 'dark', 'light', 'dark-scrim', 'light-scrim'].map((id) => [id, at(id)]));
  });
  assert.equal(read.tall.height, 32, 'a 32-pixel bar is 32 pixels, not a capped 16');
  assert.equal(read.tall.fill, 64, 'the half-filled track fills half of the real width');
  assert.equal(read.styled.radius, '2px', 'a squared bar takes the radius');
  assert.match(read.paced.ease, /steps\(4/, 'the timing function is the page’s to choose');
  assert.equal(read.layered.height, 9, 'the top bar takes a configured thickness');
  assert.equal(read.layered.z, '3', 'a page can layer it under its own chrome');
  assert.equal(read['plain-top'].z, '9999', 'and it covers the page by default');
  assert.equal(read.dark.color, 'rgb(165, 180, 252)', 'a dark theme picks a colour that reads on dark');
  assert.equal(read.light.color, 'rgb(99, 102, 241)', 'the light default is unchanged');
  assert.notEqual(read['dark-scrim'].paint, read['light-scrim'].paint, 'the overlay scrim follows the theme');
  assert.notEqual(read['light-scrim'].paint, 'none|rgba(0, 0, 0, 0)', 'the overlay still draws a scrim in light');
});
