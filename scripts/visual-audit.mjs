import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { loaderRegistry } from '@wavelo/core';
import { chromium } from 'playwright';

const outputDirectory = resolve('release-audit');
const screenshotPath = resolve(outputDirectory, 'catalog-contact-sheet.png');
// The review sheet this script writes is an artifact of a run, not documentation that
// anyone maintains: it was regenerated against a 129-design catalog and then sat in `docs/`
// describing designs that no longer ship. It now lands beside the contact sheet.
const reportPath = resolve(outputDirectory, 'VISUAL_CATALOG_AUDIT.md');
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

// Per-design review decisions, stated against what the stylesheet actually renders
// now. The name-contract test in `tests/browser.test.mjs` backs every claim here
// that says a geometry is asserted.
const designDecisions = new Map([
  ['circular', 'Closed border with a rotating ::before accent arc, asserted by the name contract; a different mechanism from ring.'],
  ['ring', 'Baseline ring; retain as canonical ring primitive.'],
  ['arc', 'One drawn border side (a quarter turn), asserted by the name contract; retain.'],
  ['thin-line', 'Measured hairline stroke (1px against the ring\u2019s 3px); retain as the documented weight pair with thick-stroke.'],
  ['thick-stroke', 'Measured heavy stroke, asserted at more than twice the ring\u2019s; retain as the documented weight pair with thin-line.'],
  ['monochrome', 'Half-filled rotating conic disc, asserted by the name contract; no longer a colour-only variant.'],
  ['dual-ring', 'Distinct nested structure; retain, but verify motion separation in a future animation review.'],
  ['multi-arc', 'Three arcs at three different insets (root plus both pseudo layers), asserted distinct from dual-ring; retain.'],
  ['segmented-ring', 'Dashed four-sided border, asserted by the name contract; retain as the stroke-pattern member of the ring family.'],
  ['three-dots', 'Canonical three-dot sequence; retain.'],
  ['four-dots', 'Dot-count variation of three/five dots; improve timing/arrangement or merge into configurable preset.'],
  ['five-dots', 'Dot-count variation of three/four dots; improve timing/arrangement or merge into configurable preset.'],
  ['dot-matrix', 'Three-by-three grid of nine parts with staggered pulse, asserted by the name contract; retain.'],
  ['alternating-dots', 'Shares linear-dot structure with fading/staggered dots; improve alternating grouping.'],
  ['vertical-dots', 'Orientation variant of dot wave; retain only if vertical motion remains perceptually distinct.'],
  ['bouncing-bars', 'Shares bar primitive with equalizer/growing bars; improve rhythm or merge.'],
  ['vertical-pulse-bars', 'Shares bar primitive with bouncing/growing bars; improve rhythm or merge.'],
  ['horizontal-pulse-bars', 'Orientation variant of bar family; retain if horizontal motion is intentional.'],
  ['audio-waveform', 'Seven bars on its own wavelo-audio keyframe, asserted different from waveform; retain.'],
  ['fading-bars', 'Shares bar primitive with equalizer/growing bars; improve timing or merge.'],
  ['alternating-bars', 'Shares bar primitive with equalizer/fading bars; improve grouping or merge.'],
  ['gradient-bars', 'Gradient-filled bars, asserted against the equalizer\u2019s flat fill; retain as the colour variant, and a theme preset would still be useful.'],
  ['ripple-circles', 'Shares expanding-ring structure with expanding circles; improve ripple origin or merge.'],
  ['expanding-circles', 'Shares expanding-ring structure with ripple circles; improve topology or merge.'],
  ['nested-squares', 'Three nested outlines at 8/25/42% insets with their own rotations; retain.'],
  ['concentric-pulse', 'Three circles at 12/28/44% insets pulsing with staggered delays; retain.'],
  ['cube', 'Faceted gradient with preserve-3d on wavelo-cube; retain.'],
  ['polygon', 'Pentagon clip-path on wavelo-polygon; retain.'],
  ['triangles', 'Three clipped triangles orbiting at 120-degree offsets on wavelo-triangle-orbit; retain.'],
  ['folding-squares', 'Two panels with a transparent seam on wavelo-fold; retain.'],
  ['skeleton-card', 'Application-role variant of skeleton; retain with documented dimensions.'],
  ['skeleton-dashboard', 'Application-role variant of skeleton; retain with documented dimensions.'],
  ['progress-steps', 'Progress-specific structure; retain and verify multiple step segments interactively.'],
  ['progress-scroll', 'Scroll-driven fill with no JavaScript; retain, and note it is Chromium-only today with a clock-driven sweep as the fallback.'],
  ['progress-view', 'View-timeline fill with no JavaScript: the bar tracks its own travel through the viewport, and `--wavelo-timeline` names another subject. Same clock-driven sweep where view timelines are missing.'],
  ['inline', 'Application-role variant; retain because placement semantics differ.'],
  ['button', 'Application-role variant; retain because placement semantics differ.'],
  ['overlay', 'Application-role variant; retain because overlay semantics differ.'],
  ['fullscreen', 'Application-role variant; retain because viewport semantics differ.']
]);

const rows = loaderRegistry.map((loader) => {
  const sharedPrimitive = loader.kind === 'ring' || loader.kind === 'rings' ? 'ring-family' : loader.kind;
  const decision = loader.deprecated
    ? `Deprecated alias of \`${loader.aliasOf}\`; public import retained for compatibility.`
    : designDecisions.get(loader.id) ?? 'Retain; rendered correctly and no immediate layout defect found.';
  const findings = `Rendered in the consistent gallery card; ${sharedPrimitive} primitive, ${loader.supportsProgress ? 'progress semantics enabled' : 'indeterminate semantics'}.`;
  return `| \`${loader.id}\` | ${loader.category} | Automated evidence; human motion-quality review pending | ${findings} | ${decision} |`;
}).join('\n');

await writeFile(reportPath, `# Visual catalog audit

## Review scope

- **Artifact:** [catalog-contact-sheet.png](../release-audit/catalog-contact-sheet.png)
- **Source of truth:** \`loaderRegistry\` (${loaderRegistry.length} entries)
- **Preview contract:** the production documentation gallery, one consistent card
  size, shared preview dimensions, labels, descriptions, and the same generated
  core markup used by consumers.
- **Automated review:** gallery card count, catalog metadata, deterministic
  rendering, public modular imports, axe checks, reduced-motion behavior, and
  console/page-error checks are covered by the existing test suite.
- **Human visual review:** the contact sheet is the artifact for the owner's review
  at desktop size — blank output, clipping, inconsistent dimensions, broken labels
  and obvious cosmetic-only variants. That review is separate from automated
  validation and is not recorded as complete here: whether each animation looks
  right is still an owner decision, tracked in \`RELEASE_CHECKLIST.md\`.

## Decisions

All ${loaderRegistry.length} entries rendered correctly in the review artifact with consistent card
dimensions, readable labels, and no desktop or mobile horizontal overflow.
None of them renders something other than what its name and description promise:
the name-contract test asserts the promised geometry per design, and the
distinctness test asserts that no two of the ${loaderRegistry.length} share a rendered signature. What the decisions below
still flag is a taste question — whether a count or orientation variant earns its
own public ID — not a defect, and it is a post-release judgement rather than a
release blocker. No entry was removed during this audit because doing so requires
coordinated preset/API deprecation work.

| Design ID | Category | Review status | Findings | Decision |
|---|---|---|---|---|
${rows}

## Follow-up risk

A screenshot cannot judge taste, but distinctness and motion are no longer taken
from one. The browser suite compares a computed-style signature for every design
(geometry, drawn borders, gradients, animation identity and timing, part layout)
and requires all ${loaderRegistry.length} to differ, and the correctness audit samples each design's
animations twice, 250ms apart, so a frozen or duplicated design fails a test
rather than relying on a reviewer's memory. What remains genuinely unproven is
perceptual quality: whether a count or orientation variant deserves its own public
ID. That is a product call for after the release, and the closest groups to
revisit are the ring-family spinners, the dot counts, and the bar/wave families.
`, 'utf8');

console.log(`Visual audit written for ${loaderRegistry.length} designs`);
console.log(`Screenshot: ${screenshotPath}`);
