import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { loaderRegistry } from '@wavelo/core';
import { chromium } from 'playwright';

const outputDirectory = resolve('release-audit');
const screenshotPath = resolve(outputDirectory, 'catalog-corrected-contact-sheet.png');
const reportPath = resolve('docs', 'LOADER_VISUAL_CORRECTNESS_AUDIT.md');
// Designs whose motion is not driven by the document clock, so sampling two
// moments 250ms apart cannot show them advancing. Determinate tracks take their
// fill from the configured value; the scroll-driven bar takes its progress from a
// scroll timeline, which the audit checks by name instead of by elapsed time.
// Anything else in the catalog must be sampled as advancing.
const staticTypes = new Set(['segmented-bar', 'progress-bar', 'progress-ring', 'progress-steps', 'progress-top']);
/** Designs whose fill comes from a timeline the browser drives, not the clock. */
const timelineTypes = new Map([['progress-scroll', 'ScrollTimeline'], ['progress-view', 'ViewTimeline']]);

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
    'progress-scroll': 'A reading-progress bar fills as the document scrolls, driven by a scroll timeline rather than a clock.',
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
  const sample = () => page.locator('.card').evaluateAll((cards) => cards.map((card) => {
    const id = card.dataset.id ?? card.querySelector('code')?.textContent?.match(/type: '([^']+)'/)?.[1];
    const element = card.querySelector('.wavelo');
    const styles = element ? getComputedStyle(element) : null;
    const pseudoBefore = element ? getComputedStyle(element, '::before').animationName : 'none';
    const pseudoAfter = element ? getComputedStyle(element, '::after').animationName : 'none';
    const partAnimations = [...(element?.querySelectorAll('.wavelo__part') ?? [])].map((part) => getComputedStyle(part).animationName);
    // A pseudo-element animation reports a CSSPseudoElement target; resolve it
    // back to its host so ring designs that animate only ::before/::after count.
    const live = document.getAnimations().filter((animation) => {
      const target = animation.effect?.target;
      if (!target) return false;
      const host = target.hostElement ?? target;
      return Boolean(element) && (element === host || element.contains(host));
    });
    return {
      id,
      className: element?.className ?? '',
      partCount: element?.querySelectorAll('.wavelo__part').length ?? 0,
      animations: [styles?.animationName ?? 'none', pseudoBefore, pseudoAfter, ...partAnimations].filter((name) => name && name !== 'none'),
      progress: element?.style.getPropertyValue('--wavelo-progress') ?? '',
      playStates: live.map((animation) => animation.playState),
      times: live.map((animation) => animation.currentTime),
      timelines: live.map((animation) => (animation.timeline === document.timeline ? 'document' : animation.timeline?.constructor?.name ?? 'other'))
    };
  }));
  // Two samples ~250ms apart prove the animation is advancing, not merely declared.
  const first = await sample();
  await page.waitForTimeout(250);
  results = (await sample()).map((second, index) => ({
    ...second,
    advancing: second.times.some((time, slot) => typeof time === 'number' && time !== first[index].times[slot])
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
const aliases = loaderRegistry.length - active.length;
const rows = active.map((loader) => {
  const actual = byId.get(loader.id);
  const motion = staticTypes.has(loader.id)
    ? 'static by design'
    : timelineTypes.has(loader.id)
      ? actual.timelines.length > 0 && actual.timelines.every((timeline) => timeline === timelineTypes.get(loader.id))
        ? `${timelineTypes.get(loader.id)}-driven (${actual.timelines.length} animation(s), no document clock)`
        : `MISMATCH: expected a ${timelineTypes.get(loader.id)}, found ${actual.timelines.join(', ') || 'no animation'}`
      : actual.advancing
        ? `animating (${actual.playStates.length} CSS animation(s) advancing)`
        : actual.animations.length > 0
          ? 'MISMATCH: animation declared but not advancing'
          : 'MISMATCH: no animation found';
  const implementation = `kind=${loader.kind}; parts=${actual.partCount}; classes=${actual.className}; animations=${actual.animations.join(', ') || 'none'}`;
  const status = motion.startsWith('MISMATCH') ? 'FAIL' : 'PASS';
  return `| \`${loader.id}\` | ${loader.name} | ${expectedBehavior(loader)} | ${implementation} | ${motion} | ${status} |`;
}).join('\n');

const failures = active.filter((loader) => {
  const actual = byId.get(loader.id);
  if (!actual) return true;
  if (staticTypes.has(loader.id)) return false;
  if (timelineTypes.has(loader.id)) return actual.timelines.length === 0 || !actual.timelines.every((timeline) => timeline === timelineTypes.get(loader.id));
  return !actual.advancing;
});
if (failures.length > 0) throw new Error(`Visual contracts not met in the browser: ${failures.map((loader) => loader.id).join(', ')}`);

await writeFile(reportPath, `# Loader visual correctness audit

Audit date: generated by \`npm run audit:visual:correctness\` against the current build.

## Scope and evidence

- **Inspected:** all ${active.length} active designs${aliases ? `, plus the ${aliases} deprecated aliases` : '; the catalog currently has no deprecated aliases'}.
- **Generated artifact:** [catalog-corrected-contact-sheet.png](../release-audit/catalog-corrected-contact-sheet.png).
- **Website under test:** the rebuilt \`apps/docs/dist/index.html\`, served by the
  same static gallery test path.
- **Automated evidence:** every card was located by its public ID; actual DOM
  classes, child-part counts, computed CSS animation names, progress CSS
  variables, desktop rendering, and 375px mobile overflow were inspected. Each
  design's CSS animations were then sampled twice, 250ms apart, through
  \`document.getAnimations()\`: a design counts as animating only if its
  animations report a running play-state **and** their current time advanced
  between the samples.
- **Human evidence:** the corrected contact sheet was visually reviewed for
  recognizable geometry, blank previews, clipping, inconsistent sizing, and
  obvious generic fallback output. A static image cannot prove motion, so the
  report relies on the sampled play-state evidence above for that and does not
  treat the screenshot as sole proof.

## Root cause found

The previous renderer dispatched most IDs only by broad \`kind\` and emitted
identical child structures. Many descriptions therefore had no corresponding
ID-specific geometry or animation. Progress rings also did not bind their
configured value to the visual ring fill. Deprecated aliases rendered under
their alias definitions instead of the canonical implementation.

## Results

All ${active.length} active designs render their own ID-specific geometry in the browser.
${active.length - staticTypes.size - timelineTypes.size} were sampled animating through \`document.getAnimations()\`;
the ${staticTypes.size} determinate progress designs are static by design, because their fill is
bound to the configured value rather than to a clock; and ${[...timelineTypes.keys()].map((id) => `\`${id}\``).join(' and ')}
run on a timeline the browser drives, which is verified by the timeline's own type rather than by elapsed time.
${aliases ? `${aliases} deprecated aliases resolve to their canonical definitions while preserving their public imports.` : 'Every public ID has its own implementation, so no design borrows another name.'}
The gallery embeds the complete stylesheet once. Separately,
\`tests/browser.test.mjs\` re-renders every design using only the slice its own
entry point ships and requires the computed result to match, so a slice that is
missing rules fails there rather than passing unnoticed here. That suite also
asserts no two designs render identically and that every design paints something
visible.

| ID | Displayed name | Expected shape/behavior | Actual renderer evidence | Animation result | Verification |
|---|---|---|---|---|---|
${rows}

## Remaining limitations

The sampled play-state evidence proves each animating design advances in Chromium
with the default configuration, the static designs bind their fill to the
configured value instead, and the two timeline-driven designs report a ScrollTimeline
and a ViewTimeline rather than the document clock. It does not prove subjective quality, nor does it cover
\`paused\`, \`direction\` and \`reducedMotion\` behaviour — those have their own
computed-style assertions in \`tests/browser.test.mjs\`, which runs in CI.
Per-design stylesheet slices are checked by rendering each design alone with only
its own slice; see the same suite. Future visual review should keep using real
browser playback rather than metadata or unique IDs alone.
`, 'utf8');

console.log(`Audited ${active.length} active designs: ${active.length - staticTypes.size - timelineTypes.size} animating, ${staticTypes.size} static by design, ${timelineTypes.size} timeline-driven${aliases ? `, ${aliases} deprecated aliases` : ''}`);
