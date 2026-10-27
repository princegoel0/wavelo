import { loaderRegistry, presetRegistry } from '../packages/core/dist/registry.js';
import { access, readFile } from 'node:fs/promises';

const ids = new Set(loaderRegistry.map((loader) => loader.id));
const active = loaderRegistry.filter((loader) => !loader.deprecated);
if (ids.size < 60) throw new Error(`Catalog has only ${ids.size} unique designs; at least 60 are required.`);
if (active.length < 60) throw new Error(`Catalog has only ${active.length} active designs; at least 60 are required.`);
if (presetRegistry.length < 100) throw new Error(`Catalog has only ${presetRegistry.length} presets; at least 100 are required.`);
const signatures = active.map((loader) => loader.visualSignature);
if (signatures.some((signature) => !signature) || new Set(signatures).size !== signatures.length) {
  throw new Error('Active catalog contains missing or duplicate visual signatures.');
}
for (const loader of loaderRegistry) {
  if (!loader.description || !loader.kind || !loader.category) throw new Error(`Incomplete metadata for ${loader.id}`);
  if (loader.deprecated && (!loader.aliasOf || !ids.has(loader.aliasOf))) throw new Error(`Invalid alias for ${loader.id}`);
}
for (const preset of presetRegistry) {
  if (!ids.has(preset.type)) throw new Error(`Preset ${preset.id} points to missing loader ${preset.type}`);
}
const docs = await readFile(new URL('../apps/docs/dist/index.html', import.meta.url), 'utf8');
for (const loader of loaderRegistry) {
  if (!docs.includes(`type: '${loader.id}'`)) throw new Error(`Documentation gallery is missing ${loader.id}`);
  await access(new URL(`../packages/core/dist/loaders/${loader.id}.js`, import.meta.url));
}
console.log(`Catalog valid: ${ids.size} public IDs, ${active.length} active designs, ${presetRegistry.length} named presets.`);
