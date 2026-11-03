import { build } from 'esbuild';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
await build({
  entryPoints: [resolve(root, 'packages/core/dist/index.js')],
  outfile: resolve(root, 'packages/core/dist/index.cjs'),
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node16',
  logLevel: 'silent'
});
console.log('Emitted packages/core/dist/index.cjs');
