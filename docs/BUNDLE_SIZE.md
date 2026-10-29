# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 9,491 | 3.5 KB (3,542 B) | 4,096 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 11,889 | 4,023 | 5,120 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 46,897 | 9.7 KB (9,892 B) | 11,264 |
| `@wavelo/core` + registry walk over all 82 designs | 46,900 | 9,899 | 11,264 |
| `@wavelo/react` | 47,320 | 10,126 | 11,264 |
| `@wavelo/vue` | 48,087 | 10,475 | 11,264 |
| `@wavelo/angular` | 49,999 | 11,308 | 12,288 |
| `@wavelo/svelte` | 46,906 | 9,895 | 11,264 |
| `@wavelo/web-components` | 48,399 | 10,518 | 11,264 |
| `@wavelo/vanilla` | 47,217 | 10,060 | 11,264 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 31,480 raw | 4,581 | — |

The budget that backs the "modular catalog" claim is `individual-loader`: a
design chosen at build time must not carry the rest of the catalog, so it does not
move when the catalog grows — adding the `progress-scroll` design and its render
kind left it at exactly 3,542 B. Adapters and `renderLoader` choose by string at
runtime, so they carry every slice and grow by roughly 220 B per design added;
their budgets are set from that reality with roughly 10% headroom rather than
pretending to be per-design.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses. The shared base carries the layout shell, the
reduced-motion and theme rules, and the four `@keyframes` blocks that more than
one kind animates with (1.5 KB, listed once for the whole catalog rather than
repeated per kind). The other 40 frames each live in their own module under
`css/keyframes/`, imported only by the kinds that animate with them, so a single
design never pays for a frame it cannot run. `npm run catalog` fails if a slice
animates with a frame nobody imports, or re-imports one the base already ships.

- Importing one design costs its slice: the `ring` entry point ships 2.0 KB of
  ring rules rather than the 31 KB sheet for all 82 designs.
- Importing `renderLoader` costs the whole set of slices, because a runtime
  `type` could select any kind. This is the price of a single component that can
  render every design; it is paid once per page, not once per loader.
- Two designs of the same kind share a slice, so `two-loaders` grows less than
  the sum of its parts.

The adapter bundles are the core renderer plus a thin bridge, which is why
`react`, `vue`, `svelte`, `vanilla` and `web-components` sit within ~0.6 KB of
each other and share one budget. Angular is larger because its component metadata
is compiled into the bundle, so it carries the next budget up.

## Per-page style cost

A page mounting twelve loaders across five render kinds writes five `<style>`
elements to the head, not twelve, because slices are keyed by content
(`RenderResult.styleKey`). Before this split, each of those twelve instances
inlined the full stylesheet: 201 KB of repeated CSS text and 1,810 parsed rules
measured in Chromium.

`npm run measure` also fails if a single-design bundle contains another design's
rules (`.wavelo--skeleton-card`, `.wavelo--helix`) or the full catalog table
(`DNA helix`, `Circular border`), so tree-shaking regressions are caught, not
assumed.
