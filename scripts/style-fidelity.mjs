// Style fidelity harness. Renders every catalog design in Chromium and records
// the resolved style of the element, its parts and their pseudo-elements.
//
//   node scripts/style-fidelity.mjs write <file>   capture a fingerprint
//   node scripts/style-fidelity.mjs diff <file>    compare the build to a file
//
// `full` mode composes the whole sheet in canonical order; `sliced` mode gives
// each design only the stylesheet slice its own entry point ships, so a diff
// between the two proves every slice is self-sufficient.
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { allStyles } from '../packages/core/dist/css/index.js';
import { loaderRegistry, renderLoader } from '../packages/core/dist/index.js';

const PROPS = [
  'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay',
  'animation-iteration-count', 'animation-direction', 'animation-play-state', 'animation-fill-mode',
  'display', 'position', 'width', 'height', 'min-width', 'min-height', 'max-height',
  'border-radius', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-style', 'border-right-style', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'background-image', 'background-color', 'background-size', 'background-position',
  'opacity', 'transform', 'transform-origin', 'inset', 'top', 'right', 'bottom', 'left',
  'gap', 'flex-direction', 'grid-template-columns', 'align-items', 'justify-content',
  'clip-path', 'box-shadow', 'box-sizing', 'color', 'overflow', 'font-size', 'line-height',
  'transition-property', 'transition-duration', 'content'
];
const VARS = ['--wavelo-size', '--wavelo-duration', '--wavelo-stroke', '--wavelo-direction', '--wavelo-play-state', '--wavelo-progress', '--wavelo-radius', '--wavelo-theme'];

const [command, file] = process.argv.slice(2);
const mode = process.argv.includes('--sliced') ? 'sliced' : 'full';
const ids = loaderRegistry.map((loader) => loader.id);
const rendered = ids.map((id) => renderLoader({ type: id, label: `Loading ${id}` }));
const sheet = mode === 'sliced'
  ? rendered.map((result) => result.css).join('')
  : allStyles;
const markup = rendered.map((result, index) => `<div id="case-${index}" data-design="${ids[index]}">${result.html}</div>`).join('');
const page = `<!doctype html><html><head><meta charset="utf-8"><title>Wavelo fidelity</title><style>${sheet}</style></head><body>${markup}</body></html>`;

const server = createServer((_request, response) => {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(page);
});
await new Promise((resolveListen) => server.listen(0, resolveListen));
const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: 'no-preference' });
const tab = await context.newPage();
const pageErrors = [];
tab.on('pageerror', (error) => pageErrors.push(String(error)));
await tab.goto(`http://127.0.0.1:${server.address().port}/`);

const rows = await tab.evaluate(
  ({ propertyList, variableList, count }) => {
    // Freeze every animation at its start so the captured values are the
    // cascade's output, not a random interpolation frame.
    for (const animation of document.getAnimations()) {
      animation.pause();
      animation.currentTime = 0;
    }
    const read = (element, pseudo) => {
      const style = getComputedStyle(element, pseudo ?? null);
      const record = {};
      for (const property of propertyList) record[property] = style.getPropertyValue(property);
      for (const variable of variableList) record[variable] = style.getPropertyValue(variable).trim();
      return record;
    };
    const collected = [];
    for (let index = 0; index < count; index++) {
      const wrap = document.getElementById(`case-${index}`);
      const design = wrap.dataset.design;
      const root = wrap.querySelector('.wavelo');
      collected.push({ design, selector: '> root', style: read(root, null) });
      const parts = [...root.querySelectorAll('.wavelo__part')];
      parts.forEach((part, partIndex) => collected.push({ design, selector: `> part[${partIndex}]`, style: read(part, null) }));
      for (const pseudo of ['::before', '::after']) {
        collected.push({ design, selector: `> root${pseudo}`, style: read(root, pseudo) });
        parts.forEach((part, partIndex) => collected.push({ design, selector: `> part[${partIndex}]${pseudo}`, style: read(part, pseudo) }));
      }
    }
    return collected;
  },
  { propertyList: PROPS, variableList: VARS, count: ids.length }
);
const payload = { mode, designs: ids.length, pageErrors, rows };

if (command === 'isolated') {
  // Prove each design renders the same using only the stylesheet slice its own
  // entry point ships. Each design gets its own page, so no other design's
  // rules can cover a missing declaration.
  const expected = new Map(rows.map((row) => [`${row.design}|${row.selector}`, row.style]));
  const mismatches = [];
  for (let index = 0; index < ids.length; index++) {
    const isolate = `<!doctype html><html><head><meta charset="utf-8"><style>${rendered[index].css}</style></head><body><div id="only">${rendered[index].html}</div></body></html>`;
    const isolateServer = createServer((_request, response) => {
      response.writeHead(200, { 'content-type': 'text/html' });
      response.end(isolate);
    });
    await new Promise((resolveListen) => isolateServer.listen(0, resolveListen));
    const isolatePage = await context.newPage();
    await isolatePage.goto(`http://127.0.0.1:${isolateServer.address().port}/`);
    const isolateRows = await isolatePage.evaluate(
      ({ propertyList, variableList }) => {
        for (const animation of document.getAnimations()) {
          animation.pause();
          animation.currentTime = 0;
        }
        const read = (element, pseudo) => {
          const style = getComputedStyle(element, pseudo ?? null);
          const record = {};
          for (const property of propertyList) record[property] = style.getPropertyValue(property);
          for (const variable of variableList) record[variable] = style.getPropertyValue(variable).trim();
          return record;
        };
        const root = document.querySelector('#only .wavelo');
        const parts = [...root.querySelectorAll('.wavelo__part')];
        const out = [{ selector: '> root', style: read(root, null) }];
        parts.forEach((part, partIndex) => out.push({ selector: `> part[${partIndex}]`, style: read(part, null) }));
        for (const pseudo of ['::before', '::after']) {
          out.push({ selector: `> root${pseudo}`, style: read(root, pseudo) });
          parts.forEach((part, partIndex) => out.push({ selector: `> part[${partIndex}]${pseudo}`, style: read(part, pseudo) }));
        }
        return out;
      },
      { propertyList: PROPS, variableList: VARS }
    );
    await isolatePage.close();
    isolateServer.close();
    const design = ids[index];
    for (const row of isolateRows) {
      const key = `${design}|${row.selector}`;
      const reference = expected.get(key);
      if (!reference) {
        mismatches.push(`${key}: row absent from the shared sheet`);
        continue;
      }
      for (const [property, value] of Object.entries(reference)) {
        if (row.style[property] !== value) mismatches.push(`${key} ${property}: ${JSON.stringify(value)} -> ${JSON.stringify(row.style[property])}`);
      }
    }
  }
  console.log(`${mismatches.length} differences between the shared sheet and isolated per-design slices`);
  const byDesign = new Map();
  for (const mismatch of mismatches) {
    const design = mismatch.split('|')[0];
    byDesign.set(design, (byDesign.get(design) ?? 0) + 1);
  }
  for (const [design, count] of byDesign) console.log(`  ${design}: ${count}`);
  if (mismatches.length) console.log(mismatches.slice(0, 12).join('\n'));
  if (mismatches.length) process.exitCode = 1;
} else if (command === 'write') {
  await writeFile(file, JSON.stringify(payload, null, 1), 'utf8');
  console.log(`wrote ${file}: ${rows.length} rows across ${ids.length} designs (${mode} sheet, ${sheet.length} bytes)`);
} else if (command === 'diff') {
  const baseline = JSON.parse(await readFile(file, 'utf8'));
  const current = new Map(rows.map((row) => [`${row.design}|${row.selector}`, row.style]));
  const differences = [];
  for (const row of baseline.rows) {
    const key = `${row.design}|${row.selector}`;
    const mine = current.get(key);
    if (!mine) {
      differences.push({ key, property: '(element)', before: 'present', after: 'MISSING' });
      continue;
    }
    for (const [property, value] of Object.entries(row.style)) {
      if (mine[property] !== value) differences.push({ key, property, before: value, after: mine[property] });
    }
  }
  for (const row of rows) {
    if (!baseline.rows.some((candidate) => `${candidate.design}|${candidate.selector}` === `${row.design}|${row.selector}`)) {
      differences.push({ key: `${row.design}|${row.selector}`, property: '(element)', before: 'absent', after: 'NEW' });
    }
  }
  console.log(`${differences.length} style differences vs ${file} (${mode} sheet, ${rows.length} rows)`);
  const grouped = new Map();
  for (const difference of differences) {
    const design = difference.key.split('|')[0];
    if (!grouped.has(design)) grouped.set(design, []);
    grouped.get(design).push(difference.key.split('|')[1] + ' ' + difference.property + ': ' + JSON.stringify(difference.before) + ' -> ' + JSON.stringify(difference.after));
  }
  for (const [design, list] of grouped) console.log(`\n${design} (${list.length})\n  ${list.slice(0, 8).join('\n  ')}`);
  if (differences.length > 0) process.exitCode = 1;
} else {
  console.log('usage: node scripts/style-fidelity.mjs <write|diff> <file> [--sliced]');
  console.log('       node scripts/style-fidelity.mjs isolated');
  process.exitCode = 2;
}

await browser.close();
server.close();
