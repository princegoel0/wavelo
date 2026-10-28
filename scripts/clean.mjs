import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

// Removes the package's build output so a deleted design cannot survive in a
// tarball as a stale emitted file.
const target = resolve(process.argv[2] ?? 'dist');
rmSync(target, { recursive: true, force: true });
