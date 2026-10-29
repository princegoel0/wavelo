# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 15,556 | 5.6 KB (5,709 B) | 6,656 |
| `@wavelo/core/loaders/progress-battery` — the busiest kind | 23,558 | 7,529 | 8,704 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 24,045 | 7,278 | 8,704 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 88,737 | 18.6 KB (19,011 B) | 22,528 |
| `@wavelo/core` + registry walk over all 111 designs | 88,740 | 19,016 | 22,528 |
| `@wavelo/react` | 89,569 | 19,438 | 22,528 |
| `@wavelo/vue` | 90,554 | 19,870 | 22,528 |
| `@wavelo/angular` | 92,511 | 20,700 | 23,552 |
| `@wavelo/svelte` | 88,929 | 19,110 | 22,528 |
| `@wavelo/web-components` | 90,996 | 19,926 | 22,528 |
| `@wavelo/vanilla` | 89,259 | 19,268 | 22,528 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 63,250 raw | 10,444 | — |

The budget that backs the "modular catalog" claim is `individual-loader`: a design
chosen at build time ships its own kind's rules and no other kind's. It is not
per-design in two ways, and both are measured rather than asserted: the rules of every
design sharing a kind ship with it (the streaming tranche took `ring` from 5,054 B to
5,482 B when two ring designs joined it), and the shared renderer ships in every one of
them — the progress tranche's per-part fill logic cost every design a further ~227 B,
including a ring, which uses none of it. `busiest-loader` is measured alongside
`individual-loader` so a crowded kind cannot grow unnoticed. Three earlier changes moved
the same number, all of them the same trade — configuration that a page can set once
instead of per loader:

- Defaults used to be written into the `style` attribute of every rendered element
  (about 180 B each). They are now fallbacks in the rules that read them, so a
  loader with no options carries no `style` attribute at all, and an ancestor or
  class rule can set size, duration, stroke, direction or play state once. The
  sheet pays for the fallbacks once per design instead of once per instance.
- Each design ships the option list measured against its own render (see
  `npm run audit:customization`) rather than a hand-written kind guess.
- The colour and dimension grammar got wider.

Runtime bundles additionally carry the registry and the 111-entry bitset those lists
are decoded from, which is why their budget is 22 KiB (23 for Angular). Adapters
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
cost of the tokens is what an ancestor rule could not previously reach. The one
exception is a change to the renderer itself, which no design is exempt from: the
determinate per-part fill added with the progress tranche cost every single-design
bundle about 227 B, `ring` included.

`createRouteProgress` is not in any of the rows above, because nothing imports it
unless a page asks for it: adding it to a runtime bundle costs 539 B gzipped, and a
page that renders loaders without a route bar pays nothing.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses. The shared base carries the layout shell, the
reduced-motion and theme rules, and the four `@keyframes` blocks that more than
one kind animates with (2.5 KB, listed once for the whole catalog rather than
repeated per kind). The other 54 frames each live in their own module under
`css/keyframes/`, imported only by the kinds that animate with them, so a single
design never pays for a frame it cannot run. `npm run catalog` fails if a slice
animates with a frame nobody imports, or re-imports one the base already ships.

- Importing one design costs its slice: the `ring` entry point ships 3.7 KB of ring
  rules (1.8 KB gzipped together with the base) rather than the 63,250-byte sheet for
  all 111 designs.
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
