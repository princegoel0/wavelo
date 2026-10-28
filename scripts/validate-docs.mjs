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
  ['CHANGELOG.md', [`${ids} public IDs`, `${active} active designs`, `${aliases} deprecated aliases`]],
  ['docs/COMPATIBILITY.md', [`${options} configuration keys`, `${slices} render kinds`, 'styles.css']],
  ['docs/FRAMEWORKS.md', ['@wavelo/core/styles.css', 'ensureStyles']],
  ['packages/core/README.md', [`${slices} render kinds`, 'ensureStyles', 'renderStylesheets']],
  ['packages/react/README.md', ['styles.css']],
  ['packages/vue/README.md', ['styles.css']],
  ['packages/svelte/README.md', ['styles.css']],
  ['packages/angular/README.md', ['styles.css']],
  ['packages/vanilla/README.md', ['styles.css']],
  ['packages/web-components/README.md', ['styles.css']],
  ['docs/BUNDLE_SIZE.md', [`${singleLoaderKb} KB`, `${catalogKb} KB`]]
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

const failures = [];
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

if (failures.length) {
  console.error(`Documentation check failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Documentation matches the code: ${ids} designs (${active} active, ${aliases} aliases), ${slices} slices, ${options} configuration keys, single loader ${singleLoaderKb} KB gzipped.`);
