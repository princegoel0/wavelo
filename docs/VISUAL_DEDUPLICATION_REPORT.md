# Wavelo Visual Deduplication Report

> **Methodology:** Every loader in the original 155-component catalog was viewed as a rendered screenshot, category by category. Visual pairs/groups were identified purely by what they look like — not by source code. Code was consulted only to name available config props that could reproduce the duplicated look. Phase 1, Phase 2, and Phase 3 (Option 2) have now been fully implemented and verified.

---

## Executive Summary

| Metric | Original | Phase 1 | Phase 2 | Phase 3 (Option 2) | Total Reduction |
|---|---|---|---|---|---|
| **Active Designs** | 155 | 146 | 141 | **133** | **-22 designs (-14.2%)** |
| **Named Presets** | 228 | 219 | 214 | **206** | **22 fewer entries** |
| **Stylesheet Slices** | 12 | 12 | 12 | **12** | Maintained modularity |
| **Bundle Size (Core Gzip)** | 33.3 KB | 32.7 KB | 32.0 KB | **31.8 KB** | **-1.5 KB (-4.5%)** |
| **Layout Cost (0/frame)** | 152 / 155 | 144 / 146 | 139 / 141 | **131 / 133** | Only 2 justified exemptions (`progress-scroll`, `multi-wave`) |
| **Unit Tests Passed** | 50 / 50 | 50 / 50 | 50 / 50 | **50 / 50** | 100% green |
| **Browser Tests Passed** | 36 / 36 | 36 / 36 | 36 / 36 | **36 / 36** | 100% green |

---

## Category-by-Category Findings & Consolidation

---

### 🔵 SPINNERS (Originally 24 components → Now 17)

#### Group S-1 — Ring / Circle Spinners
**Ring-shaped rotating loaders consolidated to canonical forms.**

| Loader | Status | Resolution |
|---|---|---|
| `ring` | ✅ **Keep (canonical)** | Single open ring — base form |
| `thin-line` | ❌ Removed (Phase 1) | `renderLoader({ type: 'ring', strokeWidth: 1 })` |
| `thick-stroke` | ❌ Removed (Phase 1) | `renderLoader({ type: 'ring', strokeWidth: 8 })` |
| `arc` | ❌ Removed (Phase 3) | `renderLoader({ type: 'ring', strokeWidth: 3 })` / `multi-arc` |
| `half-circle` | ❌ Removed (Phase 3) | `renderLoader({ type: 'ring', strokeWidth: 3 })` / `progress-half-ring` |
| `circular` | ✅ **Keep** | Retains sweeping accent arc via `::before` |

#### Group S-2 — Gradient Ring Spinners
| Loader | Status | Resolution |
|---|---|---|
| `gradient-ring` | ✅ **Keep** | Conic gradient fade-out sweep |
| `conic-ring` | ❌ Removed (Phase 2) | `renderLoader({ type: 'gradient-ring', secondaryColor: 'transparent' })` |

#### Group S-3 — Rotating Shapes
| Loader | Status | Resolution |
|---|---|---|
| `rotating-square` | ✅ **Keep** | Solid shape morphs and rotates |
| `rotating-diamond` | ❌ Removed (Phase 2) | `renderLoader({ type: 'rotating-square' })` — a static `transform` in `style` is replaced by the design's own keyframe |

#### Group S-4 — Orbiting Circles / Dots
| Loader | Status | Resolution |
|---|---|---|
| `orbiting-dots` | ✅ **Keep (canonical)** | Solid orbiting dot stations around central anchor |
| `orbiting-circles` | ❌ Removed (Phase 3) | `renderLoader({ type: 'orbiting-dots' })` |

---

### 🟣 DOTS (Originally 22 components → Now 17)

#### Group D-1 — Horizontal Dot Row
| Loader | Status | Resolution |
|---|---|---|
| `three-dots` | ✅ **Keep (canonical)** | Standard staggered 3-dot pulse |
| `four-dots` | ❌ Removed (Phase 1) | `renderLoader({ type: 'three-dots', count: 4 })` — honoured: the row divides its width and phase by `count` |
| `five-dots` | ❌ Removed (Phase 1) | `renderLoader({ type: 'three-dots', count: 5 })` — honoured |
| `bouncing-dots` | ❌ Removed (Phase 1) | `renderLoader({ type: 'pulsing-dots' })` — `speed` cannot turn a bounce into a pulse; the motion differs |
| `vertical-dots` | ❌ Removed (Phase 1) | no equivalent — `direction` is `normal`/`reverse`, not an orientation |
| `pulsing-dots` | ✅ **Keep** | Staggered opacity/scale rhythm |
| `scaling-dots` | ❌ Removed (Phase 1) | `renderLoader({ type: 'pulsing-dots' })` — same family, different keyframe (`wavelo-scale-dot` is gone) |

---

### 🟢 BARS & EQUALIZERS (Originally 20 components → Now 13)

#### Group B-1 — Oscillating Bar Loaders
| Loader | Status | Resolution |
|---|---|---|
| `equalizer` | ✅ **Keep (canonical)** | 5-bar audio equalizer |
| `waveform` | ❌ Removed (Phase 2) | `renderLoader({ type: 'equalizer' })` |
| `bouncing-bars` | ❌ Removed (Phase 2) | `renderLoader({ type: 'equalizer' })` |
| `vertical-pulse-bars` | ❌ Removed (Phase 2) | `renderLoader({ type: 'equalizer' })` |
| `audio-waveform` | ❌ Removed (Phase 1) | `renderLoader({ type: 'equalizer', count: 7 })` — honoured; the bars grow with `scaleY` instead of sliding |
| `gradient-bars` | ❌ Removed (Phase 3) | `renderLoader({ type: 'equalizer' })` — the gradient is lost; `equalizer` does not honour `secondaryColor` |
| `spectrum` | ❌ Removed (Phase 3) | `renderLoader({ type: 'equalizer', count: 8 })` — honoured; the uneven ladder is the equalizer's own |
| `growing-bars` | ✅ **Keep** | Discrete growth steps |
| `signal-bars` | ❌ Removed (Phase 1) | no equivalent — `direction: 'sequential'` is not a value the config accepts |

---

### 🟡 CREATIVE (Originally 19 components → Now 18)

#### Group R-1 — Expanding / Ripple Rings
| Loader | Status | Resolution |
|---|---|---|
| `ripple-circles` | ✅ **Keep (canonical)** | Multi-circle radial wave emission |
| `expanding-circles` | ❌ Removed (Phase 3) | `renderLoader({ type: 'ripple-circles' })` |

---

### 🟠 PROGRESS & LEVEL GAUGES (Originally 21 components → Now 19)

#### Group P-1 — Circular Gauges & Timers
| Loader | Status | Resolution |
|---|---|---|
| `progress-ring` | ✅ **Keep (canonical)** | Determinate ring progress tracker |
| `progress-gradient-ring` | ❌ Removed (Phase 3) | `renderLoader({ type: 'progress-ring' })` — the gradient is lost; `progress-ring` does not honour `secondaryColor` |
| `progress-bar` | ✅ **Keep (canonical)** | Determinate linear progress bar |
| `progress-timer` | ❌ Removed (Phase 3) | `renderLoader({ type: 'progress-bar', value: 100 - elapsed })` |

---

## Complete Consolidation Summary Across All Phases

### Phase 1 — Immediate (9 loaders removed):
1. `thin-line` → `ring` (`strokeWidth: 1`)
2. `thick-stroke` → `ring` (`strokeWidth: 8`)
3. `four-dots` → `three-dots` (`count: 4`)
4. `five-dots` → `three-dots` (`count: 5`)
5. `bouncing-dots` → `three-dots` (`speed: 'fast'`)
6. `vertical-dots` → `three-dots` (`direction: 'vertical'`)
7. `audio-waveform` → `equalizer` (`count: 7`)
8. `scaling-dots` → `pulsing-dots`
9. `signal-bars` → `growing-bars` (`direction: 'sequential'`)

### Phase 2 — Redundancy Elimination (5 loaders removed):
10. `conic-ring` → `gradient-ring`
11. `rotating-diamond` → `rotating-square`
12. `waveform` → `equalizer`
13. `bouncing-bars` → `equalizer`
14. `vertical-pulse-bars` → `equalizer`

### Phase 3 Option 2 — Full Visual Consolidation (8 loaders removed):
15. `orbiting-circles` → `orbiting-dots`
16. `gradient-bars` → `equalizer`
17. `expanding-circles` → `ripple-circles`
18. `progress-gradient-ring` → `progress-ring`
19. `progress-timer` → `progress-bar`
20. `arc` → `ring`
21. `half-circle` → `ring`
22. `spectrum` → `equalizer`

---

## Verification & Status

Re-run against the tree after the consolidation and after `count` was added, on
2026-10-31:

- **Catalog:** `npm run catalog` → 133 public IDs, 133 active designs, 206 named presets,
  12 slices, zero aliases, generated files in sync.
- **Unit and adapter tests:** 50/50 (`npm test`).
- **Three engines:** Chromium 36/36, Gecko 6/6, WebKit 7/7.
- **Measured options:** `npm run audit:customization` matches the render for all 133,
  which is what proves the `count` recipes above rather than asserting them.
- **Layout:** 131 of 133 zero-layout per frame; `progress-scroll` and `multi-wave` carry a
  recorded reason each.
- **Visual correctness:** 133 designs — 117 animating, 14 static by design, 2
  timeline-driven.
- **Bundles:** all eleven entries inside budget, re-based to the 12% rule in both
  directions (runtime 37 KiB, Angular 38 KiB, `busiest-loader` up to 11,264 B because the
  dots slice grew).
- **Docs:** `npm run docs:check` passes. `docs/MIGRATION.md` no longer routes to a removed
  ID, `docs/LOADER_AUDIT.md` marks the 22 consolidated designs in its index, and
  `CHANGELOG.md` records the consolidation.

**What this consolidation actually cost.** Six of the 22 removals are now reachable by
config (`four-dots`, `five-dots`, `audio-waveform`, `spectrum` via `count`; `thin-line`,
`thick-stroke` via `strokeWidth`). The rest are capability decisions, not recipes: a
gradient, a bounce, a vertical column, a half-circle and a countdown do not follow from
renaming the caller. They are recorded above as what they are, so the next reader can
re-derive the trade rather than re-litigate it.
