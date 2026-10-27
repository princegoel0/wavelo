import { gzipSync } from 'node:zlib';
import { readFileSync, statSync } from 'node:fs';

const files = [
  ['core', 'packages/core/dist/index.js'],
  ['registry', 'packages/core/dist/registry.js'],
  ['render', 'packages/core/dist/render.js'],
  ['individual-loader', 'packages/core/dist/loaders/orbit.js']
];
for (const [name, file] of files) {
  const raw = readFileSync(file);
  console.log(`${name}: ${raw.length} bytes, ${gzipSync(raw).length} bytes gzipped`);
}
console.log('Budgets: core entry <= 10 KB gzipped; individual loader target <= 5 KB gzipped.');
