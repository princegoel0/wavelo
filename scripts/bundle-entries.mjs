// The entry points whose size the bundle gate enforces. They live here, and not inside
// scripts/bundle.mjs, because scripts/validate-docs.mjs quotes two of them in the
// documentation and the two must not be measured from different sources: the docs once
// asked for "33.4 KB" while the gate reported 34,255 B (33.5 KB) for the same renderer,
// because the validator's inline snippet picked a different design id.
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

export const external = ['react', 'react-dom', 'vue', '@angular/core', 'svelte'];

export const entries = {
  'individual-loader': "import { ring } from '@wavelo/core/loaders/ring'; console.log(ring({ label: 'Loading' }));",
  'busiest-loader': "import { voxelCluster } from '@wavelo/core/loaders/voxel-cluster'; console.log(voxelCluster());",
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

/** Build one entry point the way the published consumer would, and report its shipped size. */
export async function bundleSize(source, name) {
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
  return { minified: bytes.length, gzipped: gzipSync(bytes).length, text: new TextDecoder().decode(bytes) };
}
