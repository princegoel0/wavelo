# Comprehensive Wavelo Loader, Spinner & Progress Component Audit

> **Scope:** Full architectural audit of all **133 active loading components** (and consolidation recipes for 22 redundant designs consolidated in Phases 1–3) across **8 functional categories** in the Wavelo design system.  
> **Repository:** `@wavelo/core` (with React, Vue, Svelte, Angular, Vanilla, and Web Components bridges).  
> **Audited Date:** October 2026 (Updated post-Phase 3 consolidation)  
> **Engine:** Verified via Chromium, Gecko, and WebKit test suites with zero layout thrashing (131 compositor-pure designs).

---

## 1. System Architecture & Configuration Taxonomy

Wavelo decouples markup from stylesheets. The core engine (`renderLoader`) emits semantic HTML elements with semantic `role`, `aria-*` attributes, and CSS custom property inline variables (`--wavelo-*`), while injecting self-contained stylesheet slices into `<head>` deduped by FNV-1a content hashing.

Every configuration option is **empirically validated** via browser computed-style difference probing (`scripts/honoured-options.mjs`). Options are classified into three distinct architectural tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION TAXONOMY                          │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 1: UNIVERSAL STRUCTURAL CONFIGURATIONS (100% of loaders)          │
│ • label, labelledBy, describedBy, decorative (Accessibility / ARIA)    │
│ • loading, inline, className, data-testid (DOM / Lifecycle)            │
│ • reducedMotion (prefers-reduced-motion override)                      │
│ • style (CSS custom properties escape hatch: --wavelo-*)               │
│ • theme (light / dark / system palette resolution)                     │
│ • color (primary foreground tint token)                                │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 2: SHARED GEOMETRIC & TEMPORAL CONFIGURATIONS (86% - 99%)         │
│ • size: Root bounding box (width & height) for square components       │
│ • width, height: Independent dimension controls for rectangular designs│
│ • duration, speed: Cycle timing controls (seconds/ms and multiplier)   │
│ • direction: 'normal' | 'reverse' playback control                     │
│ • paused: boolean / string animation freeze state                      │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 3: COMPONENT-SPECIFIC & SPECIALIZED CONFIGURATIONS (6% - 39%)     │
│ • strokeWidth: Ring border, line weight, or stroke thickness           │
│ • value, max, valueText: Determinate fill level and ARIA progressbar   │
│ • count: Track repetitions (skeleton lines, rows, steps, files)        │
│ • secondaryColor: Dual-tone accents, orbiting sun/planets, dial hands  │
│ • backgroundColor: Container background, track fill, or overlay scrim  │
│ • data-wavelo-state: 'idle' | 'loading' | 'success' | 'error'          │
│ • data-wavelo-constellation: 'ursa-major' | 'orion' | 'cassiopeia' ... │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Universal & Shared Options Reference

The following table summarizes options available across the entire catalog and specifies how they affect the DOM and styling:

| Option | Type | Tier | Target CSS / Attribute | Description |
|---|---|:---:|---|---|
| `label` | `string` | Tier 1 | `aria-label` | Accessible label announced by screen readers (role="status" or "progressbar"). |
| `labelledBy` | `string` | Tier 1 | `aria-labelledby` | Space-separated DOM IDs referencing visible label elements. |
| `describedBy` | `string` | Tier 1 | `aria-describedby` | Space-separated DOM IDs referencing caption or descriptive elements. |
| `decorative` | `boolean` | Tier 1 | `aria-hidden="true"` | Suppresses assistive technology announcements when sibling text already communicates loading. |
| `loading` | `boolean` | Tier 1 | DOM mounting | When `false`, renders zero markup and zero CSS bytes. Default `true`. |
| `inline` | `boolean` | Tier 1/2 | `.wavelo-inline` | Sits on the surrounding text line (`inline-flex` / `inline-block`) instead of block level. |
| `className` | `string` | Tier 1 | `class` | Additional caller-provided CSS class names. |
| `data-testid` | `string` | Tier 1 | `data-testid` | Automated testing / QA selector attribute. |
| `reducedMotion` | `'auto' | 'always' | 'never'` | Tier 1 | `data-wavelo-motion` | Controls motion reduction without overriding OS preferences. |
| `theme` | `'light' | 'dark' | 'system'` | Tier 1 | `data-wavelo-theme` | Skeleton shimmer tones, default backgrounds, and overlay scrims. |
| `color` | `string` | Tier 1 | `--wavelo-color` | Primary accent or foreground stroke/fill color. |
| `style` | `LoaderStyle` | Tier 1 | `style` | Escape hatch for typed tokens (`--wavelo-*`) or standard CSS properties. |
| `size` | `string | number` | Tier 2 | `--wavelo-size` | Bounding box dimensions (width and height). |
| `width` | `string | number` | Tier 2 | `--wavelo-width` | Width override for rectangular loaders (bars, skeletons, etc.). |
| `height` | `string | number` | Tier 2 | `--wavelo-height` | Height override for non-square loaders. |
| `duration` | `string | number` | Tier 2 | `--wavelo-duration` | Full animation cycle duration (e.g. `'1.5s'`, `'800ms'`). |
| `speed` | `number` | Tier 2 | `--wavelo-duration` | Speed multiplier (e.g. `2` doubles speed, halving duration). |
| `direction` | `'normal' | 'reverse'` | Tier 2 | `--wavelo-direction` | Animation playback direction. |
| `paused` | `boolean | string` | Tier 2 | `--wavelo-play-state` | Freezes motion on demand without resetting element state. |

---

## 3. Component-Specific Options Reference

The following options are honoured strictly by loaders engineered to read them:

| Option | Type | Consumers | Effect |
|---|---|---|---|
| `strokeWidth` | `number` | Rings, circular borders, battery frames, constellation lines, rubber band, etc. (35 loaders) | Sets `--wavelo-stroke` (in px), controlling border thickness or line stroke. |
| `value` | `number` | Determinate progress bars, rings, battery, meters, counters (18 loaders) | Current completion number between `0` and `max`. Sets `--wavelo-progress` and `aria-valuenow`. |
| `max` | `number` | Determinate progress loaders (18 loaders) | Maximum completion range (default 100). Sets `aria-valuemax`. |
| `valueText` | `string` | Determinate progress loaders (18 loaders) | Humanized reading (e.g., `"4 of 12 items"`). Sets `aria-valuetext` and visual counters. |
| `count` | `number` | Skeleton text lines and composite layouts, multi-step progress, upload queues, and the two repeated-track designs `three-dots` and `equalizer` (26 loaders) | Controls repeating child elements (lines of text, step chips, file items) and, on the two track designs, the length of the row: the sheet divides track width and animation phase by `--wavelo-parts`. |
| `secondaryColor` | `string` | Dual-color rings, clock hands, solar system, thinking glow (8 loaders) | Secondary orbital, inactive border, or accent color via `--wavelo-secondary-color`. |
| `backgroundColor` | `string` | Skeletons, progress tracks, modals, cards, overlays (44 loaders) | Sets `--wavelo-background` for outer track containers and scrims. |
| `data-wavelo-state` | `'idle' | 'loading' | 'success' | 'error'` | Micro-interactions (6 loaders: `success-ring`, `error-shake`, `button-confirm`, `offline-dot`, `save-indicator`, `undo-progress`) | Triggers reactive visual morphs (spin -> checkmark, pulse -> alert). |
| `data-wavelo-constellation` | `'ursa-major' | 'orion' | 'cassiopeia' | 'cygnus' | 'ursa-minor'` | Constellation loader | Selects celestial star pattern and geometric line matrix. |

---

## 4. Component-by-Component Detailed Audit (133 shipped, 155 audited)

### Category: SPINNER (17 shipped, 24 audited)

> **Consolidated away since this section was written:** `arc`, `conic-ring`, `half-circle`, `orbiting-circles`, `rotating-diamond`, `thin-line`, `thick-stroke`. Those entries
> describe the design as audited; it no longer ships, and the survivor it folded
> into is named in `docs/VISUAL_DEDUPLICATION_REPORT.md`.

*Circular, ring, arc, radial, and orbital rotating loaders operating on continuous angular momentum.*

#### `circular` — Circular border

- **Identifier:** `circular`
- **Render Kind (Slice):** `ring`
- **Description:** Closed circular border with a sweeping accent arc
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `secondaryColor`, `strokeWidth` |

---

#### `ring` — Ring

- **Identifier:** `ring`
- **Render Kind (Slice):** `ring`
- **Description:** Open ring spinner
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `branded-minimal`, `high-contrast`, `classic-collection`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `dual-ring` — Dual ring

- **Identifier:** `dual-ring`
- **Render Kind (Slice):** `rings`
- **Description:** Nested dual-ring rotation
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `arc` — Rotating arc

- **Identifier:** `arc`
- **Render Kind (Slice):** `ring`
- **Description:** Single quarter-turn rotating arc
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `multi-arc` — Multiple arcs

- **Identifier:** `multi-arc`
- **Render Kind (Slice):** `rings`
- **Description:** Three layered arcs rotating in alternating directions
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `dotted-circle` — Dotted circle

- **Identifier:** `dotted-circle`
- **Render Kind (Slice):** `dots`
- **Description:** Circular dotted spinner
- **DOM & Technical Construction:** 8 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `segmented-ring` — Segmented ring

- **Identifier:** `segmented-ring`
- **Render Kind (Slice):** `ring`
- **Description:** Dashed circular indicator
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `half-circle` — Half circle

- **Identifier:** `half-circle`
- **Render Kind (Slice):** `ring`
- **Description:** Half-circle sweep
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `ellipse` — Elliptical spinner

- **Identifier:** `ellipse`
- **Render Kind (Slice):** `ring`
- **Description:** Elliptical rotation
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `rotating-square` — Rotating square

- **Identifier:** `rotating-square`
- **Render Kind (Slice):** `shape`
- **Description:** Rotating square
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `rotating-diamond` — Rotating diamond

- **Identifier:** `rotating-diamond`
- **Render Kind (Slice):** `shape`
- **Description:** Rotating diamond
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `orbiting-dots` — Orbiting dots

- **Identifier:** `orbiting-dots`
- **Render Kind (Slice):** `orbit`
- **Description:** Dots orbiting a center
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `large-display` (moved here when `orbiting-circles` was consolidated)

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `orbiting-circles` — Orbiting circles

- **Identifier:** `orbiting-circles`
- **Render Kind (Slice):** `orbit`
- **Description:** Circles orbiting a center
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `large-display` — **consolidated**; the preset now resolves to `orbiting-dots`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `comet-orbit` — Comet orbit

- **Identifier:** `comet-orbit`
- **Render Kind (Slice):** `orbit`
- **Description:** A dot on a fading conic-gradient tail that turns with it
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `gradient-ring` — Gradient ring

- **Identifier:** `gradient-ring`
- **Render Kind (Slice):** `ring`
- **Description:** Gradient ring sweep
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `dark-surface`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `secondaryColor`, `strokeWidth` |

---

#### `conic-ring` — Conic ring

- **Identifier:** `conic-ring`
- **Render Kind (Slice):** `ring`
- **Description:** Conic sweep carved into a ring by a radial mask
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `neon-ring` — Neon ring

- **Identifier:** `neon-ring`
- **Render Kind (Slice):** `ring`
- **Description:** Ring that turns while its glow swells and fades
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `rubber-band` — Rubber band

- **Identifier:** `rubber-band`
- **Render Kind (Slice):** `ring`
- **Description:** A closed band stretched tall and snapped back through its own overshoots
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `snake` — Snake

- **Identifier:** `snake`
- **Render Kind (Slice):** `ring`
- **Description:** A segmented snake chasing its tail around the walls of a room
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `clock-spinner` — Clock spinner

- **Identifier:** `clock-spinner`
- **Render Kind (Slice):** `ring`
- **Description:** A dial with two hands turning twelve to one
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `secondaryColor`, `strokeWidth` |

---

#### `thin-line` — Thin line

- **Identifier:** `thin-line`
- **Render Kind (Slice):** `ring`
- **Description:** Minimal hairline ring
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `thick-stroke` — Thick stroke

- **Identifier:** `thick-stroke`
- **Render Kind (Slice):** `ring`
- **Description:** Bold heavy-stroke ring
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `monochrome` — Monochrome

- **Identifier:** `monochrome`
- **Render Kind (Slice):** `ring`
- **Description:** Half-filled rotating disc
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `svg-star` — SVG star

- **Identifier:** `svg-star`
- **Render Kind (Slice):** `shape`
- **Description:** Star-shaped SVG spinner
- **DOM & Technical Construction:** Embedded inline SVG path (`.wavelo__part`). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---


### Category: DOTS (17 shipped, 22 audited)

> **Consolidated away since this section was written:** `bouncing-dots`, `five-dots`, `four-dots`, `scaling-dots`, `vertical-dots`. Those entries
> describe the design as audited; it no longer ships, and the survivor it folded
> into is named in `docs/VISUAL_DEDUPLICATION_REPORT.md`.

*Staggered, bouncing, pulsating, orbiting, and celestial particle arrays conveying lively activity.*

#### `three-dots` — Three dots

- **Identifier:** `three-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Three-dot sequence
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `search-results`, `compact-inline`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `four-dots` — Four dots

- **Identifier:** `four-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Four-dot sequence
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `five-dots` — Five dots

- **Identifier:** `five-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Five-dot sequence
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `bouncing-dots` — Bouncing dots

- **Identifier:** `bouncing-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Bouncing dot rhythm
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `pulsing-dots` — Pulsing dots

- **Identifier:** `pulsing-dots`
- **Render Kind (Slice):** `pulse`
- **Description:** Sequential pulse
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `fading-dots` — Fading dots

- **Identifier:** `fading-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Fading dot sequence
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `scaling-dots` — Scaling dots

- **Identifier:** `scaling-dots`
- **Render Kind (Slice):** `pulse`
- **Description:** Scaling dots
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `rotating-dots` — Rotating dots

- **Identifier:** `rotating-dots`
- **Render Kind (Slice):** `orbit`
- **Description:** Rotating dots
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `dot-wave` — Dot wave

- **Identifier:** `dot-wave`
- **Render Kind (Slice):** `wave`
- **Description:** Wave of dots
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `dot-matrix` — Dot matrix

- **Identifier:** `dot-matrix`
- **Render Kind (Slice):** `dots`
- **Description:** Three-by-three pulsing dot matrix
- **DOM & Technical Construction:** 9 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `grid-pulse` — Grid pulse

- **Identifier:** `grid-pulse`
- **Render Kind (Slice):** `pulse`
- **Description:** Two-by-two pulsing grid
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `alternating-dots` — Alternating dots

- **Identifier:** `alternating-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Alternating dot groups
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `expanding-dot` — Expanding dot

- **Identifier:** `expanding-dot`
- **Render Kind (Slice):** `pulse`
- **Description:** Single dot expanding and contracting
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `ripple-dot` — Ripple dot

- **Identifier:** `ripple-dot`
- **Render Kind (Slice):** `rings`
- **Description:** Ripple expanding from a centre dot
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `staggered-dots` — Staggered dots

- **Identifier:** `staggered-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Staggered dot timing
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `vertical-dots` — Vertical bouncing dots

- **Identifier:** `vertical-dots`
- **Render Kind (Slice):** `wave`
- **Description:** Vertical dot bounce
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `magnetic-dots` — Magnetic dots

- **Identifier:** `magnetic-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Five dots pulled toward the centre and released
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `pendulum` — Pendulum

- **Identifier:** `pendulum`
- **Render Kind (Slice):** `dots`
- **Description:** A suspension rod and bob swinging in a realistic harmonic arc from a top pivot
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `constellation` — Constellation

- **Identifier:** `constellation`
- **Render Kind (Slice):** `dots`
- **Description:** Astronomical star pattern with connecting lines (Ursa Major, Orion, Cassiopeia, Cygnus, Ursa Minor)
- **DOM & Technical Construction:** 7 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Astronomical Star Maps:** Supports 5 authentic constellations (`ursa-major`, `orion`, `cassiopeia`, `cygnus`, `ursa-minor`) selectable via `data-wavelo-constellation` or presets.
- **Associated Pattern Presets:** `constellation-ursa-major`, `constellation-orion`, `constellation-cassiopeia`, `constellation-cygnus`, `constellation-ursa-minor`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `bubble-rise` — Bubble rise

- **Identifier:** `bubble-rise`
- **Render Kind (Slice):** `dots`
- **Description:** Eight bubbles rising, growing and floating upward at varying speeds
- **DOM & Technical Construction:** 8 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `fireflies` — Fireflies

- **Identifier:** `fireflies`
- **Render Kind (Slice):** `orbit`
- **Description:** Ten glowing fireflies drifting on uneven paths and fading as they go
- **DOM & Technical Construction:** 10 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `solar-system` — Solar system

- **Identifier:** `solar-system`
- **Render Kind (Slice):** `orbit`
- **Description:** The Solar System with central Sun, orbital rings, and orbiting planets
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `secondaryColor` |

---


### Category: BARS (13 shipped, 20 audited)

> **Consolidated away since this section was written:** `audio-waveform`, `bouncing-bars`, `gradient-bars`, `signal-bars`, `spectrum`, `vertical-pulse-bars`, `waveform`. Those entries
> describe the design as audited; it no longer ships, and the survivor it folded
> into is named in `docs/VISUAL_DEDUPLICATION_REPORT.md`.

*Vertical and horizontal columns, oscillating waveforms, cardiac traces, and acoustic equalizer displays.*

#### `equalizer` — Equalizer bars

- **Identifier:** `equalizer`
- **Render Kind (Slice):** `bars`
- **Description:** Audio equalizer bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `bouncing-bars` — Bouncing bars

- **Identifier:** `bouncing-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Bouncing vertical bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `vertical-pulse-bars` — Vertical pulse bars

- **Identifier:** `vertical-pulse-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Vertical pulse bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `horizontal-pulse-bars` — Horizontal pulse bars

- **Identifier:** `horizontal-pulse-bars`
- **Render Kind (Slice):** `wave`
- **Description:** Horizontal pulse bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `waveform` — Waveform

- **Identifier:** `waveform`
- **Render Kind (Slice):** `wave`
- **Description:** Waveform animation
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `audio-waveform` — Audio waveform

- **Identifier:** `audio-waveform`
- **Render Kind (Slice):** `bars`
- **Description:** Seven-bar audio waveform
- **DOM & Technical Construction:** 7 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `fading-bars` — Fading bars

- **Identifier:** `fading-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Sequential fading bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `growing-bars` — Growing bars

- **Identifier:** `growing-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Growing and shrinking bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `connection-quality` (moved here when `signal-bars` was consolidated)

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `alternating-bars` — Alternating bars

- **Identifier:** `alternating-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Alternating bar motion
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `gradient-bars` — Gradient bars

- **Identifier:** `gradient-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Gradient-filled equalizer bars
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `secondaryColor` |

---

#### `signal-bars` — Signal bars

- **Identifier:** `signal-bars`
- **Render Kind (Slice):** `bars`
- **Description:** Four bars of increasing height filling in sequence
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `connection-quality` — **consolidated**; the preset now resolves to `growing-bars`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `piano-keys` — Piano keys

- **Identifier:** `piano-keys`
- **Render Kind (Slice):** `bars`
- **Description:** Bars landing one after another at uneven points in the cycle
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `fire-rise` — Fire rise

- **Identifier:** `fire-rise`
- **Render Kind (Slice):** `bars`
- **Description:** Bars rising, stretching and burning out at the top
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `spectrum` — Spectrum

- **Identifier:** `spectrum`
- **Render Kind (Slice):** `bars`
- **Description:** Eight bars running an uneven ladder of heights out of phase
- **DOM & Technical Construction:** 8 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `heartbeat` — Heartbeat

- **Identifier:** `heartbeat`
- **Render Kind (Slice):** `wave`
- **Description:** A realistic medical ECG cardiac trace sweeping across the monitor
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `vitals`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `breathing` — Breathing

- **Identifier:** `breathing`
- **Render Kind (Slice):** `wave`
- **Description:** One bar widening and narrowing on a slow cycle
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `breathing-guide`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `moving-stripe` — Moving stripe

- **Identifier:** `moving-stripe`
- **Render Kind (Slice):** `wave`
- **Description:** Traveling stripe
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `traveling-highlight` — Traveling highlight

- **Identifier:** `traveling-highlight`
- **Render Kind (Slice):** `wave`
- **Description:** Highlight sweep
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `oscillating-line` — Oscillating line

- **Identifier:** `oscillating-line`
- **Render Kind (Slice):** `wave`
- **Description:** Oscillating line
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `multi-wave` — Multi-wave

- **Identifier:** `multi-wave`
- **Render Kind (Slice):** `wave`
- **Description:** Multiple wave layers
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---


### Category: PROGRESS (19 shipped, 21 audited)

> **Consolidated away since this section was written:** `progress-gradient-ring`, `progress-timer`. Those entries
> describe the design as audited; it no longer ships, and the survivor it folded
> into is named in `docs/VISUAL_DEDUPLICATION_REPORT.md`.

*Determinate meters, stepped milestones, multi-file queues, battery gauges, and scroll-linked trackers.*

#### `segmented-bar` — Segmented bar

- **Identifier:** `segmented-bar`
- **Render Kind (Slice):** `progress`
- **Description:** Segmented progress bar
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-bar` — Progress bar

- **Identifier:** `progress-bar`
- **Render Kind (Slice):** `progress`
- **Description:** Determinate progress bar
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `file-processing`, `progress-collection`, `time-remaining`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-ring` — Progress ring

- **Identifier:** `progress-ring`
- **Render Kind (Slice):** `progress`
- **Description:** Determinate circular progress
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme` |
| **Component-Specific** | `max`, `strokeWidth`, `value`, `valueText` |

---

#### `progress-steps` — Progress steps

- **Identifier:** `progress-steps`
- **Render Kind (Slice):** `progress`
- **Description:** Multi-step progress
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `multi-stage`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `count`, `max`, `value`, `valueText` |

---

#### `progress-top` — Top progress

- **Identifier:** `progress-top`
- **Render Kind (Slice):** `progress`
- **Description:** Top-of-page progress
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `style`, `theme` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-upload` — Upload progress

- **Identifier:** `progress-upload`
- **Render Kind (Slice):** `progress`
- **Description:** Upload progress
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `download-progress`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-scroll` — Scroll progress

- **Identifier:** `progress-scroll`
- **Render Kind (Slice):** `scroll`
- **Description:** Reading progress driven by the document scroll position
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: CSS Scroll-Driven Timeline (scroll() / view()).
- **Associated Pattern Presets:** `reading-position`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `progress-view` — In-view progress

- **Identifier:** `progress-view`
- **Render Kind (Slice):** `scroll`
- **Description:** Progress driven by the view timeline of the element it sits in
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: CSS Scroll-Driven Timeline (scroll() / view()).
- **Associated Pattern Presets:** `section-progress`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `progress-battery` — Battery level

- **Identifier:** `progress-battery`
- **Render Kind (Slice):** `progress`
- **Description:** A charge shell filling to the value, terminal and all
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `storage-level`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `strokeWidth`, `value`, `valueText` |

---

#### `progress-half-ring` — Half-ring gauge

- **Identifier:** `progress-half-ring`
- **Render Kind (Slice):** `progress`
- **Description:** A 180 degree gauge arc drawn from the value
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `strokeWidth`, `value`, `valueText` |

---

#### `progress-wave-fill` — Wave fill

- **Identifier:** `progress-wave-fill`
- **Render Kind (Slice):** `progress`
- **Description:** A liquid level whose crest rolls while the value holds
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-count` — Counting bar

- **Identifier:** `progress-count`
- **Render Kind (Slice):** `progress`
- **Description:** A bar whose percentage counts itself up
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-dots-fill` — Dots fill

- **Identifier:** `progress-dots-fill`
- **Render Kind (Slice):** `progress`
- **Description:** Whole units filled as dots, one per step
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `survey-progress`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `count`, `max`, `value`, `valueText` |

---

#### `progress-label-inline` — Labelled bar

- **Identifier:** `progress-label-inline`
- **Render Kind (Slice):** `progress`
- **Description:** The value text riding the edge of the fill
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-gradient-ring` — Gradient progress ring

- **Identifier:** `progress-gradient-ring`
- **Render Kind (Slice):** `progress`
- **Description:** A masked ring whose filled arc is a gradient
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme` |
| **Component-Specific** | `max`, `secondaryColor`, `strokeWidth`, `value`, `valueText` |

---

#### `progress-multi-step` — Numbered steps

- **Identifier:** `progress-multi-step`
- **Render Kind (Slice):** `progress`
- **Description:** Steps that number themselves beneath the track
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `checkout-steps`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `count`, `max`, `strokeWidth`, `value`, `valueText` |

---

#### `progress-upload-multi` — Multi-file upload

- **Identifier:** `progress-upload-multi`
- **Render Kind (Slice):** `progress`
- **Description:** One track per file, each filled by its share of the value
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `upload-queue`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `count`, `max`, `strokeWidth`, `value`, `valueText` |

---

#### `progress-ai-generate` — Generating

- **Identifier:** `progress-ai-generate`
- **Render Kind (Slice):** `wave`
- **Description:** A bright band travelling an empty track, with no percentage to report
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `ai-generation`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `secondaryColor` |

---

#### `progress-skill` — Skill bar

- **Identifier:** `progress-skill`
- **Render Kind (Slice):** `progress`
- **Description:** A level that overshoots and settles
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `secondaryColor`, `value`, `valueText` |

---

#### `progress-timer` — Countdown

- **Identifier:** `progress-timer`
- **Render Kind (Slice):** `progress`
- **Description:** The track empties as the value climbs
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Associated Pattern Presets:** `time-remaining` — **consolidated**; the preset now resolves to `progress-bar`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `progress-orbit-fill` — Orbit level

- **Identifier:** `progress-orbit-fill`
- **Render Kind (Slice):** `progress`
- **Description:** Six stations around a ring, filled one by one
- **DOM & Technical Construction:** 6 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `height`, `inline`, `label`, `labelledBy`, `loading`, `reducedMotion`, `size`, `style`, `theme`, `width` |
| **Component-Specific** | `count`, `max`, `value`, `valueText` |

---


### Category: CREATIVE (18 shipped, 19 audited)

> **Consolidated away since this section was written:** `expanding-circles`. Those entries
> describe the design as audited; it no longer ships, and the survivor it folded
> into is named in `docs/VISUAL_DEDUPLICATION_REPORT.md`.

*Geometric morphing shapes, 3D rotating cubes, liquid blobs, hourglasses, and mathematical figures.*

#### `ripple-circles` — Ripple circles

- **Identifier:** `ripple-circles`
- **Render Kind (Slice):** `rings`
- **Description:** Expanding ripple circles
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `expanding-circles` — Expanding circles

- **Identifier:** `expanding-circles`
- **Render Kind (Slice):** `rings`
- **Description:** Expanding concentric circles
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `morphing-shapes` — Morphing shapes

- **Identifier:** `morphing-shapes`
- **Render Kind (Slice):** `shape`
- **Description:** Shape morphing between square, triangle and diamond
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `creative-collection`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `infinity` — Infinity loop

- **Identifier:** `infinity`
- **Render Kind (Slice):** `rings`
- **Description:** Two nodes run a figure-eight track drawn as two circles touching at the centre
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `helix` — DNA helix

- **Identifier:** `helix`
- **Render Kind (Slice):** `wave`
- **Description:** Two strands of nodes twist around each other, joined by base pairs that close as they cross
- **DOM & Technical Construction:** 18 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `cube` — Cube rotation

- **Identifier:** `cube`
- **Render Kind (Slice):** `shape`
- **Description:** Cube rotation
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `polygon` — Rotating polygon

- **Identifier:** `polygon`
- **Render Kind (Slice):** `shape`
- **Description:** Rotating polygon
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `triangles` — Rotating triangles

- **Identifier:** `triangles`
- **Render Kind (Slice):** `shape`
- **Description:** Rotating triangles
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `folding-squares` — Folding squares

- **Identifier:** `folding-squares`
- **Render Kind (Slice):** `shape`
- **Description:** Folding square motion
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `nested-squares` — Nested squares

- **Identifier:** `nested-squares`
- **Render Kind (Slice):** `rings`
- **Description:** Nested square rotation
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `concentric-pulse` — Concentric pulse

- **Identifier:** `concentric-pulse`
- **Render Kind (Slice):** `rings`
- **Description:** Pulsing concentric circles
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `trip-orbit` — Triple arc orbit

- **Identifier:** `trip-orbit`
- **Render Kind (Slice):** `dots`
- **Description:** Three arcs one third of a turn apart, sweeping and shrinking together
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `liquid-blob` — Liquid blob

- **Identifier:** `liquid-blob`
- **Render Kind (Slice):** `shape`
- **Description:** A body whose corner radii keep changing while it stays in place
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `sand-timer` — Sand timer

- **Identifier:** `sand-timer`
- **Render Kind (Slice):** `shape`
- **Description:** Sand falls from the upper glass to the lower one, then the timer turns over
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `eye-blink` — Eye blink

- **Identifier:** `eye-blink`
- **Render Kind (Slice):** `shape`
- **Description:** An eye that glances aside and blinks, its lid closing over the opening
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `metronome` — Metronome

- **Identifier:** `metronome`
- **Render Kind (Slice):** `shape`
- **Description:** An arm swinging about its foot, left to right and back
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `spiral` — Spiral

- **Identifier:** `spiral`
- **Render Kind (Slice):** `ring`
- **Description:** Spiral sweep
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `radar` — Radar sweep

- **Identifier:** `radar`
- **Render Kind (Slice):** `ring`
- **Description:** Circular radar sweep
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `particle-orbit` — Particle orbit

- **Identifier:** `particle-orbit`
- **Render Kind (Slice):** `orbit`
- **Description:** Particle orbit system
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---


### Category: AI (6 shipped, 6 audited)

*Neural synapsing grids, token streamers, thinking halos, and animated generative AI shimmer states.*

#### `typing-dots` — Typing dots

- **Identifier:** `typing-dots`
- **Render Kind (Slice):** `dots`
- **Description:** Three dots lift in sequence while a reply is composed
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `assistant-typing`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `thinking-glow` — Thinking glow

- **Identifier:** `thinking-glow`
- **Render Kind (Slice):** `pulse`
- **Description:** An orb breathes inside a halo that leaves it
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `model-thinking`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `stream-cursor` — Stream cursor

- **Identifier:** `stream-cursor`
- **Render Kind (Slice):** `pulse`
- **Description:** Block cursor blinking at the end of a streamed answer
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `token-stream` — Token stream

- **Identifier:** `token-stream`
- **Render Kind (Slice):** `wave`
- **Description:** Short dashes appear at the left and travel right as tokens arrive
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `streaming-response`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `strokeWidth` |

---

#### `ai-shimmer` — AI response shimmer

- **Identifier:** `ai-shimmer`
- **Render Kind (Slice):** `skeleton`
- **Description:** A tall rounded panel swept by one bright band
- **DOM & Technical Construction:** Pseudo-element based (0 child parts; drawn via root element and ::before / ::after). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `ai-response`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `neural-grid` — Neural grid

- **Identifier:** `neural-grid`
- **Render Kind (Slice):** `dots`
- **Description:** Nine nodes pulse along a diagonal across a three-by-three grid
- **DOM & Technical Construction:** 9 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---


### Category: SKELETON (26 shipped, 26 audited)

*Content-aware wireframe placeholders for text, media, avatars, tables, dashboards, and app layouts.*

#### `skeleton-line` — Skeleton text line

- **Identifier:** `skeleton-line`
- **Render Kind (Slice):** `skeleton`
- **Description:** Single skeleton line
- **DOM & Technical Construction:** Pseudo-element based (0 child parts; drawn via root element and ::before / ::after). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `chat-message`, `notification-list`, `lazy-content`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-card` — Skeleton card

- **Identifier:** `skeleton-card`
- **Render Kind (Slice):** `skeleton`
- **Description:** Card placeholder
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `product-grid`, `article-layout`, `statistics-card`, `chart-placeholder`, `pricing-card`, `skeleton-collection`, `ecommerce-collection`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-avatar` — Skeleton avatar

- **Identifier:** `skeleton-avatar`
- **Render Kind (Slice):** `skeleton`
- **Description:** Avatar placeholder
- **DOM & Technical Construction:** Pseudo-element based (0 child parts; drawn via root element and ::before / ::after). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `profile-page`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-table` — Skeleton table

- **Identifier:** `skeleton-table`
- **Render Kind (Slice):** `skeleton`
- **Description:** Table placeholder
- **DOM & Technical Construction:** 6 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `table-body`, `table-header`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-inbox` — Skeleton inbox

- **Identifier:** `skeleton-inbox`
- **Render Kind (Slice):** `skeleton`
- **Description:** Avatar and subject tracks repeated as inbox rows
- **DOM & Technical Construction:** 6 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `inbox-loading`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-chat` — Skeleton chat

- **Identifier:** `skeleton-chat`
- **Render Kind (Slice):** `skeleton`
- **Description:** Alternating bubbles, the newest lifting while the reply is written
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `conversation-loading`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-code` — Skeleton code

- **Identifier:** `skeleton-code`
- **Render Kind (Slice):** `skeleton`
- **Description:** Code lines beside a numbered gutter, the last one short
- **DOM & Technical Construction:** 6 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `code-block-loading`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-metric` — Skeleton metric

- **Identifier:** `skeleton-metric`
- **Render Kind (Slice):** `skeleton`
- **Description:** Metric card: number, label and trend chip
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `metric-card-loading`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-dashboard` — Skeleton dashboard

- **Identifier:** `skeleton-dashboard`
- **Render Kind (Slice):** `skeleton`
- **Description:** Dashboard placeholder
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `dashboard-cards`, `dashboard-collection`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-product-card` — Skeleton product card

- **Identifier:** `skeleton-product-card`
- **Render Kind (Slice):** `skeleton`
- **Description:** Product card placeholder with image, title, price, and action
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `product-card`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-product-page` — Skeleton product page

- **Identifier:** `skeleton-product-page`
- **Render Kind (Slice):** `skeleton`
- **Description:** Product detail page placeholder with gallery, breadcrumb, and CTA
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `product-page`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-cart` — Skeleton cart

- **Identifier:** `skeleton-cart`
- **Render Kind (Slice):** `skeleton`
- **Description:** Shopping cart row with thumbnail, details, quantity, and price
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `cart-drawer`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-review` — Skeleton review

- **Identifier:** `skeleton-review`
- **Render Kind (Slice):** `skeleton`
- **Description:** Review card with avatar, rating, and body text
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `review-card`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-chart-bar` — Skeleton bar chart

- **Identifier:** `skeleton-chart-bar`
- **Render Kind (Slice):** `skeleton`
- **Description:** Bar chart placeholder with varying height columns
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `chart-bar`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-chart-line` — Skeleton line chart

- **Identifier:** `skeleton-chart-line`
- **Render Kind (Slice):** `skeleton`
- **Description:** Line chart placeholder with trend line and grid baseline
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `chart-line`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-chart-donut` — Skeleton donut chart

- **Identifier:** `skeleton-chart-donut`
- **Render Kind (Slice):** `skeleton`
- **Description:** Donut chart placeholder with masked radial ring and legend
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `chart-donut`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-data-table` — Skeleton data table

- **Identifier:** `skeleton-data-table`
- **Render Kind (Slice):** `skeleton`
- **Description:** Data table placeholder with header, alternating rows, and pagination
- **DOM & Technical Construction:** 6 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `data-grid`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-kanban` — Skeleton kanban board

- **Identifier:** `skeleton-kanban`
- **Render Kind (Slice):** `skeleton`
- **Description:** Three-column kanban board placeholder with cards
- **DOM & Technical Construction:** 6 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `kanban-board`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-timeline` — Skeleton timeline

- **Identifier:** `skeleton-timeline`
- **Render Kind (Slice):** `skeleton`
- **Description:** Vertical activity timeline placeholder with nodes and events
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `timeline-feed`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-calendar` — Skeleton calendar

- **Identifier:** `skeleton-calendar`
- **Render Kind (Slice):** `skeleton`
- **Description:** Seven-column calendar view placeholder with day cells
- **DOM & Technical Construction:** 7 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `calendar-grid`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-sidebar` — Skeleton sidebar

- **Identifier:** `skeleton-sidebar`
- **Render Kind (Slice):** `skeleton`
- **Description:** Sidebar navigation placeholder with logo, nav links and user footer
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-notification` — Skeleton notification

- **Identifier:** `skeleton-notification`
- **Render Kind (Slice):** `skeleton`
- **Description:** Notification card placeholder with status icon, header, and multi-line message
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `skeleton-command` — Skeleton command palette

- **Identifier:** `skeleton-command`
- **Render Kind (Slice):** `skeleton`
- **Description:** Command palette modal placeholder with search input and shortcut list rows
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-feed` — Skeleton feed post

- **Identifier:** `skeleton-feed`
- **Render Kind (Slice):** `skeleton`
- **Description:** Social feed post placeholder with avatar, author header, media box, and action bar
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-filter-panel` — Skeleton filter panel

- **Identifier:** `skeleton-filter-panel`
- **Render Kind (Slice):** `skeleton`
- **Description:** Faceted search filter panel placeholder with chips, checkbox groups, and range slider
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `skeleton-map` — Skeleton map view

- **Identifier:** `skeleton-map`
- **Render Kind (Slice):** `skeleton`
- **Description:** Geographic map view placeholder with pin markers, route path, and zoom controls
- **DOM & Technical Construction:** 4 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---


### Category: APPLICATION (17 shipped, 17 audited)

*Production UI patterns, modal overlays, action button spinners, and state-transition micro-interactions.*

#### `inline` — Inline loading

- **Identifier:** `inline`
- **Render Kind (Slice):** `pulse`
- **Description:** Inline application loading
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `api-loading`, `icon-button`, `static-reduced-motion`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `button` — Button loading

- **Identifier:** `button`
- **Render Kind (Slice):** `pulse`
- **Description:** Button loading state
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `form-submit`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `overlay` — Section overlay

- **Identifier:** `overlay`
- **Render Kind (Slice):** `overlay`
- **Description:** Section loading overlay
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `modal-loading`, `container-loading`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `fullscreen` — Full-screen overlay

- **Identifier:** `fullscreen`
- **Render Kind (Slice):** `overlay`
- **Description:** Full-screen loading overlay
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `speed`, `style`, `theme` |
| **Component-Specific** | `backgroundColor` |

---

#### `page-transition` — Page transition

- **Identifier:** `page-transition`
- **Render Kind (Slice):** `progress`
- **Description:** Page transition indicator
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `speed`, `style`, `theme` |
| **Component-Specific** | `max`, `value`, `valueText` |

---

#### `image-placeholder` — Image placeholder

- **Identifier:** `image-placeholder`
- **Render Kind (Slice):** `skeleton`
- **Description:** Image loading placeholder
- **DOM & Technical Construction:** Pseudo-element based (0 child parts; drawn via root element and ::before / ::after). Motion engine: GPU Compositor-only (transform / opacity).
- **Associated Pattern Presets:** `image-gallery`, `product-details`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `infinite-scroll` — Infinite scroll

- **Identifier:** `infinite-scroll`
- **Render Kind (Slice):** `dots`
- **Description:** Infinite-scroll indicator
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `background-operation` — Background operation

- **Identifier:** `background-operation`
- **Render Kind (Slice):** `pulse`
- **Description:** Background operation indicator
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `success-ring` — Success ring

- **Identifier:** `success-ring`
- **Render Kind (Slice):** `ring`
- **Description:** Stateful ring spinner that morphs into a checkmark on completion
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.
- **Associated Pattern Presets:** `action-success`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `secondaryColor`, `strokeWidth` |

---

#### `error-shake` — Error shake

- **Identifier:** `error-shake`
- **Render Kind (Slice):** `shape`
- **Description:** Stateful shape indicator that shakes horizontally on error
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.
- **Associated Pattern Presets:** `form-error`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `button-confirm` — Button confirm

- **Identifier:** `button-confirm`
- **Render Kind (Slice):** `pulse`
- **Description:** Stateful button loader that contracts into a confirmation tick
- **DOM & Technical Construction:** 3 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.
- **Associated Pattern Presets:** `submit-confirm`

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `toast-loading` — Toast loading

- **Identifier:** `toast-loading`
- **Render Kind (Slice):** `pulse`
- **Description:** Floating notification badge with spinner and message line
- **DOM & Technical Construction:** 2 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `strokeWidth` |

---

#### `drag-drop-pulse` — Drag and drop pulse

- **Identifier:** `drag-drop-pulse`
- **Render Kind (Slice):** `pulse`
- **Description:** Dropzone boundary with breathing dashed border and upload prompt
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | *None (relies entirely on shared geometric and temporal controls)* |

---

#### `page-skeleton` — Page skeleton

- **Identifier:** `page-skeleton`
- **Render Kind (Slice):** `skeleton`
- **Description:** Full viewport page skeleton with header navbar, sidebar navigation, and main canvas
- **DOM & Technical Construction:** 5 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `count` |

---

#### `offline-dot` — Offline status dot

- **Identifier:** `offline-dot`
- **Render Kind (Slice):** `pulse`
- **Description:** Network connectivity indicator transitioning between online, offline alert, and reconnecting wave
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor` |

---

#### `save-indicator` — Save indicator

- **Identifier:** `save-indicator`
- **Render Kind (Slice):** `ring`
- **Description:** Document save status transitioning from spinning sync to saved check or error
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: GPU Compositor-only (transform / opacity).
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `backgroundColor`, `secondaryColor`, `strokeWidth` |

---

#### `undo-progress` — Undo progress

- **Identifier:** `undo-progress`
- **Render Kind (Slice):** `progress`
- **Description:** Action toast bar that drains its time track and morphs to undone or dismissed state
- **DOM & Technical Construction:** 1 internal DOM child `.wavelo__part` element(s). Motion engine: Determinate progress fill via CSS Custom Property (--wavelo-progress).
- **Progress Semantics:** Determinate progress component with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
- **Micro-Interaction State:** State-aware component responding to `data-wavelo-state="idle|loading|success|error"`.

**Configuration Options:**

| Scope | Options Honoured |
|---|---|
| **Generic / Shared** | `className`, `color`, `data-testid`, `decorative`, `describedBy`, `direction`, `duration`, `height`, `inline`, `label`, `labelledBy`, `loading`, `paused`, `reducedMotion`, `size`, `speed`, `style`, `theme`, `width` |
| **Component-Specific** | `max`, `value`, `valueText` |

---


## 5. Master Loader Index & Capability Matrix (133 shipped)

> The index is the 155 designs as audited, in audit order. The 22 marked
> **(consolidated)** no longer ship: each was folded into a surviving design, and
> `docs/VISUAL_DEDUPLICATION_REPORT.md` names the target. `three-dots` and
> `equalizer` gained a working `count` so the dot-row and bar-row variants among
> them have a real replacement.

| # | Loader ID | Name | Category | Kind | Parts | Determinate? | Component-Specific Options |
|:---:|---|---|---|---|:---:|:---:|---|
| 1 | `circular` | Circular border | `spinner` | `ring` | 1 | No | backgroundColor, secondaryColor, strokeWidth |
| 2 | `ring` | Ring | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 3 | `dual-ring` | Dual ring | `spinner` | `rings` | 1 | No | backgroundColor, strokeWidth |
| 4 | `arc` **(consolidated)** | Rotating arc | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 5 | `multi-arc` | Multiple arcs | `spinner` | `rings` | 1 | No | backgroundColor, strokeWidth |
| 6 | `dotted-circle` | Dotted circle | `spinner` | `dots` | 8 | No | — |
| 7 | `segmented-ring` | Segmented ring | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 8 | `half-circle` **(consolidated)** | Half circle | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 9 | `ellipse` | Elliptical spinner | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 10 | `rotating-square` | Rotating square | `spinner` | `shape` | 1 | No | — |
| 11 | `rotating-diamond` **(consolidated)** | Rotating diamond | `spinner` | `shape` | 1 | No | — |
| 12 | `orbiting-dots` | Orbiting dots | `spinner` | `orbit` | 5 | No | — |
| 13 | `orbiting-circles` **(consolidated)** | Orbiting circles | `spinner` | `orbit` | 5 | No | strokeWidth |
| 14 | `comet-orbit` | Comet orbit | `spinner` | `orbit` | 1 | No | strokeWidth |
| 15 | `gradient-ring` | Gradient ring | `spinner` | `ring` | 1 | No | secondaryColor, strokeWidth |
| 16 | `conic-ring` **(consolidated)** | Conic ring | `spinner` | `ring` | 1 | No | strokeWidth |
| 17 | `neon-ring` | Neon ring | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 18 | `rubber-band` | Rubber band | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 19 | `snake` | Snake | `spinner` | `ring` | 5 | No | strokeWidth |
| 20 | `clock-spinner` | Clock spinner | `spinner` | `ring` | 1 | No | secondaryColor, strokeWidth |
| 21 | `thin-line` **(consolidated)** | Thin line | `spinner` | `ring` | 1 | No | backgroundColor |
| 22 | `thick-stroke` **(consolidated)** | Thick stroke | `spinner` | `ring` | 1 | No | backgroundColor, strokeWidth |
| 23 | `monochrome` | Monochrome | `spinner` | `ring` | 1 | No | — |
| 24 | `svg-star` | SVG star | `spinner` | `shape` | 1 | No | — |
| 25 | `three-dots` | Three dots | `dots` | `dots` | 3 | No | backgroundColor |
| 26 | `four-dots` **(consolidated)** | Four dots | `dots` | `dots` | 4 | No | backgroundColor |
| 27 | `five-dots` **(consolidated)** | Five dots | `dots` | `dots` | 5 | No | backgroundColor |
| 28 | `bouncing-dots` **(consolidated)** | Bouncing dots | `dots` | `dots` | 5 | No | backgroundColor |
| 29 | `pulsing-dots` | Pulsing dots | `dots` | `pulse` | 3 | No | backgroundColor |
| 30 | `fading-dots` | Fading dots | `dots` | `dots` | 5 | No | backgroundColor |
| 31 | `scaling-dots` **(consolidated)** | Scaling dots | `dots` | `pulse` | 3 | No | backgroundColor |
| 32 | `rotating-dots` | Rotating dots | `dots` | `orbit` | 5 | No | — |
| 33 | `dot-wave` | Dot wave | `dots` | `wave` | 5 | No | backgroundColor |
| 34 | `dot-matrix` | Dot matrix | `dots` | `dots` | 9 | No | — |
| 35 | `grid-pulse` | Grid pulse | `dots` | `pulse` | 4 | No | — |
| 36 | `alternating-dots` | Alternating dots | `dots` | `dots` | 5 | No | backgroundColor |
| 37 | `expanding-dot` | Expanding dot | `dots` | `pulse` | 1 | No | backgroundColor |
| 38 | `ripple-dot` | Ripple dot | `dots` | `rings` | 1 | No | backgroundColor, strokeWidth |
| 39 | `staggered-dots` | Staggered dots | `dots` | `dots` | 5 | No | backgroundColor |
| 40 | `vertical-dots` **(consolidated)** | Vertical bouncing dots | `dots` | `wave` | 5 | No | backgroundColor |
| 41 | `magnetic-dots` | Magnetic dots | `dots` | `dots` | 5 | No | backgroundColor |
| 42 | `pendulum` | Pendulum | `dots` | `dots` | 1 | No | backgroundColor, strokeWidth |
| 43 | `constellation` | Constellation | `dots` | `dots` | 7 | No | strokeWidth |
| 44 | `bubble-rise` | Bubble rise | `dots` | `dots` | 8 | No | backgroundColor |
| 45 | `fireflies` | Fireflies | `dots` | `orbit` | 10 | No | — |
| 46 | `solar-system` | Solar system | `dots` | `orbit` | 5 | No | secondaryColor |
| 47 | `equalizer` | Equalizer bars | `bars` | `bars` | 5 | No | backgroundColor |
| 48 | `bouncing-bars` **(consolidated)** | Bouncing bars | `bars` | `bars` | 5 | No | backgroundColor |
| 49 | `vertical-pulse-bars` **(consolidated)** | Vertical pulse bars | `bars` | `bars` | 5 | No | backgroundColor |
| 50 | `horizontal-pulse-bars` | Horizontal pulse bars | `bars` | `wave` | 5 | No | backgroundColor |
| 51 | `waveform` **(consolidated)** | Waveform | `bars` | `wave` | 5 | No | backgroundColor |
| 52 | `audio-waveform` **(consolidated)** | Audio waveform | `bars` | `bars` | 7 | No | backgroundColor |
| 53 | `fading-bars` | Fading bars | `bars` | `bars` | 5 | No | backgroundColor |
| 54 | `growing-bars` | Growing bars | `bars` | `bars` | 5 | No | backgroundColor |
| 55 | `alternating-bars` | Alternating bars | `bars` | `bars` | 5 | No | backgroundColor |
| 56 | `gradient-bars` **(consolidated)** | Gradient bars | `bars` | `bars` | 5 | No | backgroundColor, secondaryColor |
| 57 | `signal-bars` **(consolidated)** | Signal bars | `bars` | `bars` | 4 | No | backgroundColor |
| 58 | `piano-keys` | Piano keys | `bars` | `bars` | 5 | No | backgroundColor |
| 59 | `fire-rise` | Fire rise | `bars` | `bars` | 5 | No | backgroundColor |
| 60 | `spectrum` **(consolidated)** | Spectrum | `bars` | `bars` | 8 | No | backgroundColor |
| 61 | `heartbeat` | Heartbeat | `bars` | `wave` | 1 | No | — |
| 62 | `breathing` | Breathing | `bars` | `wave` | 1 | No | — |
| 63 | `segmented-bar` | Segmented bar | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 64 | `moving-stripe` | Moving stripe | `bars` | `wave` | 5 | No | — |
| 65 | `traveling-highlight` | Traveling highlight | `bars` | `wave` | 5 | No | — |
| 66 | `oscillating-line` | Oscillating line | `bars` | `wave` | 5 | No | strokeWidth |
| 67 | `multi-wave` | Multi-wave | `bars` | `wave` | 5 | No | backgroundColor |
| 68 | `ripple-circles` | Ripple circles | `creative` | `rings` | 3 | No | backgroundColor, strokeWidth |
| 69 | `expanding-circles` **(consolidated)** | Expanding circles | `creative` | `rings` | 3 | No | backgroundColor, strokeWidth |
| 70 | `morphing-shapes` | Morphing shapes | `creative` | `shape` | 1 | No | — |
| 71 | `infinity` | Infinity loop | `creative` | `rings` | 3 | No | strokeWidth |
| 72 | `helix` | DNA helix | `creative` | `wave` | 18 | No | strokeWidth |
| 73 | `cube` | Cube rotation | `creative` | `shape` | 1 | No | strokeWidth |
| 74 | `polygon` | Rotating polygon | `creative` | `shape` | 1 | No | — |
| 75 | `triangles` | Rotating triangles | `creative` | `shape` | 3 | No | — |
| 76 | `folding-squares` | Folding squares | `creative` | `shape` | 1 | No | — |
| 77 | `nested-squares` | Nested squares | `creative` | `rings` | 3 | No | backgroundColor, strokeWidth |
| 78 | `concentric-pulse` | Concentric pulse | `creative` | `rings` | 3 | No | backgroundColor, strokeWidth |
| 79 | `trip-orbit` | Triple arc orbit | `creative` | `dots` | 3 | No | backgroundColor, strokeWidth |
| 80 | `liquid-blob` | Liquid blob | `creative` | `shape` | 1 | No | — |
| 81 | `sand-timer` | Sand timer | `creative` | `shape` | 1 | No | — |
| 82 | `eye-blink` | Eye blink | `creative` | `shape` | 1 | No | — |
| 83 | `metronome` | Metronome | `creative` | `shape` | 1 | No | — |
| 84 | `spiral` | Spiral | `creative` | `ring` | 1 | No | strokeWidth |
| 85 | `radar` | Radar sweep | `creative` | `ring` | 1 | No | strokeWidth |
| 86 | `particle-orbit` | Particle orbit | `creative` | `orbit` | 5 | No | — |
| 87 | `typing-dots` | Typing dots | `ai` | `dots` | 3 | No | backgroundColor |
| 88 | `thinking-glow` | Thinking glow | `ai` | `pulse` | 1 | No | backgroundColor, strokeWidth |
| 89 | `stream-cursor` | Stream cursor | `ai` | `pulse` | 1 | No | backgroundColor |
| 90 | `token-stream` | Token stream | `ai` | `wave` | 5 | No | backgroundColor, strokeWidth |
| 91 | `ai-shimmer` | AI response shimmer | `ai` | `skeleton` | 0 | No | — |
| 92 | `neural-grid` | Neural grid | `ai` | `dots` | 9 | No | — |
| 93 | `skeleton-line` | Skeleton text line | `skeleton` | `skeleton` | 0 | No | count |
| 94 | `skeleton-card` | Skeleton card | `skeleton` | `skeleton` | 3 | No | count |
| 95 | `skeleton-avatar` | Skeleton avatar | `skeleton` | `skeleton` | 0 | No | — |
| 96 | `skeleton-table` | Skeleton table | `skeleton` | `skeleton` | 6 | No | count |
| 97 | `skeleton-inbox` | Skeleton inbox | `skeleton` | `skeleton` | 6 | No | count |
| 98 | `skeleton-chat` | Skeleton chat | `skeleton` | `skeleton` | 3 | No | count |
| 99 | `skeleton-code` | Skeleton code | `skeleton` | `skeleton` | 6 | No | count |
| 100 | `skeleton-metric` | Skeleton metric | `skeleton` | `skeleton` | 3 | No | count |
| 101 | `skeleton-dashboard` | Skeleton dashboard | `skeleton` | `skeleton` | 5 | No | count |
| 102 | `skeleton-product-card` | Skeleton product card | `skeleton` | `skeleton` | 4 | No | — |
| 103 | `skeleton-product-page` | Skeleton product page | `skeleton` | `skeleton` | 5 | No | count |
| 104 | `skeleton-cart` | Skeleton cart | `skeleton` | `skeleton` | 4 | No | — |
| 105 | `skeleton-review` | Skeleton review | `skeleton` | `skeleton` | 4 | No | — |
| 106 | `skeleton-chart-bar` | Skeleton bar chart | `skeleton` | `skeleton` | 5 | No | count |
| 107 | `skeleton-chart-line` | Skeleton line chart | `skeleton` | `skeleton` | 4 | No | — |
| 108 | `skeleton-chart-donut` | Skeleton donut chart | `skeleton` | `skeleton` | 3 | No | count |
| 109 | `skeleton-data-table` | Skeleton data table | `skeleton` | `skeleton` | 6 | No | count |
| 110 | `skeleton-kanban` | Skeleton kanban board | `skeleton` | `skeleton` | 6 | No | count |
| 111 | `skeleton-timeline` | Skeleton timeline | `skeleton` | `skeleton` | 4 | No | — |
| 112 | `skeleton-calendar` | Skeleton calendar | `skeleton` | `skeleton` | 7 | No | count |
| 113 | `skeleton-sidebar` | Skeleton sidebar | `skeleton` | `skeleton` | 5 | No | count |
| 114 | `skeleton-notification` | Skeleton notification | `skeleton` | `skeleton` | 4 | No | — |
| 115 | `skeleton-command` | Skeleton command palette | `skeleton` | `skeleton` | 5 | No | count |
| 116 | `skeleton-feed` | Skeleton feed post | `skeleton` | `skeleton` | 5 | No | count |
| 117 | `skeleton-filter-panel` | Skeleton filter panel | `skeleton` | `skeleton` | 5 | No | count |
| 118 | `skeleton-map` | Skeleton map view | `skeleton` | `skeleton` | 4 | No | — |
| 119 | `progress-bar` | Progress bar | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 120 | `progress-ring` | Progress ring | `progress` | `progress` | 1 | Yes | max, strokeWidth, value, valueText |
| 121 | `progress-steps` | Progress steps | `progress` | `progress` | 5 | Yes | count, max, value, valueText |
| 122 | `progress-top` | Top progress | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 123 | `progress-upload` | Upload progress | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 124 | `progress-scroll` | Scroll progress | `progress` | `scroll` | 1 | No | — |
| 125 | `progress-view` | In-view progress | `progress` | `scroll` | 1 | No | — |
| 126 | `progress-battery` | Battery level | `progress` | `progress` | 1 | Yes | max, strokeWidth, value, valueText |
| 127 | `progress-half-ring` | Half-ring gauge | `progress` | `progress` | 1 | Yes | max, strokeWidth, value, valueText |
| 128 | `progress-wave-fill` | Wave fill | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 129 | `progress-count` | Counting bar | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 130 | `progress-dots-fill` | Dots fill | `progress` | `progress` | 5 | Yes | count, max, value, valueText |
| 131 | `progress-label-inline` | Labelled bar | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 132 | `progress-gradient-ring` **(consolidated)** | Gradient progress ring | `progress` | `progress` | 1 | Yes | max, secondaryColor, strokeWidth, value, valueText |
| 133 | `progress-multi-step` | Numbered steps | `progress` | `progress` | 5 | Yes | count, max, strokeWidth, value, valueText |
| 134 | `progress-upload-multi` | Multi-file upload | `progress` | `progress` | 3 | Yes | count, max, strokeWidth, value, valueText |
| 135 | `progress-ai-generate` | Generating | `progress` | `wave` | 1 | No | secondaryColor |
| 136 | `progress-skill` | Skill bar | `progress` | `progress` | 1 | Yes | max, secondaryColor, value, valueText |
| 137 | `progress-timer` **(consolidated)** | Countdown | `progress` | `progress` | 1 | Yes | max, value, valueText |
| 138 | `progress-orbit-fill` | Orbit level | `progress` | `progress` | 6 | Yes | count, max, value, valueText |
| 139 | `inline` | Inline loading | `application` | `pulse` | 3 | No | backgroundColor |
| 140 | `button` | Button loading | `application` | `pulse` | 3 | No | backgroundColor |
| 141 | `overlay` | Section overlay | `application` | `overlay` | 1 | No | backgroundColor |
| 142 | `fullscreen` | Full-screen overlay | `application` | `overlay` | 1 | No | backgroundColor |
| 143 | `page-transition` | Page transition | `application` | `progress` | 1 | Yes | max, value, valueText |
| 144 | `image-placeholder` | Image placeholder | `application` | `skeleton` | 0 | No | — |
| 145 | `infinite-scroll` | Infinite scroll | `application` | `dots` | 5 | No | backgroundColor |
| 146 | `background-operation` | Background operation | `application` | `pulse` | 3 | No | backgroundColor |
| 147 | `success-ring` | Success ring | `application` | `ring` | 1 | No | backgroundColor, secondaryColor, strokeWidth |
| 148 | `error-shake` | Error shake | `application` | `shape` | 1 | No | — |
| 149 | `button-confirm` | Button confirm | `application` | `pulse` | 3 | No | — |
| 150 | `toast-loading` | Toast loading | `application` | `pulse` | 2 | No | strokeWidth |
| 151 | `drag-drop-pulse` | Drag and drop pulse | `application` | `pulse` | 1 | No | — |
| 152 | `page-skeleton` | Page skeleton | `application` | `skeleton` | 5 | No | count |
| 153 | `offline-dot` | Offline status dot | `application` | `pulse` | 1 | No | backgroundColor |
| 154 | `save-indicator` | Save indicator | `application` | `ring` | 1 | No | backgroundColor, secondaryColor, strokeWidth |
| 155 | `undo-progress` | Undo progress | `application` | `progress` | 1 | Yes | max, value, valueText |
