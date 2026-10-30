import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

const entries = {
  'individual-loader': "import { ring } from '@wavelo/core/loaders/ring'; console.log(ring({ label: 'Loading' }));",
  // The most crowded kind decides what "one design" costs, so it is sampled too. It
  // moved with the progress tranche: twelve determinate designs made `progress` the
  // largest slice gzipped (2,820 B), and it still is, though the six dots designs the
  // motion tranche added gave `dots` more raw bytes and more selectors than any other.
  'busiest-loader': "import { progressBattery } from '@wavelo/core/loaders/progress-battery'; console.log(progressBattery());",
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
// Two separate growth mechanisms show up in these numbers, and conflating them is how
// the last set of comments ended up claiming something false.
//
// 1. A design chosen at build time carries the shared base, the renderer, and exactly
//    one render-kind slice — never another kind's rules. Two things still move it:
//    a sibling joining its kind (the two ring designs took `ring` from 5,054 B to
//    5,482 B; the motion tranche put three more ring designs in the same slice and
//    took it to 6,237 B), and the renderer itself, because `render.ts` is in every
//    bundle. The progress tranche proved the second: thirteen designs whose level comes
//    from a value needed per-part state in the renderer, and that cost every design
//    ~227 B gzipped, including a ring, which uses none of it.
// 2. Adapters and `renderLoader` select by string at runtime, so they carry every
//    slice, the registry and the measured option table, and grow by roughly 210-220 B
//    gzipped per design added (13 designs: 17,013 B to 19,872 B; 18 designs: 19,011 B
//    to 22,797 B).
//
// Budgets are set from those two realities with ~12% headroom, not from a per-design
// ideal.
const runtime = 30 * 1024;
const budgets = {
  // A design chosen at build time carries its kind slice plus the token defaults that
  // used to be written inline on every element, so ancestor and class-level theming can
  // reach it: 3,542 B before that change, 4,612 B after, 5,018 B with the visibility,
  // track-count and inline options, 5,482 B once the conic and neon rings joined the ring
  // slice, 5,709 B once the renderer learned to fill a design from a value, 6,237 B once
  // the motion tranche's three ring designs joined it too. The saving lands per page
  // instead — a default loader now carries no `style` attribute at all, where it used to
  // carry about 180 bytes of tokens, and a loader with `loading: false` carries nothing.
  //
  // Budgets sit about 12% above the measured value, rounded up to the next 512 B,
  // and are re-based deliberately when a feature adds surface: a configuration key
  // costs roughly 20-30 B gzipped in every bundle, which is why the accessibility
  // keys cost a single design 407 B and why the styling tokens cost more than that —
  // they are new rules in every slice, not new reads of existing ones.
  'individual-loader': 8.5 * 1024,
  'busiest-loader': 9 * 1024,
  'two-loaders': 10 * 1024,
  'core-renderer': runtime,
  'full-catalog': runtime,
  react: runtime,
  vue: runtime,
  // Angular compiles its component metadata into the bundle.
  angular: 30.5 * 1024,
  svelte: runtime,
  // Custom-element registration adds the observed-attribute table.
  'web-components': runtime,
  vanilla: runtime
};

// A single loader must not carry other kinds' rules or the full catalog table. The
// busiest-loader case matters most: it is the design that pays for every skeleton in
// its kind, so a new skeleton has to show up here rather than silently elsewhere.
const notIn = {
  'individual-loader': ['.wavelo--skeleton-card', '.wavelo--helix', 'DNA helix', 'Circular border'],
  'busiest-loader': ['.wavelo--ring', '.wavelo--dots', 'wavelo-typing-dot'],
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
