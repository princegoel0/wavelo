// Documentation is kept in sync with the code: the numbers and API names below
// are read from the built packages, and every file listed against them must
// state the same thing. Adding a design, an option or a bundle-size claim means
// updating the document — `npm run docs:check` fails otherwise.
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import { loaderConfigKeys } from '../packages/core/dist/config.js';
import { loaderRegistry, presetRegistry } from '../packages/core/dist/registry.js';
import { kindStyles } from '../packages/core/dist/css/index.js';

const ids = loaderRegistry.length;
const active = loaderRegistry.filter((loader) => !loader.deprecated).length;
const aliases = ids - active;
const slices = Object.keys(kindStyles).length;
const options = loaderConfigKeys.length;

async function gzipped(source) {
  const result = await build({
    stdin: { contents: source, resolveDir: process.cwd(), sourcefile: 'doc-check.ts', loader: 'ts' },
    bundle: true, minify: true, format: 'esm', platform: 'browser',
    external: ['react', 'react-dom', 'vue', '@angular/core', 'svelte'],
    write: false, logLevel: 'silent'
  });
  return gzipSync(result.outputFiles[0].contents).length;
}

const singleLoaderKb = ((await gzipped("import { ring } from '@wavelo/core/loaders/ring'; console.log(ring({ label: 'x' }));")) / 1024).toFixed(1);
const catalogKb = ((await gzipped("import { renderLoader } from '@wavelo/core'; console.log(renderLoader({ type: 'ring' }));")) / 1024).toFixed(1);

/** [file, strings that must appear] */
const required = [
  ['README.md', [`${ids} designs`, `${slices} stylesheet slices`, `${options} configuration keys`]],
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
  'README.md', 'docs/BUNDLE_SIZE.md', 'docs/PERFORMANCE.md', 'docs/COMPATIBILITY.md',
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
const files = new Set(required.map(([file]) => file));
for (const [file, strings] of required) {
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
  'README.md', 'CHANGELOG.md', 'RELEASE_CHECKLIST.md', 'RELEASE_READINESS_AUDIT.md', 'packages/core/README.md',
  'docs/COMPATIBILITY.md', 'docs/FINAL_DELIVERY_REPORT.md', 'docs/MIGRATION.md',
  'docs/PERFORMANCE.md', 'docs/BUNDLE_SIZE.md',
  // These three restate catalog totals and were never compared to anything, so each one
  // drifted: the master audit claimed 133 shipped in its scope line and 155 in every
  // section header, and the progress tracker carried two builds of stale figures.
  'docs/LOADER_AUDIT.md', 'docs/VISUAL_DEDUPLICATION_REPORT.md', 'docs/wavelo-analysis.md'
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
}

if (failures.length) {
  console.error(`Documentation check failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Documentation matches the code: ${ids} designs (${active} active, ${aliases} aliases), ${slices} slices, ${options} configuration keys, ${tokensRead.size} custom properties, single loader ${singleLoaderKb} KB gzipped.`);
