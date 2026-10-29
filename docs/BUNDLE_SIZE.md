# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 14,894 | 5.4 KB (5,482 B) | 6,144 |
| `@wavelo/core/loaders/skeleton-card` — the busiest kind | 19,159 | 6,248 | 7,168 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 23,383 | 7,053 | 8,192 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 75,808 | 15.7 KB (16,105 B) | 18,944 |
| `@wavelo/core` + registry walk over all 98 designs | 75,811 | 16,115 | 18,944 |
| `@wavelo/react` | 76,640 | 16,526 | 18,944 |
| `@wavelo/vue` | 77,625 | 16,959 | 18,944 |
| `@wavelo/angular` | 79,582 | 17,789 | 19,968 |
| `@wavelo/svelte` | 76,000 | 16,205 | 18,944 |
| `@wavelo/web-components` | 78,067 | 17,013 | 18,944 |
| `@wavelo/vanilla` | 76,330 | 16,360 | 18,944 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 52,947 raw | 8,343 | — |

The budget that backs the "modular catalog" claim is `individual-loader`: a design
chosen at build time ships its own kind's rules and no other kind's. It is not
per-design — every design sharing a kind ships that kind's whole slice — so it moves
when a sibling joins the kind, and `busiest-loader` is measured alongside it to keep
that honest. The streaming tranche is the proof: two ring designs and five skeleton
designs took `ring` from 5,054 B to 5,482 B and `skeleton-card` to 6,248 B, while a
design in a quiet kind (`overlay`, 1,322 B of stylesheet) stayed where it was. Three
earlier changes moved the same number, all of them the same trade — configuration that
a page can set once instead of per loader:

- Defaults used to be written into the `style` attribute of every rendered element
  (about 180 B each). They are now fallbacks in the rules that read them, so a
  loader with no options carries no `style` attribute at all, and an ancestor or
  class rule can set size, duration, stroke, direction or play state once. The
  sheet pays for the fallbacks once per design instead of once per instance.
- Each design ships the option list measured against its own render (see
  `npm run audit:customization`) rather than a hand-written kind guess.
- The colour and dimension grammar got wider.

Runtime bundles additionally carry the registry and the 98-entry bitset those lists
are decoded from, which is why their budget is 18.5 KiB (19.5 for Angular). Adapters
and `renderLoader` choose by string at runtime, so they carry every slice and grow by
roughly 220 B per design added. Budgets sit about 12% above the measured value,
rounded up to the next 512 B, and are re-based on purpose: a configuration key costs
20-30 B gzipped in every bundle, which is what the four accessibility options cost a
single design (4,205 → 4,612 B). The three ergonomics options (`loading`, `count`,
`inline`) cost it 265 B more, and the styling tokens 141 more than that — both well
above the rule, because they are new rules in the sheet rather than new reads of
rules that already existed. `inline` needs a twin for every design authored as a
block or a grid, `count` needs the stack rules, and `--wavelo-ease`, `--wavelo-gap`
and `--wavelo-radius` are inserted into the declarations of the slices that draw
them. A design that is not a skeleton does not load the stack rules at all, and the
cost of the tokens is what an ancestor rule could not previously reach.

`createRouteProgress` is not in any of the rows above, because nothing imports it
unless a page asks for it: adding it to a runtime bundle costs 539 B gzipped, and a
page that renders loaders without a route bar pays nothing.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses. The shared base carries the layout shell, the
reduced-motion and theme rules, and the four `@keyframes` blocks that more than
one kind animates with (2.5 KB, listed once for the whole catalog rather than
repeated per kind). The other 52 frames each live in their own module under
`css/keyframes/`, imported only by the kinds that animate with them, so a single
design never pays for a frame it cannot run. `npm run catalog` fails if a slice
animates with a frame nobody imports, or re-imports one the base already ships.

- Importing one design costs its slice: the `ring` entry point ships 3.7 KB of ring
  rules (1.8 KB gzipped together with the base) rather than the 52.9 KB sheet for all
  98 designs.
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

The same reasoning applies per element. A loader configured with nothing carries no
`style` attribute at all, where it used to carry roughly 180 bytes of token
defaults — and because those were inline, no ancestor rule or shared class could
have set size, speed or stroke for the whole page. That is the cost booked in the
table above and the reason it is worth paying.

`npm run measure` also fails if a single-design bundle contains another kind's rules
(`.wavelo--skeleton-card`, `.wavelo--helix`, `wavelo-typing-dot`) or the full catalog
table (`DNA helix`, `Circular border`), so tree-shaking regressions are caught, not
assumed. The check runs on `ring` and on `skeleton-card`, the kind carrying the most
designs, because that is the pair whose slices could grow unnoticed.
