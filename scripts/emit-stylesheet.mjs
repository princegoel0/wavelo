import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Runs with the core package as the working directory, after tsc has emitted.
const { allStyles } = await import(pathToFileURL(resolve('dist/css/index.js')).href);
await writeFile(resolve('dist/wavelo.css'), `/* Wavelo: every design slice. Import once to style the whole catalog. */\n${allStyles}\n`);
console.log(`dist/wavelo.css: ${allStyles.length} bytes`);
