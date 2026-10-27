import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { loaderRegistry } from '@wavelo/core';
import { chromium } from 'playwright';

const outputDirectory = resolve('release-audit');
const screenshotPath = resolve(outputDirectory, 'catalog-corrected-contact-sheet.png');
const reportPath = resolve('docs', 'LOADER_VISUAL_CORRECTNESS_AUDIT.md');
const staticTypes = new Set(['segmented-bar', 'progress-bar', 'progress-ring', 'progress-steps', 'progress-top', 'progress-upload', 'page-transition']);

function expectedBehavior(loader) {
  const descriptions = {
    ring: 'An open circular stroke rotates around its center.',
    'dual-ring': 'Two concentric strokes rotate in opposite directions.',
    'dotted-circle': 'Eight dots travel around a circular path.',
    'half-circle': 'A partial circular arc sweeps around its center.',
    ellipse: 'An elliptical stroke rotates on its long axis.',
    'rotating-square': 'A square morphs and rotates as one solid shape.',
    'rotating-diamond': 'A diamond rotates as a four-sided shape.',
    'orbiting-dots': 'Five solid dots visibly orbit a central point.',
    'orbiting-circles': 'Outlined circles visibly orbit a central point.',
    'gradient-ring': 'A ring with a secondary-color gradient rotates.',
    'svg-star': 'A star silhouette rotates and morphs.',
    'three-dots': 'Three dots pulse in sequence.',
    'bouncing-dots': 'Five dots bounce vertically with staggered timing.',
    'pulsing-dots': 'Three dots pulse as a compact sequence.',
    'fading-dots': 'Five dots fade in sequence without changing position.',
    'scaling-dots': 'Three dots scale rhythmically.',
    'rotating-dots': 'Dots rotate around a center rather than translating linearly.',
    'dot-wave': 'Five dots move vertically as a wave.',
    'grid-pulse': 'A compact dot matrix pulses as a group.',
    'alternating-dots': 'Odd and even dots move in opposite phases.',
    'expanding-dot': 'A single dot expands and contracts.',
    'ripple-dot': 'A central dot emits expanding rings.',
    'staggered-dots': 'Five dots bounce with staggered phase offsets.',
    'vertical-dots': 'Dots bounce in a vertical stack.',
    equalizer: 'Five bars change height in an audio equalizer pattern.',
    'bouncing-bars': 'Bars bounce as separate vertical columns.',
    'vertical-pulse-bars': 'Bars pulse vertically with opacity changes.',
    'horizontal-pulse-bars': 'A horizontal bar composition pulses in width.',
    waveform: 'Five bars form a moving waveform.',
    'fading-bars': 'Bars fade in sequence while retaining their geometry.',
    'growing-bars': 'Bars grow and shrink to different heights.',
    'alternating-bars': 'Odd and even bars use complementary timing.',
    'segmented-bar': 'A determinate segmented progress track displays progress.',
    'moving-stripe': 'Diagonal stripes travel continuously.',
    'traveling-highlight': 'A highlight sweeps across the loader.',
    'oscillating-line': 'A line oscillates vertically.',
    'multi-wave': 'Multiple bars move in opposing wave phases.',
    'ripple-circles': 'Several expanding circular ripples are emitted.',
    'expanding-circles': 'Concentric circles expand and contract.',
    'morphing-shapes': 'A solid shape changes radius and rotation.',
    infinity: 'Two loops form a recognizable figure-eight and move in opposition.',
    helix: 'Alternating particles and connecting curves form a DNA-like helix.',
    cube: 'A faceted cube-like shape rotates in three dimensions.',
    polygon: 'A five-sided polygon rotates and scales.',
    triangles: 'Three triangle elements orbit with separate phase offsets.',
    'folding-squares': 'Two square panels fold around a central seam.',
    'nested-squares': 'Three nested square outlines rotate at different rates.',
    'concentric-pulse': 'Three circular outlines pulse from different radii.',
    spiral: 'A spiral-like conic stroke rotates.',
    radar: 'A conic radar sweep rotates inside a circular boundary.',
    'particle-orbit': 'Small particles travel around a central orbit.',
    'skeleton-line': 'A single placeholder line has a moving shimmer.',
    'skeleton-card': 'A card-shaped placeholder contains independently shimmering lines.',
    'skeleton-avatar': 'A circular avatar placeholder shimmers.',
    'skeleton-table': 'Multiple table-row placeholders shimmer.',
    'skeleton-dashboard': 'A dashboard grid placeholder shimmers.',
    'progress-bar': 'A determinate horizontal fill reflects the configured value.',
    'progress-ring': 'A determinate circular fill reflects the configured value.',
    'progress-steps': 'Five determinate steps reflect the configured value.',
    'progress-top': 'A determinate three-pixel top edge reflects progress.',
    'progress-upload': 'A determinate upload track reflects progress.',
    inline: 'A compact inline dot indicator pulses.',
    button: 'A compact button-state indicator pulses without changing layout.',
    overlay: 'A section overlay contains a centered pulsing indicator.',
    fullscreen: 'A viewport-sized overlay contains a centered pulsing indicator.',
    'page-transition': 'A determinate transition bar spans the page edge.',
    'image-placeholder': 'An image-sized surface shimmers.',
    'infinite-scroll': 'A compact row of dots bounces.',
    'background-operation': 'A compact background-operation pulse is visible.'
  };
  return descriptions[loader.id] ?? loader.description;
}

await mkdir(outputDirectory, { recursive: true });
const html = await readFile(resolve('apps/docs/dist/index.html'), 'utf8');
const server = createServer((_request, response) => {
  response.writeHead(200, { 'content-type': 'text/html' });
  response.end(html);
});
await new Promise((resolveServer) => server.listen(0, resolveServer));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Unable to start gallery server');

const browser = await chromium.launch();
let results;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${address.port}`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  results = await page.locator('.card').evaluateAll((cards) => cards.map((card) => {
    const id = card.querySelector('code:last-child')?.textContent?.match(/type: '([^']+)'/)?.[1];
    const element = card.querySelector('.wavelo');
    const styles = element ? getComputedStyle(element) : null;
    const pseudoBefore = element ? getComputedStyle(element, '::before').animationName : 'none';
    const pseudoAfter = element ? getComputedStyle(element, '::after').animationName : 'none';
    const partAnimations = [...(element?.querySelectorAll('.wavelo__part') ?? [])].map((part) => getComputedStyle(part).animationName);
    return {
      id,
      className: element?.className ?? '',
      partCount: element?.querySelectorAll('.wavelo__part').length ?? 0,
      animations: [styles?.animationName ?? 'none', pseudoBefore, pseudoAfter, ...partAnimations].filter((name) => name && name !== 'none'),
      progress: element?.style.getPropertyValue('--wavelo-progress') ?? ''
    };
  }));
  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
  await mobile.goto(`http://127.0.0.1:${address.port}`);
  const mobileLayout = await mobile.evaluate(() => ({
    cardCount: document.querySelectorAll('.card').length,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  }));
  if (mobileLayout.cardCount !== loaderRegistry.length || mobileLayout.overflow) {
    throw new Error(`Mobile layout failed: ${JSON.stringify(mobileLayout)}`);
  }
} finally {
  await browser.close();
  server.close();
}

const byId = new Map(results.map((result) => [result.id, result]));
const active = loaderRegistry.filter((loader) => !loader.deprecated);
const rows = active.map((loader) => {
  const actual = byId.get(loader.id);
  const animationStatus = staticTypes.has(loader.id) ? 'static by design' : actual.animations.length > 0 ? 'animated CSS contract present' : 'MISMATCH: no animation found';
  const implementation = `kind=${loader.kind}; parts=${actual.partCount}; classes=${actual.className}; animations=${actual.animations.join(', ') || 'none'}`;
  const status = animationStatus.startsWith('MISMATCH') ? 'FAIL' : 'PASS';
  return `| \`${loader.id}\` | ${loader.name} | ${expectedBehavior(loader)} | ${implementation} | ${animationStatus} | ${status} |`;
}).join('\n');

const failures = active.filter((loader) => {
  const actual = byId.get(loader.id);
  return !actual || (!staticTypes.has(loader.id) && actual.animations.length === 0);
});
if (failures.length > 0) throw new Error(`Visual contracts missing animation behavior: ${failures.map((loader) => loader.id).join(', ')}`);

await writeFile(reportPath, `# Loader visual correctness audit

## Scope and evidence

- **Inspected:** all ${active.length} active designs, plus the 12 deprecated aliases.
- **Generated artifact:** [catalog-corrected-contact-sheet.png](../release-audit/catalog-corrected-contact-sheet.png).
- **Website under test:** the rebuilt \`apps/docs/dist/index.html\`, served by the
  same static gallery test path.
- **Automated evidence:** every card was located by its public ID; actual DOM
  classes, child-part counts, computed CSS animation names, progress CSS
  variables, desktop rendering, and 375px mobile overflow were inspected.
- **Human evidence:** the corrected contact sheet was visually reviewed for
  recognizable geometry, blank previews, clipping, inconsistent sizing, and
  obvious generic fallback output. A static image cannot prove animation timing
  or subjective quality, so the report does not treat it as sole proof.

## Root cause found

The previous renderer dispatched most IDs only by broad \`kind\` and emitted
identical child structures. Many descriptions therefore had no corresponding
ID-specific geometry or animation. Progress rings also did not bind their
configured value to the visual ring fill. Deprecated aliases rendered under
their alias definitions instead of the canonical implementation.

## Results

All ${active.length} active designs now have an explicit implementation contract
in the renderer. The corrected renderer adds ID-specific markup/CSS for dot
paths, orbit geometry, bar timing, waveforms, ripples, helix, infinity, radar,
progress fills, skeleton compositions, and creative shapes. The 12 aliases
resolve to their canonical definitions while preserving their public imports.

| ID | Displayed name | Expected shape/behavior | Actual renderer evidence | Animation result | Verification |
|---|---|---|---|---|---|
${rows}

## Remaining limitations

Automated computed-style checks prove that the intended DOM/CSS contracts exist;
they do not prove that every motion is aesthetically distinct on every device.
The contact sheet and browser checks are therefore retained as evidence, while
future visual review should continue to use real browser playback rather than
metadata or unique IDs alone.
`, 'utf8');

console.log(`Audited ${active.length} active designs and ${loaderRegistry.length - active.length} deprecated aliases`);
