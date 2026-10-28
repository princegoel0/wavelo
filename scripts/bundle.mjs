import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

const entries = {
  'individual-loader': "import { ring } from '@wavelo/core/loaders/ring'; console.log(ring({ label: 'Loading' }));",
  'two-loaders': "import { ring } from '@wavelo/core/loaders/ring'; import { skeletonCard } from '@wavelo/core/loaders/skeleton-card'; console.log(ring(), skeletonCard());",
  'core-renderer': "import { renderLoader } from '@wavelo/core'; console.log(renderLoader({ type: 'orbiting-dots' }));",
  'full-catalog': "import { loaderRegistry, renderLoader } from '@wavelo/core'; console.log(loaderRegistry.map(({ id }) => renderLoader({ type: id })));",
  react: "import { Loader } from '@wavelo/react'; console.log(Loader);",
  vue: "import { Loader } from '@wavelo/vue'; console.log(Loader);",
  angular: "import { LoaderComponent } from '@wavelo/angular'; console.log(LoaderComponent);",
  svelte: "import { renderSvelteLoader } from '@wavelo/svelte'; console.log(renderSvelteLoader());",
  'web-components': "import { defineWaveloElements } from '@wavelo/web-components'; console.log(defineWaveloElements);",
  vanilla: "import { mountLoader } from '@wavelo/vanilla'; console.log(mountLoader);"
};

const external = ['react', 'react-dom', 'vue', '@angular/core', 'svelte'];
// The number that backs the "modular catalog" claim is `individual-loader`: a
// design chosen at build time must not carry the rest of the catalog. Adapters
// and `renderLoader` select by string at runtime, so they legitimately carry
// every stylesheet slice; their budgets are set from that reality with ~10%
// headroom rather than pretending to be per-design.
const budgets = {
  'individual-loader': 4 * 1024,
  'two-loaders': 5 * 1024,
  'core-renderer': 10 * 1024,
  'full-catalog': 10 * 1024,
  react: 10 * 1024,
  vue: 10 * 1024,
  angular: 11 * 1024,
  svelte: 10 * 1024,
  'web-components': 10 * 1024,
  vanilla: 10 * 1024
};

// A single loader must not carry other designs' rules or the full catalog table.
const notIn = {
  'individual-loader': ['.wavelo--skeleton-card', '.wavelo--helix', 'DNA helix', 'Circular border'],
  'two-loaders': ['.wavelo--helix', 'DNA helix']
};

for (const [name, source] of Object.entries(entries)) {
  const result = await build({
    stdin: { contents: source, resolveDir: process.cwd(), sourcefile: `${name}.ts`, loader: 'ts' },
    bundle: true,
    minify: true,
    format: 'esm',
    platform: 'browser',
    external,
    write: false,
    logLevel: 'silent'
  });
  const bytes = result.outputFiles[0].contents;
  const text = new TextDecoder().decode(bytes);
  for (const marker of notIn[name] ?? []) {
    if (text.includes(marker)) throw new Error(`${name} bundle unexpectedly contains ${marker}.`);
  }
  const gzipped = gzipSync(bytes).length;
  if (gzipped > budgets[name]) throw new Error(`${name} bundle is ${gzipped} bytes gzipped; budget is ${budgets[name]}.`);
  console.log(`${name}: ${bytes.length} bytes minified, ${gzipped} bytes gzipped (budget ${budgets[name]})`);
}

const stylesheet = await readFile('packages/core/dist/wavelo.css', 'utf8');
console.log(`styles.css: ${stylesheet.length} bytes raw, ${gzipSync(stylesheet).length} bytes gzipped (whole catalog, loaded once)`);
