# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 9,491 | 3.5 KB (3,542 B) | 4,096 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 11,889 | 4,023 | 5,120 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 45,816 | 9.4 KB (9,675 B) | 10,240 |
| `@wavelo/core` + registry walk over all 81 designs | 45,819 | 9,676 | 10,240 |
| `@wavelo/react` | 46,239 | 9,898 | 10,240 |
| `@wavelo/vue` | 47,006 | 10,236 | 10,240 |
| `@wavelo/angular` | 48,918 | 11,071 | 11,264 |
| `@wavelo/svelte` | 45,825 | 9,673 | 10,240 |
| `@wavelo/web-components` | 47,318 | 10,294 | 11,264 |
| `@wavelo/vanilla` | 46,136 | 9,837 | 10,240 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 30,550 raw | 4,419 | — |

The budget that backs the "modular catalog" claim is `individual-loader`: a
design chosen at build time must not carry the rest of the catalog. Adapters and
`renderLoader` choose by string at runtime, so they legitimately carry every
slice; their budgets are set from that reality with roughly 10% headroom rather
than pretending to be per-design.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses. The shared base carries the layout shell, the
reduced-motion and theme rules, and the four `@keyframes` blocks that more than
one kind animates with (1.5 KB, listed once for the whole catalog rather than
repeated per kind). The other 39 frames each live in their own module under
`css/keyframes/`, imported only by the kinds that animate with them, so a single
design never pays for a frame it cannot run. `npm run catalog` fails if a slice
animates with a frame nobody imports, or re-imports one the base already ships.

- Importing one design costs its slice: the `ring` entry point ships 2.0 KB of
  ring rules rather than the 30 KB sheet for all 81 designs.
- Importing `renderLoader` costs the whole set of slices, because a runtime
  `type` could select any kind. This is the price of a single component that can
  render every design; it is paid once per page, not once per loader.
- Two designs of the same kind share a slice, so `two-loaders` grows less than
  the sum of its parts.

The adapter bundles are the core renderer plus a thin bridge, which is why
`react`, `vue`, `svelte` and `web-components` sit within ~0.6 KB of each other.
Angular is larger because its component metadata is compiled into the bundle, and
`web-components` because custom-element registration adds the observed-attribute
table; those two carry the larger budget.

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
