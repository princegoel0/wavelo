import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

const entries = {
  'individual-loader': "import { orbit } from '@wavelo/core/loaders/orbit'; console.log(orbit({ label: 'Loading' }));",
  'core-renderer': "import { renderLoader } from '@wavelo/core'; console.log(renderLoader({ type: 'orbiting-dots' }));",
  'full-catalog': "import { loaderRegistry, renderLoader } from '@wavelo/core'; console.log(loaderRegistry.map(({ id }) => renderLoader({ type: id })));",
  react: "import { Loader } from '@wavelo/react'; console.log(Loader);",
  vue: "import { Loader } from '@wavelo/vue'; console.log(Loader);",
  angular: "import { LoaderComponent } from '@wavelo/angular'; console.log(LoaderComponent);",
  svelte: "import { renderSvelteLoader } from '@wavelo/svelte'; console.log(renderSvelteLoader());"
};
const external = ['react', 'react-dom', 'vue', '@angular/core', 'svelte'];
const budgets = {
  'individual-loader': 7 * 1024,
  'core-renderer': 10 * 1024,
  'full-catalog': 10 * 1024,
  react: 9 * 1024,
  vue: 9 * 1024,
  angular: 10 * 1024,
  svelte: 9 * 1024
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
  if (name === 'individual-loader' && new TextDecoder().decode(bytes).includes('Circular border')) {
    throw new Error('Individual loader bundle unexpectedly contains unrelated catalog metadata.');
  }
  const gzipped = gzipSync(bytes).length;
  if (gzipped > budgets[name]) throw new Error(`${name} bundle is ${gzipped} bytes gzipped; budget is ${budgets[name]}.`);
  console.log(`${name}: ${bytes.length} bytes minified, ${gzipped} bytes gzipped (budget ${budgets[name]})`);
}
