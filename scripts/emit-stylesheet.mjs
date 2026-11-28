import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Runs with the core package as the working directory, after tsc has emitted.
const { allStyles } = await import(pathToFileURL(resolve('dist/css/index.js')).href);
await writeFile(resolve('dist/wavelo.css'), `/* Wavelo: every design slice. Import once to style the whole catalog. */\n${allStyles}\n`);
await writeFile(resolve('dist/wavelo.layer.css'), `/* Wavelo: layered catalog stylesheet for CSS Cascade Layers / Tailwind v4. */\n@layer wavelo {\n${allStyles}\n}\n`);
console.log(`dist/wavelo.css: ${allStyles.length} bytes`);
