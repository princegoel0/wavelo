import { catalogArtifacts } from './catalog-artifacts.mjs';
import { loaderRegistry } from '../packages/core/dist/registry.js';
import { readdir, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('packages/core');
const artifacts = catalogArtifacts(loaderRegistry);

if (!existsSync(`${root}/src/loaders`)) await mkdir(`${root}/src/loaders`, { recursive: true });

// Remove generated modules that no longer have a catalog entry, so a deleted
// design cannot keep shipping an importable entry point.
const expected = new Set([...artifacts.keys()].map((path) => path.replace('src/loaders/', '')));
const existing = await readdir(`${root}/src/loaders`);
const stale = existing.filter((name) => name.endsWith('.ts') && !expected.has(name));
for (const name of stale) await rm(`${root}/src/loaders/${name}`);

for (const [relative, content] of artifacts) {
  await writeFile(`${root}/${relative}`, content);
}

console.log(`Generated ${loaderRegistry.length} loader entry points, the loaders barrel and src/ids.ts (${stale.length} stale file(s) removed).`);
