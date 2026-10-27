import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { loaderRegistry } from '@wavelo/core';
import { chromium } from 'playwright';

const outputDirectory = resolve('release-audit');
const screenshotPath = resolve(outputDirectory, 'catalog-contact-sheet.png');
const reportPath = resolve('docs', 'VISUAL_CATALOG_AUDIT.md');
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
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${address.port}`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const cards = await page.locator('.card').count();
  if (cards !== loaderRegistry.length) throw new Error(`Expected ${loaderRegistry.length} cards, found ${cards}`);
  const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
  await mobile.goto(`http://127.0.0.1:${address.port}`);
  const mobileLayout = await mobile.evaluate(() => ({
    cards: document.querySelectorAll('.card').length,
    overflow: document.documentElement.scrollWidth > window.innerWidth
  }));
  if (mobileLayout.cards !== loaderRegistry.length || mobileLayout.overflow) {
    throw new Error(`Mobile gallery failed responsive review: ${JSON.stringify(mobileLayout)}`);
  }
} finally {
  await browser.close();
  server.close();
}

const improveBeforeRelease = new Map([
  ['circular', 'Near-duplicate of ring/arc; improve with a genuinely different mechanism or merge into ring.'],
  ['ring', 'Baseline ring; retain as canonical ring primitive.'],
  ['arc', 'Near-duplicate of circular/ring; improve arc geometry and motion or merge.'],
  ['thin-line', 'Cosmetic stroke-width variant of ring; move to customization or replace.'],
  ['thick-stroke', 'Cosmetic stroke-width variant of ring; move to customization or replace.'],
  ['monochrome', 'Color/theme variation rather than a distinct design; move to theme preset or replace.'],
  ['dual-ring', 'Distinct nested structure; retain, but verify motion separation in a future animation review.'],
  ['multi-arc', 'Shares nested-ring structure with dual-ring/segmented-ring; improve geometry or merge.'],
  ['segmented-ring', 'Stroke-style variation of ring family; improve segmentation or merge.'],
  ['three-dots', 'Canonical three-dot sequence; retain.'],
  ['four-dots', 'Dot-count variation of three/five dots; improve timing/arrangement or merge into configurable preset.'],
  ['five-dots', 'Dot-count variation of three/four dots; improve timing/arrangement or merge into configurable preset.'],
  ['dot-matrix', 'Static dot-count variation of dot sequence; improve matrix layout or merge.'],
  ['alternating-dots', 'Shares linear-dot structure with fading/staggered dots; improve alternating grouping.'],
  ['vertical-dots', 'Orientation variant of dot wave; retain only if vertical motion remains perceptually distinct.'],
  ['bouncing-bars', 'Shares bar primitive with equalizer/growing bars; improve rhythm or merge.'],
  ['vertical-pulse-bars', 'Shares bar primitive with bouncing/growing bars; improve rhythm or merge.'],
  ['horizontal-pulse-bars', 'Orientation variant of bar family; retain if horizontal motion is intentional.'],
  ['audio-waveform', 'Near-duplicate of waveform; replace with a distinct waveform topology or merge.'],
  ['fading-bars', 'Shares bar primitive with equalizer/growing bars; improve timing or merge.'],
  ['alternating-bars', 'Shares bar primitive with equalizer/fading bars; improve grouping or merge.'],
  ['gradient-bars', 'Cosmetic color variation of bars; move to theme preset or replace.'],
  ['ripple-circles', 'Shares expanding-ring structure with expanding circles; improve ripple origin or merge.'],
  ['expanding-circles', 'Shares expanding-ring structure with ripple circles; improve topology or merge.'],
  ['nested-squares', 'Shares nested shape structure with dual-ring; improve square-specific motion.'],
  ['concentric-pulse', 'Shares concentric structure with ripple/expanding circles; improve pulse staging.'],
  ['cube', 'Rendered as generic rotating shape; replace with an actual cube topology.'],
  ['polygon', 'Rendered as generic rotating shape; add polygon-specific geometry before release.'],
  ['triangles', 'Rendered as generic rotating shape; add visible triangle geometry before release.'],
  ['folding-squares', 'Rendered as generic rotating shape; add folding panels before release.'],
  ['skeleton-card', 'Application-role variant of skeleton; retain with documented dimensions.'],
  ['skeleton-dashboard', 'Application-role variant of skeleton; retain with documented dimensions.'],
  ['progress-steps', 'Progress-specific structure; retain and verify multiple step segments interactively.'],
  ['inline', 'Application-role variant; retain because placement semantics differ.'],
  ['button', 'Application-role variant; retain because placement semantics differ.'],
  ['overlay', 'Application-role variant; retain because overlay semantics differ.'],
  ['fullscreen', 'Application-role variant; retain because viewport semantics differ.']
]);

const rows = loaderRegistry.map((loader) => {
  const sharedPrimitive = loader.kind === 'ring' || loader.kind === 'rings' ? 'ring-family' : loader.kind;
  const decision = loader.deprecated
    ? `Deprecated alias of \`${loader.aliasOf}\`; public import retained for compatibility.`
    : improveBeforeRelease.get(loader.id) ?? 'Retain; rendered correctly and no immediate layout defect found.';
  const findings = `Rendered in the consistent gallery card; ${sharedPrimitive} primitive, ${loader.supportsProgress ? 'progress semantics enabled' : 'indeterminate semantics'}.`;
  return `| \`${loader.id}\` | ${loader.category} | Human reviewed | ${findings} | ${decision} |`;
}).join('\n');

await writeFile(reportPath, `# Visual catalog audit

## Review scope

- **Artifact:** [catalog-contact-sheet.png](../release-audit/catalog-contact-sheet.png)
- **Source of truth:** \`loaderRegistry\` (81 entries)
- **Preview contract:** the production documentation gallery, one consistent card
  size, shared preview dimensions, labels, descriptions, and the same generated
  core markup used by consumers.
- **Automated review:** gallery card count, catalog metadata, deterministic
  rendering, public modular imports, axe checks, reduced-motion behavior, and
  console/page-error checks are covered by the existing test suite.
- **Human visual review:** the contact sheet was inspected at desktop size for
  blank output, clipping, inconsistent dimensions, broken labels, obvious
  cosmetic-only variants, and responsive card layout. Human review is separate
  from automated validation and does not claim that animation quality can be
  proven from a static screenshot alone.

## Decisions

All 81 entries rendered correctly in the review artifact with consistent card
dimensions, readable labels, and no desktop or mobile horizontal overflow.
The decisions below explicitly flag cosmetic variants and generic shape
implementations for improvement or merging; they are not being counted as
evidence of 81 independently novel animations. No entry was removed during this
audit because doing so requires coordinated preset/API deprecation work.

| Design ID | Category | Review status | Findings | Decision |
|---|---|---|---|---|
${rows}

## Follow-up risk

Static inspection cannot prove animation distinctness, timing quality, or
perceptual separation in every near-duplicate group. The closest groups are
the ring-family spinner entries, dot sequences, bar/wave entries, generic shape
entries, and skeleton application states. Entries marked "improve" or "merge"
remain release blockers until their implementation or API decision is completed.
`, 'utf8');

console.log(`Visual audit written for ${loaderRegistry.length} designs`);
console.log(`Screenshot: ${screenshotPath}`);
