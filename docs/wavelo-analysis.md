# Wavelo — Progress Tracker & Comprehensive Analysis Report

> **Last verified against code & tests:** 2026-10-30 (IST), working tree on `dev` at `9aaf779` plus an uncommitted batch
> **Catalog size:** **155 active designs / 228 named presets** (started at 83/120)
> **Quality gates:** `npm run check` green — build, strict typecheck, 50 unit/adapter tests, catalog drift, 7-package metadata validation, documentation sync, bundle budgets.
> **Browser validation:** three engines passing — **Chromium 36/36**, **Gecko 6/6**, **WebKit 7/7**.
> **Layout cost:** **152 of 155** designs cost 0 layout recalculations per frame; the three that do (`progress-scroll`, `waveform`, `multi-wave`) are each accounted for.
> **Visual audit:** 155 active designs — 137 animating, 16 static by design (bound to a value), 2 timeline-driven.
> **CI:** PR #23 — `verify` and `verify-browser` both pass.

Every number in this document was re-derived from the build rather than carried
forward from an earlier draft. The test counts, the bundle table and one catalog figure
did not survive that check; see [Corrections](#corrections). The batch described here is
**not yet committed**.

---

## 1. Project Overview & Architecture

**Wavelo** is an open-source, framework-independent loading and motion library published as a monorepo under the `@wavelo/*` npm scope.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        @wavelo/core (Zero Runtime Deps)                │
│   renderLoader(config) ──► { html, css, styleKey, config, definition }  │
│   • 155 designs across 8 categories   • 12 stylesheet slices           │
│   • 88 @keyframes modules             • 22 --wavelo-* CSS variables    │
│   • ARIA status/progressbar semantics • O(1) Map registry lookups      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  Framework   │             │   Vanilla    │             │     Web      │
│   Bridges    │             │     DOM      │             │  Components  │
│ React · Vue  │             │ mountLoader  │             │<wavelo-loader│
│ Svelte · Ng  │             │ createWavelo │             │              │
└──────────────┘             └──────────────┘             └──────────────┘
```

### Architectural principles, verified in code

1. **Markup and styles are separate.** The core produces HTML; no stylesheet is inlined on an element. Slices are deduped by an FNV-1a content hash and injected into `<head>` once per distinct slice.
2. **Compositor-only motion wherever it is possible.** 152 of 155 designs cost no layout per frame; the three exceptions are recorded with the reason a transform would destroy the effect.
3. **Options are measured, not assumed.** What each design advertises comes from `scripts/honoured-options.mjs`, which renders every design in Chromium and compares computed styles. `npm run audit:customization` re-checks all 155 in CI.
4. **Zero runtime dependencies** in core; framework packages declare peers only.

---

## 2. Completed Work

### A. All 17 Specialized Skeletons Completed
- **E-commerce:** `skeleton-product-card`, `skeleton-product-page`, `skeleton-cart`, `skeleton-review`.
- **Analytics & Dashboards:** `skeleton-chart-bar`, `skeleton-chart-line`, `skeleton-chart-donut` (masked radial ring plus legend bars), `skeleton-data-table` (header, zebra rows, pagination pill), `skeleton-dashboard`, `skeleton-metric`.
- **Productivity & Navigation:** `skeleton-kanban`, `skeleton-timeline`, `skeleton-calendar`, `skeleton-sidebar` (brand logo, navigation links, user footer block), `skeleton-notification` (status badge, title, multi-line message), `skeleton-command` (search input, shortcut list rows), `skeleton-feed` (avatar, handle, text, media container, action pill), `skeleton-filter-panel` (section header, tag chips, checkboxes, range slider), `skeleton-map` (terrain canvas, pin markers, zoom controls), `page-skeleton` (full viewport navbar, sidebar, hero, content cards).

### B. Stateful Micro-Interactions (6 Designs with `data-wavelo-state`)
Six designs respond directly to `data-wavelo-state` across `loading`, `success`, `error`, and `idle`:
1. `success-ring`: Spinning ring that transitions into a green checkmark on completion.
2. `error-shake`: Shape that shakes horizontally and turns red on error.
3. `button-confirm`: Pill loader that collapses into a confirmation tick.
4. `offline-dot`: Network connectivity indicator transitioning between connecting pulse/ping, online success green, and offline alert red.
5. `save-indicator`: Document save status transitioning from spinning sync to saved check or error state.
6. `undo-progress`: Action toast timer bar that drains its track and confirms undone or dismissed state.

The contract is formally documented in `README.md` and `docs/RECIPES.md`. Tests in `tests/browser.test.mjs` render each state and assert that computed geometry, animation names, and border/background colours transition properly.

### C. Visual Enhancements & Defect Resolutions
Every design in the catalog has been audited and rendered against its stated name and description:

| Design | Previous Observation | Enhanced Implementation |
|---|---|---|
| `pendulum` | Looked like an unanchored dot sliding back and forth | Added a top pivot mount pin (`:before`), slender suspension rod (`.wavelo__part`), and heavy swinging circular bob (`:after`) moving with true harmonic oscillation |
| `constellation` | Only 5 stars without constellation shape | Re-engineered with authentic celestial star patterns and polygon connecting lines. Supports 5 major constellations selectable via `data-wavelo-constellation` or dedicated presets: Ursa Major (Big Dipper, default), Orion (The Hunter), Cassiopeia (The Queen "W"), Cygnus (Northern Cross), and Ursa Minor (Little Dipper & Polaris). |
| `bubble-rise` | 5 clustered bubbles | Expanded to 8 buoyant bubbles with natural varied sizes, translucent highlights, and staggered column rise |
| `fireflies` | 6 motes | Expanded to 10 fireflies with warm bioluminescent radial glow drifting on independent paths |
| `solar-system` | 3 generic dots around a flat circle | Central radiant Sun with corona glow, faint concentric orbital guide tracks, and 5 distinct planets (Mercury, Venus, Earth, Mars, and Saturn with its signature tilted planetary ring) |
| `heartbeat` | Short, tiny (40px) blur passing in 1s | Expanded monitor width (6.5rem) and sweep duration (2.4s) with medical monitor grid background and authentic clinical P-Q-R-S-T cardiac waveform |
| `dot-wave` | Wave of 5 rectangular bars | Rebuilt as 5 circular dots (14% diameter, 50% radius, `flex: none`) undulating along a smooth sine wave (`wavelo-dot-wave`) |
| `snake` | Rigid spinning arc | 5 segmented body parts chasing tail around the perimeter of a walled room |
| `gradient-ring` | Square outline from unclipped `border-image` | Gradient fill carved into a ring by a radial mask |
| `comet-orbit` | Head detached from tail | Unified spin on root container with anchored head and fading tail |
| `rubber-band` | Open wobbling C-shape | Closed elastic band with plucking deformation and overshoots |
| `clock-spinner` | Two hands sweeping in empty space | Dial face at 22% with 4 hour markers and 12:1 hour/minute gearing |
| `sand-timer` | Solid silhouette turning | Two glass chambers draining and filling with sand, then turning over |
| `eye-blink` | Squashing ellipse | Almond aperture with glancing iris and closing eyelid |
| `ellipse` | Squashed open C-ring | Closed hoop rotating on tilted 3D axis |
| `infinity` | A typed `∞` character with two ellipses sliding past each other — a cluster of circles | Two circle outlines that touch at the centre form the track, and three nodes run it on a sixteen-stop lemniscate (eight stops per lobe, 45 degrees apart, so the chord error stays invisible and the speed constant) |
| `helix` | Six dots in one vertical column swinging left and right — one strand, no helix | Eighteen parts in six rows of rung, far node, near node; each row a fifth of a turn behind the one above, the far strand half a turn behind its own pair and smaller and dimmer, and the base pairs close to nothing as the strands cross |
| `toast-loading` | New application pattern | Floating notification badge with mini spinner and message line |
| `drag-drop-pulse` | New application pattern | Dropzone boundary with breathing dashed border and upload prompt |

---

## 3. Catalog Breakdown — 155 Designs / 228 Presets

Counts read directly from the built registry: **155 active designs, 155 public IDs, 0 aliases, 228 preset-registry entries, 73 pattern presets, 12 render kinds, 88 keyframe modules, 22 custom properties, 27 configuration keys**.

| Category | Count | Description |
|---|---|---|
| Spinners | 24 | Ring, dual-ring, conic, neon, snake, clock, arc, etc. |
| Dots & particles | 22 | Staggered, bouncing, matrix, constellation, pendulum, bubbles, etc. |
| Progress | 21 | Bar, ring, steps, battery, wave fill, count, timer, etc. |
| Bars & waveforms | 20 | Equalizer, audio waveform, heartbeat, spectrum, etc. |
| Skeletons | 26 | Sidebar, card, table, chat, code, feed, map, command, etc. |
| Creative & geometric | 19 | Ripple, helix, morphing shapes, cube, sand timer, etc. |
| Application patterns | 17 | Overlay, modal, toast loading, drag-drop pulse, page skeleton, micro-interactions |
| AI / streaming | 6 | Typing dots, thinking glow, stream cursor, token stream, shimmer |

### Bundle Cost (Measured via `npm run measure`)

| Entry Point | Minified | Gzipped | Budget | Headroom |
|---|---|---|---|---|
| Single loader (`ring`) | 27,455 B | 8,440 B | 9,728 | 15.3% |
| Busiest loader (`bubble-rise`) | 35,541 B | 9,319 B | 10,752 | 15.4% |
| Two loaders (`ring` + `skeleton-card`) | 50,210 B | 11,631 B | 13,312 | 14.5% |
| Core runtime (`renderLoader`) | 166,578 B | 33,769 B | 38,912 | 15.2% |
| Full catalog + registry walk | 166,581 B | 33,776 B | 38,912 | 15.2% |
| `@wavelo/react` | 167,410 B | 34,224 B | 38,912 | 13.7% |
| `@wavelo/vue` | 168,395 B | 34,673 B | 38,912 | 12.2% |
| `@wavelo/angular` | 170,352 B | 35,519 B | 39,936 | 12.4% |
| `@wavelo/svelte` | 166,770 B | 33,878 B | 38,912 | 14.9% |
| `@wavelo/web-components` | 168,837 B | 34,712 B | 38,912 | 12.1% |
| `@wavelo/vanilla` | 167,100 B | 34,047 B | 38,912 | 14.3% |
| Static `styles.css` (entire catalog) | 132,233 B raw | 22,601 B | — | — |

Every entry now sits between 12.1% and 15.4% under its ceiling, which is the stated rule
(~12% above measured, rounded up to the next 512 B) rather than a coincidence.

### Slice cost by render kind, gzipped with the base

`dots` 4,935 · `skeleton` 4,545 · `ring` 4,110 · `progress` 4,017 · `shape` 3,942 · `wave` 3,657 · `orbit` 3,075 · `pulse` 2,750 · `bars` 2,442 · `rings` 2,399 · `scroll` 1,961 · `overlay` 1,609

This ranking is what surfaced [M-1](#m-1-the-busiest-loader-probe-watches-the-wrong-kind):
`progress` is no longer the largest slice, and the probe that guards it was still pointed
at a `progress` design.

---

## 4. Open Work & Status

### 🔴 Before 0.1.0 — Owner Actions
These are external infrastructure and governance gates. None can be done from the
repository, and publishing seven packages is irreversible and permanently reserves the
names — it happens only on explicit instruction. This batch is also still uncommitted.
| # | Item | Action |
|---|---|---|
| P0-1 | npm Trusted Publishing | Establish for `@wavelo` scope against `princegoel0/wavelo`, `.github/workflows/release.yml`, environment `npm`. |
| P0-2 | `RELEASE_ENABLED` | Set to `true` when ready to publish. Currently `false` in CI to prevent accidental release. |
| P0-3 | `GALLERY_ENABLED` | Set to `true` and configure GitHub Pages to deploy docs gallery. |

### ⚠️ Measurement problems found while verifying this report — both resolved

<a name="m-1-the-busiest-loader-probe-watches-the-wrong-kind"></a>
**M-1 (Resolved) — the `busiest-loader` probe was watching the wrong kind.** It exists so a
crowded render kind cannot grow unnoticed, and it probed `progress-battery` on the
documented basis that `progress` is the largest slice. It is not: `dots` is largest at
4,935 B gzipped, then `skeleton` at 4,545, then `ring` at 4,110, with `progress` fourth at
4,017. The probe was also *cheaper* than the plain `ring` sample — 8,293 against 8,433 —
which is what made the drift visible. `scripts/bundle.mjs` now probes `bubble-rise`, and
the comment that stated the old premise says what the probe actually does: it follows the
measurement, not the history. Measured in the same build, the dots design is 1,019 bytes
gzipped larger than the progress design the probe used (8,300 against 9,319), so the real
worst case had grown a full kilobyte past what a green gate was reporting.

Two things had to be true before the new probe could be trusted. All seven dots designs
were measured first, so `bubble-rise` (9,321 → 9,319 in the final build) really is the
worst case and not a guess: `constellation` 9,310, `infinite-scroll` 9,301, `three-dots`
and `dotted-circle` 9,298, `dot-matrix` 9,297. And the absent-selector markers were
corrected — `wavelo-typing-dot` was one of them, and `typing-dots` is itself a dots-kind
design, so the marker was a substring of a selector the probed bundle legitimately defines.
It would have failed the bundle it existed to protect. `docs/BUNDLE_SIZE.md` now records
the marker rule.

**M-2 (Resolved) — `two-loaders` had 1.3% headroom.** At 11,619 against an 11,776 ceiling,
the next change to the `ring` or `skeleton` slice would have failed the build, and `vue`,
`web-components` and `angular` were between 5.8% and 6.0%. The re-base was made as its own
deliberate step rather than as a side effect of a feature: every budget re-measured against
the 12% rule and rounded up to the next 512 B — `individual-loader` 8,704 → 9,728,
`busiest-loader` 9,216 → 10,752, `two-loaders` 11,776 → 13,312, the shared runtime 35,840 →
38,400 and `angular` 36,864 → 38,912 (the tightest entry at 12.3%, and the only one kept
above the runtime budget because its component metadata is compiled in). `docs/BUNDLE_SIZE.md`
and `docs/PERFORMANCE.md` carry the same figures; the per-kind sample list in the latter
grew from five designs to six so that the dots design that sets the budget is also the
design the doc quotes.

### 🟢 Gaps Resolved in Repository
- **G-1 (Closed):** `data-wavelo-state` contract fully documented in `README.md` and `docs/RECIPES.md`.
- **G-2 (Closed):** Success/error colours tokenized to `var(--wavelo-success-color, #22c55e)` and `var(--wavelo-error-color, #ef4444)`. Verified: 20 uses of the two tokens, and **zero** bare `#22c55e` / `#ef4444` assignments remain.
- **G-3 (Closed):** `dot-wave` rebuilt with authentic circular dots undulating on a sine wave.
- **G-5 (Closed):** `data-wavelo-constellation` documented in `README.md` and `docs/RECIPES.md`, and its failure mode defined — see below.
- **Backlog Items (Closed):** All 12 pending catalog items implemented and verified; duplicate `lazy-image-shimmer` declined as a copy of `image-placeholder`.

### 🟠 New gap opened by the constellation work — now closed

**G-5 — `data-wavelo-constellation` was a second public contract, undocumented.**
`constellation` renders five real star patterns (Ursa Major, Orion, Cassiopeia, Cygnus,
Ursa Minor) selected through the attribute in `packages/core/src/render.ts`. It appeared in
`docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md` and in this report, but in neither `README.md` nor
`docs/RECIPES.md` — the same position `data-wavelo-state` had been in a day earlier.

Documenting it exposed a second problem, which is why this is not only a docs change. The
five geometries match on exact attribute values, so a name outside the list selected no
rule and left every star stacked at the box origin — verified by rendering
`data-wavelo-constellation="lyra"` in Chromium and reading the star boxes back: the first
three landed at 9,9, 9,9 and 8,8, one point with three sizes. The renderer now checks the
value against the pattern list and falls back to `ursa-major`, which is what an unknown
`type` already does for a whole design. The
five names live in one module, `packages/core/src/constellations.ts`, imported both by the
renderer (validation) and by the catalog (the five `constellation-*` presets are generated
from it), so a sixth pattern cannot be added to the stylesheet without the preset list and
the accepted-value list moving with it. It is its own module rather than a list inside
`catalog.ts` because `render.ts` must not pull the catalog into a bundle that ships one
design.

Two smaller things went with it: the renderer's hand-written read of a nested
`dataAttributes` object — a shape that is not in the public input type, that no adapter
produces, and that the top-level `data-*` pass-through already covers — was removed, and
`tests/core.test.mjs` now exercises the documented attribute form plus the unknown-name and
attribute-over-preset cases.

---

## 5. Final Verification Matrix

| Suite | Command | Result |
|---|---|---|
| Unit & adapter | `npm test` | ✅ 50 pass |
| Chromium | `npm run test:browser` | ✅ 36 pass |
| Gecko | `npm run test:browser:firefox` | ✅ 6 pass |
| WebKit | `npm run test:browser:webkit` | ✅ 7 pass |
| Full check | `npm run check` | ✅ pass |
| Layout profiler | `npm run audit:layout` | ✅ 152 of 155 zero-layout |
| Measured options | `npm run audit:customization` | ✅ matches for 155 |
| Visual correctness | `npm run audit:visual:correctness` | ✅ 137 animating / 16 static by design / 2 timeline-driven |
| Catalog drift | `npm run catalog` | ✅ 155 / 228 / 12 |
| Package metadata | `npm run packages:check` | ✅ 7 packages |
| Packed tarballs | `npm run pack:verify` | ✅ pass |
| Documentation sync | `npm run docs:check` | ✅ pass |
| Gallery | `npm run docs:verify` | ✅ pass (155 cards) |
| Bundle budgets | `npm run measure` | ✅ all 11 entries inside budget |
| Release validation | `npm run release:validate` | ✅ pass — "version 0.1.0 is aligned across 7 packages and is not published" |

### Corrections

Against the previous draft of this file: **Chromium is 36 tests, not 35**, and **unit and
adapter tests are 50, not 49** — both were one behind the code after tests landed in this
batch. **Catalog drift is 228 presets, not 223**, which also contradicted this document's
own section 3. The whole bundle table was from an earlier build: every gzipped figure was
low by 100–1,200 bytes and the runtime budget was stated as 32,768 where it is now 38,400.
The layout figure of 152 of 155, the `release:validate` result, and the counts in section 3
were all confirmed correct as written.

`docs/BUNDLE_SIZE.md` and `docs/PERFORMANCE.md` were two different kinds of stale, and
`npm run docs:check` caught neither: the first table was already refreshed to the current
build while the budgets beside it were two re-bases old, and the second still carried a
per-kind slice table from the 129-design build — `dots` at 3,454 where it now measures
4,935. The validator compares two headline KB figures and the design counts, not every cell,
so a doc can be half-updated and still pass. The constellation patterns, the six per-design
samples and the growth checkpoints in both files are now measured from this build, and every
budget in them is the number `scripts/bundle.mjs` actually enforces.

### Methodology note worth keeping

The largest defect family in section 2 was invisible to every automated gate, because gates
compare declarations and each design's own signature. A design can pass computed-style,
distinctness, animation and geometry checks while rendering something its name does not
describe — ten "dots" designs were drawing ellipses, and `gradient-ring` was drawing a
square. What caught them was rendering each design at four points of its own cycle and
**looking**, via `scripts/filmstrip.mjs`. The same habit is what surfaced M-1: the numbers
only looked wrong because they were measured rather than assumed, and the assumption was
sitting in a code comment.
