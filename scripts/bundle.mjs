import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

const entries = {
  'individual-loader': "import { ring } from '@wavelo/core/loaders/ring'; console.log(ring({ label: 'Loading' }));",
  // The most crowded kind decides what "one design" costs, so it is sampled too:
  // the skeleton slice now carries six composite layouts, and `ring` cannot show that.
  'busiest-loader': "import { skeletonCard } from '@wavelo/core/loaders/skeleton-card'; console.log(skeletonCard());",
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
// The number that backs the "modular catalog" claim is `individual-loader`: a design
// chosen at build time carries the shared base plus exactly one render-kind slice, and
// never another kind's rules. It is not per-design: the rules of every design that
// shares that kind ship with it, so a design's cost moves when a sibling joins its kind.
// The streaming tranche measured that: two new ring designs took `ring` from 5,054 B to
// 5,482 B, and four composite skeletons took `ring + skeleton-card` from 5,820 B to
// 7,053 B. Adapters and `renderLoader` select by string at runtime, so they carry every
// slice, the registry and the measured option table, and they grow with each design
// added (~220 B gzipped at the time of writing); their budgets are set from that reality
// with ~12% headroom rather than pretending to be per-design.
const runtime = 18.5 * 1024;
const budgets = {
  // A design chosen at build time carries its kind slice plus the token defaults that
  // used to be written inline on every element, so ancestor and class-level theming can
  // reach it: 3,542 B before that change, 4,612 B after, 5,018 B with the visibility,
  // track-count and inline options, 5,482 B once the conic and neon rings joined the ring
  // slice. The saving lands per page instead — a default loader now carries no `style`
  // attribute at all, where it used to carry about 180 bytes of tokens, and a loader with
  // `loading: false` carries nothing.
  //
  // Budgets sit about 12% above the measured value, rounded up to the next 512 B,
  // and are re-based deliberately when a feature adds surface: a configuration key
  // costs roughly 20-30 B gzipped in every bundle, which is why the accessibility
  // keys cost a single design 407 B and why the styling tokens cost more than that —
  // they are new rules in every slice, not new reads of existing ones.
  'individual-loader': 6 * 1024,
  'busiest-loader': 7 * 1024,
  'two-loaders': 8 * 1024,
  'core-renderer': runtime,
  'full-catalog': runtime,
  react: runtime,
  vue: runtime,
  // Angular compiles its component metadata into the bundle.
  angular: 19.5 * 1024,
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
