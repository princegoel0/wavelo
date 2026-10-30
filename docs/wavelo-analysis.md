# Wavelo — Progress Tracker & Comprehensive Analysis Report

> **Last verified against code & tests:** 2026-10-30 (IST), commit `cc7124b` on `dev`
> **Catalog size:** **143 active designs / 211 named presets** (started at 83/120)
> **Quality gates:** `npm run check` green — build, strict typecheck, 49 unit/adapter tests, catalog drift, 7-package metadata validation, documentation sync, bundle budgets.
> **Browser validation:** three engines passing — **Chromium 35/35**, **Gecko 6/6**, **WebKit 7/7**.
> **Layout cost:** **140 of 143** designs cost 0 layout recalculations per frame; the three that do (`progress-scroll`, `waveform`, `multi-wave`) are each accounted for.
> **CI:** PR #23 — `verify` and `verify-browser` both pass.

Every number in this document was re-derived from the build rather than carried
forward from an earlier draft. Two figures in the previous revision did not survive
that check and are corrected below; the list is in [Corrections](#corrections).

---

## 1. Project Overview & Architecture

**Wavelo** is an open-source, framework-independent loading and motion library published as a monorepo under the `@wavelo/*` npm scope.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        @wavelo/core (Zero Runtime Deps)                │
│   renderLoader(config) ──► { html, css, styleKey, config, definition }  │
│   • 143 designs across 8 categories   • 12 stylesheet slices           │
│   • 84 @keyframes modules             • 20 --wavelo-* CSS variables    │
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
2. **Compositor-only motion wherever it is possible.** 140 of 143 designs cost no layout per frame; the three exceptions are recorded with the reason a transform would destroy the effect.
3. **Options are measured, not assumed.** What each design advertises comes from `scripts/honoured-options.mjs`, which renders every design in Chromium and compares computed styles. `npm run audit:customization` re-checks all 143 in CI.
4. **Zero runtime dependencies** in core; framework packages declare peers only.

---

## 2. Completed work

### A. Specialized skeletons (11 of the 17 planned)

- **E-commerce:** `skeleton-product-card`, `skeleton-product-page`, `skeleton-cart`, `skeleton-review`.
- **Analytics:** `skeleton-chart-bar`, `skeleton-chart-line`, `skeleton-chart-donut` (masked radial ring plus legend bars), `skeleton-data-table` (header, zebra rows, pagination pill).
- **Productivity:** `skeleton-kanban`, `skeleton-timeline`, `skeleton-calendar`.

### B. Stateful micro-interactions (3 of the 6 planned)

`success-ring`, `error-shake` and `button-confirm` respond to `data-wavelo-state`
across `loading`, `success`, `error` and `idle`. The contract rides the existing
`data-*` pass-through, so no public option changed and no runtime cost was added.
`tests/browser.test.mjs` renders each state and asserts the geometry actually
differs — the designs are not exempted from the animation check.

### C. Rendering defects fixed

Found by auditing designs against their own names and descriptions, not by a
failing gate — each had been passing every test while rendering something else.

| Design | Defect | Fix |
|---|---|---|
| `progress-orbit-fill` | translated by a percentage of its own 2.4px box, so six units collapsed into a central clump | travel expressed against `--wavelo-size` |
| `progress-ring` | drew a solid pie disc | radial cutout mask makes it a hollow ring |
| `progress-gradient-ring` | halved the sweep, so 100% filled half the circle | full 360° at maximum |
| `progress-count` | description did not match the rendered counter | description corrected |
| `orbiting-dots`, `orbiting-circles` | legacy delay rules collided with the shared orbit stagger; pivots off-centre | delays removed, pivots centred, anchor cores added, guarded by a test |
| `gradient-ring` | `border-image` is not clipped by `border-radius`, so it rendered a spinning **square** | gradient fill carved into a ring by a radial mask |
| `comet-orbit` | tail and dot spun about different centres, so the head slid off the tail | one spin on the root; both placed inside it |
| `snake` | a rigid arc on a constant rotation — a spinner, not a snake | five segments chasing each other around a walled room |
| `rotating-square` | no rule of its own; inherited a keyframe morphing `border-radius` to 50%, i.e. to a circle | keeps its corners, turns about a tilted axis |
| `rotating-diamond` | a square caught at 45°, so a quarter of every turn looked like its neighbour | a true rhombus |
| `rubber-band` | an open hoop wobbling; a rubber band is a loop | closed, with a pluck, two overshoots and a rest |
| `clock-spinner` | hands sweeping through empty space, no clock | dial at 22% and four hour markers |
| `sand-timer` | a silhouette turning end over end | two chambers that drain and fill, then the timer turns over |
| `eye-blink` | an ellipse squashing | almond aperture, an iris that glances aside, a lid that closes |
| `ellipse` | inherited the ring's open side, so a squashed arc, and its in-plane spin was imperceptible | closed hoop turning about a tilted axis, measured never to go edge-on |
| ten `*-dots` designs | parts are flex items that overflowed the box and were shrunk sideways, so `border-radius:50%` drew **ellipses** | `flex:none` and sizes that fit; 18 of 20 dot designs now measure exactly 1.00 aspect |

**New gate:** the parts test freezes every design across its cycle and fails if two
parts share a position and a size, or if any percentage-radius part renders more than
6% off square. That assertion is what would have caught the largest family above.

### D. Multi-engine browser hardening

- **Chromium** — 35 tests: computed styles, slice isolation, geometry, axe accessibility, layout behaviour, state transitions.
- **Gecko** — 6 tests: sheet application, and timeline designs falling back to the document clock (Firefox 157 does not support `animation-timeline: scroll()/view()`).
- **WebKit** — 7 tests: mask carving, conic gradients, registered `@property`, and native `ScrollTimeline`/`ViewTimeline` execution (WebKit 27.2 supports them).

CI installs and runs all three engines.

### E. Developer experience

O(1) `Map` registry lookups · live code-sync in the playground · `count` documented for composite layouts · 0.x versioning policy in `docs/RELEASE.md` · `dist/tokens.css` · React Server Component recipes · `data-wavelo-fallback` tracing on an unknown type.

---

## 3. Catalog breakdown — 143 designs / 211 presets

Counts read from the built registry: 143 active designs, 143 public IDs, 0 aliases,
211 preset-registry entries, 68 pattern presets, 12 render kinds, 84 keyframe modules,
20 custom properties, 27 configuration keys.

| Category | Count |
|---|---|
| Spinners | 24 |
| Dots & particles | 22 |
| Progress | 21 |
| Bars & waveforms | 20 |
| Skeletons | 20 |
| Creative & geometric | 19 |
| Application patterns | 11 |
| AI / streaming | 6 |

### Bundle cost, measured and gzipped

| Entry point | Gzipped | Budget |
|---|---|---|
| one design at build time (`ring`) | 8,087 B | 8,704 |
| busiest kind (`progress-battery`) | 7,877 B | 9,216 |
| two designs, different kinds | 10,633 B | 11,776 |
| `renderLoader` at runtime | 28,926 B | 32,768 |
| `@wavelo/angular` | 30,627 B | 33,792 |
| `styles.css`, whole catalog, once | 18,838 B | — |

---

## 4. Open work

### 🔴 Before 0.1.0 — owner actions

These are configuration and governance gates, not code. Nothing here can be done
from the repository.

| # | Item | Action |
|---|---|---|
| P0-1 | npm Trusted Publishing | Establish it for the `@wavelo` scope against `princegoel0/wavelo`, `.github/workflows/release.yml`, environment `npm`. |
| P0-2 | `RELEASE_ENABLED` | Set to `true` when ready to publish. It is `false` today, and the release workflow therefore validates and skips publishing. |
| P0-3 | `GALLERY_ENABLED` | Set to `true` and point GitHub Pages at "GitHub Actions" to host the gallery. |

Publishing seven packages is irreversible and reserves the names permanently. It
happens only on explicit instruction.

### 🟠 In-repo gaps created by this round of work

| # | Gap | Why it matters |
|---|---|---|
| G-1 | **`data-wavelo-state` is undocumented.** Zero mentions in `README.md` or `docs/`. | A new public contract shipping in 0.1.0 that no consumer can discover. The docs gate cannot catch it — it validates counts and tokens, not contracts. Undocumented today means breaking to change tomorrow. |
| G-2 | **Success/error colours are hardcoded.** `#22c55e` and `#ef4444` appear in 7 rules across `pulse.ts`, `ring.ts` and `shape.ts`. | Everything else is themed through `currentColor` and the 20 tokens, which is what lets an ancestor or class rule restyle a page at once. A success ring cannot be re-coloured by a page today. |
| G-3 | **`dot-wave` is not dots.** It is a `wave`-kind design of 5×28px bars, described as "Wave of dots". | A name that describes a different design. Fixing it is a catalog decision (rename, or rebuild as dots), not a CSS edit. |
| G-4 | **`docs/wavelo-analysis.md` is a status report living in shipped documentation.** | Anything in `docs/` is read as authoritative. Either hold the two corrections above in it, or move it to a working-note location. |

### 🟡 P1 — post-launch developer experience

| # | Item | Note |
|---|---|---|
| P1-1 | `npx wavelo` CLI (`add` / `init` / `list`) | Package name is an owner decision. |
| P1-2 | shadcn/ui registry entry | **Blocked on hosting** — needs a public URL, which is P0-3. |
| P1-3 | ESLint + Prettier in CI | No linter exists in the repo today. |
| P1-4 | `examples/` projects | Satisfies the PRD requirement for out-of-monorepo consumer builds. |

### 🔵 Remaining catalog items (13 of the original 45)

- **6 skeletons:** `skeleton-sidebar`, `skeleton-notification`, `skeleton-command`, `skeleton-feed`, `skeleton-filter-panel`, `skeleton-map`.
- **3 application patterns:** `toast-loading`, `drag-drop-pulse`, `page-skeleton`.
- **3 micro-interactions:** `offline-dot`, `save-indicator`, `undo-progress` — all three need the state contract from G-1 documented first.
- **1 duplicate to decline:** `lazy-image-shimmer` is the same thing as the existing `image-placeholder`; adding it would grow the catalog and the bundle for no new capability.

### ⚪ P3 — community and tooling

VS Code extension with hover previews · Figma kit · `@wavelo/storybook` · a competitive benchmark page. All four are downstream of P0-3: the gallery has to be hosted before any of them has something to link to.

---

## 5. Verification matrix

| Suite | Command | Result |
|---|---|---|
| Unit & adapter | `npm test` | ✅ 49 pass |
| Chromium | `npm run test:browser` | ✅ 35 pass |
| Gecko | `npm run test:browser:firefox` | ✅ 6 pass |
| WebKit | `npm run test:browser:webkit` | ✅ 7 pass |
| Full check | `npm run check` | ✅ pass |
| Layout profiler | `npm run audit:layout` | ✅ 140 of 143 zero-layout |
| Measured options | `npm run audit:customization` | ✅ matches for 143 |
| Visual correctness | `npm run audit:visual:correctness` | ✅ pass |
| Catalog drift | `npm run catalog` | ✅ 143 / 211 / 12 |
| Package metadata | `npm run packages:check` | ✅ 7 packages |
| Documentation sync | `npm run docs:check` | ✅ pass |
| Gallery | `npm run docs:verify` | ✅ pass |
| Bundle budgets | `npm run measure` | ✅ all 12 entries inside |

### Corrections

The previous revision of this report stated **83 `@keyframes` modules**; the build has
**84**. It also presented the P2 catalog expansion as **"Newly Completed"** while 13 of
its items had not been built and were not listed as pending — they are now itemised
under *Remaining catalog items*. Both were found by reading the tree and the built
registry rather than the document.

A methodology note worth keeping: the largest defect family in section 2C was invisible
to every automated gate, because the gates compare declarations and each design's own
signature. A design can pass computed-style, distinctness, animation and geometry checks
while rendering something its name does not describe. The fix that stuck was rendering
each design at four points of its own cycle and **looking** — `scripts/filmstrip.mjs`.
