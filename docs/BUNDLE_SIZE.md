# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 10,972 | 3.5 KB (3,617 B) | 4,096 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 13,141 | 4,007 | 4,608 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 37,730 | 8.1 KB (8,268 B) | 10,240 |
| `@wavelo/core` + registry walk over all 81 designs | 37,733 | 8,276 | 10,240 |
| `@wavelo/react` | 38,153 | 8,487 | 9,216 |
| `@wavelo/vue` | 38,920 | 8,795 | 9,216 |
| `@wavelo/angular` | 40,831 | 9,578 | 10,240 |
| `@wavelo/svelte` | 37,739 | 8,269 | 9,216 |
| `@wavelo/web-components` | 39,231 | 8,867 | 9,216 |
| `@wavelo/vanilla` | 38,050 | 8,423 | 9,216 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 23,446 raw | 3,570 | — |

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses; the shared base carries the layout shell, the
reduced-motion and theme rules, and all 37 `@keyframes` blocks (3.2 KB, listed
once for the whole catalog rather than repeated per kind).

- Importing one design costs its slice: the `ring` entry point ships 1.2 KB of
  ring rules rather than the 23 KB sheet for all 81 designs.
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
