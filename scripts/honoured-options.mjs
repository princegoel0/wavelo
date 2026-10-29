// The configuration keys each design honours are measured, not guessed.
//
// Every key is applied to every design in Chromium and the rendered result is
// compared against the same design with defaults: computed geometry, borders,
// gradients, colours and animation declarations for the element, its parts and
// their pseudo-elements, plus the markup attributes the key changed. The inline
// `style` attribute is deliberately left out of the comparison — it echoes every
// configured token whether or not anything reads it.
//
// `registry.ts` reads the generated map, so the docs, the gallery and the adapter
// prop tables inherit a list that is true, and `npm run audit:customization`
// re-measures it in CI.
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { loaderRegistry, renderLoader } from '../packages/core/dist/index.js';
import { allStyles } from '../packages/core/dist/css/index.js';

const generatedPath = new URL('../packages/core/src/honoured-options.ts', import.meta.url);

/** Keys judged by how the design animates rather than by a style difference. */
const TIME_KEYS = ['duration', 'speed'];
const CONTROL_KEYS = ['paused', 'direction'];
/**
 * Keys that change markup or select the design, not a visual property, so they
 * are true for every design and are not measured: `label` writes `aria-label`,
 * `className` writes `class`, `data-testid` writes an attribute, `reducedMotion`
 * writes `data-wavelo-motion` (its effect depends on the operating-system
 * preference, which the earlier browser suite covers for all three modes), and
 * `style` is the general custom-property escape hatch.
 */
const STRUCTURAL = ['label', 'className', 'style', 'data-testid', 'reducedMotion'];

const PROBES = {
  size: { size: 300 },
  width: { width: 300 },
  height: { height: 60 },
  color: { color: '#ff0000' },
  secondaryColor: { secondaryColor: '#00ff00' },
  backgroundColor: { backgroundColor: '#0000ff' },
  speed: { speed: 4 },
  duration: { duration: '4s' },
  strokeWidth: { strokeWidth: 12 },
  theme: { theme: 'dark' },
  direction: { direction: 'reverse' },
  paused: { paused: true },
  value: { value: 70, max: 100 },
  max: { value: 40, max: 80 }
};

const PROPS = [
  'width', 'height', 'display', 'position', 'gap', 'gridTemplateColumns', 'flexDirection', 'alignItems', 'justifyContent',
  'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderTopStyle', 'borderTopColor',
  'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'borderImageSource', 'borderRadius', 'backgroundImage',
  'backgroundColor', 'color', 'fill', 'opacity', 'transform', 'inset', 'clipPath', 'boxShadow', 'content',
  'animationName', 'animationDuration', 'animationDirection', 'animationPlayState', 'animationDelay', 'animationIterationCount', 'animationTimeline'
];

/**
 * Pairs established by hand. If the measurement disagrees, the probe is broken and
 * this module refuses to generate anything.
 */
const SELF_CHECKS = [
  ['ring', 'strokeWidth', true],
  ['ring', 'secondaryColor', false],
  ['ring', 'paused', true],
  ['ring', 'size', true],
  ['circular', 'secondaryColor', true],
  ['skeleton-card', 'strokeWidth', false],
  ['skeleton-card', 'theme', true],
  ['progress-top', 'size', false],
  ['progress-top', 'width', false],
  ['progress-scroll', 'duration', false],
  ['progress-scroll', 'speed', false],
  ['progress-scroll', 'paused', true],
  ['progress-scroll', 'direction', true],
  ['progress-bar', 'value', true],
  ['progress-bar', 'duration', false],
  ['dot-matrix', 'size', true],
  ['dot-matrix', 'width', false]
];

async function fingerprintPage(browser, overrides) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  try {
    const body = loaderRegistry
      .map((design) => {
        const config = { type: design.id, label: design.name };
        if (overrides) Object.assign(config, overrides);
        return `<div data-id="${design.id}">${renderLoader(config).html}</div>`;
      })
      .join('');
    await page.setContent(`<!doctype html><html><head><style>${allStyles}</style></head><body>${body}</body></html>`);
    return await page.evaluate((propertyList) => {
      // A scroll-driven animation takes its progress from its timeline, and
      // assigning it a numeric currentTime throws, so only document-timeline
      // animations are wound back; pausing already holds the scroll-driven one.
      for (const animation of document.getAnimations()) {
        animation.pause();
        if (animation.timeline === document.timeline) animation.currentTime = 0;
      }
      const read = (element, pseudo) => {
        const style = getComputedStyle(element, pseudo ?? null);
        return propertyList.map((property) => style[property]).join('|');
      };
      const cells = {};
      for (const wrap of document.querySelectorAll('[data-id]')) {
        const root = wrap.querySelector('.wavelo');
        const parts = [...root.querySelectorAll('.wavelo__part')];
        const elements = [[root, null], [root, '::before'], [root, '::after']];
        for (const part of parts) elements.push([part, null], [part, '::before'], [part, '::after']);
        const own = document.getAnimations().filter((animation) => {
          const target = animation.effect?.target;
          if (!target) return false;
          const host = target.hostElement ?? target;
          return host === root || root.contains(host);
        });
        const animates = elements.some(([element, pseudo]) => getComputedStyle(element, pseudo ?? null).animationName !== 'none');
        const scrollDriven = own.some((animation) => animation.timeline !== document.timeline);
        cells[wrap.dataset.id] = {
          render: elements.map(([element, pseudo]) => read(element, pseudo)).join('##'),
          animates,
          scrollDriven
        };
      }
      return cells;
    }, PROPS);
  } finally {
    await page.close();
  }
}

/** Maps design id to the configuration keys that measurably change its render. */
export async function measureHonouredKeys(browser) {
  const baseline = await fingerprintPage(browser, null);
  const table = Object.fromEntries(loaderRegistry.map((design) => [design.id, new Set(STRUCTURAL)]));

  for (const [key, overrides] of Object.entries(PROBES)) {
    const measured = await fingerprintPage(browser, overrides);
    for (const design of loaderRegistry) {
      const before = baseline[design.id];
      const after = measured[design.id];
      const differs = before.render !== after.render;
      let honoured;
      if (TIME_KEYS.includes(key)) honoured = before.animates && !before.scrollDriven && differs;
      else if (CONTROL_KEYS.includes(key)) honoured = before.animates && differs;
      else honoured = differs;
      if (honoured) table[design.id].add(key);
    }
  }

  const serializable = Object.fromEntries(Object.entries(table).map(([id, keys]) => [id, [...keys].sort()]));
  const failures = SELF_CHECKS.filter(([id, key, expectHonoured]) => serializable[id]?.includes(key) !== expectHonoured);
  if (failures.length) {
    throw new Error(`customization probe disagrees with hand-measured cases: ${failures.map(([id, key, expect]) => `${id}/${key} expected ${expect ? 'honoured' : 'inert'}`).join('; ')}`);
  }
  return serializable;
}

const serialize = (table) => {
  const names = [...new Set(Object.values(table).flat())].sort();
  if (names.length > 31) throw new Error(`the honoured-options bitset supports at most 31 keys, have ${names.length}`);
  const position = new Map(names.map((name, index) => [name, index]));
  const encode = (keys) => {
    let value = 0;
    for (const key of keys) value |= 1 << position.get(key);
    return (value >>> 0).toString(16).padStart(Math.ceil(names.length / 4), '0');
  };
  const encoded = Object.fromEntries(Object.entries(table).map(([id, keys]) => [id, encode(keys)]));
  return `// GENERATED by scripts/honoured-options.mjs from a Chromium render of every design.
// Do not edit: \`npm run audit:customization\` re-measures it and fails when it drifts.

/**
 * Every configuration key, in the order the bits below address them. Each design
 * maps to a hex bitset of the keys that measurably change its render, so the whole
 * table costs a few hundred bytes instead of repeating key names 82 times.
 */
export const honouredKeyNames: readonly string[] = ${JSON.stringify(names)};

/** Bitset per catalog id; \`registry.ts\` decodes it into \`LoaderDefinition.options\`. */
export const honouredOptions: Readonly<Record<string, string>> = ${JSON.stringify(encoded, null, 1).replace(/\n/g, '\n  ')};
`;
};

export async function writeHonouredOptions(browser) {
  const table = await measureHonouredKeys(browser);
  const content = serialize(table);
  const current = await readFile(generatedPath, 'utf8').catch(() => '');
  if (current === content) return { changed: false, designs: Object.keys(table).length };
  await writeFile(generatedPath, content, 'utf8');
  return { changed: true, designs: Object.keys(table).length };
}

export async function checkHonouredOptions(browser) {
  const table = await measureHonouredKeys(browser);
  const committed = await readFile(generatedPath, 'utf8').catch(() => undefined);
  if (committed === undefined) throw new Error('packages/core/src/honoured-options.ts is missing; run npm run catalog:generate');
  const normalize = (text) => text.replace(/\r\n/g, '\n');
  return { matches: normalize(committed) === normalize(serialize(table)), table };
}

const isCli = process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/honoured-options.mjs');
if (isCli) {
  const browser = await chromium.launch();
  try {
    if (process.argv.includes('--check')) {
      const result = await checkHonouredOptions(browser);
      if (!result.matches) {
        console.error('honoured-options.ts does not match what Chromium renders; run npm run catalog:generate');
        process.exitCode = 1;
      } else {
        console.log(`honoured options match the render: ${Object.keys(result.table).length} designs`);
      }
    } else {
      const result = await writeHonouredOptions(browser);
      console.log(`honoured options ${result.changed ? 'rewritten' : 'unchanged'} for ${result.designs} designs`);
    }
  } finally {
    await browser.close();
  }
}
