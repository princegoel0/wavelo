# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 11,278 | 3.6 KB (3,705 B) | 4,096 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 13,447 | 4,099 | 4,608 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 39,180 | 8.3 KB (8,511 B) | 10,240 |
| `@wavelo/core` + registry walk over all 81 designs | 39,183 | 8,516 | 10,240 |
| `@wavelo/react` | 39,603 | 8,730 | 9,216 |
| `@wavelo/vue` | 40,370 | 9,038 | 9,216 |
| `@wavelo/angular` | 42,281 | 9,853 | 10,240 |
| `@wavelo/svelte` | 39,189 | 8,511 | 9,216 |
| `@wavelo/web-components` | 40,681 | 9,107 | 9,216 |
| `@wavelo/vanilla` | 39,500 | 8,666 | 9,216 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 24,709 raw | 3,738 | — |

Headroom is deliberately tight: `vue` and `web-components` sit within ~180 B of
their budgets, so a careless addition to the core fails CI instead of shipping.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses; the shared base carries the layout shell, the
reduced-motion and theme rules, and all 39 `@keyframes` blocks (3.3 KB, listed
once for the whole catalog rather than repeated per kind).

- Importing one design costs its slice: the `ring` entry point ships 1.0 KB of
  ring rules rather than the 24 KB sheet for all 81 designs.
- Importing `renderLoader` costs the whole set of slices, because a runtime
  `type` could select any kind. This is the price of a single component that can
  render every design; it is paid once per page, not once per loader.
- Two designs of the same kind share a slice, so `two-loaders` grows less than
  the sum of its parts.

The adapter bundles are the core renderer plus a thin bridge, which is why
`react`, `vue`, `svelte` and `web-components` sit within ~0.6 KB of each other.
Angular is larger because its component metadata is compiled into the bundle.

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
