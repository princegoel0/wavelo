import { catalogArtifacts } from './catalog-artifacts.mjs';
import { kindStyles } from '../packages/core/dist/css/index.js';
import { loaderAttributes, loaderConfigKeys } from '../packages/core/dist/config.js';
import { loaderRegistry, presetRegistry } from '../packages/core/dist/registry.js';
import { access, readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const ids = new Set(loaderRegistry.map((loader) => loader.id));
const active = loaderRegistry.filter((loader) => !loader.deprecated);
check(ids.size >= 60, `Catalog has only ${ids.size} unique designs; at least 60 are required.`);
check(active.length >= 60, `Catalog has only ${active.length} active designs; at least 60 are required.`);
check(presetRegistry.length >= 100, `Catalog has only ${presetRegistry.length} presets; at least 100 are required.`);

const signatures = active.map((loader) => loader.visualSignature);
check(signatures.every(Boolean) && new Set(signatures).size === signatures.length, 'Active catalog contains missing or duplicate visual signatures.');

for (const loader of loaderRegistry) {
  check(Boolean(loader.description && loader.kind && loader.category), `Incomplete metadata for ${loader.id}`);
  check(loader.options.length > 0, `${loader.id} declares no options`);
  check(ids.has(loader.visualSignature), `${loader.id} points at unknown visual signature ${loader.visualSignature}`);
  if (loader.deprecated) {
    check(Boolean(loader.aliasOf) && ids.has(loader.aliasOf), `Invalid alias for ${loader.id}`);
    const canonical = loaderRegistry.find((candidate) => candidate.id === loader.aliasOf);
    if (canonical) {
      // An alias renders its target, so its rendering metadata must match.
      check(loader.kind === canonical.kind, `${loader.id} alias kind ${loader.kind} differs from ${canonical.kind}`);
      check(loader.supportsProgress === canonical.supportsProgress, `${loader.id} alias progress support differs from ${canonical.id}`);
      check(loader.options.join() === canonical.options.join(), `${loader.id} alias options differ from ${canonical.id}`);
    }
  }
}

for (const preset of presetRegistry) {
  check(ids.has(preset.type), `Preset ${preset.id} points to missing loader ${preset.type}`);
}

// Every render kind used by the catalog must have a stylesheet slice.
for (const loader of loaderRegistry) {
  check(typeof kindStyles[loader.kind] === 'string' && kindStyles[loader.kind].length > 0, `No stylesheet slice for kind ${loader.kind} (${loader.id})`);
}

// The generated entry points must match the catalog, with no stale modules left
// in source or in build output.
const artifacts = catalogArtifacts(loaderRegistry);
// Compare ignoring line endings: a Windows checkout can rewrite these files,
// and that is not drift from the catalog.
const normalize = (text) => text.replace(/\r\n/g, '\n');
for (const [relative, expected] of artifacts) {
  const path = new URL(`../packages/core/${relative}`, import.meta.url);
  if (!existsSync(path)) {
    failures.push(`${relative} is missing; run npm run catalog:generate`);
    continue;
  }
  const actual = normalize(await readFile(path, 'utf8'));
  if (actual !== normalize(expected)) failures.push(`${relative} drifted from the catalog; run npm run catalog:generate`);
}

const sourceModules = (await readdir(new URL('../packages/core/src/loaders/', import.meta.url)))
  .filter((name) => name.endsWith('.ts') && name !== 'index.ts');
const expectedModules = loaderRegistry.map((loader) => `${loader.id}.ts`);
check(new Set(sourceModules).size === expectedModules.length && sourceModules.every((name) => expectedModules.includes(name)), `src/loaders has files outside the catalog: ${sourceModules.filter((name) => !expectedModules.includes(name)).join(', ') || 'count mismatch'}`);

await access(new URL('../packages/core/dist/loaders/index.js', import.meta.url));
const builtModules = (await readdir(new URL('../packages/core/dist/loaders/', import.meta.url))).filter((name) => name.endsWith('.js') && name !== 'index.js');
check(builtModules.length === ids.size, `dist/loaders holds ${builtModules.length} modules for ${ids.size} catalog IDs; rebuild the core package`);

// The static stylesheet must cover every design, and the configuration surface
// must be complete for adapters.
const stylesheet = await readFile(new URL('../packages/core/dist/wavelo.css', import.meta.url), 'utf8');
for (const loader of active) {
  // A design is styled either by rules naming it or by its kind's shared rules;
  // a design matched by neither would render as an empty box.
  const styled = stylesheet.includes(`.wavelo--${loader.id}`) || stylesheet.includes(`.wavelo--${loader.kind}`);
  check(styled, `${loader.id} is matched by no rule in dist/wavelo.css`);
}

// A rule belongs to exactly the slice its selectors can reach: a design named in
// another kind's slice would never load, and a kind named in a foreign slice
// would style designs it has nothing to do with.
const kindOfDesign = new Map(loaderRegistry.map((loader) => [loader.id, loader.kind]));
const kinds = new Set(Object.keys(kindStyles));
for (const [kind, css] of Object.entries(kindStyles)) {
  for (const [, token] of css.matchAll(/\.wavelo--([a-z0-9-]+)/g)) {
    if (kinds.has(token) && !kindOfDesign.has(token)) continue;
    const owner = kindOfDesign.get(token);
    check(owner === kind, `${kind} slice styles ${token}, which is a ${owner ?? 'non-existent'} design`);
  }
}
check(stylesheet.includes('prefers-reduced-motion'), 'dist/wavelo.css lost the reduced-motion rules');
check(stylesheet.includes('data-wavelo-motion="always"'), 'dist/wavelo.css lost the always-reduced rules');
check(stylesheet.includes('data-wavelo-theme="dark"'), 'dist/wavelo.css lost the dark theme rules');
check(loaderAttributes.length === loaderConfigKeys.length, 'attribute names and config keys disagree');

const docs = await readFile(new URL('../apps/docs/dist/index.html', import.meta.url), 'utf8');
for (const loader of loaderRegistry) {
  check(docs.includes(`type: '${loader.id}'`), `Documentation gallery is missing ${loader.id}`);
}

if (failures.length) {
  console.error(`Catalog validation failed with ${failures.length} problem(s):`);
  for (const failure of failures.slice(0, 20)) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`Catalog valid: ${ids.size} public IDs, ${active.length} active designs, ${presetRegistry.length} named presets, ${Object.keys(kindStyles).length} stylesheet slices.`);
