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

**80 of the 83 designs cost no layout per frame.** Three do, each for a reason a
transform would take away:

| Design | Layouts per 2 s | Why it stays as it is |
| --- | --- | --- |
| `progress-scroll` | 121 | the fill *is* the reading position, and a `scaleX` would squash the leading dot that marks it with the bar |
| `waveform` | 81 | the bar slides while it grows, and the slide is a percentage of the height it is growing |
| `multi-wave` | 80 | the same two frames, in opposite phase |

Each of those is one element inside a box the size of a line of text, and a page
carries one reading bar rather than 150 — the cost is recorded, not hidden.

### What the measurement changed

Four designs — `equalizer`, `gradient-bars`, `growing-bars`, `alternating-bars` —
animated `height: 20% → 100%` on their bars. They now animate
`transform: scaleY(.2 → 1)` on a full-height box anchored to the bottom:

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

The same conversion was then tried on `waveform` and **rejected by the geometry
check**: its `translateY` is a percentage of a height that is itself animating, so the
arc the bars draw came out 30 px off. It still animates `height`, and the row above
says so.

The pass also found a dead keyframe: `wavelo-bars` was imported by the bars slice and
referenced by the kind's default rule, which every design in that family overrides,
so no design ever ran it. Removing it took 126 bytes off the catalog sheet.

## What one design costs

A design's stylesheet is the shared base plus the one render-kind slice it uses.
Gzipped together, as shipped — the cheapest design in each kind:

| Kind | Bytes | Kind | Bytes |
| --- | --- | --- | --- |
| `overlay` | 1,322 | `dots` | 1,602 |
| `pulse` | 1,338 | `wave` | 1,651 |
| `orbit` | 1,393 | `shape` | 1,658 |
| `ring` | 1,445 | `scroll` | 1,678 |
| `bars` | 1,499 | `rings` | 1,717 |
| `progress` | 1,511 | `skeleton` | 1,747 |

The shared base — layout shell, reduced-motion and theme rules, and the four keyframe
blocks more than one kind animates with — is 1,025 bytes of that. The whole catalog
sheet is 5,897 bytes gzipped, loaded once, for all 83 designs.

Importing one design's entry point costs the renderer, validation and that slice:
`ring` 5,018 bytes, `equalizer` 5,121, `progress-view` 5,248, `skeleton-card` 5,303 —
all inside the 5,632-byte budget `npm run measure` enforces. Importing `renderLoader`,
which chooses by string at runtime, costs 12.4 KB because it must be able to draw
anything. See [BUNDLE_SIZE.md](BUNDLE_SIZE.md) for every entry point.

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
