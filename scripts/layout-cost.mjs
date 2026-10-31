// Which designs cost the browser a layout on every frame, measured rather than
// guessed. An animation that changes `height` or `width` re-lays-out the element's
// box; one that changes `transform` or `opacity` does not, so the same motion costs
// nothing per frame. This script loads N copies of a design, reads Chromium's layout
// and style-recalculation counters across two seconds, and prints the difference.
//
//   node scripts/layout-cost.mjs                 # the designs that animate geometry
//   node scripts/layout-cost.mjs --count=300     # more copies, same conclusion
import { chromium } from 'playwright';
import { allStyles } from '../packages/core/dist/css/index.js';
import { loaderRegistry, renderLoader } from '../packages/core/dist/index.js';

const copies = Number(process.argv.find((arg) => arg.startsWith('--count='))?.split('=')[1] ?? 150);
const seconds = 2;

/**
 * The designs that animate a layout property on purpose, and why a transform would
 * not draw the same picture. `npm run catalog` fails if a frame animating height or
 * width appears here without being listed, so this stays the whole truth.
 */
const accepted = {
  'multi-wave': 'the same two frames run in opposite phase',
  'progress-scroll': 'the fill is the reading position, and a scaleX would squash the leading dot that marks it'
};

const browser = await chromium.launch();
const rows = [];
try {
  for (const design of loaderRegistry) {
    if (design.deprecated) continue;
    const body = Array.from({ length: copies }, () => renderLoader({ type: design.id, label: design.name }).html).join('');
    // Every copy has to be on screen while the window is measured. Chromium does not
    // animate boxes it cannot see, so 150 copies stacked in normal flow put about 18 of
    // them in the viewport and the rest contribute nothing: the same design then
    // measures 120 layouts on one run and 0 on another, and a 0 reads as "no longer
    // costs layout". A fixed grid the size of the viewport keeps all of them painted.
    const cols = Math.ceil(Math.sqrt(copies));
    const stage = `<div style="position:fixed;inset:0;display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));grid-auto-rows:minmax(0,1fr);align-items:center;justify-items:center;overflow:hidden">${body}</div>`;
    const page = await browser.newPage();
    await page.setContent(`<!doctype html><html><head><style>${allStyles}</style></head><body>${stage}</body></html>`);
    // A scroll-driven animation only advances when the page moves, so measuring it
    // still would report no cost at all. Give the document something to scroll and
    // keep it moving for the whole window.
    if (design.kind === 'scroll') {
      await page.evaluate(() => {
        document.body.insertAdjacentHTML('beforeend', '<div style="height:400vh"></div>');
        window.__scrolling = true;
        const step = (time) => {
          if (!window.__scrolling) return;
          window.scrollTo(0, (Math.sin(time / 120) * 0.5 + 0.5) * (document.body.scrollHeight - innerHeight));
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const counters = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((metric) => [metric.name, metric.value]));
    const before = await counters();
    await page.waitForTimeout(seconds * 1000);
    const after = await counters();
    if (design.kind === 'scroll') await page.evaluate(() => { window.__scrolling = false; });
    await page.close();
    rows.push({
      id: design.id,
      layouts: after.LayoutCount - before.LayoutCount,
      styles: after.RecalcStyleCount - before.RecalcStyleCount
    });
  }
} finally {
  await browser.close();
}

// A design that re-lays-out on every frame measures about 60 layouts per second of the
// window (120 across two), because one layout pass covers all 150 copies. Anything above
// a sixth of that is not noise; anything below is a design that does not dirty layout.
const costly = rows.filter((row) => row.layouts > seconds * 10).sort((a, b) => b.layouts - a.layouts);
console.log(`${copies} copies of ${rows.length} designs, ${seconds}s each, all copies in the viewport:`);
for (const row of costly) {
  const note = accepted[row.id] ? `accepted: ${accepted[row.id]}` : 'NOT FREE';
  console.log(`  ${row.id}: ${row.layouts} layouts, ${row.styles} style recalculations (${note})`);
}
const unexplained = costly.filter((row) => !accepted[row.id]);
if (unexplained.length) {
  console.error(`These designs cost a layout per frame with no recorded reason: ${unexplained.map((row) => row.id).join(', ')}`);
  console.error('Make it a transform, or add the reason to scripts/layout-cost.mjs.');
  process.exitCode = 1;
}
const missing = Object.keys(accepted).filter((id) => !costly.some((row) => row.id === id));
if (missing.length) {
  console.error(`These designs are listed as costing layout but no longer do: ${missing.join(', ')}`);
  console.error('Remove them from scripts/layout-cost.mjs so the list stays true.');
  process.exitCode = 1;
}
if (!process.exitCode) {
  console.log(`${rows.length - costly.length} of ${rows.length} designs cost no layout per frame; the ${costly.length} that do are each accounted for.`);
}
