# Bundle size

Measured by `npm run measure` (`scripts/bundle.mjs`) with esbuild, minified and
gzipped, framework peers external. Budgets are enforced in CI: a regression
fails the build rather than getting documented.

| Entry point | Minified | Gzipped | Budget |
| --- | --- | --- | --- |
| `@wavelo/core/loaders/ring` — one design, chosen at build time | 32,389 | 9.4 KB (9,603 B) | 10,240 |
| `@wavelo/core/loaders/voxel-cluster` — the busiest kind | 59,968 | 13,777 | 13,824 |
| Two designs from different kinds (`ring` + `skeleton-card`) | 63,593 | 14,064 | 14,336 |
| `@wavelo/core` — `renderLoader`, design chosen at runtime | 284,800 | 50.5 KB (51,665 B) | 53,248 |
| `@wavelo/core` + registry walk over all 168 designs | 284,803 | 50.5 KB (51,673 B) | 53,248 |
| `@wavelo/react` | 285,632 | 50.9 KB (52,134 B) | 53,248 |
| `@wavelo/vue` | 286,617 | 51.3 KB (52,553 B) | 53,248 |
| `@wavelo/angular` | 240,228 | 44.7 KB (45,780 B) | 52,224 |
| `@wavelo/svelte` | 284,992 | 50.6 KB (51,780 B) | 53,248 |
| `@wavelo/web-components` | 287,111 | 51.4 KB (52,609 B) | 53,248 |
| `@wavelo/vanilla` | 285,322 | 50.7 KB (51,948 B) | 53,248 |
| `@wavelo/core/styles.css` (all designs, loaded once) | 243,267 raw | 38,071 | — |

The budget that backs the "modular catalog" claim is `individual-loader`: a design
chosen at build time ships its own kind's rules and no other kind's. It is not
per-design in two ways, and both are measured rather than asserted: the rules of every
design sharing a kind ship with it (the streaming tranche took `ring` from 5,054 B to
5,482 B when two ring designs joined it, and the motion tranche took it to 6,237 B when
three more did), and the shared renderer ships in every one of them — the progress
tranche's per-part fill logic cost every design a further ~227 B, including a ring,
which uses none of it. `busiest-loader` is measured alongside `individual-loader` so a
crowded kind cannot grow unnoticed, and it is pointed at whatever the largest slice is
now rather than at the kind that held the record when the probe was written: `shape`
(8,156 B with the base) leads `dots` (6,844), `wave` (5,553) and `skeleton` (4,966), so
the probe samples `voxel-cluster`. It has moved twice — `progress` while twelve determinate
designs made that the largest slice, then `dots` (through `bubble-rise`) after the motion
and skeleton tranches, now `shape` after the 3D suite — and each move was only visible
because `npm run measure` prints the ranking: the previous ceiling of 11,264 B sat *below*
the 12,145 B a shape design actually costs, so the worst case was growing while the gate
passed.
Budgets move in both directions with
the measurement, because a ceiling left above the number it is meant to guard stops
guarding: the consolidation of 22 duplicate designs took `core-renderer` from 32,907 B to
32,084 B, and the runtime budget came down from 38,912 to 37,888 with it. It has moved up
since — to 39,424 when the token and 3D work pushed the heaviest adapter past that band,
and to 51,200 (52,224 for Angular) with the 3D suite — because the catalog grew rules
rather than designs: counted rows, the redrawn `infinity` and `helix`, twenty new
compositions and the `--wavelo-parts` grammar put `web-components` at 45,356 B.
Each ceiling is a clean KiB number sitting about 12% above the heaviest of the entries
that share it; `core-renderer` sits further under its ceiling than that, because seven
runtime-shaped entries share one number and the heaviest of them is an adapter. The rule
matters more than the number: a ceiling set 0.5% above the measurement is not a budget but
a rerun, because the next design added to any slice fails CI for adding bytes. `busiest-loader`
has always moved with the slice it samples — 10,752 → 11,264 when `three-dots` and
`equalizer` learned to divide their row by a `count`, and 13,824 now that it samples the
shape slice. Three earlier changes
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

Runtime bundles additionally carry the registry and the 153-entry bitset those lists
are decoded from, which is why their budget is 50 KiB (51 for Angular). Adapters
and `renderLoader` choose by string at runtime, so they carry every slice and grow with
the catalog, but the marginal design is not one fixed number: it is its slice delta plus
a registry entry plus a row in the option table, and it is largest when the design
brings a `@keyframes` module nobody had imported yet. Measured checkpoints — 129 designs
at 24,582 B, 143 at 28,678 B, 155 at 32,907 B — put the two big tranches at 293 B and
353 B per design, against the ~210 B the first eight-design tranche cost when every
design joined an already-shipping frame. The same line runs backwards and sideways:
consolidating 22 duplicate designs away took it to 32,084 B, and giving `three-dots` and
`equalizer` a working `count` brought it back to 32,613 B. Redesigning designs already in
the catalog moves it without adding either — the lemniscate `infinity` traces and the
eighteen-part `helix` are new rules in two slices, and every runtime bundle carries every
slice. The chain to where this build measures 44,372 B is: 32,613 B at the counted rows,
34,259 B once the token-consensus fix and the first five 3D labels landed in 0.1.0, and
44,372 B now — twenty new compositions, twenty new `@keyframes` modules nobody had
imported, and eleven redrawn designs, each of which is a new rule in a slice every runtime
bundle carries. Earlier moves on the same number: the
motion tranche's 18 designs took `core-renderer` from 19,011 B to 22,797 B, putting the
base defaults at zero specificity added 221 B more, and the five designs redrawn during
the visual review a further 1,564 B, to 24,582 B. Budgets sit about 12% above the
heaviest entry sharing each ceiling, at a clean KiB number, and are re-based on purpose: a configuration key costs
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
unless a page asks for it: adding it to a runtime bundle costs 695 B gzipped, and a
page that renders loaders without a route bar pays nothing.

## The targets the brief set

The brief asked for 5 KB or less per loader and 10 KB or less for the shared core.

- **5 KB per loader is met at the quiet end of the catalog and missed at the crowded one.**
  A design imports its kind's whole slice, so an `overlay` design pays 1.7 KB of rules and a
  `shape` design pays 7.1 KB before the renderer is counted. The cheapest designs clear 5 KB;
  `voxel-cluster` pays 12,145 B for the largest slice.
- **10 KB for the core is missed by design.** A renderer that chooses the design at runtime
  must be able to draw all twelve slices, which is 44,372 B gzipped. The target holds only for
  the build-time entry point, where tree-shaking leaves one slice in the bundle.

Both gaps are recorded here rather than quietly dropped, and the enforced numbers are the ones
in the table above.

## Why the numbers look like this

Styles and markup are separate. A design's stylesheet slice is `baseCss` plus the
one render-kind slice it uses. The shared base carries the layout shell, the
reduced-motion and theme rules, and the four `@keyframes` blocks that more than
one kind animates with (3.2 KB, listed once for the whole catalog rather than
repeated per kind). Every frame lives in its own module under `css/keyframes/` —
102 of them now — and the four shared ones are the ones the base imports; the other
98 are imported only by the kinds that animate with them, so a single design never
pays for a frame it cannot run. `npm run catalog` fails if a slice
animates with a frame nobody imports, or re-imports one the base already ships.

- Importing one design costs its slice: the `ring` entry point ships its ring rules
  (4.3 KB gzipped together with the base) rather than the 199,247-byte sheet for
  all 153 designs.
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
