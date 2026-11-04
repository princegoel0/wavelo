// Documentation is kept in sync with the code: the numbers and API names below
// are read from the built packages, and every file listed against them must
// state the same thing. Adding a design, an option or a bundle-size claim means
// updating the document — `npm run docs:check` fails otherwise.
import { gzipSync } from 'node:zlib';
import { bundleSize, entries } from './bundle-entries.mjs';
import { readFile } from 'node:fs/promises';
import { loaderConfigKeys } from '../packages/core/dist/config.js';
import { loaderRegistry, presetRegistry } from '../packages/core/dist/registry.js';
import { baseCss, kindStyles } from '../packages/core/dist/css/index.js';

const ids = loaderRegistry.length;
const active = loaderRegistry.filter((loader) => !loader.deprecated).length;
const aliases = ids - active;
const slices = Object.keys(kindStyles).length;
const options = loaderConfigKeys.length;
// The 3D set is asserted against each design's own CSS in tests/core.test.mjs; the count is
// what the documents quote, so it is derived here rather than typed.
const threeD = loaderRegistry.filter((loader) => loader.dimension === '3d').length;

async function gzipped(source, name) {
  return (await bundleSize(source, name)).gzipped;
}

// Measured from the same entry points `npm run measure` budgets, so a document can never
// quote a figure the gate disagrees with.
const singleLoaderKb = ((await gzipped(entries['individual-loader'], 'doc-check-individual')) / 1024).toFixed(1);
const catalogKb = ((await gzipped(entries['core-renderer'], 'doc-check-renderer')) / 1024).toFixed(1);

/** [file, strings that must appear] */
const required = [
  ['README.md', [`${ids} designs`, `${slices} stylesheet slices`, `${options} configuration keys`]],
  // The PRD is the requirements document the rest of the project is measured against, and
  // until now nothing measured it: it carried "128 of the 138 designs are 2D" and "Ten
  // designs" for a 3D set of 25 through a full green run, because it was in none of the
  // lists below.
  ['PRD.md', [`${ids} designs`, `${options} configuration keys`, `${slices} render kinds`, `${threeD} designs`]],
  ['CHANGELOG.md', [`${ids} public IDs`, aliases ? `${aliases} deprecated aliases` : 'no deprecated aliases']],
  ['docs/COMPATIBILITY.md', [`${options} configuration keys`, `${slices} render kinds`, 'styles.css']],
  ['docs/FRAMEWORKS.md', ['@wavelo/core/styles.css', 'ensureStyles']],
  ['packages/core/README.md', [`${slices} render kinds`, 'ensureStyles', 'renderStylesheets']],
  ['packages/react/README.md', ['styles.css']],
  ['packages/vue/README.md', ['styles.css']],
  ['packages/svelte/README.md', ['styles.css']],
  ['packages/angular/README.md', ['styles.css']],
  ['packages/vanilla/README.md', ['styles.css']],
  ['packages/web-components/README.md', ['styles.css']],
  ['docs/BUNDLE_SIZE.md', [`${singleLoaderKb} KB`, `${catalogKb} KB`]],
  ['docs/RECIPES.md', ['@wavelo/core/styles.css', 'wavelo-csp-nonce', 'ensureStyles']],
  ['docs/MIGRATION.md', [`${ids} designs`, 'createRouteProgress']],
  ['docs/PERFORMANCE.md', [`${ids} designs`, 'npm run audit:layout']]
];

/** API that no longer exists must not be documented anywhere. */
const forbiddenTerms = [
  /loaders\/orbit(?![\w-])/,
  /loaders\/pulse(?![\w-])/,
  /loaders\/spinner(?![\w-])/,
  /loaders\/skeleton(?![\w-])/,
  /loaders\/progress(?![\w-])/
];
const forbiddenPatterns = [/\bvariant\s*[:=]/, /result\.css into every component/, /styles? are inlined per component/];

/**
 * Design IDs retired by the visual consolidation. A document that describes the *current*
 * catalog must not name one as reachable: `docs/MIGRATION.md` did exactly that for five
 * rows, so a reader following it got the fallback loader and no gate noticed. The history
 * documents — the dedup report, the master audit's index, the changelog — name them on
 * purpose, so they are not scanned. Only the code-quoted form matches, which keeps prose
 * like "bars and waveforms" out of the check.
 */
const retiredDesignIds = [
  'arc', 'half-circle', 'rotating-diamond', 'orbiting-circles', 'conic-ring', 'thin-line', 'thick-stroke',
  'four-dots', 'five-dots', 'bouncing-dots', 'scaling-dots', 'vertical-dots',
  'bouncing-bars', 'vertical-pulse-bars', 'waveform', 'audio-waveform', 'gradient-bars', 'signal-bars', 'spectrum',
  'expanding-circles', 'progress-gradient-ring', 'progress-timer'
];
const currentCatalogDocs = [
  'README.md', 'PRD.md', 'docs/BUNDLE_SIZE.md', 'docs/PERFORMANCE.md', 'docs/COMPATIBILITY.md',
  'docs/MIGRATION.md', 'docs/RECIPES.md', 'docs/FRAMEWORKS.md', 'docs/RELEASE.md',
  'packages/core/README.md', 'packages/react/README.md', 'packages/vue/README.md',
  'packages/svelte/README.md', 'packages/angular/README.md', 'packages/vanilla/README.md',
  'packages/web-components/README.md'
];
const failures = [];
for (const file of currentCatalogDocs) {
  const text = await readFile(file, 'utf8').catch(() => '');
  for (const id of retiredDesignIds) {
    if (new RegExp(`[\`'"]${id}[\`'"]`).test(text)) {
      failures.push(`${file} documents \`${id}\`, a design that was consolidated away`);
    }
  }
}
// A maintained document states a catalog size in the present tense, so the number has to be the
// registry's. docs/COMPATIBILITY.md carried "The catalog holds 129 public IDs" through four
// releases of growth because nothing compared it with anything.
for (const file of currentCatalogDocs) {
  const text = await readFile(file, 'utf8').catch(() => '');
  for (const [, stated] of text.matchAll(/(\d[\d,]*) public IDs\b/g)) {
    if (Number(stated.replace(/,/g, '')) !== ids) {
      failures.push(`${file} states ${stated} public IDs; the build has ${ids}`);
    }
  }
}

const files = new Set(required.map(([file]) => file));for (const [file, strings] of required) {
  const text = await readFile(file, 'utf8').catch(() => undefined);
  if (text === undefined) {
    failures.push(`${file} is missing`);
    continue;
  }
  // Whitespace is collapsed so a required fact survives prose reflow.
  const flat = text.replace(/\s+/g, ' ');
  for (const string of strings) {
    if (!flat.includes(string)) failures.push(`${file} does not state "${string}"`);
  }
}

for (const file of files) {
  const text = await readFile(file, 'utf8').catch(() => '');
  for (const pattern of forbiddenTerms) {
    if (pattern.test(text)) failures.push(`${file} still documents the removed entry point ${pattern}`);
  }
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(text)) failures.push(`${file} still documents removed behaviour matching ${pattern}`);
  }
}

// The custom properties are one promise in three places: the sheet reads them,
// `WaveloTokens` declares them, and the README table documents them. Any pair of
// those drifting means a caller sets a property that does nothing.
const stylesheet = await readFile('packages/core/dist/wavelo.css', 'utf8');
const tokensRead = new Set([...stylesheet.matchAll(/var\(\s*(--wavelo-[a-z0-9-]+)/g)].map((match) => match[1]));
const tokensDeclared = new Set(
  [...(await readFile('packages/core/src/types.ts', 'utf8')).matchAll(/'(--wavelo-[a-z0-9-]+)'\??:/g)].map((match) => match[1])
);
const readme = await readFile('README.md', 'utf8');
for (const token of tokensRead) {
  if (!tokensDeclared.has(token)) failures.push(`the sheet reads ${token}, which WaveloTokens does not declare`);
  if (!readme.includes(token)) failures.push(`README.md does not document the ${token} token`);
}
for (const token of tokensDeclared) {
  if (!tokensRead.has(token)) failures.push(`WaveloTokens declares ${token}, which no rule in the sheet reads`);
}

// A count restated in prose is a second source of truth, and one of them was already
// wrong: a document said "149 named presets" after arithmetic on an older total rather
// than a measurement, and `npm run catalog` only requires at least 100, so nothing
// noticed until another document copied it. Any number written next to "presets" in a
// document that reports the current state has to be the built count.
const { patternPresets } = await import('../packages/core/dist/catalog.js');
const countDocuments = [
  // CHANGELOG.md and RELEASE_CHECKLIST.md are deliberately absent: each entry records what
  // was true when it was written, so "Catalog Totals (v0.2.0): 153 public IDs" is a fact about
  // a past release, not a claim about this build. The current release is still checked, through
  // `required` below, which demands the built total appear in the changelog.
  'README.md', 'PRD.md', 'RELEASE_READINESS_AUDIT.md', 'packages/core/README.md',
  'docs/COMPATIBILITY.md', 'docs/FINAL_DELIVERY_REPORT.md', 'docs/MIGRATION.md',
  'docs/PERFORMANCE.md', 'docs/BUNDLE_SIZE.md',
  // These three restate catalog totals and were never compared to anything, so each one
  // drifted: the master audit claimed 133 shipped in its scope line and 155 in every
  // section header, and the progress tracker carried two builds of stale figures.
  'docs/LOADER_AUDIT.md', 'docs/VISUAL_DEDUPLICATION_REPORT.md', 'docs/COMPONENT_CUSTOMIZATION_API.md',
  'docs/wavelo-analysis.md'
];
for (const file of countDocuments) {
  const text = (await readFile(file, 'utf8').catch(() => '')).replace(/\s+/g, ' ');
  for (const [, stated] of text.matchAll(/(\d+) named presets/g)) {
    if (Number(stated) !== presetRegistry.length) failures.push(`${file} states ${stated} named presets; the build has ${presetRegistry.length}`);
  }
  // A bare number directly before "presets" is a total; "20 skeleton presets" or
  // "35 pattern presets" name a subset and are not this claim.
  for (const [, stated] of text.matchAll(/(\d+) presets\b/g)) {
    if (Number(stated) !== presetRegistry.length) failures.push(`${file} states ${stated} presets; the build has ${presetRegistry.length}`);
  }
  for (const [, stated] of text.matchAll(/(\d+) pattern presets/g)) {
    if (Number(stated) !== patternPresets.length) failures.push(`${file} states ${stated} pattern presets; the build has ${patternPresets.length}`);
  }
  // "128 of the 138 designs are 2D" described no build this project ever shipped: the
  // denominator is the catalog size, and the 2D numerator is that minus the 3D set. Both
  // halves of a fraction like this are derivable, so neither is allowed to be typed.
  // "128 of the 138 designs are 2D" described no build this project ever shipped: the
  // denominator is the catalog size, and the 2D numerator is that minus the 3D set. Both
  // halves of a fraction like this are derivable, so neither is allowed to be typed. A
  // number that follows an arrow is a phase transition ("155 → 146 active designs"), which
  // is history rather than a claim about this build, so those are left alone.
  const history = (text, index) => text.slice(Math.max(0, index - 8), index).includes('→');
  for (const match of text.matchAll(/(\d+) of (?:the )?(\d+) designs?\b/g)) {
    if (history(text, match.index)) continue;
    const [, part, whole] = match;
    if (Number(whole) !== ids) failures.push(`${file} says "${match[0]}"; the build has ${ids} designs`);
    if (Number(part) > Number(whole)) failures.push(`${file} says "${match[0]}", which is more parts than the whole`);
  }
  for (const [, part] of text.matchAll(/(\d+) of the \d+ designs are 2D/g)) {
    if (Number(part) !== ids - threeD) failures.push(`${file} states ${part} designs are 2D; the build has ${ids - threeD} of ${ids}`);
  }
  // "153 active designs" is the same claim as "153 designs" in different clothes, and it
  // slipped through while the catalog grew to 165 because only the exact phrase was matched.
  for (const match of text.matchAll(/(\d+) active designs\b/g)) {
    if (history(text, match.index)) continue;
    if (Number(match[1]) !== active) failures.push(`${file} states ${match[1]} active designs; the build has ${active}`);
  }
}

// The slice costs in docs/PERFORMANCE.md are re-derived here rather than copied from a log:
// that table was the one nobody measured, so it rotted twice while every gate stayed green.
const performanceDoc = (await readFile('docs/PERFORMANCE.md', 'utf8')).replace(/\s+/g, ' ');
for (const [kind, slice] of Object.entries(kindStyles)) {
  const stated = gzipSync(Buffer.from(`${baseCss}${slice}`)).length.toLocaleString('en-US');
  if (!performanceDoc.includes(stated)) failures.push(`docs/PERFORMANCE.md does not state the ${kind} slice cost (${stated} B gzipped with the base)`);
}
const sheetGzipped = gzipSync(Buffer.from(stylesheet)).length.toLocaleString('en-US');
// Every document that quotes the sheet size is checked against the built artifact, including
// docs/RELEASE.md: it carried "34,699 B" through two releases precisely because it was the one
// release-facing document nobody measured.
for (const file of ['docs/PERFORMANCE.md', 'docs/BUNDLE_SIZE.md', 'docs/RELEASE.md']) {
  if (!(await readFile(file, 'utf8')).replace(/\s+/g, ' ').includes(sheetGzipped)) {
    failures.push(`${file} does not state the whole-catalog sheet size (${sheetGzipped} B gzipped)`);
  }
}

// docs/COMPONENT_CUSTOMIZATION_API.md is written by hand, one section per design, and every
// option it names for a design is a promise the measured table can contradict. It carried 53
// claims the build does not support — designs said to take a colour or a stroke that no rule
// of theirs reads, and `gap`/`radius` published as configuration keys when they are custom
// properties — so each bullet is now checked against the registry. A bullet may name a
// data-* attribute (public contract), a configuration key the design is measured to honour,
// or a --wavelo-* token that a rule the design can actually reach reads; kind rules count,
// because a property set on the loader reaches those too.
{
  const apiDoc = await readFile('docs/COMPONENT_CUSTOMIZATION_API.md', 'utf8');
  const sheetRules = [...stylesheet.matchAll(/[^}]*\}/g)].map((match) => match[0]);
  const byId = new Map(loaderRegistry.map((loader) => [loader.id, loader]));
  const readsToken = (loader, token) => sheetRules.some((rule) => {
    const selector = rule.slice(0, rule.indexOf('{'));
    return (selector.includes(`.wavelo--${loader.id}`) || selector.includes(`.wavelo--${loader.kind}`)) && rule.includes(token);
  });
  let section = null;
  for (const line of apiDoc.split(/\r?\n/)) {
    const heading = /^#### \d+\. `([a-z0-9-]+)`/.exec(line);
    if (heading) { section = byId.get(heading[1]); continue; }
    const bullet = /^  - `([a-zA-Z-]+)` \(/.exec(line);
    if (!bullet || !section) continue;
    const name = bullet[1];
    if (name.startsWith('data-')) continue;
    if (name.startsWith('--wavelo-')) {
      if (!readsToken(section, name)) failures.push(`${section.id} is documented with ${name}, which no rule it renders reads`);
    } else if (!loaderConfigKeys.includes(name)) {
      failures.push(`docs/COMPONENT_CUSTOMIZATION_API.md names ${name} as an option of ${section.id}, but no such configuration key exists`);
    } else if (!section.options.includes(name)) {
      failures.push(`docs/COMPONENT_CUSTOMIZATION_API.md gives ${section.id} ${name}, which the measured option table says it ignores`);
    }
  }
}

// A peer range is a support promise, and the manifest is the one npm enforces. Every range a
// document states for these five peers must equal its manifest's, and each adapter README must
// state its own: the 0.2.0 tree carried four READMEs promising React 19 beside manifests that
// said 16.8, and `packages:check` passed because it only asks whether a peer is declared.
{
  /** peer -> the range npm enforces, and the package that declares it. */
  const peers = new Map();
  for (const dir of ['react', 'vue', 'svelte', 'angular']) {
    const manifest = JSON.parse(await readFile(`packages/${dir}/package.json`, 'utf8'));
    for (const [peer, range] of Object.entries(manifest.peerDependencies ?? {})) {
      peers.set(peer, { range: range.replace(/\s+/g, ''), dir });
    }
  }
  const escapeRe = (text) => text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  // One comparison term, optionally a second after a space: `>=3.0.0 <4.0.0` reads as one
  // range, and the sentence ending after it cannot be swallowed into the match.
  const term = '(?:[<>]=?|[=~^])?\\d+(?:\\.\\d+){0,3}';
  const rangeOf = (peer) => new RegExp('(?<![\\w@/-])' + escapeRe(peer) + '\\s*:?\\s*"?(\\s*' + term + '(?:\\s+' + term + '){0,2})', 'g');
  const files = [
    'packages/react/README.md', 'packages/vue/README.md', 'packages/svelte/README.md', 'packages/angular/README.md',
    'docs/COMPATIBILITY.md', 'docs/FRAMEWORKS.md', 'docs/wavelo-analysis.md', 'PRD.md'
  ];
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const [peer, { range, dir }] of peers) {
      for (const match of text.matchAll(rangeOf(peer))) {
        const stated = match[1].replace(/\s+/g, '');
        if (stated && stated !== range) {
          failures.push(`${file} documents ${peer} as "${stated}"; packages/${dir}/package.json declares "${range}"`);
        }
      }
    }
  }
  for (const dir of ['react', 'vue', 'svelte', 'angular']) {
    const manifest = JSON.parse(await readFile(`packages/${dir}/package.json`, 'utf8'));
    const text = await readFile(`packages/${dir}/README.md`, 'utf8');
    for (const peer of Object.keys(manifest.peerDependencies ?? {})) {
      if (!new RegExp('(?<![\\w@/-])' + escapeRe(peer) + '\\s*:?\\s*"?(\\s*[<>=~^])').test(text)) {
        failures.push(`packages/${dir}/README.md states no peer range for ${peer}, so nothing keeps it honest against the manifest`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Documentation check failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Documentation matches the code: ${ids} designs (${active} active, ${aliases} aliases), ${slices} slices, ${options} configuration keys, ${tokensRead.size} custom properties, single loader ${singleLoaderKb} KB gzipped.`);
