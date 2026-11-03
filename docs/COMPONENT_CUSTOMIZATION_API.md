# Wavelo — Component Customization API Specification

> **Scope:** Architectural audit and complete customization API reference for all **153 active loading designs** across **8 functional categories** in `@wavelo/core`.
> **Status:** Authoritative reference for developer customization, framework adapter props, and design system governance.
> **Version Alignment:** Wavelo 0.3.0 on branch `dev` (Post Phase 4 3D expansion; zero-layout compositor performance verified).

---

## 1. System Architecture & Configuration Hierarchy

Wavelo separates markup from stylesheets. The core engine (`renderLoader`) generates semantic HTML elements with `role`, `aria-*` attributes, and CSS custom property inline variables (`--wavelo-*`), while injecting deduplicated stylesheet slices into `<head>` keyed by FNV-1a content hashes.

To avoid a "one-size-fits-all" trap while maintaining extreme consistency, configurations are organized into a strict three-tier hierarchy:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CONFIGURATION ARCHITECTURE HIERARCHY                 │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 1: GLOBAL BASELINE SETTINGS (accepted by all 153)                 │
│ Universal structural, accessibility, lifecycle, and core tokens.       │
│ Every design accepts them; what each visibly reads is measured.        │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 2: SHARED GEOMETRIC & TEMPORAL SETTINGS (84% – 97% of designs)   │
│ Bounding box dimensions, cycle timing, direction, and play state.      │
│ Inherited by all non-viewport/non-static designs.                     │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 3: DESIGN-SPECIFIC & UNIQUE SETTINGS (Tailored per design)        │
│ Parameters exclusive to the visual and mechanical nature of a design:  │
│ stroke widths, fill levels, dual tones, track counts, and states.      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Common / Global Baseline Configurations (3a)

The following baseline parameters apply universally or across all standard loading components.

### Tier 1: Universal Structural & Accessibility Settings (165 / 165 Loaders)

| Property | TypeScript Type | Default Value | Target DOM / CSS | What it Controls |
|---|---|---|---|---|
| `type` | `LoaderId \| string` | `'inline'` | Registry resolution | Selects the loader design from the 165 active designs or 255 presets. |
| `color` | `string` | `'#6366f1'` (currentColor) | `--wavelo-color` | Primary foreground accent, stroke, or fill color. |
| `backgroundColor` | `string` | `'transparent'` | `--wavelo-background` | Outer container background fill, track surface, or modal scrim. |
| `theme` | `'light' \| 'dark' \| 'system'` | `'light'` | `data-wavelo-theme` | Page color palette: light shimmer, dark surface (`#374151`), or OS dark mode. |
| `loading` | `boolean` | `true` | DOM mounting | Lifecycle switch: when `false`, renders 0 DOM nodes and injects 0 CSS bytes. |
| `inline` | `boolean` | `false` | `.wavelo-inline` | Sits inline on text metrics (`inline-flex` / `inline-block`) instead of block. |
| `reducedMotion` | `'auto' \| 'always' \| 'never'` | `'auto'` | `data-wavelo-motion` | Motion accessibility: disables animation or respects OS `prefers-reduced-motion`. |
| `label` | `string` | `undefined` | `aria-label` | Accessible label for screen readers (`role="status"` or `role="progressbar"`). |
| `labelledBy` | `string` | `undefined` | `aria-labelledby` | Space-separated DOM IDs referencing visible text labelling this loader. |
| `describedBy` | `string` | `undefined` | `aria-describedby` | Space-separated DOM IDs referencing caption or descriptive elements. |
| `decorative` | `boolean` | `false` | `aria-hidden="true"` | Suppresses assistive announcements when adjacent text already communicates loading. |
| `className` | `string` | `''` | `class` | Additional custom CSS class names appended to the root element. |
| `data-testid` | `string` | `undefined` | `data-testid` | Automated QA / testing selector attribute. |
| `style` | `LoaderStyle` | `{}` | `style` attribute | Escape hatch for typed `--wavelo-*` tokens and standard CSS declarations. |

### Tier 2: Shared Geometric & Temporal Settings (Non-Viewport / Animating)

| Property | TypeScript Type | Default Value | Target DOM / CSS | What it Controls |
|---|---|---|---|---|
| `size` | `number \| string` | `40` (`2.5rem`) | `--wavelo-size` | Bounding box dimensions (width and height for square/circular components). |
| `width` | `number \| string` | `undefined` | `--wavelo-width` | Width override for rectangular loaders (bars, waveforms, skeletons). |
| `height` | `number \| string` | `undefined` | `--wavelo-height` | Height override for non-square loaders. |
| `duration` | `number \| string` | `'1s'` | `--wavelo-duration` | Full animation cycle duration (e.g. `'800ms'`, `'1.5s'`). |
| `speed` | `number` | `1` | `--wavelo-duration` | Cycle speed multiplier (`2` halves duration to double playback speed). |
| `direction` | `'normal' \| 'reverse'` | `'normal'` | `--wavelo-direction` | Animation playback direction (counter-rotation or inverted flow). |
| `paused` | `boolean \| string` | `false` | `--wavelo-play-state` | Freezes animation frames on demand without resetting state or unmounting. |

---

## 3. Design-Specific & Unique Settings Breakdown (3b)

The following sections detail every single design across all 8 functional categories. For each design, its unique mechanical nature, DOM structure, micro-styling parameters, and macro-behavioral options are formally specified.

---

### Category A: Classic Spinners (17 Designs)

Circular, ring, radial, and orbital rotating loaders operating on continuous angular momentum.

#### 1. `circular` — Circular Border Spinner
- **DOM Structure:** `<span class="wavelo wavelo--ring wavelo--circular"><span class="wavelo__part"></span></span>` (Uses `::before` for sweeping accent arc).
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Thickness of the outer guide ring and sweeping accent arc.
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of the sweeping accent arc rotating along `::before`.
  - `color` (`string`, default `'#6366f1'`): Color of the base closed circular guide border.

#### 2. `ring` — Canonical Ring Spinner
- **DOM Structure:** Single open circular border rotating continuously.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Ring border thickness (from 1px hairline to 8px bold).
  - `color` (`string`, default `'#6366f1'`): Stroke color of the spinning ring.

#### 3. `dual-ring` — Nested Dual Ring
- **DOM Structure:** Two concentric counter-rotating ring arcs (`::before` outer arc at inset 10%, `::after` inner arc at inset 28%).
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Stroke thickness of both outer and inner rings.
  - `secondaryColor` (`string`, default `'currentColor'` at opacity 0.65): Color of the inner counter-rotating ring.
  - `color` (`string`, default `'#6366f1'`): Color of the outer rotating ring.

#### 4. `multi-arc` — Triple Layered Arcs
- **DOM Structure:** Three layered arc segments rotating in alternating clockwise/counter-clockwise directions.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Border weight of the concentric arcs.
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of the intermediate counter-phase arc.
  - `color` (`string`, default `'#6366f1'`): Primary color of outer and inner arcs.

#### 5. `dotted-circle` — Circular Dotted Spinner
- **DOM Structure:** 8 circular dots positioned radially around a central hub.
- **Unique & Design-Specific Options:**
  - `size` (`number | string`, default `40`): Diameter of the radial dot constellation.

#### 6. `segmented-ring` — Dashed Ring
- **DOM Structure:** Dashed circular border spinning on central axis.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Dash stroke thickness.
  - `color` (`string`, default `'#6366f1'`): Color of dash segments.

#### 7. `ellipse` — 3D Foreshortened Hoop
- **DOM Structure:** Closed hoop rotating on tilted 3D axis with dynamic perspective foreshortening.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Hoop wire thickness.
  - `width` / `height` (`number | string`, default `40` / `20`): Aspect ratio defining 3D viewing angle tilt.

#### 8. `rotating-square` — Morphing Square
- **DOM Structure:** Solid geometric shape rotating with periodic corner radius adjustments.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 9. `orbiting-dots` — Orbital Dot System
- **DOM Structure:** Central anchor dot surrounded by two orbiting satellite nodes.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'currentColor'`): Color of the stationary central hub dot.
  - `color` (`string`, default `'#6366f1'`): Color of the orbiting satellite dots.

#### 10. `comet-orbit` — Comet with Radiant Tail
- **DOM Structure:** Rotating node anchored to a fading conic-gradient tail.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Radiant head color.

#### 11. `gradient-ring` — Radial Masked Gradient Sweep
- **DOM Structure:** Conic gradient sweep carved into a ring by a radial CSS mask.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Width of the radial ring mask opening.
  - `secondaryColor` (`string`, default `'transparent'`): Fading tail color of the conic gradient.
  - `color` (`string`, default `'#6366f1'`): Leading edge highlight color.

#### 12. `neon-ring` — Luminous Halo Ring
- **DOM Structure:** Turning ring combined with breathing radial box-shadow glow.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Core ring stroke.

#### 13. `rubber-band` — Elastic Snapping Loop
- **DOM Structure:** Closed elastic hoop stretched tall and snapping back past equilibrium with damped harmonic overshoots.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Elastic band line weight.
  - `color` (`string`, default `'#6366f1'`): Band stroke color.

#### 14. `snake` — Walled Room Perimeter Chaser
- **DOM Structure:** Walled room boundary containing 5 body parts chasing head along the perimeter.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Thickness of the outer perimeter boundary wall.
  - `--wavelo-radius` (`number | string`, default `6`): Corner radius of the perimeter room. (a custom property on the loader, not a configuration key).
  - `color` (`string`, default `'#6366f1'`): Color of the snake body and eyes.

#### 15. `clock-spinner` — Geared Chronometer
- **DOM Structure:** Dial face with 4 hour quadrant markers and hour/minute hands geared at 12:1.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of the slower hour hand and outer dial ring.
  - `color` (`string`, default `'#6366f1'`): Color of the sweeping minute hand and quadrant tick marks.
  - `strokeWidth` (`number`, default `2`): Hand and dial line weight.

#### 16. `monochrome` — Dual-Hemisphere Disc
- **DOM Structure:** Half-filled circular disc rotating on center.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Solid hemisphere color.

#### 17. `svg-star` — Geometric Vector Star
- **DOM Structure:** Clean vector `<svg>` path executing continuous axial rotation.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Vector star fill color.

---

### Category B: Dots & Particles (17 Designs)

Sequential, pulsed, wave, and physically simulated particle clusters.

#### 18. `three-dots` — Sequential Dot Sequence
- **DOM Structure:** Row of circular dots dividing container width and phase by count.
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `3`): Number of dots in the row (e.g. 3, 4, 5). Automatically recalculates width and phase stagger.
  - `--wavelo-gap` (`number | string`, default `0.35rem`): Horizontal spacing between adjacent dots. (a custom property on the loader, not a configuration key).

#### 19. `pulsing-dots` — Sequential Pulse
- **DOM Structure:** 3 stationary dots scaling in brightness and diameter in sequence.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 20. `fading-dots` — Sequential Fading
- **DOM Structure:** Dots fading opacity sequentially along the row.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.35rem`): Dot spacing. (a custom property on the loader, not a configuration key).

#### 21. `rotating-dots` — Centered Dot Ring
- **DOM Structure:** 4 dots orbiting on a shared circular track.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 22. `dot-wave` — Harmonic Sine Wave Dots
- **DOM Structure:** 5 circular dots undulating along a mathematical sine wave curve.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.35rem`): Horizontal distance between wave peaks. (a custom property on the loader, not a configuration key).

#### 23. `dot-matrix` — 3x3 Pulsing Matrix
- **DOM Structure:** 9 dots in a 3-by-3 grid pulsing along diagonal wavefronts.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.25rem`): Grid gap between rows and columns. (a custom property on the loader, not a configuration key).

#### 24. `grid-pulse` — 2x2 Grid Pulse
- **DOM Structure:** 4 dots in a 2-by-2 arrangement pulsing sequentially.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.3rem`): Grid spacing. (a custom property on the loader, not a configuration key).

#### 25. `alternating-dots` — Counter-Phase Dot Groups
- **DOM Structure:** Two sets of dots jumping in alternating counter-phase.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of the second alternating dot group.

#### 26. `expanding-dot` — Breathing Radial Dot
- **DOM Structure:** Single center dot expanding and contracting with smooth cubic ease.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 27. `ripple-dot` — Core Dot with Radiating Waves
- **DOM Structure:** Solid center dot emitting expanding circular ripple shockwaves.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `2`): Line weight of expanding ripple rings.

#### 28. `staggered-dots` — Staggered Timing Dot Row
- **DOM Structure:** Row of dots lifting with asymmetric phase offsets.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.35rem`): Dot spacing. (a custom property on the loader, not a configuration key).

#### 29. `magnetic-dots` — Centripetal Pull & Release
- **DOM Structure:** 5 dots drawn toward center by magnetic attraction and released outward.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 30. `pendulum` — Harmonic Bob & Rod
- **DOM Structure:** Top pivot mount pin (`::before`), suspension rod (`.wavelo__part`), and swinging circular bob (`::after`).
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Suspension rod and top mount pin tone.
  - `color` (`string`, default `'#6366f1'`): Swinging pendulum bob color.
  - `strokeWidth` (`number`, default `2`): Suspension rod thickness.

#### 31. `constellation` — Astronomical Star Patterns
- **DOM Structure:** Star nodes with polygon connecting lines forming authentic constellations.
- **Unique & Design-Specific Options:**
  - `data-wavelo-constellation` (`'ursa-major' | 'orion' | 'cassiopeia' | 'cygnus' | 'ursa-minor'`, default `'ursa-major'`): Selects celestial geometry.
  - `secondaryColor` (`string`, default `'rgba(99, 102, 241, 0.35)'`): Color of connecting constellation polygon lines.
  - `strokeWidth` (`number`, default `1.5`): Line weight of connecting star links.
  - `color` (`string`, default `'#6366f1'`): Star node color.

#### 32. `bubble-rise` — Buoyant Rising Bubbles
- **DOM Structure:** 8 buoyant bubbles with natural varied diameters rising and floating upward.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'rgba(255, 255, 255, 0.65)'`): Surface glare/highlight reflection on bubbles.
  - `color` (`string`, default `'#6366f1'`): Bubble body color.

#### 33. `fireflies` — Bioluminescent Drifting Swarm
- **DOM Structure:** 10 glowing firefly motes drifting on independent chaotic paths with warm pulses.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#f59e0b'`): Firefly glowing core.

#### 34. `solar-system` — Heliocentric Planetary Orbit
- **DOM Structure:** Radiant Sun with corona glow, faint concentric orbital tracks, and 5 distinct planets (including tilted Saturn ring).
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'rgba(99, 102, 241, 0.3)'`): Color of concentric orbital guide tracks and terrestrial planets.
  - `color` (`string`, default `'#f59e0b'`): Color of central Sun, solar corona, and Saturn ring.

---

### Category C: Bars & Waveforms (13 Designs)

Acoustic, biometric, and rhythmic linear energy meters using 100% compositor-pure `scaleY` transforms.

#### 35. `equalizer` — Audio Equalizer Bars
- **DOM Structure:** Row of vertical audio bars undulating across uneven frequency bands.
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `5`): Number of frequency bars in the row.
  - `--wavelo-gap` (`number | string`, default `0.25rem`): Space between adjacent equalizer bars. (a custom property on the loader, not a configuration key).
  - `--wavelo-radius` (`number | string`, default `3`): Top and bottom corner curvature of bars. (a custom property on the loader, not a configuration key).
  - `secondaryColor` (`string`, default `'currentColor'`): Alternating bar color.

#### 36. `horizontal-pulse-bars` — Lateral Pulse Bars
- **DOM Structure:** 3 horizontal bars pulsing along horizontal axis.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.3rem`): Vertical spacing between bars. (a custom property on the loader, not a configuration key).
  - `--wavelo-radius` (`number | string`, default `2`): Corner radius of bars. (a custom property on the loader, not a configuration key).

#### 37. `fading-bars` — Sequential Fading Bars
- **DOM Structure:** Vertical bar column fading opacity in continuous wave.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.25rem`): Bar spacing. (a custom property on the loader, not a configuration key).

#### 38. `growing-bars` — Harmonic Scaling Bars
- **DOM Structure:** Bars scaling vertically with compositor-pure `transform: scaleY()`.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.25rem`): Bar spacing. (a custom property on the loader, not a configuration key).
  - `--wavelo-radius` (`number | string`, default `2`): Bar corner radius. (a custom property on the loader, not a configuration key).

#### 39. `alternating-bars` — Jumping Counter-Bars
- **DOM Structure:** Adjacent bars oscillating in counter-phase motion.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of alternating bar group.

#### 40. `piano-keys` — Sequential Key Press Wave
- **DOM Structure:** Bars landing one after another at uneven rhythmic intervals.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.2rem`): Key separation. (a custom property on the loader, not a configuration key).

#### 41. `fire-rise` — Flame Ember Bars
- **DOM Structure:** Bars rising, stretching, and burning out at the apex.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#ef4444'`): Base fire bar color.

#### 42. `heartbeat` — Clinical ECG Waveform Monitor
- **DOM Structure:** Medical ECG monitor with authentic clinical P-Q-R-S-T cardiac waveform sweeping across a CRT grid background.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#22c55e'`): Color of the sweeping cardiac trace line.
  - `secondaryColor` (`string`, default `'rgba(34, 197, 94, 0.15)'`): Color of the background medical monitor grid lines.
  - `backgroundColor` (`string`, default `'#0b1020'`): Dark CRT monitor screen background.
  - `width` (`number | string`, default `'6.5rem'`): Monitor sweep width.

#### 43. `breathing` — Elastic Breathing Bar
- **DOM Structure:** Single bar widening and narrowing horizontally on a slow respiratory cycle.
- **Unique & Design-Specific Options:**
  - `--wavelo-radius` (`number | string`, default `4`): Corner radius. (a custom property on the loader, not a configuration key).
  - `height` (`number | string`, default `8`): Bar thickness.

#### 44. `moving-stripe` — Traveling Bar Highlight
- **DOM Structure:** High-velocity stripe sliding across a track.
- **Unique & Design-Specific Options:**
  - `--wavelo-radius` (`number | string`, default `4`): Track corner radius. (a custom property on the loader, not a configuration key).

#### 45. `traveling-highlight` — Luminous Highlight Sweep
- **DOM Structure:** Soft luminous gradient highlight sweeping across a base bar.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'rgba(255, 255, 255, 0.7)'`): Color of the sweeping highlight sheen.

#### 46. `oscillating-line` — Sine Waveform Line
- **DOM Structure:** Continuous harmonic oscillating line.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `2`): Waveform line thickness.

#### 47. `multi-wave` — Dual Fluid Wave Layers
- **DOM Structure:** Layered fluid waves running in counter-phase.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

---

### Category D: Progress Indicators (19 Designs)

Determinate and indeterminate progress indicators exposing ARIA progressbar semantics.

#### 48. `segmented-bar` — Segmented Track Bar
- **DOM Structure:** Discrete block units that fill in proportion to `value`.
- **Unique & Design-Specific Options:**
  - `value` (`number`, required for determinate): Current progress value.
  - `max` (`number`, default `100`): Maximum scale ceiling.
  - `secondaryColor` (`string`, default `'rgba(99, 102, 241, 0.2)'`): Unfilled segment track color.
  - `--wavelo-gap` (`number | string`, default `0.25rem`): Space between segment blocks. (a custom property on the loader, not a configuration key).

#### 49. `progress-bar` — Standard Linear Progress Bar
- **DOM Structure:** Horizontal track with smoothly transitioning progress fill.
- **Unique & Design-Specific Options:**
  - `value` (`number`, default `35`): Current percentage or absolute value.
  - `max` (`number`, default `100`): Progress ceiling.
  - `secondaryColor` (`string`, default `'#e5e7eb'`): Background track groove color.
  - `--wavelo-radius` (`number | string`, default `4`): Track and fill corner radius. (a custom property on the loader, not a configuration key).
  - `height` (`number | string`, default `8`): Bar height.

#### 50. `progress-ring` — Circular Progress Ring
- **DOM Structure:** Circular gauge filling radial progress arc via conic mask / stroke.
- **Unique & Design-Specific Options:**
  - `value` (`number`, default `35`): Progress value.
  - `max` (`number`, default `100`): Scale ceiling.
  - `strokeWidth` (`number`, default `4`): Ring gauge stroke thickness.
  - `secondaryColor` (`string`, default `'#e5e7eb'`): Background ring track color.

#### 51. `progress-steps` — Multi-Stage Step Progress
- **DOM Structure:** Discrete milestone steps filling whole units (supports `count`).
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `5`): Total number of milestone steps.
  - `value` (`number`, default `2`): Current active milestone step.
  - `secondaryColor` (`string`, default `'#e5e7eb'`): Upcoming step node color.
  - `color` (`string`, default `'#6366f1'`): Completed and active step node color.

#### 52. `progress-top` — Viewport Top Route Bar
- **DOM Structure:** Full viewport-width line fixed to the top of the browser page.
- **Unique & Design-Specific Options:**
  - `value` (`number`): Route load completion value.
  - `height` (`number | string`, default `3`): Hairline bar thickness.

#### 53. `progress-upload` — Upload File Bar
- **DOM Structure:** File upload bar with animated angled barber-pole stripes.
- **Unique & Design-Specific Options:**
  - `value` (`number`): Upload progress value.
  - `secondaryColor` (`string`, default `'#e5e7eb'`): Track background.
  - `color` (`string`, default `'#6366f1'`): Animated upload fill stripe.

#### 54. `progress-scroll` — Document Reading Position
- **DOM Structure:** Zero-JS document reading indicator bound to CSS `ScrollTimeline`.
- **Unique & Design-Specific Options:**
  - `height` (`number | string`, default `3`): Bar thickness.
  - `color` (`string`, default `'#6366f1'`): Reading fill color.

#### 55. `progress-view` — Viewport Element Travel
- **DOM Structure:** Reading indicator bound to element viewport intersection (`ViewTimeline`).
- **Unique & Design-Specific Options:**
  - `height` (`number | string`, default `3`): Bar thickness.

#### 56. `progress-battery` — Battery Level Indicator
- **DOM Structure:** Battery shell, anode terminal, and internal fluid level fill.
- **Unique & Design-Specific Options:**
  - `value` (`number`, default `65`): Battery charge percentage.
  - `secondaryColor` (`string`, default `'#94a3b8'`): Outer battery frame and terminal cap tone.
  - `color` (`string`, default `'#22c55e'`): Battery charge fluid level color.
  - `strokeWidth` (`number`, default `2`): Battery chassis border weight.

#### 57. `progress-half-ring` — Semicircular Speedometer Gauge
- **DOM Structure:** 180-degree semicircular meter arc with graduated readout.
- **Unique & Design-Specific Options:**
  - `value` (`number`): Meter reading.
  - `strokeWidth` (`number`, default `4`): Gauge needle/arc thickness.
  - `secondaryColor` (`string`, default `'#e5e7eb'`): Inactive speedometer arc tone.

#### 58. `progress-wave-fill` — Liquid Container Fill
- **DOM Structure:** Container with undulating liquid wave crest rising with value.
- **Unique & Design-Specific Options:**
  - `value` (`number`): Fill height percentage.
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Wave crest foam highlight.
  - `--wavelo-radius` (`number | string`, default `8`): Container corner radius. (a custom property on the loader, not a configuration key).

#### 59. `progress-count` — Bar with Animated Integer Readout
- **DOM Structure:** Bar with transitioning numerical percentage counter (`--wavelo-count`).
- **Unique & Design-Specific Options:**
  - `value` (`number`): Determinate percentage.
  - `valueText` (`string`): Optional custom caption string.
  - `secondaryColor` (`string`, default `'#64748b'`): Counter numeral text color.

#### 60. `progress-dots-fill` — Sequential Dot Queue Fill
- **DOM Structure:** Row of discrete dots filling one by one (supports `count`).
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `5`): Total number of queue dots.
  - `value` (`number`): Current completed dots.
  - `secondaryColor` (`string`, default `'#e2e8f0'`): Unfilled queue dot color.

#### 61. `progress-label-inline` — Bar with Inline Text Description
- **DOM Structure:** Linear progress bar with embedded descriptive text.
- **Unique & Design-Specific Options:**
  - `valueText` (`string`): Printed text description.
  - `value` (`number`): Progress value.

#### 62. `progress-multi-step` — Multi-Stage Checkout Steps
- **DOM Structure:** Step nodes joined by connecting track bars.
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `4`): Total checkout stages.
  - `value` (`number`, default `2`): Active stage index.
  - `secondaryColor` (`string`, default `'#cbd5e1'`): Future stage node and track tone.

#### 63. `progress-upload-multi` — Multi-File Upload Queue
- **DOM Structure:** Stacks multiple file upload tracks, dividing value across items (supports `count`).
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `3`): Number of files in the batch queue.
  - `value` (`number`): Aggregate upload percentage.
  - `--wavelo-gap` (`number | string`, default `0.35rem`): Vertical spacing between file tracks. (a custom property on the loader, not a configuration key).

#### 64. `progress-ai-generate` — Generative Model Creation Meter
- **DOM Structure:** Gradient generation bar with leading radiant particle beam.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#c084fc'`): Radiant lead particle glow color.
  - `color` (`string`, default `'#6366f1'`): Base generation track gradient.

#### 65. `progress-skill` — Competency Meter Bar
- **DOM Structure:** Compact skill meter with rating indicator.
- **Unique & Design-Specific Options:**
  - `value` (`number`): Skill score.
  - `secondaryColor` (`string`, default `'#e2e8f0'`): Empty track color.

#### 66. `progress-orbit-fill` — Orbital Ring Station Fill
- **DOM Structure:** Circular ring holding radial station nodes that illuminate in sequence (supports `count`).
- **Unique & Design-Specific Options:**
  - `count` (`number`, default `6`): Number of orbital station nodes.
  - `value` (`number`): Number of energized nodes.

---

### Category E: Skeletons (26 Designs)

Placeholder content layouts for UI components, data visualization, and full viewports.

#### Universal Skeleton Customization Parameters (All 26 Skeletons)
- `theme` (`'light' | 'dark' | 'system'`, default `'light'`): Controls shimmer surface palette.
- `backgroundColor` (`string`, default `var(--wavelo-skeleton-base)`): Base placeholder block tone.
- `color` (`string`, default `var(--wavelo-skeleton-highlight)`): Highlight shimmer sweep tone.
- `radius` (`number | string`, default `4`–`8`): Corner roundness of skeleton cards and pills.
- `count` (`number`): Repeats composite rows, lines, or data entries.

#### Individual Skeleton Layouts

| Design ID | Layout Type | Default Parts / Tracks | Tailored Options & Behavior |
|---|---|---|---|
| 67. `skeleton-line` | Typography line | 1 track (stacks with `count`) | `count` turns line into a paragraph block with short last line. |
| 68. `skeleton-card` | Container card | 3 tracks | Header pill, body block, action footer. |
| 69. `skeleton-avatar` | User profile avatar | 1 circular disc | Rounded circular avatar (`border-radius: 50%`). |
| 70. `skeleton-table` | Data table rows | 6 tracks | Alternating zebra rows with simulated column cells. |
| 71. `skeleton-inbox` | Email inbox list | 6 tracks (3 rows of 2) | Avatar disc paired with subject line preview. |
| 72. `skeleton-chat` | Messaging thread | 3 speech bubbles | Alternating left/right speech bubbles; newest lifts smoothly. |
| 73. `skeleton-code` | Code block | 6 tracks | Numbered gutter margin beside code lines with short trailing lines. |
| 74. `skeleton-metric` | Dashboard KPI card | 3 tracks | Large bold metric number, caption label, trend pill chip. |
| 75. `skeleton-dashboard` | Analytics screen | 5 panels | Top metric row, bar chart placeholder, recent activity feed. |
| 76. `skeleton-product-card` | E-commerce card | 4 tracks | Square image canvas, product title, price tag, add-to-cart button. |
| 77. `skeleton-product-page` | Full product view | 5 tracks | Large media gallery, product options, pricing block, reviews. |
| 78. `skeleton-cart` | Shopping cart drawer | 4 tracks | Item thumbnail, quantity selector, subtotal, checkout button. |
| 79. `skeleton-review` | User review card | 4 tracks | Star rating row, author handle, verified badge, review body. |
| 80. `skeleton-chart-bar` | Bar chart graphic | 5 bars | Staggered vertical bar columns with baseline axis. |
| 81. `skeleton-chart-line` | Line chart graphic | 4 segments | Undulating trend line with faint grid lines. |
| 82. `skeleton-chart-donut` | Donut chart graphic | 3 elements | Masked radial ring paired with legend indicator bars. |
| 83. `skeleton-data-table` | Enterprise grid | 6 tracks | Table header with sort arrows, data rows, pagination bar. |
| 84. `skeleton-kanban` | Task board column | 6 task cards | Column header with task count pill, stacked draggable cards. |
| 85. `skeleton-timeline` | Activity log feed | 4 entries | Vertical connecting line, milestone node dots, timestamped entries. |
| 86. `skeleton-calendar` | Calendar agenda | 7 day columns | Weekday header cells, date boxes with simulated event pills. |
| 87. `skeleton-sidebar` | Navigation drawer | 5 nav items | Brand logo block, navigation links, user footer block. |
| 88. `skeleton-notification` | Alert / push toast | 4 tracks | Status icon badge, headline, multi-line message, dismiss button. |
| 89. `skeleton-command` | Spotlight / palette | 5 tracks | Search input pill, keyboard shortcut chips, result list rows. |
| 90. `skeleton-feed` | Social media feed | 5 tracks | Avatar, user handle, text block, media container, reaction row. |
| 91. `skeleton-filter-panel` | Filter sidebar | 5 tracks | Section headers, tag chips, checkboxes, range slider track. |
| 92. `skeleton-map` | Map / GIS view | 4 tracks | Terrain canvas, pin markers, zoom control cluster. |

---

### Category F: Creative & Geometric (18 Designs)

Mathematical curves, physics simulations, 3D illusions, and complex organic motions.

#### 93. `ripple-circles` — Expanding Radial Ripples
- **DOM Structure:** 3 concentric circles expanding and fading outward.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Ripple border thickness.
  - `secondaryColor` (`string`, default `'rgba(99, 102, 241, 0.4)'`): Fading outer ripple ring color.

#### 94. `morphing-shapes` — Shape-Shifting Polygon
- **DOM Structure:** Morphing shape transitioning between square, circle, diamond, and triangle.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Shape fill tone.

#### 95. `infinity` — Lemniscate Figure-Eight
- **DOM Structure:** Isometric 3D interwoven ribbon loop with depth shading, ambient occlusion underlayer, and traveling energy photons.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'rgba(99, 102, 241, 0.28)'`): Ribbon underlayer and depth shadow tone.
  - `color` (`string`, default `'#6366f1'`): Color of the traveling energy photons and specular highlights.

#### 96. `helix` — Double DNA Helix
- **DOM Structure:** 18 parts across 6 rows representing near nodes, far nodes, and connecting base pairs that close as strands cross.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of far strand nodes and connecting base pairs.
  - `color` (`string`, default `'#6366f1'`): Color of dominant foreground strand.
  - `strokeWidth` (`number`, default `2`): Thickness of connecting base pair rungs.

#### 97. `cube` — 3D Isometric Cube
- **DOM Structure:** Isometric cube rotating with distinct facial illumination.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#818cf8'`): Shaded side face tone.
  - `color` (`string`, default `'#6366f1'`): Top illuminated face tone.
  - `strokeWidth` (`number`, default `1.5`): Cube vertex edge line weight.

#### 98. `polygon` — Rotating Hexagonal Polygon
- **DOM Structure:** Multi-faceted polygon executing axial rotation.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 99. `triangles` — Interlocking Triangle Spin
- **DOM Structure:** 3 intersecting triangles rotating around center.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 100. `folding-squares` — Origami Folding Squares
- **DOM Structure:** 4 squares folding inward in 3D perspective sequence.
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 101. `nested-squares` — Nested Counter-Rotating Squares
- **DOM Structure:** 3 concentric squares rotating at staggered angles (0°, 45°, 22°).
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Color of inner nested squares.
  - `strokeWidth` (`number`, default `3`): Square border thickness.

#### 102. `concentric-pulse` — Pulsing Target Circles
- **DOM Structure:** 2 nested circular borders pulsing with staggered timing.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Ring border thickness.
  - `secondaryColor` (`string`, default `'#a5b4fc'`): Inner circle tone.

#### 103. `trip-orbit` — Triple Arc Orbit
- **DOM Structure:** Three arcs spaced 120° apart, sweeping and shrinking in synchrony.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Arc thickness.

#### 104. `liquid-blob` — Organic Morphing Amoeba
- **DOM Structure:** Fluid shape continuously mutating border radii along 8 coordinate axes.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Liquid fill color.

#### 105. `sand-timer` — Hourglass Sand Physics
- **DOM Structure:** Upper glass chamber draining sand motes into lower glass, then flipping 180°.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'rgba(99, 102, 241, 0.3)'`): Glass chamber outline and neck frame.
  - `color` (`string`, default `'#f59e0b'`): Falling sand grain particles and sand pile fill.

#### 106. `eye-blink` — Biomorphic Glance & Blink
- **DOM Structure:** Almond eye aperture glancing left/right with animated eyelid closing over pupil.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#1e293b'`): Pupil, iris, and eye contour stroke.

#### 107. `metronome` — Harmonic Tempo Arm
- **DOM Structure:** Arm swinging harmonically about bottom foot anchor pin with sliding weight bob.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Swinging metallic arm and sliding tempo bob.

#### 108. `spiral` — Archimedean Rotary Spiral
- **DOM Structure:** Multi-turn spiral sweep.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `3`): Spiral line weight.

#### 109. `radar` — Phosphor Radar Sweep
- **DOM Structure:** 360-degree radar beam sweep leaving a phosphorescent fading trail.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number`, default `2`): Perimeter range ring and quadrant crosshairs stroke.
  - `color` (`string`, default `'#22c55e'`): Leading sweep beam and outer boundary.

#### 110. `particle-orbit` — Swarm Gravitational Core
- **DOM Structure:** Particle swarm orbiting a gravitational nucleus.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Orbiting particle motes.

---

### Category G: AI & Streaming Loaders (6 Designs)

Generative AI response, thinking, streaming token, and inference states.

#### 111. `typing-dots` — Assistant Chat Typing
- **DOM Structure:** 3 dots lifting sequentially with smooth damping while assistant generates a reply.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.3rem`): Distance between typing dots. (a custom property on the loader, not a configuration key).
  - `color` (`string`, default `'#6366f1'`): Typing dot color.

#### 112. `thinking-glow` — Model Contemplation Orb
- **DOM Structure:** Central orb breathing gently inside an expanding radiant halo.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`, default `'rgba(147, 51, 234, 0.4)'`): Color of the expanding thought halo.
  - `color` (`string`, default `'#8b5cf6'`): Color of the central thinking nucleus.

#### 113. `stream-cursor` — Real-Time Stream Token Cursor
- **DOM Structure:** Vertical block cursor blinking at the terminal edge of streaming text.
- **Unique & Design-Specific Options:**
  - `width` (`number | string`, default `8`): Cursor block width.
  - `height` (`number | string`, default `18`): Cursor line height.
  - `--wavelo-radius` (`number | string`, default `2`): Cursor corner curvature. (a custom property on the loader, not a configuration key).
  - `color` (`string`, default `'currentColor'`): Cursor block color.

#### 114. `token-stream` — Incoming Token Dash Stream
- **DOM Structure:** Short token dashes materializing at left and flowing rightward as tokens arrive.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.35rem`): Space between consecutive token dashes. (a custom property on the loader, not a configuration key).
  - `secondaryColor` (`string`, default `'#c084fc'`): Trailing token color.
  - `color` (`string`, default `'#6366f1'`): Leading arriving token dash color.

#### 115. `ai-shimmer` — Tall Response Card Shimmer
- **DOM Structure:** Tall rounded response panel swept by one bright radiant highlight beam.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `var(--wavelo-skeleton-highlight)`): Highlight beam color.
  - `--wavelo-radius` (`number | string`, default `10`): Panel corner curvature. (a custom property on the loader, not a configuration key).

#### 116. `neural-grid` — Synaptic Grid Execution
- **DOM Structure:** 3x3 node matrix pulsing along a diagonal axis simulating deep neural network inference.
- **Unique & Design-Specific Options:**
  - `--wavelo-gap` (`number | string`, default `0.3rem`): Node grid spacing. (a custom property on the loader, not a configuration key).
  - `color` (`string`, default `'#8b5cf6'`): Firing synaptic node tone.

---

### Category H: Application Patterns & Micro-Interactions (17 Designs)

Contextual viewports, modals, and reactive state machines.

#### 117. `inline` — Text Flow Spinner
- **DOM Structure:** Minimal compact spinner aligned with font metrics (`vertical-align: middle`).
- **Unique & Design-Specific Options:**
  - None beyond the shared surface: what this design honours is the baseline configuration, and `npm run audit:customization` measures it per design.

#### 118. `button` — Button Submit Spinner
- **DOM Structure:** Spinner designed to nest directly inside `<button>` elements.
- **Unique & Design-Specific Options:**
  - `size` (`number | string`, default `18`): Proportional button height.

#### 119. `overlay` — Modal Backdrop Scrim
- **DOM Structure:** Semi-transparent backdrop surface with centered loading indicator.
- **Unique & Design-Specific Options:**
  - `backgroundColor` (`string`, default `'rgba(15, 23, 42, 0.45)'`): Scrim background tone (`--wavelo-scrim`).
  - `color` (`string`, default `'#ffffff'`): Centered loader color.

#### 120. `fullscreen` — Full Viewport Lock
- **DOM Structure:** Fixed viewport overlay (`position: fixed; inset: 0; z-index: 9999`).
- **Unique & Design-Specific Options:**
  - `backgroundColor` (`string`, default `'#ffffff'` or `'#0f172a'`): Fullscreen background surface.

#### 121. `page-transition` — View Transition Sweep
- **DOM Structure:** Screen-wide transition wave executing across page navigation.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#6366f1'`): Transition sweep wave color.

#### 122. `image-placeholder` — Media Canvas Shimmer
- **DOM Structure:** Rectangular media placeholder with centered image icon and shimmer.
- **Unique & Design-Specific Options:**
  - `--wavelo-radius` (`number | string`, default `6`): Image corner curvature. (a custom property on the loader, not a configuration key).

#### 123. `infinite-scroll` — List Bottom Trigger
- **DOM Structure:** Compact dot cluster signaling dynamic list pagination.
- **Unique & Design-Specific Options:**
  - `size` (`number | string`, default `24`): Compact pagination size.

#### 124. `background-operation` — Low-Priority Sync Indicator
- **DOM Structure:** Subtle pulsing dot signaling background synchronization.
- **Unique & Design-Specific Options:**
  - `color` (`string`, default `'#64748b'`): Non-distracting muted neutral tone.

#### 125. `success-ring` — Reactive Success Morph (Stateful)
- **DOM Structure:** Spinning ring that morphs into a solid green checkmark upon completion.
- **Unique & Design-Specific Options:**
  - `data-wavelo-state` (`'idle' | 'loading' | 'success' | 'error'`, default `'loading'`): Controls reactive state morph.
  - `secondaryColor` (`string`, default `'#22c55e'`): Checkmark success green (`--wavelo-success-color`).
  - `strokeWidth` (`number`, default `3`): Ring and checkmark stroke thickness.

#### 126. `error-shake` — Reactive Error Alert (Stateful)
- **DOM Structure:** Alert badge that shakes on the error state and turns to a checkmark on success.
- **Unique & Design-Specific Options:**
  - `data-wavelo-state` (`'idle' | 'loading' | 'success' | 'error'`): State switch.
  - No bespoke configuration key. The alert red and the success green come from
    `--wavelo-error-color` and `--wavelo-success-color`, which have no config option and
    are set through `style`, a class rule or `dist/tokens.css`.

#### 127. `button-confirm` — Pill Loader to Checkmark (Stateful)
- **DOM Structure:** Elongated button loader that contracts into a confirmation tick.
- **Unique & Design-Specific Options:**
  - `data-wavelo-state` (`'idle' | 'loading' | 'success' | 'error'`): State trigger.

#### 128. `toast-loading` — Toast Notification Badge
- **DOM Structure:** Floating notification badge pill with mini spinner and message caption.
- **Unique & Design-Specific Options:**
  - `--wavelo-radius` (`number | string`, default `8`): Toast corner radius. (a custom property on the loader, not a configuration key).

#### 129. `drag-drop-pulse` — File Upload Dropzone
- **DOM Structure:** Dropzone boundary with breathing dashed border and upload icon prompt.
- **Unique & Design-Specific Options:**
  - `--wavelo-radius` (`number | string`, default `8`): Dropzone corner radius. (a custom property on the loader, not a configuration key).

#### 130. `page-skeleton` — Full Viewport Page Layout
- **DOM Structure:** Complete screen skeleton (top navbar, sidebar navigation, hero canvas, content cards).
- **Unique & Design-Specific Options:**
  - `theme` (`'light' | 'dark' | 'system'`): Shimmer palette.

#### 131. `offline-dot` — Network Connectivity State (Stateful)
- **DOM Structure:** Connectivity dot transitioning between connecting pulse, online success green, and offline alert red.
- **Unique & Design-Specific Options:**
  - `data-wavelo-state` (`'idle' | 'loading' | 'success' | 'error'`): Drives connection mode:
    - `loading`: Connecting pulse / ping wave.
    - `success`: Solid online green (`--wavelo-success-color`).
    - `error`: Warning offline red (`--wavelo-error-color`).

#### 132. `save-indicator` — Document Cloud Sync (Stateful)
- **DOM Structure:** Cloud sync indicator transitioning from rotating sync arrows to saved check or error retry.
- **Unique & Design-Specific Options:**
  - `data-wavelo-state` (`'idle' | 'loading' | 'success' | 'error'`):
    - `loading`: Continuous synchronization spin.
    - `success`: Stationary saved checkmark.
    - `error`: Cloud warning indicator.
  - `secondaryColor` (`string`, default `'#22c55e'`): Saved checkmark color.

#### 133. `undo-progress` — Toast Timer Bar (Stateful)
- **DOM Structure:** Action toast bar draining its countdown track, morphing to undone or dismissed state.
- **Unique & Design-Specific Options:**
  - `data-wavelo-state` (`'idle' | 'loading' | 'success' | 'error'`): Toast lifecycle state.
  - `value` (`number`): Remaining toast lifespan (100% → 0%).
  - `height` (`number | string`, default `4`): Timer track thickness.

#### 134. `gyroscope` — Triple Gimbal 3D Rings
- **DOM Structure:** Three nested concentric gimbal rings rotating on orthogonal X, Y, and Z axes with 3D depth.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Color of outer and intermediate gimbal rings.
  - `strokeWidth` (`number | string`): Thickness of gimbal ring borders.
  - `backgroundColor` (`string`): Gimbal container backdrop.

#### 135. `tesseract` — 4D Hypercube Projection
- **DOM Structure:** Eight isometric cube vertices and connecting projection struts undergoing 4D-to-3D perspective inversion.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number | string`): Strut line gauge.

#### 136. `sphere-lattice` — Geodesic Wireframe Globe
- **DOM Structure:** Longitudinal and latitudinal wireframe rings revolving in 3D spherical coordinate space.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Latitudinal ring accent color.
  - `strokeWidth` (`number | string`): Wireframe lattice gauge.
  - `backgroundColor` (`string`): Globe container fill.

#### 137. `prism-refraction` — 3D Dispersion Light Fan
- **DOM Structure:** Triangular glass prism dispersing white light beam into dynamic spectral refractive rays.
- **Unique & Design-Specific Options:**
  - None (governed by Tier 1 & Tier 2 baseline and chromatic dispersion presets).

#### 138. `atom-orbital` — Quantum Planetary Shells
- **DOM Structure:** Central atomic nucleus orbited by three tilted elliptical electron probability clouds.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Electron orbital track accent.

#### 139. `dna-double-helix` — Spatial Base-Pair Helical Ladder
- **DOM Structure:** Intertwined dual-strand helix with periodic base-pair rungs rotating in 3D space.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Complementary strand and base rung color.
  - `strokeWidth` (`number | string`): Helical backbone gauge.

#### 140. `hologram-pyramid` — Inverted Laser Projection
- **DOM Structure:** Inverted four-faceted 3D pyramid rotating above an oscillating circular emitter pedestal.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Emitter pedestal and scanning ring accent.

#### 141. `black-hole-accretion` — Relativistic Accretion Disk
- **DOM Structure:** Event horizon singularity with tilted glowing accretion disk exhibiting relativistic Doppler beaming.
- **Unique & Design-Specific Options:** None (inherits universal size, duration, speed, and directional options).

#### 142. `crystal-cluster` — Faceted Mineral Cluster
- **DOM Structure:** Hexagonal quartz crystal prism cluster oscillating with specular facet reflections.
- **Unique & Design-Specific Options:** None (inherits universal size, duration, speed, and directional options).

#### 143. `mobius-band` — Topological Ribbon Flow
- **DOM Structure:** Non-orientable single-sided continuous Mobius strip twisting in 3D coordinate space.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Reverse-twist surface tone.
  - `strokeWidth` (`number | string`): Ribbon gauge.

#### 144. `vortex-tunnel` — Hyperspace Concentric Gates
- **DOM Structure:** Concentric perspective gate rings cascading into infinite depth.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Outer gate perimeter color.
  - `strokeWidth` (`number | string`): Tunnel gate border gauge.

#### 145. `isometric-deck` — Floating Card Shuffle
- **DOM Structure:** Isometric deck of cards floating, fanning, and restacking in 3D perspective.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Card rim and shadow tone.

#### 146. `voxel-cluster` — Dispersing Voxel Matrix
- **DOM Structure:** 3D matrix of isometric cubes expanding and collapsing elastically around a core.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Core voxel accent.

#### 147. `torus-ring` — 3D Donut Coordinate Mesh
- **DOM Structure:** Toroidal geometry mesh revolving with spatial surface perspective.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Torus inner diameter ring tone.
  - `strokeWidth` (`number | string`): Torus wire gauge.

#### 148. `cylindrical-wave` — Spatial Wave Array
- **DOM Structure:** Circular pin-matrix array elevating and depressing in sinusoidal 3D ripples.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Crest crest highlight color.

#### 149. `liquid-mercury` — Zero-G Fluid Droplet
- **DOM Structure:** Fluid metallic droplet undulating with surface tension dynamics in microgravity.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Specular highlight tone.

#### 150. `dna-decode` — Genomic Sequencing Scanner
- **DOM Structure:** Rotating DNA double strand traversed by an oscillating high-intensity sequencing laser beam.
- **Unique & Design-Specific Options:**
  - `strokeWidth` (`number | string`): Strand diameter.

#### 151. `quantum-superposition` — Probability Cloud
- **DOM Structure:** Stochastically oscillating quantum wavepackets collapsing into a unified eigenstate.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Eigenstate collapse focal point color.

#### 152. `magnetic-field` — Toroidal Dipole Flux Lines
- **DOM Structure:** North-south magnetic poles generating revolving toroidal magnetic field flux loops.
- **Unique & Design-Specific Options:**
  - `secondaryColor` (`string`): Opposite pole magnetic stream tone.

#### 153. `aurora-borealis` — Atmospheric Plasma Curtains
- **DOM Structure:** Dual undulating sheets of geomagnetic plasma shimmering across the upper atmosphere.
- **Unique & Design-Specific Options:** None (inherits universal size, duration, speed, and directional options).

---

## 4. Complete Configuration Matrix Summary

The following index summarizes the primary bespoke parameter availability across all 153 designs:

```
┌────────────────────────────────────────────────────────────────────────┐
│               COMPONENT-SPECIFIC PARAMETER DISTRIBUTION                │
├────────────────────────────────────────────────────────────────────────┤
│ • strokeWidth (35 designs): All spinners, rings, loops, ECG, radar     │
│ • value & max (19 designs): All progress indicators & toast timer      │
│ • count (26 designs): Skeletons, three-dots, equalizer, upload queues  │
│ • secondaryColor (60+ target designs): Two-tone spinners, tracks, dots │
│ • backgroundColor (153 target designs): Universal container/scrim fill │
│ • radius (Skeletons, shapes, bars, dropzone, toast, buttons)           │
│ • gap (Dot rows, matrix, equalizer, upload queues, skeleton lists)     │
│ • data-wavelo-state (6 designs): Stateful micro-interaction morphs     │
│ • data-wavelo-constellation (1 design): 5 astronomical star patterns   │
└────────────────────────────────────────────────────────────────────────┘
```
