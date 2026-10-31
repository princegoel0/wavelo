# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 26,504 | 8.1 KB (8,300 B) | 9,728 |
| `@wavelo/core/loaders/bubble-rise` — the busiest kind | 36,712 | 9,648 | 11,264 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 49,259 | 11,490 | 13,312 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 158,141 | 31.8 KB (32,613 B) | 37,888 |
| `@wavelo/core` + registry walk over all 133 designs | 158,144 | 32,622 | 37,888 |
| `@wavelo/react` | 158,973 | 33,073 | 37,888 |
| `@wavelo/vue` | 159,958 | 33,530 | 37,888 |
| `@wavelo/angular` | 161,915 | 34,369 | 38,912 |
| `@wavelo/svelte` | 158,333 | 32,725 | 37,888 |
| `@wavelo/web-components` | 160,400 | 33,576 | 37,888 |
| `@wavelo/vanilla` | 158,663 | 32,896 | 37,888 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 126,068 raw | 21,930 | — |

The budget that backs the "modular catalog" claim is `individual-loader`: a design
chosen at build time ships its own kind's rules and no other kind's. It is not
per-design in two ways, and both are measured rather than asserted: the rules of every
design sharing a kind ship with it (the streaming tranche took `ring` from 5,054 B to
5,482 B when two ring designs joined it, and the motion tranche took it to 6,237 B when
three more did), and the shared renderer ships in every one of them — the progress
tranche's per-part fill logic cost every design a further ~227 B, including a ring,
which uses none of it. `busiest-loader` is measured alongside `individual-loader` so a
crowded kind cannot grow unnoticed, and it is pointed at whatever the largest slice is
now rather than at the kind that held the record when the probe was written: `dots`
(5,217 B with the base) leads `skeleton` (4,545), `ring` (3,923) and `progress` (3,858),
and the original busiest — `progress` — is fourth. Budgets move in both directions with
the measurement, because a ceiling left above the number it is meant to guard stops
guarding: the consolidation of 22 duplicate designs took `core-renderer` from 32,907 B to
32,084 B, and the budget came down from 38,912 to 37,888 with it. `busiest-loader` went
the other way, 10,752 → 11,264, because teaching `three-dots` and `equalizer` to divide
their row by a `count` added twelve index rules to the dots slice. Three earlier changes
moved the same number, all of them the same trade — configuration that a page can set
once instead of per loader:

- Defaults used to be written into the `style` attribute of every rendered element
  (about 180 B each). They are now fallbacks in the rules that read them, so a
  loader with no options carries no `style` attribute at all, and an ancestor or
  class rule can set size, duration, stroke, direction or play state once. The
  sheet pays for the fallbacks once per design instead of once per instance.
- Each design ships the option list measured against its own render (see
  `npm run audit:customization`) rather than a hand-written kind guess.
- The colour and dimension grammar got wider.

Runtime bundles additionally carry the registry and the 133-entry bitset those lists
are decoded from, which is why their budget is 37 KiB (38 for Angular). Adapters
and `renderLoader` choose by string at runtime, so they carry every slice and grow with
the catalog, but the marginal design is not one fixed number: it is its slice delta plus
a registry entry plus a row in the option table, and it is largest when the design
brings a `@keyframes` module nobody had imported yet. Measured checkpoints — 129 designs
at 24,582 B, 143 at 28,678 B, 155 at 32,907 B — put the two big tranches at 293 B and
353 B per design, against the ~210 B the first eight-design tranche cost when every
design joined an already-shipping frame. The same line runs backwards and sideways:
consolidating 22 duplicate designs away took it to 32,084 B, and giving `three-dots` and
`equalizer` a working `count` brought it back to 32,613 B. Redrawing two designs already
in the catalog moved it by 862 B without adding either — a sixteen-stop lemniscate and an
eighteen-part helix are new rules in two slices, and every runtime bundle carries every
slice. Earlier moves on the same number: the
motion tranche's 18 designs took `core-renderer` from 19,011 B to 22,797 B, putting the
base defaults at zero specificity added 221 B more, and the five designs redrawn during
the visual review a further 1,564 B, to 24,582 B. Budgets sit about 12% above the
measured value, rounded up to the next 512 B, and are re-based on purpose: a configuration key costs
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
unless a page asks for it: adding it to a runtime bundle costs 662 B gzipped, and a
page that renders loaders without a route bar pays nothing.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses. The shared base carries the layout shell, the
reduced-motion and theme rules, and the four `@keyframes` blocks that more than
one kind animates with (3.2 KB, listed once for the whole catalog rather than
repeated per kind). Every frame lives in its own module under `css/keyframes/` —
81 of them now — and the four shared ones are the ones the base imports; the other
77 are imported only by the kinds that animate with them, so a single design never
pays for a frame it cannot run. `npm run catalog` fails if a slice
animates with a frame nobody imports, or re-imports one the base already ships.

- Importing one design costs its slice: the `ring` entry point ships its ring rules
  (3.9 KB gzipped together with the base) rather than the 126,068-byte sheet for
  all 133 designs.
- Importing `renderLoader` costs the whole set of slices, because a runtime
  `type` could select any kind. This is the price of a single component that can
  render every design; it is paid once per page, not once per loader.
- Two designs of the same kind share a slice, so `two-loaders` grows less than
  the sum of its parts.

The adapter bundles are the core renderer plus a thin bridge, which is why
`react`, `vue`, `svelte`, `vanilla` and `web-components` sit within ~0.9 KB of
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
(`.wavelo--skeleton-card`, `.wavelo--helix`) or the full catalog table (`DNA helix`,
`Circular border`), so tree-shaking regressions are caught, not assumed. The check runs
on `ring` and on `bubble-rise`, the design from the kind carrying the most designs and the
largest slice, because that is the pair whose slices could grow unnoticed; only the
`bubble-rise` probe can additionally assert that `.wavelo--ring` is absent, since that
selector belongs to the `ring` design's own bundle. Markers are picked per probe and must
not be a substring of anything the probed slice defines — `wavelo-typing-dot` once was, and
`typing-dots` is itself a dots-kind design, so it would have failed the very bundle it was
meant to prove clean.
