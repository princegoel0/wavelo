// Scratch review harness: one page, every design frozen at four phases of its own
// cycle, on a light and a dark stage. Not a gate — it exists so a human can look.
import { writeFile } from 'node:fs/promises';
import { renderLoader } from '@wavelo/core';
import { chromium } from 'playwright';

const ids = process.argv.slice(2);
const cols = [0, 0.25, 0.5, 0.75];

function tiles(theme) {
  return ids
    .map((id) => {
      const row = cols
        .map(
          (phase, index) =>
            `<div class="cell" data-id="${id}" data-col="${index}">${renderLoader({ type: id }).html}</div>`
        )
        .join('');
      return `<div class="row"><span class="name">${id}</span><div class="cells">${row}</div></div>`;
    })
    .join('');
}

const page = `<!doctype html><meta charset=utf8><style>
${[...new Set(ids.map((id) => renderLoader({ type: id }).css))].join('\n')}
body{margin:0;font:12px system-ui;background:#fff;color:#0b1020}
.row{display:grid;grid-template-columns:9rem 1fr;border-bottom:1px solid #d8dce6}
.name{align-self:center;padding:.5rem;font-weight:600}
.cells{display:grid;grid-template-columns:repeat(4,1fr)}
.cell{display:grid;place-items:center;height:120px;border-left:1px dashed #e5e8f0}
.dark{background:#0f172a;color:#e2e8f0}
.phase{position:sticky;top:0;background:#f3f5ff;font-weight:700;padding:.2rem .5rem}
</style>
<div class="phase">columns are the same design frozen at 0, 300, 600 and 900 ms of wall-clock time</div>
${tiles('light')}
`;

const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const shot = await browser.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 });
  await shot.setContent(page);
  if (theme === 'dark') await shot.addStyleTag({ content: 'body{background:#0f172a;color:#e2e8f0}' });
  await shot.evaluate(() => {
    for (const animation of document.getAnimations()) {
      const cell = animation.effect?.target?.closest?.('.cell');
      if (!cell) continue;
      // Absolute time, not a fraction of each animation's own cycle: a design with two
      // speeds (a clock's hands) must keep their ratio, or the filmstrip hides it.
      animation.pause();
      animation.currentTime = Number(cell.dataset.col) * 300;
    }
  });
  const path = `release-audit/tranche1-${theme}.png`;
  await shot.screenshot({ path, fullPage: true });
  const painted = await shot.evaluate(() => {
    const blank = [];
    for (const cell of document.querySelectorAll('.cell')) {
      const box = cell.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) blank.push(`${cell.dataset.id}#${cell.dataset.col}: zero box`);
      const el = cell.firstElementChild;
      if (!el) blank.push(`${cell.dataset.id}#${cell.dataset.col}: no element`);
      else {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) blank.push(`${cell.dataset.id}#${cell.dataset.col}: ${r.width}x${r.height}`);
        const overflowY = Math.max(0, Math.round(r.bottom - box.bottom), Math.round(box.top - r.top));
        const overflowX = Math.max(0, Math.round(r.right - box.right), Math.round(box.left - r.left));
        if (overflowY > 6 || overflowX > 20) blank.push(`${cell.dataset.id}#${cell.dataset.col}: clipped ${overflowX}x${overflowY}`);
      }
    }
    return blank;
  });
  console.log(`${path}: ${ids.length} designs, ${cols.length} phases`);
  for (const line of painted) console.log('  ', line);
}
await browser.close();
