import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';

const entries = {
  'individual-loader': "import { ring } from '@wavelo/core/loaders/ring'; console.log(ring({ label: 'Loading' }));",
  // The most crowded kind decides what "one design" costs, so it is sampled too — which
  // means this probe has to follow the measurement, not the history. It was pointed at
  // `progress` when twelve determinate designs made that the largest slice; the motion
  // and skeleton tranches then pushed `dots` (4,935 B gzipped with the base) and
  // `skeleton` (4,545) past it, leaving `progress` fourth at 4,017. Sampling the old kind
  // would let the actual worst case grow unnoticed, so it samples the largest slice now.
  'busiest-loader': "import { bubbleRise } from '@wavelo/core/loaders/bubble-rise'; console.log(bubbleRise());",
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
//    slice, the registry and the measured option table. The marginal cost of a design
//    here is not one number: it is the slice delta plus a registry entry plus a row in
//    the option table, and it is largest when the design brings a `@keyframes` module
//    nobody had imported yet. Measured at three checkpoints — 129 designs at 24,582 B,
//    143 at 28,678 B, 155 at 32,907 B — which is 293 B and 353 B per design for the two
//    most recent tranches, against the 210 B the first eight-design tranche cost when
//    every design joined an already-shipping frame. Redrawing two designs already in the
//    catalog moved the same number by 862 B without adding either: a sixteen-stop
//    lemniscate and an eighteen-part helix are new rules in two slices, and every runtime
//    bundle carries every slice.
//
// The curve runs backwards too, and the budget has to follow it in that direction or it
// stops being a gate: taking 22 designs out of the catalog (155 to 133) pulled
// `core-renderer` from 32,907 B to 32,084 B, and a budget left at 38,912 would then have
// sat 21% above the measurement — loose enough to absorb a regression of the size that
// the dedup just saved.
//
// Budgets are set from those two realities with ~12% headroom, not from a per-design
// ideal.
const runtime = 37 * 1024;
const budgets = {
  // A design chosen at build time carries its kind slice plus the token defaults that
  // used to be written inline on every element, so ancestor and class-level theming can
  // reach it: 3,542 B before that change, 4,612 B after, 5,018 B with the visibility,
  // track-count and inline options, 5,482 B once the conic and neon rings joined the ring
  // slice, 5,709 B once the renderer learned to fill a design from a value, 6,237 B once
  // the motion tranche's three ring designs joined it too, 8,440 B after the ring slice
  // gained a clock dial, a masked gradient ring and a snake room, and 8,300 B back down
  // again once the duplicated ring and bar designs were consolidated away. The saving
  // lands per page instead — a default loader now carries no `style` attribute at all,
  // where it used to carry about 180 bytes of tokens, and a loader with `loading: false`
  // carries nothing.
  //
  // Budgets sit about 12% above the measured value, rounded up to the next 512 B,
  // and are re-based deliberately when a feature adds surface: a configuration key
  // costs roughly 20-30 B gzipped in every bundle, which is why the accessibility
  // keys cost a single design 407 B and why the styling tokens cost more than that —
  // they are new rules in every slice, not new reads of existing ones.
  'individual-loader': 9.5 * 1024,
  // Raised while the budgets came down elsewhere: `three-dots` and `equalizer` learned to
  // divide their row by a `count`, which is twelve index rules in the dots slice, and this
  // probe samples that slice.
  'busiest-loader': 11 * 1024,
  'two-loaders': 13 * 1024,
  'core-renderer': runtime,
  'full-catalog': runtime,
  react: runtime,
  vue: runtime,
  // Angular compiles its component metadata into the bundle, so it sits above the
  // runtime budget the other five adapters share: 34,369 B measured against their
  // 33,576 at the same design count.
  angular: 38 * 1024,
  svelte: runtime,
  // Custom-element registration adds the observed-attribute table.
  'web-components': runtime,
  vanilla: runtime
};

// A single loader must not carry other kinds' rules or the full catalog table. The
// busiest-loader case matters most: it is the design that pays for every sibling in the
// largest slice, so a new dots design has to show up here rather than silently elsewhere.
// Its markers are chosen from kinds the dots slice does not contain — note that
// `wavelo-typing-dot` cannot be one of them, because `typing-dots` is itself a dots-kind
// design and its class is a substring match inside this very slice.
const notIn = {
  'individual-loader': ['.wavelo--skeleton-card', '.wavelo--helix', 'DNA helix', 'Circular border'],
  'busiest-loader': ['.wavelo--ring', '.wavelo--skeleton-card', '.wavelo--helix', 'Circular border'],
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
