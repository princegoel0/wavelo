# Performance

Every number here is measured in Chromium against the current build. The commands
that produce them are in CI, so a claim that stops being true fails the build.

| Claim | Measured by |
| --- | --- |
| A design costs no layout per frame, or says why not | `npm run audit:layout` |
| One imported design ships its own rules, not the catalog's | `npm run measure` |
| A page's loaders share one copy of each stylesheet slice | `npm run test:browser` |
| The options a design advertises are the ones it honours | `npm run audit:customization` |

## Layout cost per frame

An animation that changes `height`, `width` or `left` makes the browser lay the
element out again on every frame. An animation that changes `transform` or `opacity`
does not. `scripts/layout-cost.mjs` loads 150 copies of each design, reads
Chromium's layout and style-recalculation counters across two seconds, and fails when
a design costs a layout with no recorded reason.

**131 of the 133 designs cost no layout per frame.** Two do, each for a reason a
transform would take away:

| Design | Layouts per 2 s | Why it stays as it is |
| --- | --- | --- |
| `progress-scroll` | 120-122 | the fill *is* the reading position, and a `scaleX` would squash the leading dot that marks it with the bar |
| `multi-wave` | 74-90 | the same two frames, in opposite phase |

The counts are ranges because repeated runs of the same build produce them: the audit
reads Chromium's own counters, and how many frames land in a two-second window varies
with what else the machine is doing. What does not vary is the shape — one layout per
frame for a design that animates a box property, and zero for the other 131.

Each of those is one element inside a box the size of a line of text, and a page
carries one reading bar rather than 150 — the cost is recorded, not hidden. The
counts come from the stage layout in `scripts/layout-cost.mjs`, which keeps all 150
copies inside the viewport: Chromium does not animate a box it has decided is off
screen, and an off-screen sample reports zero layouts for a design that does cost them.

### What the measurement changed

Four designs — `equalizer`, gradient-bars, `growing-bars`, `alternating-bars` —
animated `height: 20% → 100%` on their bars. They now animate
`transform: scaleY(.2 → 1)` on a full-height box anchored to the bottom; gradient-bars
has since been consolidated into `equalizer`, so three of the four remain:

| 150 copies, 2 s | before | after |
| --- | --- | --- |
| layouts | 119–120, every one of the four | 0 |
| style recalculations | 119–120 | 1 |

That was not accepted on argument. Every bar's box — position, width, height and
opacity — was measured at three points of the animation cycle, before and after,
across all eight bar designs, and every value matched to within 0.6 px. Pixels are not
bit-identical: about 0.5% of them differ, all of them on the caps, because a vertical
scale also compresses the 2 px corner radius to 0.4 px while the box is short. The
largest channel difference is 84 on an antialiased edge, and the bars are moving.

The same conversion was then tried on waveform and **rejected by the geometry
check**: its `translateY` is a percentage of a height that is itself animating, so the
arc the bars draw came out 30 px off. It kept animating `height`, and the frame it used
still does — `multi-wave` runs it on two layers in opposite phase, and it is one of the
two exemptions above. waveform itself has since been consolidated into `equalizer`.

The pass also found a dead keyframe: `wavelo-bars` was imported by the bars slice and
referenced by the kind's default rule, which every design in that family overrides,
so no design ever ran it. Removing it took 126 bytes off the catalog sheet.

## What one design costs

A design's stylesheet is the shared base plus the one render-kind slice it uses.
Gzipped together, as shipped — the cheapest design in each kind:

| Kind | Bytes | Kind | Bytes |
| --- | --- | --- | --- |
| `overlay` | 1,609 | `wave` | 3,622 |
| `scroll` | 1,961 | `shape` | 3,802 |
| `bars` | 2,148 | `progress` | 3,858 |
| `rings` | 2,341 | `ring` | 3,923 |
| `pulse` | 2,737 | `skeleton` | 4,545 |
| `orbit` | 3,043 | `dots` | 5,217 |

The shared base — layout shell, reduced-motion and theme rules, and the four keyframe
blocks more than one kind animates with — is 1,316 bytes of every row above. The whole
catalog sheet is 21,930 bytes gzipped, loaded once, for all 133 designs.

A kind's cost is the thing to watch when the catalog grows: it is shared by every
design in that kind, and it moves in both directions. Since the 129-design checkpoint,
`dots` has gone from 3,454 to 5,217 bytes as the motion tranche and a countable dot row
joined it, while `ring` fell from 4,110 to 3,923 and `progress` from 4,017 to 3,858 when
their duplicate designs were consolidated away — which is why `progress`, the largest
slice at 3,866 back then, is now fourth. That re-ordering is exactly why `busiest-loader`
in `npm run measure` samples a dots design today: a probe pinned to whatever kind held the
record when it was written stops measuring the worst case the moment another kind
overtakes it, and the budget still passes. Redrawing a design moves its kind too, and not
in proportion to the design's own size: `infinity` is one loader's worth of markup and put
388 bytes on `rings` because the figure eight is sixteen keyframe stops, and `helix` put
410 on `wave` because a DNA twist needs eighteen parts in six rows. A design in a crowded
kind costs more than a design in a quiet one, whatever its own rules — and a change to the
renderer, which every design imports, costs all of them: the determinate fill path added
227 bytes to every single-design bundle.

Importing one design's entry point costs the renderer, validation and that slice, and
the six samples below are strictly ordered by the slice they pay for: `progress-view`
(`scroll`) 6,237 bytes, `equalizer` (`bars`) 6,493, `progress-battery` (`progress`)
8,191, `ring` 8,292, `skeleton-card` (`skeleton`) 8,894 and `bubble-rise` (`dots`) 9,648
— the largest, because `dots` is now the most crowded slice. `npm run measure` enforces
both ends of that range: 9,728 bytes for the sampled `ring` and 11,264 for the busiest
kind, so a new dots design cannot grow that slice without a number moving. Importing
`renderLoader`, which chooses by string at runtime, costs 31.8 KB because it must be able
to draw anything. See [BUNDLE_SIZE.md](BUNDLE_SIZE.md) for every entry point.

## Styles are injected once, not per loader

`ensureStyles` keys a slice by its own content, so a page with twelve loaders across
five render kinds writes five `<style>` elements to the head. Measured in the browser
suite: the injection count is asserted, not assumed, and the same slice requested
twice adds nothing. Before the split, those twelve instances each carried a copy of
the whole sheet — 201 KB of repeated CSS text and 1,810 parsed rules.

A loader that is hidden costs nothing at all: `loading: false` returns empty markup
and an empty slice, and an empty slice is never injected.

## Motion the browser can skip

- Reduced motion is honoured three ways: the operating-system preference,
  `reducedMotion: 'always'` for a page that wants it without being asked, and
  `'never'` for a design where the motion is the message. All three are asserted
  against computed styles in Chromium.
- `paused` sets `animation-play-state` on the element that actually animates, so a
  loader that is not being looked at costs no frames — verified against
  `document.getAnimations()`, not just the declared CSS.
- Scroll- and view-driven bars run on the compositor's own timeline: no scroll
  listener, no JavaScript, no re-render. Their fallback, for a browser without
  timelines, is the same keyframes on the document clock.
