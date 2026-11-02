# WAVelo
## Universal Loading & Motion Library

**Tagline:** Motion made simple.

**Document:** Product Requirements Document (PRD)  
**Version:** 2.0  
**Status:** Revised specification — ready for technical review  
**Product type:** Open-source, cross-framework npm library  
**Primary objective:** Deliver a comprehensive, customizable, lightweight and accessible loading system for modern web applications.

---

# 1. Executive Summary

## 1.1 Product Vision

Wavelo is a universal loading-animation and loading-state library that allows developers to integrate polished loading experiences into web applications with minimal code.

The library will support React, Angular, Vue, Svelte and plain HTML/JavaScript through a shared, framework-independent architecture and optional framework-specific integrations.

Wavelo will provide a comprehensive collection of classic spinners, creative animations, skeleton placeholders, progress indicators, loading overlays and application loading patterns.

Developers must be able to select an existing design, customize it extensively, or compose their own variations without having to build animations from scratch.

## 1.2 Product Promise

**Choose a loader. Customize it. Use it in any supported framework.**

Wavelo must provide:

- A large, organized collection of ready-to-use loaders.
- A consistent and predictable public API.
- Extensive customization without requiring custom CSS for common use cases.
- Minimal installation and integration effort.
- Optional framework integrations without unnecessary dependencies.
- Accessible behavior and reduced-motion support.
- Efficient rendering and small incremental bundle costs.
- A visual documentation website with interactive previews and working examples.
- Reliable versioning, compatibility testing and npm distribution.

## 1.3 Core Problem

Developers currently encounter several problems when implementing loading experiences:

1. Repeatedly writing or adapting CSS animations.
2. Installing separate packages for different loading patterns.
3. Difficulty finding a loader that matches their interface.
4. Inconsistent configuration across different components.
5. Excessive dependencies or unnecessarily large bundles.
6. Difficulties integrating loading indicators into multiple frontend frameworks.
7. Inadequate accessibility and reduced-motion behavior.
8. Limited documentation and examples.
9. Styling conflicts with the host application.
10. Unreliable SSR, hydration or framework integration behavior.
11. Difficulty creating custom variations of existing loaders.
12. Unnecessary maintenance when an animation library is upgraded.

Wavelo must address these issues rather than introducing another layer of complexity.

## 1.4 Product Principles

The following principles are mandatory:

1. **Simple by default:** Common use cases must require minimal code.
2. **Customizable when needed:** Advanced configuration must be available without making basic usage complicated.
3. **Framework-independent core:** The core must not require a frontend framework.
4. **Modular distribution:** Developers should import only what they use.
5. **Consistent APIs:** Common options must behave consistently across adapters.
6. **Accessible by default:** Accessibility must not be an optional paid feature or separate tier.
7. **Performance-conscious:** Avoid unnecessary JavaScript, dependencies, timers and rendering work.
8. **Honest compatibility:** Only advertise integrations and versions that have been tested.
9. **Composition over duplication:** Create new variants from reusable animation primitives whenever practical.
10. **Production-ready:** Documentation, tests, packaging and maintenance are part of the product, not post-release extras.

---

# 2. Goals and Non-Goals

## 2.1 Primary Goals

- Support the major frontend frameworks.
- Deliver at least 60 distinct animation designs and at least 100 ready-to-use loader, skeleton, progress and loading-state presets.
- Include the common and popular loading patterns developers expect.
- Provide a consistent configuration API.
- Support extensive visual customization.
- Keep individual imports efficient.
- Provide a searchable interactive gallery.
- Meet accessibility and reduced-motion requirements.
- Publish reliable TypeScript-enabled npm packages.
- Provide working examples for every advertised integration.
- Establish a sustainable contribution and release process.

The catalog targets are minimum release goals, not a limit. Additional designs may be added when they provide meaningful visual or functional variety.

## 2.2 Non-Goals

Wavelo is not intended to:

- Replace a general-purpose animation engine.
- Replace application state management.
- Automatically detect every asynchronous operation.
- Provide backend task queues or distributed job processing.
- Require accounts, API keys or a hosted service.
- Force developers to install every framework adapter.
- Include hundreds of superficial variations that differ only by color.
- Promise identical rendering on every device.
- Automatically intercept network requests or alter application behavior.
- Ship unnecessary features in the core merely to increase the catalog size.

---

# 3. Target Users and Use Cases

## 3.1 Target Users

- Frontend developers.
- Full-stack developers.
- SaaS product teams.
- Design-system engineers.
- E-commerce developers.
- Dashboard and admin-panel developers.
- Open-source maintainers.
- Developers building internal enterprise applications.

## 3.2 Primary Use Cases

Wavelo must support:

- Loading data from an API.
- Loading entire pages or application sections.
- Submitting forms.
- Loading buttons and actions.
- Loading product images.
- Displaying placeholder cards while content loads.
- Showing skeleton tables and dashboard layouts.
- Tracking upload and download progress.
- Indicating background operations.
- Showing progress through multi-step operations when measurable progress is available.
- Creating branded loading experiences.
- Reusing a consistent loading design across different frameworks.

---

# 4. Product Architecture

## 4.1 Architectural Decision

Wavelo will use a shared, framework-independent core with optional framework adapters and an optional native Web Component integration.

The architecture must not require developers to use Web Components when a native framework component is more suitable.

The shared core will define:

- Loader metadata.
- Public configuration types.
- Shared validation and normalization.
- Reusable animation definitions.
- CSS variables and design tokens.
- Accessibility conventions.
- Theme configuration.
- Progress calculations.
- Loader composition primitives.

Framework adapters will translate framework-native properties and lifecycle behavior into the shared rendering model.

## 4.2 Proposed Packages

The following names are provisional and must be checked for npm availability.

| Package | Purpose |
|---|---|
| `@wavelo/core` | Shared types, definitions, utilities and framework-independent primitives |
| `@wavelo/react` | Native React components and hooks |
| `@wavelo/angular` | Angular components and directives |
| `@wavelo/vue` | Vue components and composables |
| `@wavelo/svelte` | Svelte components and bindings |
| `@wavelo/web-components` | Native custom elements for framework-independent browser usage |
| `@wavelo/vanilla` | `mountLoader` and `createWavelo` for plain-DOM apps, with no framework peer |

Seven packages publish: the six above plus `@wavelo/core`.

If a suitable npm scope is unavailable, select a consistent alternative naming scheme.

Not every package must be published on day one. Each package must have a working implementation, documented purpose and automated tests before release.

## 4.3 Dependency Rules

- The core must not depend on React, Angular, Vue or Svelte.
- Framework adapters must declare framework dependencies as peer dependencies where appropriate.
- The Web Components package must not require a framework runtime.
- Development dependencies must not accidentally become runtime dependencies.
- Optional integrations must not be installed automatically by the core.
- Circular dependencies between packages are prohibited.
- A framework adapter must not duplicate the full animation implementation when it can reuse the core.
- No adapter may require unrelated adapters.

## 4.4 Technology Stack

The proposed stack is:

- TypeScript.
- CSS animations and transforms.
- SVG for suitable vector-based animations.
- Web Components for native browser integration.
- npm workspaces.
- A modern library build tool with explicit entry points and TypeScript declarations.
- Node's built-in test runner for unit and adapter tests.
- Playwright for browser integration tests.
- A documentation framework supporting interactive examples.
- GitHub Actions or an equivalent CI system.

The final tools and versions must be selected after validating compatibility with the supported frameworks.

---

# 5. Comprehensive Loader Catalog

## 5.1 Catalog Strategy

Wavelo must maximize useful variety without creating a maintenance burden.

The release target is:

- At least 60 distinct animation designs (Shipped: **153 active designs** across 8 functional categories, including 25 authentic 3D designs).
- At least 20 skeleton presets or primitives (Shipped: 26 skeleton designs).
- At least 10 progress-indicator designs or variants (Shipped: 19 progress designs).
- At least 10 application-level loading patterns (Shipped: 17 application designs).
- Dedicated AI/streaming loading lane (Shipped: 6 AI designs).
- Dual classification: Functional UX category and Spatial Dimensionality (`2d` vs `3d`).
- At least 100 named, documented presets and loading patterns overall (Shipped: **231 named presets**).

Categories may overlap where a design legitimately belongs to more than one category. The final catalog count must be calculated from a central registry using unique identifiers, not by counting aliases or cosmetic variations as new designs.

Every entry must have a documented purpose, working implementation and gallery preview.

### Category Independence Principle

Wavelo enforces strict separation between marketing/organizational categories and runtime configuration capabilities:

- **No Parameter Restrictions by Category:** Category is an informational metadata label and gallery filter. It has zero runtime authority over configuration acceptance, validation, or styling. Any loader may accept and honour any parameter that its visual construction supports.
- **Cross-Category Slices:** 9 of the 12 render kinds span multiple categories (e.g. `skeleton` powers designs in `skeleton`, `ai`, and `application`; `progress` powers designs in `progress` and `application`; `ring` powers designs in `spinner`, `creative`, and `application`).
- **Determinate Progress Semantics:** `supportsProgress` is determined strictly by `kind === 'progress'`, not marketing category, ensuring application designs like `undo-progress` and `page-transition` expose full `role="progressbar"` semantics and progress options.

> **Status of the numbered lists in §5.2–§5.9.** They are the original requirement set, and
> they still describe what the library must cover. Twenty-two of the named shapes have since
> been consolidated into a surviving design because they rendered the same thing — the ring
> thickness and mask variants, five dot rows, seven bar rows, the concentric-circle pair, the
> orbiting-circle and the two determinate forms. The full list, with what each one was folded
> into and whether configuration genuinely reproduces it, is in
> `docs/VISUAL_DEDUPLICATION_REPORT.md`; `docs/LOADER_AUDIT.md` §5 marks each affected row
> **consolidated** in place. Nothing in this section should be read as "unimplemented"
> because a name is absent from the catalog: coverage is the requirement, the specific ID is
> not.

## 5.2 Category A — Classic Spinners

Provide common, familiar indicators:

1. Circular border spinner.
2. Ring spinner.
3. Dual-ring spinner.
4. Rotating arc.
5. Multiple rotating arcs.
6. Dotted circular spinner.
7. Segmented ring.
8. Half-circle spinner.
9. Elliptical spinner.
10. Rotating square.
11. Rotating diamond.
12. Rotating geometric shapes.
13. Orbiting dots.
14. Orbiting circles.
15. Gradient ring.
16. Thin-line spinner.
17. Thick-stroke spinner.
18. Minimal monochrome spinner.
19. Branded spinner.
20. Custom SVG spinner.

These designs must support common size, color, speed and accessibility settings where applicable.

## 5.3 Category B — Dots and Bouncing Loaders

1. Three-dot loader.
2. Four-dot loader.
3. Five-dot loader.
4. Bouncing dots.
5. Sequentially pulsing dots.
6. Fading dots.
7. Scaling dots.
8. Rotating dots.
9. Orbiting dot.
10. Dot wave.
11. Dot matrix.
12. Grid pulse.
13. Alternating dots.
14. Expanding dot.
15. Ripple dot.
16. Staggered dot animation.
17. Circular dot sequence.
18. Vertical bouncing dots.

Dot count, spacing, size, color and animation timing must be configurable where relevant.

## 5.4 Category C — Bars and Waveforms

1. Equalizer bars.
2. Bouncing bars.
3. Vertical pulse bars.
4. Horizontal pulse bars.
5. Waveform.
6. Audio-style waveform.
7. Sequential fading bars.
8. Growing and shrinking bars.
9. Alternating bars.
10. Gradient bars.
11. Segmented progress bars.
12. Moving stripe indicator (high-contrast, mathematically tiled diagonal repeating stripe pattern with seamless translation).
13. Traveling highlight (fluid luminous beam sweep with soft edge falloff and drop-shadow glow moving across a rounded track).
14. Oscillating line (64-stop sinusoidal waveform band clipped via polygon math and oscillating continuously on a telemetry baseline).
15. Multi-wave animation.

These patterns must support configurable bar count where the design allows, spacing, height, color and speed.

## 5.5 Category D — Geometric and Creative Loaders

1. Ripple circles.
2. Expanding circles.
3. Morphing shapes.
4. Infinity loop (two synchronized dots traversing opposing lobes of a lemniscate curve with balanced 50% phase offset).
5. DNA-style helix (3D double helix with front/back depth perspective, alternating scale/opacity, complementary strands, and responsive base-pair rungs).
6. Cube rotation.
7. Three-dimensional-style cube animation.
8. Rotating polygon.
9. Rotating triangles.
10. Rotating squares.
11. Folding squares.
12. Nested rings.
13. Nested squares.
14. Pulsing concentric circles.
15. Spiral animation.
16. Rotating orbit system.
17. Elastic ring.
18. Liquid-style motion (organic fluid multi-axis morphing squircle keyframe with center radiance).
19. Blinking grid.
20. Moving geometric blocks.
21. Sliding blocks.
22. Wave distortion effect.
23. Rotating segmented shapes.
24. Circular radar sweep.
25. Particle orbit.

Effects must be implemented using appropriate CSS, SVG or other justified rendering methods. Heavy techniques must not be used when a simpler method achieves the same result.

## 5.6 Category E — Skeleton Loading

Provide composable skeleton primitives and ready-to-use layouts:

1. Text line.
2. Multiple text lines.
3. Paragraph block.
4. Circular avatar.
5. Rectangular avatar.
6. Image placeholder.
7. Video thumbnail.
8. Basic card.
9. Profile card.
10. Product card.
11. Product grid.
12. Article layout.
13. Profile page.
14. Table row.
15. Table body.
16. Table with header.
17. Dashboard cards.
18. Dashboard layout.
19. Sidebar navigation.
20. Form layout.
21. List item.
22. Notification item.
23. Chat message.
24. Comment thread.
25. Statistics card.
26. Chart placeholder.
27. Image gallery.
28. Pricing card.
29. E-commerce product details.
30. Custom skeleton block.

Skeleton primitives must allow developers to build their own layouts without depending on predefined templates.

Skeletons must support static and animated variants, dimensions, spacing, shape, radius, background and highlight colors.

The default behavior should avoid unnecessary movement when the user prefers reduced motion.

## 5.7 Category F — Progress Indicators

1. Horizontal indeterminate bar.
2. Determinate horizontal bar.
3. Circular determinate progress.
4. Circular indeterminate progress.
5. Segmented progress.
6. Step progress.
7. Thin top-of-page progress.
8. Gradient progress bar.
9. Progress with percentage text.
10. Progress with custom label.
11. Ring progress.
12. Multi-stage progress.
13. Upload progress.
14. Download progress.
15. File-processing progress.
16. Half-ring gauge (semicircular telemetry arc with live breathing glow).
17. Fluid wave fill (liquid container with rolling sinusoidal wave crest).

Determinate progress must reflect values supplied by the application. The library must never invent progress measurements. All determinate track and bar loaders must fill predictably from left to right (0% to 100% via `justify-content: flex-start`), ensuring realistic visual progression rather than centered track expansion.

## 5.8 Category G — Application Loading Patterns

1. Inline loading indicator.
2. Button loading state.
3. Icon-button loading state.
4. Section-level loading overlay (frosted modal scrim with blur and border, centered with a circular spinner ring).
5. Container loading overlay.
6. Full-screen loading overlay (viewport-wide frosted scrim with centered circular spinner ring, avoiding oval distortion).
7. Modal loading indicator.
8. Page-transition indicator.
9. Image loading placeholder.
10. Lazy-content placeholder.
11. Form submission loading state.
12. Search-results loading state.
13. Infinite-scroll loading indicator.
14. Background-operation indicator.
15. Multi-step operation indicator.
16. Error shake (stateful alert badge with bold exclamation mark and realistic damped physical oscillation).

These patterns must integrate with application state without automatically taking control of unrelated application behavior.

## 5.9 Category H — Specialized and Branded Variants

Provide a controlled extension catalog for:

- Minimal loaders.
- Monochrome loaders.
- Gradient loaders.
- Brand-colored loaders.
- Dark-surface loaders.
- Light-surface loaders.
- High-contrast variants.
- Compact inline variants.
- Large display variants.
- Custom SVG-based loaders.

These variants should reuse shared definitions whenever possible.

## 5.10 Category I — AI and Streaming Loaders

Provide dedicated visual indicators for modern generative AI interfaces, model inference, and real-time streaming responses:

1. Typing dots (`typing-dots`): Three dots lifting in sequence while a response is composed.
2. Thinking glow (`thinking-glow`): Breathing orb inside an expanding halo representing model contemplation.
3. Stream cursor (`stream-cursor`): Blinking block cursor marking the leading edge of streamed text.
4. Token stream (`token-stream`): Short dashes traveling left-to-right as text tokens arrive.
5. AI response shimmer (`ai-shimmer`): Tall rounded response card swept by a bright radiant band.
6. Neural grid (`neural-grid`): 3x3 node matrix pulsing diagonally to indicate neural network execution.

These loaders must convey real-time generative responsiveness with compositor-pure motion.

## 5.11 Dimensional Taxonomy & Catalog Modernization Strategy

In addition to functional UX categories, the catalog is classified across spatial dimensionality, paired with an active modernization review of existing designs and an ambitious 3D motion expansion roadmap.

### 5.11.1 Spatial Dimensionality Taxonomy (2D & 3D Loaders)

- **2D Loaders (`2d`):** Planar vector, CSS keyframes, clip-paths, borders, and 2D transforms (`translate`, `rotate`, `scaleX/scaleY`). 128 of the 153 designs are 2D.
- **3D Loaders (`3d`):** Loaders whose own motion runs in depth — CSS 3D transforms (`rotateX`, `rotateY`, `translateZ`, `rotate3d`, `perspective`) — rather than imitating depth with a flat scale. 25 designs: `atom-orbital`, `aurora-borealis`, `black-hole-accretion`, `crystal-cluster`, `cube`, `cylindrical-wave`, `dna-decode`, `dna-double-helix`, `ellipse`, `folding-squares`, `gyroscope`, `helix`, `hologram-pyramid`, `isometric-deck`, `liquid-mercury`, `magnetic-field`, `mobius-band`, `prism-refraction`, `quantum-superposition`, `rotating-square`, `sphere-lattice`, `tesseract`, `torus-ring`, `vortex-tunnel` and `voxel-cluster`. Optional future WebGL/Canvas rendering slices stay in this class.
- **Dimensionality Requirements:**
  1. Every catalog entry must explicitly declare its dimensionality (`dimension: '2d' | '3d'`).
  2. The label is derived, not hand-asserted: a unit test reads each design's own rules and keyframes and requires the label to match the transforms they actually animate, and it pins the 3D set above so a new or re-labelled design fails until the gallery filter copy and this section follow. The list is alphabetical for exactly that reason — it can be diffed against the assertion in `tests/core.test.mjs`.
  3. 3D loaders must not compromise performance: they must adhere to the 0 layout recalculations rule and use GPU-accelerated compositing. `npm run audit:layout` measures every design and fails on any that costs a layout without a recorded reason; the exemptions on record are `progress-scroll` and `multi-wave`, both 2D, each accounted for in `docs/PERFORMANCE.md`. The audit prints the current count per run rather than this section carrying one.
  4. The documentation gallery must provide a Dimension filter chip (`All dimensions`, `2D`, `3D`) alongside category filters.

### 5.11.2 Catalog Modernization Review (User Perspective & Visual Delight)

A thorough UX, visual, and kinesthetic audit across the active catalog identifies several existing loaders that, while functionally operational, originally appeared visually flat, simplistic, or lacking in physical realism. Modern frontend developers and design-system engineers demand loading indicators that communicate craft, visual polish, and organic motion dynamics (similar to micro-interactions found in Apple, Stripe, Linear, and Vercel products).

**Scope of this review:** it was written against the 133-design catalog and its seven sections cover **107 designs** — Spinners 17, Dots 17, Bars 13, Creative 18, Progress 19, Application 17, AI 6. The 26 skeleton layouts are not reviewed here, and neither are the 20 designs added in 0.2.0; the per-design census of all 153, including both, is [`docs/COMPREHENSIVE_DESIGN_AUDIT_REPORT.md`](COMPREHENSIVE_DESIGN_AUDIT_REPORT.md). The counts below are the designs this section actually evaluates, not the category totals, which are in §5.10.

### 🔴 Priority Key
- 🔴 **Must fix** — obvious visual problem or physics mismatch
- 🟡 **Should improve** — currently functional but lacking polish
- 🟢 **Nice to have** — already solid, could be elevated further

---

### A. Spinners (17 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `ring` | ✅ Clean, standard. | Add a subtle luminous **comet-trail gradient** along the open arc — the gap reads as motion rather than just "missing border." | 🟢 |
| `circular` | ✅ Dual-ring works well. | Counter-rotate the secondary ring for **yin-yang tension** — currently both arcs spin the same direction, reducing visual interest. | 🟡 |
| `dual-ring` | Slightly redundant with `circular`. | Differentiate with **morphing stroke-dashoffset** — instead of two full rings, have them dynamically shrink and grow arcs like a closing iris. | 🟡 |
| `multi-arc` | ✅ Good layered arcs. | Add **progressive scale fade** — each arc slightly smaller + lower opacity so the depth reads as a stack receding into space. | 🟢 |
| `dotted-circle` | A single bright dot travels around the ring. | The "wave of brightness" should **cascade fully around the circle** instead of having one peak. Use multiple simultaneous pulses. | 🟡 |
| `segmented-ring` | Dashed border is the whole trick. | Replace the CSS `border-style: dashed` with **explicit arc segments** using `stroke-dasharray` on SVG — gives sharper, pixel-perfect segment gaps with controllable count. | 🟡 |
| `ellipse` | 3D tilted hoop — good concept. | Add a faint **orbital track ring** behind the hoop (semi-transparent) so users can see the tilted path the hoop follows — makes the 3D depth read immediately. | 🟢 |
| `rotating-square` | Tumbles on its diagonal axis — distinctive. | Add **face lighting**: the square face darkens when edge-on (squished) and brightens when face-on — feels like a card catching light. | 🟡 |
| `gradient-ring` | Gradient carved by a mask ring — correct. | **Add animation to the gradient angle** (`@property` + `conic-gradient`) so the color bands themselves rotate — gives a prismatic sweep rather than just a ring spinning. | 🟡 |
| `neon-ring` | Ring + pulsing glow. | The glow pulse and the spin are independent. **Sync the glow peak** to align with the bright arc end so the luminance surge feels intentional, not accidental. | 🟡 |
| `rubber-band` | Elastic pluck deformation — good. | Add a **color shift during peak stretch** — the band warms to the `secondaryColor` when fully stretched and snaps back to `color` at rest (just opacity + color-mix transition on the border). | 🟢 |
| `snake` | 5-segment perimeter chase — excellent. | The head's two-dot "eyes" are tiny. Make them **flash/blink** using a micro-pulse animation so the snake reads as alive even at small sizes. | 🟢 |
| `clock-spinner` | Dial face + two hands — good. | The four hour-markers are just gradient dots. Replace them with **actual tick marks** (short radial lines via `linear-gradient` at four corners) for authentic clock geometry. | 🟡 |
| `monochrome` | Half-opaque conic gradient — too simple. | Transform into a **fluid mercury drop** — the dark half sweeps faster through the bottom half and slows at the top, simulating viscous fluid inertia. | 🟡 |
| `radar` | Simple conic sweep. | 🔴 Most important upgrade. Needs **CRT phosphor decay** — the swept region leaves a decaying luminous afterglow trail. Currently reads as a plain spinner with a gradient. | 🔴 |
| `spiral` | Multi-arc conic — static. | The "spiral" should actually **tighten and loosen** — animate the conic stops so the arcs converge inward then expand outward, creating a breathing vortex. | 🟡 |
| `svg-star` | Rotating star shape. | Add a **scale pulse** synced to the rotation so the star pulses large at 4 cardinal points and small at 45° — like a twinkling star with radial symmetry. | 🟡 |

---

### B. Dots & Particles (17 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `three-dots` | Standard, clean. | **Height variance** — the middle dot bounces higher than the outer ones (apex 60% vs 40%) for a more organic, wave-like appearance rather than mechanical uniformity. | 🟡 |
| `pulsing-dots` | Scale pulse in place. | Add **color depth** — each dot warms from `color` at its smallest to `secondaryColor` at its largest, making the pulse feel like a heartbeat rather than just scaling. | 🟢 |
| `fading-dots` | Opacity wave. | Combine opacity fade with a **micro-scale reduction** — dots should shrink by 15% as they fade, like particles dissolving rather than just dimming. | 🟢 |
| `dot-wave` | 5 circular dots undulating — good. | Add **depth shading** — the dot at the crest of the sine wave (at peak height) lightens to `secondaryColor`, the dot at the trough darkens. Creates an illusion of a physical wave catching light. | 🟡 |
| `dot-matrix` | Uniform grid pulse. | Implement a **ripple origin** — pulses radiate outward from the center of the grid in expanding concentric rings, like a stone dropped in water. Currently all nodes pulse identically. | 🔴 |
| `grid-pulse` | Similar to dot-matrix. | Differentiate: make this a **scanning line** — a bright horizontal row sweeps from top to bottom through the matrix (like a progress scanner). Makes it distinct from dot-matrix. | 🟡 |
| `alternating-dots` | Odd/even dots counter-phase. | Add **horizontal travel** — the dots should physically move apart and together, not just change in opacity/scale. The "alternating" motion should be spatial, not just chromatic. | 🔴 |
| `expanding-dot` | Single dot expanding. | Add **concentric ring echoes** — as the dot expands, it leaves a fading ring at each pulse peak, like sonar echoes. Currently just a single scale animation. | 🟡 |
| `ripple-dot` | ✅ Already good. | Ensure the ring echoes **stagger** rather than all emanating simultaneously — sequential launch creates a more naturalistic water-drop feel. | 🟢 |
| `staggered-dots` | ✅ Good phase stagger. | Add a **color cascade** — each dot progressively shifts hue across the group (`color-mix` interpolation) so the wave isn't just kinetic but chromatic. | 🟢 |
| `magnetic-dots` | Dots attract/repel. | The paths should be more **organic and erratic** — currently too uniform. Add individual `animation-timing-function` overrides per dot for natural irregularity. | 🟡 |
| `pendulum` | Pivot + rod + bob — excellent. | Add a **cast shadow** from the bob onto the "floor" (bottom edge) that swings with the pendulum, giving the design physical grounding. | 🟢 |
| `constellation` | Star patterns + lines — excellent. | The connecting lines should **animate sequentially** — drawing themselves link by link rather than appearing all at once, like a starmap being traced. | 🟡 |
| `bubble-rise` | 8 buoyant bubbles — great. | Bubbles should **accelerate toward the top** (realistic buoyancy physics: slower at the bottom, faster at the surface). Currently they use linear timing. | 🟡 |
| `fireflies` | 10 bioluminescent motes. | Add **pulse synchronization events** — occasionally (every 3s) 3-4 fireflies should flare simultaneously before diverging, like real Photinus pyralis synchronous flashing. | 🟢 |
| `solar-system` | 5 planets orbiting flat. | 🔴 The orbital plane should be **tilted at 60°** in 3D space. Currently purely flat 2D. Add Keplerian speed variation (faster closer, slower farther). See §5.11.2 spec. | 🔴 |
| `rotating-dots` | 5 dots orbiting in formation. | Add **size depth perspective** — dots at the bottom of the orbit (notionally "closer") are larger; dots at the top are smaller. Creates illusion of a circular 3D orbit. | 🟡 |

---

### C. Bars & Waveforms (13 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `equalizer` | Classic bars bouncing. | Add **frequency color bands** — the lowest bars are bass-warm (`color`), mid bars blend toward neutral, the tallest peaks flare to `secondaryColor`. Feels like a real EQ visualization. | 🟡 |
| `horizontal-pulse-bars` | Horizontal scale pulse. | Stagger the bars along a **traveling sine envelope** (rather than a flat bounce), giving a sinewave-on-bars composite effect. | 🟡 |
| `fading-bars` | Opacity fade. | Combine opacity fade with a **height descent** — bars that fade are also slowly deflating (scaleY reduces as opacity reduces). Much more physicalistic. | 🟡 |
| `growing-bars` | Sequential bar growth. | Add a **spring overshoot** on the max-height arrival — the bar overshoots 15% then snaps back. One `cubic-bezier(0.34, 1.56, 0.64, 1)` timing on scaleY achieves this. | 🟢 |
| `alternating-bars` | Every-other bar counter-phase. | Make bars **cross the center line** — instead of `scaleY(0.2)` at minimum, they compress and immediately flip to grow from the opposite side. Like an audio peak-flip visualization. | 🟡 |
| `piano-keys` | Keys pressing down. | Add **individual key release spring** — after each key presses (scaleY shrinks), it bounces back with a slight overshoot before settling. Real piano keys do this. | 🟡 |
| `fire-rise` | Flame bars rising. | Add a **color gradient from base to tip**: each bar grades from deep orange at the base to pale yellow/white at the top, using `linear-gradient` on `scaleY` — matches real flame thermodynamics. | 🔴 |
| `heartbeat` | Clinical ECG waveform — excellent. | Add a **scanning cursor line** — a faint vertical line sweeps left-to-right across the monitor width in sync with the waveform, like a real oscilloscope CRT beam. | 🟡 |
| `breathing` | Slow scale oscillation. | The breathing should follow the **human respiratory curve**: rapid sharp inhalation, long plateau hold, controlled slow exhalation. Currently uniform sinusoidal which feels robotic. | 🟡 |
| `moving-stripe` | Diagonal stripe translation. | Add **depth chevron** — alternate strips in slightly different shades (alternating `color` / `color-mix(color 80%, white)`) for a 3D depth-banding optical illusion. | 🟢 |
| `traveling-highlight` | Luminous beam sweep. | Add a **reflected highlight** on the opposite side of the track at 30% opacity, mimicking how a physical glossy track surface would reflect the passing beam from below. | 🟢 |
| `oscillating-line` | 64-stop sinusoidal waveform. | The waveform should **modulate in amplitude** — the wave height breathes from 20% to 80% of the band height over a 3-second envelope while the frequency remains constant. | 🟡 |
| `multi-wave` | Layered wave interference. | Add a **third interfering wave** at `secondaryColor` with a slightly different frequency. Two-wave interference is nice; three-wave creates genuine, complex Lissajous beauty. | 🟡 |

---

### D. Creative & Geometric (18 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `ripple-circles` | Expanding concentric rings. | Add **chromatic dispersion** — the innermost ring is `color`, the next is `secondaryColor`, and the outermost is a lighter tint, like a prism splitting light into concentric colors. | 🟡 |
| `morphing-shapes` | Shape border-radius morphing. | Currently only morphs corner radii. Add **scale breathing** (size pulses 10% in sync with the morphing) so the shape feels like it's growing and contracting as it changes identity. | 🟡 |
| `infinity` | Lemniscate curve + 2 orbiting dots. | The dots should **leave a fading motion trail** — a short comet tail (3-5 ghost dot copies at decreasing opacity) so the path of the figure-8 is visible and continuous. | 🟡 |
| `helix` | 3D DNA double helix — good. | Add a **base-pair "flash" highlight** when the front strand passes closest to the viewer — a brief luminance peak on the nearest-point rung makes the rotation read as 3D immediately. | 🟡 |
| `cube` | A real cube: three faces placed with `rotateX`/`rotateY` and `translateZ`, `transform-style: preserve-3d` on the container, per-face shading through `color-mix`, and a soft ground shadow. Rebuilt since this row was written — the flat square it described no longer exists, and the derived-label test lists it as `3d`. | Optional: a specular sweep across the top face as it turns would sell the light source. | 🟢 |
| `polygon` | Rotating pentagon. | Add a **border pulse** — the polygon's border-width breathes from 2px to 8px as it rotates, making the shape feel more kinetically alive rather than just spinning. | 🟢 |
| `triangles` | Each triangle orbits *and* spins on its own axis: `wavelo-triangle-orbit` carries `rotate(var(--a)) translateY(…) rotate(-720deg)`, so the counter-rotation this row asked for is shipped, with a `--a` offset of 120° per part and staggered negative delays. | Optional: vary the spin rate per triangle rather than only its phase, so the three are not perfectly metronomic. | 🟢 |
| `folding-squares` | Four quadrants, each with its own animation, on a container that sets `perspective` and `transform-style: preserve-3d`; the fold keyframes open at `rotateZ(45deg)` and close with `perspective(250px) rotateX(180deg)` / `rotateY(…)`. The flat whole-element `rotateY(180deg)` this row described is gone. | Optional: share one crease line between opposite quadrants so the fold reads as a single origami sheet rather than four independent flaps. | 🟡 |
| `nested-squares` | Concentric squares scaling. | Add **rotation offset per ring** — each nested square rotates at a slightly different speed, creating a mesmerizing **gyro parallax** between the square rings. | 🟡 |
| `concentric-pulse` | Pulsing rings. | The rings should pulse **in sequence inward** (outermost pulses first, then the inner rings cascade inward one by one), like a radar ping propagating inward. | 🟡 |
| `trip-orbit` | 3 arc spinners on one ring. | Give each arc a **unique color** (`color`, `secondaryColor`, and an auto-derived third via `hue-rotate(120deg)`) — three-arc RGB triad is visually stunning. | 🟡 |
| `liquid-blob` | Organic squircle morphing. | Add a **surface tension ripple** — when the blob transitions between two corner-radius states, a tiny circular ripple pulse (`:before` pseudo) emanates from the morph pivot point. | 🟢 |
| `sand-timer` | Glass silhouette with animated sand. | 🔴 Add **particle stream** — the sand between upper and lower chambers should appear as a thin animated stream (1-2px column animated via `scaleY`) rather than just the chambers scaling. | 🔴 |
| `eye-blink` | Almond eye with iris and lid. | Add **micro-saccade** — the iris should drift slightly left/right (small `translateX` motion) between blinks, like an eye glancing around rather than staring straight ahead. | 🟡 |
| `metronome` | Swinging arm. | Add a **tick sound visualization** — at the extreme left and right swing positions, a brief bright flash (opacity spike on the arm) to represent the audible "tick" of a real metronome. | 🟢 |
| `spiral` | Multi-band conic gradient. | The arms should **tighten inward** over time (like a contracting galaxy) before snapping back out — periodic tighten/release cycle rather than continuous uniform spin. | 🟡 |
| `radar` | Simple conic sweep. | 🔴 Full redesign per §5.11.2 — concentric range rings, HUD crosshairs, phosphor persistence trail, acoustic ping blips. The current design is misleadingly simple for its name. | 🔴 |
| `particle-orbit` | Small dots on orbital paths. | Give particles **size variation by orbital position** — particles appear larger at orbital perigee (closest approach to the center) and smaller at apogee, like Keplerian objects. | 🟡 |

---

### E. Progress Indicators (19 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `progress-bar` | Standard left-to-right fill. | Add **fill shimmer** — a subtle bright traveling highlight inside the filled portion (like a glossy bar in iOS) makes the fill feel alive and dimensional. | 🟢 |
| `progress-ring` | Stroke-dashoffset ring fill. | Add **breathing glow** on the active arc end — the leading edge of the arc glows and pulses as the value increases, like a live indicator catching light. | 🟡 |
| `progress-top` | Thin NProgress-style top bar. | Add **easing variation** — the bar should slow down asymptotically near 95% when indeterminate (to fake organic perception) then snap to 100%. | 🟡 |
| `progress-battery` | Battery chassis with fill. | Add **charging animation** — when the battery is not at 100%, a small moving "lightning bolt" or pulsing glow inside the active portion indicates active charging. | 🟡 |
| `progress-half-ring` | Semicircular gauge arc. | Add **tick marks** at 25%, 50%, 75% positions around the semicircle arc so it reads as a real gauge/speedometer, not just a half-ring. | 🟡 |
| `progress-wave-fill` | Liquid wave tank. | Add **realistic surface tension** — small ripples should form at the side edges of the tank where the wave meets the walls, like water in a physical container. | 🟢 |
| `progress-count` | Number counting bar. | The count number should **animate with an odometer roll** — digits should scroll upward as they increment, not just swap instantly. | 🟡 |
| `progress-dots-fill` | Dots filling a track. | Add **fill pop** — each dot that activates should momentarily scale up 130% then settle to 100%, like a bubble popping into place. | 🟡 |
| `progress-ai-generate` | Wave fill for AI generation. | Add a **token-burst flash** at the wave crest — a brief bright sparkle every 0.5–1 second indicates individual token generation events. Pairs perfectly with LLM use cases. | 🟡 |
| `progress-orbit-fill` | Orbiting dot showing fill level. | The orbit radius should **shrink as progress increases** — at 0% the dot orbits wide, at 100% it spirals tightly inward and vanishes, showing "task complete." | 🟡 |
| `progress-steps` | Numbered milestone steps. | Add **connector animation** — the line connecting milestone steps should animate a **traveling fill** between completed and pending nodes rather than being static. | 🟡 |
| `progress-skill` | Horizontal skill bar. | Add **label score tick** — a small vertical mark appears at the current `value` with the percentage as a pill tooltip above it, like a professional skills chart. | 🟢 |

---

### F. Application Patterns (17 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `button` | Spinner in a button. | **Add skeleton shimmer state** — when `data-wavelo-state="loading"`, the button label should fade out and be replaced by a skeleton shimmer (not just a spinner), for modern design patterns. | 🟡 |
| `overlay` | Frosted scrim + spinner. | Add a **subtle animated gradient aurora** in the scrim background — a very slow, barely-visible drifting gradient behind the blur, making overlays feel premium instead of static. | 🟢 |
| `fullscreen` | Viewport-wide frosted scrim. | Same as `overlay` — add **ambient particle drift** (very subtle floating specks) in the background scrim for a high-end application feel. | 🟢 |
| `toast-loading` | Notification badge with spinner. | Add **progress drain** — optionally show a thin progress bar at the bottom of the toast that drains to show the auto-dismiss countdown. | 🟡 |
| `drag-drop-pulse` | Breathing dashed border. | Add **corner highlight flare** — when the dashed border pulses, each corner briefly brightens with a glow, making the boundary feel interactive and touchable. | 🟡 |
| `success-ring` | Spin → checkmark. | The checkmark should **draw itself** using `stroke-dashoffset` animation (svg tick path) rather than appearing as a static rotated border, which looks unpolished at some sizes. | 🟡 |
| `error-shake` | Red badge shaking. | Add **damage flash** — at the peak of the shake, a brief full-opacity red flash (like a screen-edge damage indicator in games) makes the error state unmistakably urgent. | 🟢 |
| `button-confirm` | Pill collapses into checkmark. | Add **color transition** — the pill changes from brand color to a success green during the collapse animation, providing semantic color feedback alongside the kinematic feedback. | 🟡 |
| `offline-dot` | Network status dot. | Add **connection-attempt pulse ring** — when in `connecting` state, expanding rings should animate outward from the dot (like a WiFi/cellular search signal). | 🟡 |
| `infinite-scroll` | 3 dots at the bottom. | Consider replacing with a **pull-to-refresh arc** variant — an arc that fills 0→100% as the user scrolls, then triggers the load bounce. Common modern UX pattern. | 🟢 |
| `page-transition` | Thin bar at page top. | Add **shimmer highlight** moving along the bar's filled portion, and allow the bar to **glow** (soft box-shadow) in the `color` hue. | 🟢 |

---

### G. AI / Streaming (6 designs)

| Design | Current State | Suggested Enhancement | Priority |
|---|---|---|---|
| `typing-dots` | 3 lifting dots. | Add **emoji-style expression variants** — via `data-wavelo-state`, the dots could shift from "thinking" (slow, thoughtful lift) to "excited" (rapid bouncing) to match AI emotional context. | 🟢 |
| `thinking-glow` | Breathing orb with halo. | Add a **second pulsing halo ring** that breathes at a lower, slower frequency — the two desynchronized breathing rings create a meditative, alive quality. | 🟡 |
| `stream-cursor` | Blinking block cursor. | Add **insertion-point flicker** — the cursor doesn't uniformly blink but occasionally flickers (shorter dark intervals) like a real terminal cursor in a live environment. | 🟢 |
| `token-stream` | Left-to-right dash flow. | Add **variable dash velocity** — dashes should accelerate and decelerate in bursts to match real LLM token generation patterns (tokens arrive in irregular rhythm, not uniform flow). | 🟡 |
| `ai-shimmer` | Tall card swept by light. | Add **multi-line shimmer stagger** — the bright band should sweep the first line, then the second line with a delay, then the third, simulating actual line-by-line text streaming. | 🔴 |
| `neural-grid` | 3x3 grid diagonal pulse. | 🔴 Upgrade to **directional wave propagation** — pulses should travel along distinct paths (not just diagonal) with animated connecting "synapse" lines briefly lighting between adjacent nodes. | 🔴 |

---

### 5.11.3 Flagship & Experimental 3D Motion Road Map (Unique, Differentiating & Popular Pure-CSS 3D Loaders)

To establish Wavelo as the most innovative, visually captivating, and popular loading library in the open-source ecosystem, Wavelo introduces a dedicated suite of **Zero-Runtime-Dependency Pure-CSS 3D Loaders**. 

While other animation libraries require massive 500KB–2MB WebGL engines (Three.js, Babylon, Spline) that introduce canvas mounting latency, memory leaks, and mobile GPU battery drain, Wavelo harnesses the unexploited power of the **GPU Compositor with Pure CSS 3D transforms** (`transform-style: preserve-3d; perspective; rotate3d(); translateZ()`). This yields buttery 60/120fps motion with zero layout shifts, native dark/light theme adaptation, and tiny sub-2.5KB bundle sizes.

The 3D portfolio is structured across three deliberate tiers:
- **Tier 1 — Viral Flagships (Phase 4B/4C):** Highly original, shareable designs designed to capture developer mindshare on Twitter/X, GitHub trending, and Product Hunt.
- **Tier 2 — Showcase Spatial Structures (Phase 4D):** Polished isometric and volumetric components for professional dashboards, fintech, cloud consoles, and SaaS.
- **Tier 3 — Experimental Innovations (Phase 4E):** Unprecedented CSS-only physical and scientific simulations pushing the frontier of what web standards can animate without canvas.

> All designs: Pure CSS 3D (`transform-style: preserve-3d`, `perspective`, `rotate3d`, `translateZ`)  
> **Zero runtime dependencies** · **< 2.5 KB gzipped** · **0 layout recalculations**

---

### Tier 1 — Viral, "Stop the Scroll" Designs

These are designed to be the "hero" of the library — designs users screenshot and share.

---

#### 3D-01: `gyroscope` — 3D Gimbal Precession Ring

```
Visual: Three concentric metallic rings rotating independently on X, Y, Z axes
with a glowing suspended orb at the center.
```

**Why it's unique:** No CSS library has ever shipped a true 3D gimbal. This is immediately recognizable as "space tech" or "quantum computing" and will be shared by developers on social media.

**Kinematics:**
- Outer ring: `rotateX(360deg)` in 3.0s
- Middle ring: `rotateY(360deg)` in 4.85s (golden ratio from outer)
- Inner ring: `rotateZ(360deg)` in 7.85s (sum of outer + middle — Fibonacci)
- Core sphere: subtle radial-gradient pulsing glow, no rotation

**CSS Architecture:**
```
.wavelo--gyroscope              ← perspective context (600px)
  .wavelo__part:nth-child(1)    ← outer ring (X-axis rotation)
    .wavelo__part:nth-child(2)  ← middle ring (Y-axis rotation, nested)
      .wavelo__part:nth-child(3)← inner ring (Z-axis rotation, nested)
        .wavelo__part:nth-child(4) ← central glowing orb
```

**Target contexts:** Aerospace apps, quantum computing UIs, security/auth flows, scientific platforms.

---

#### 3D-02: `tesseract` — 4D Hypercube Perspective Projection

```
Visual: A wireframe inner cube that continuously unfolds through the 6 faces
of an outer cube and becomes the outer cube — infinite dimensional topology.
```

**Why it's unique:** The tesseract is the most mathematically elegant shape in 4D geometry. Developers who studied math will immediately recognize it and share it. It looks impossible.

**Kinematics:**
- Inner cube corners animate outward to outer cube corners positions
- Outer cube corners simultaneously animate inward
- Net effect: a continuous morphing between two state where the inside becomes the outside
- Simultaneous slow `rotateY` of the entire assembly for extra depth

**CSS Architecture:**
- 8 vertex dots positioned with `translate3d` keyframes
- 12 connecting "edge" lines via thin `<span>` elements with 3D rotation
- Continuous `rotateY(360deg)` on the parent for global tumble

**Target contexts:** AI/ML platforms, 4D simulation software, advanced tech dashboards, Web3 tooling.

---

#### 3D-03: `sphere-lattice` — Volumetric Rotating Particle Globe

```
Visual: A 3D globe of latitude rings with glowing node intersections.
Nodes on the viewer-facing side are large and bright; nodes behind
are small and dim — perfect depth simulation without WebGL.
```

**Why it's unique:** The "spinning globe" is instantly recognizable and used everywhere in corporate dashboards. This pure CSS version will be stunning and people will not believe it's CSS.

**Kinematics:**
- 5 rings of latitude, each `rotateX(angle)` pitched differently
- Parent rotates `rotateY(360deg)` continuously
- Each node (`:before` pseudo-element at each ring) uses depth-based `scale()` and `opacity` driven by `@property`-registered CSS custom properties
- Globe axial tilt: `rotateX(23.5deg)` (Earth-accurate)

**CSS Architecture:**
```css
.wavelo--sphere-lattice {
  transform-style: preserve-3d;
  perspective: 400px;
  animation: rotateY(360deg) 4s linear infinite;
}
/* 5 latitude rings, each pitched */
.wavelo__part:nth-child(n) {
  transform: rotateX(calc(n * 30deg - 60deg));
  /* child nodes positioned around the ring */
}
```

**Target contexts:** Global CDN ops, geolocation APIs, international finance, world-facing SaaS products.

---

#### 3D-04: `prism-refraction` — Optical Glass Crystal

```
Visual: A floating hexagonal glass prism slowly rotating in 3D.
As it rotates, face luminance shifts between highlight and shadow,
and a chromatic dispersion rainbow fan sweeps across the surroundings.
```

**Why it's unique:** Combines optics simulation with 3D geometry. The color dispersion makes it feel like real light physics. This is the kind of loader that appears in luxury product launches and high-end creative tools.

**Kinematics:**
- Hexagonal prism: 6 side faces + top/bottom caps, each a thin `<span>` with `translateZ`
- Prism tumbles on a diagonal axis: `rotate3d(1, 2, 0.5, 360deg)` in 6s
- Each face: `background: linear-gradient` that shifts luminance based on which `rotateY` value is "facing"
- Chromatic fan: `:before` pseudo with `conic-gradient` of spectral colors, slowly rotating

**Target contexts:** Photography/video tools, luxury e-commerce, design software, generative art platforms.

---

#### 3D-05: `atom-orbital` — Rutherford-Bohr Quantum Atom

```
Visual: A glowing nucleus with 3 tilted elliptical electron orbitals
at 0°, 60°, and 120° angular inclinations in true 3D perspective.
Electrons orbit at variable speed (relativistic perihelion acceleration).
```

**Why it's unique:** The atom is an iconic scientific loader. No existing CSS library does it in proper 3D with multi-axis orbital planes. This is what `solar-system` should have been.

**Kinematics:**
- Nucleus: pulsing radial gradient orb at center
- Ring 1: `rotateX(0deg)` — equatorial orbit
- Ring 2: `rotateX(60deg)` — tilted 60° from equatorial
- Ring 3: `rotateX(120deg)` — tilted 120° (perpendicular pair)
- Each electron: `rotateZ(360deg)` on a child inside each ring frame
- Keplerian speed: `animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1)` to simulate elliptical orbit acceleration

**Target contexts:** Science, biotech, pharmaceutical, nuclear, education, chemistry tools.

---

### Tier 2 — Showcase Designs (Beautiful, Shareable)

---

#### 3D-06: `vortex-tunnel` — Warp Speed Depth Gates

```
Visual: 8 concentric hexagonal rings accelerating toward the viewer
along the Z-axis from a deep vanishing point. Pure CSS warp drive.
```

**Kinematics:**
- 8 rings with staggered `translateZ(-600px)` → `translateZ(200px)` keyframes
- Perspective set very aggressively (`perspective: 200px`) for dramatic foreshortening
- Rings opacity: 0 at max distance, 1 at mid-distance, 0 again as they "pass through" the camera plane
- Ring color: progresses from `secondaryColor` (far/blue-shifted) to `color` (near)

**Target contexts:** Gaming launchers, VPN/tunnel applications, fast data transfer UIs, warp-speed themed deployments.

---

#### 3D-07: `isometric-deck` — Floating Card Stack Shuffle

```
Visual: 4 isometric document cards floating in 3D space at
rotateX(60deg) rotateZ(-45deg). Top card slides off and reappears
at the bottom of the stack with smooth spring animation.
```

**Kinematics:**
- 4 `.wavelo__part` cards stacked at different `translateZ` elevations
- Top card animates: `translateX(120%) translateZ(60px) rotateZ(12deg)` (flies off)
- Remaining cards animate upward: each `translateZ` increases by one slot
- Bottom receives the old top: `translateX(-80%) translateZ(-60px)` (flies in from below)
- Contact shadow per card: `box-shadow` animates with elevation

**Target contexts:** Document management, SaaS platforms, card games, checkout flows, task management apps.

---

#### 3D-08: `voxel-cluster` — Isometric Rubik's Cube Assembly

```
Visual: 8 isometric voxel sub-cubes that explode radially outward,
orbit with angular momentum, and magnetically snap back together
into a unified cube with a satisfying click.
```

**Kinematics:**
- 8 corner cubes start at their unified positions: `translate3d(±X, ±Y, ±Z)`
- Explosion phase: each cube translates outward along its diagonal (`translateZ` + `translateX/Y`)
- Orbit phase: subtle `rotateY` on each sub-cube as they spread
- Reassembly phase: `cubic-bezier(0.34, 1.56, 0.64, 1)` — elastic snap with 8% overshoot then settle
- The entire cluster rotates slowly on `rotateY` at all times for continuous 3D readable-ness

**Target contexts:** Cloud infrastructure, build systems, 3D printing software, Minecraft/voxel game launchers, DevOps deployment UIs.

---

#### 3D-09: `torus-ring` — Möbius Strip Continuous Flow

```
Visual: A 3D torus (donut shape) made from polygonal ribbon segments
that loop continuously through the center hole. A bright light streak
races around the ring's surface.
```

**Kinematics:**
- Torus approximated by 16-24 ribbon segments, each a thin `<span>` with computed 3D positions
- Parent rotates on `rotate3d(1, 1, 0, 360deg)` for tumbling torus rotation
- Light streak: a single bright `<span>` that `rotateZ(360deg)` around the torus with a glowing `box-shadow`
- Color temperature: ring body is `color`, light streak is warm `secondaryColor`

**Target contexts:** Infinite loop workflows, CI/CD pipelines, mathematical platforms, SaaS subscription billing.

---

#### 3D-10: `cylindrical-wave` — 3D Pin Matrix Wave

```
Visual: 12-16 vertical columns arranged in a circle (when viewed from above),
each column extruding and retracting to form a traveling sinusoidal wave
that propagates around the cylinder. Viewed at a 45° isometric angle.
```

**Kinematics:**
- 16 columns arranged radially: `rotateY(angle) translateZ(radius)` for each
- Wave propagation: each column's `scaleY` keyframe is offset by `(index / total) * 100%` delay
- Viewed at: `rotateX(45deg)` on the container for the isometric 3D depth
- Column tops have rounded caps (`:before` pseudo sphere) that rise and fall with the column

**Target contexts:** Audio/music platforms, seismic monitoring, telemetry dashboards, 3D data visualization, sound-to-visual tools.

---

### Tier 3 — Experimental / Conceptual Innovations

These are ideas no other library has ever attempted that push the boundary of what CSS can do.

---

#### 3D-11: `liquid-mercury` — Physics-Simulated Mercury Surface

```
Visual: A blob of liquid mercury that flows under simulated gravity —
pooling at the bottom when still, rippling when "disturbed," and
splitting/merging based on data-wavelo-state transitions.
```

**Why it's unprecedented:** This combines CSS `border-radius` morphing with simulated surface tension physics entirely in keyframes. No JavaScript, no Canvas.

**Kinematics:**
- Base state: mercury pool at the bottom of the bounding box, flat top surface with a convex meniscus
- Active state: surface oscillates with a damped sinusoidal wave across the top edge
- Success state: blob rises, becomes spherical (surface tension "winning" over gravity), then dissolves upward
- Error state: blob flattens hard (impact simulation) then bounces and resettles

**Target contexts:** Fluid simulation platforms, physics engines, chemistry/material apps, futuristic loading concepts.

---

#### 3D-12: `dna-decode` — Decoding Base Pair Scanner

```
Visual: A strip of DNA double helix with a bright "scanner beam"
traversing from top to bottom. As the beam passes each base pair,
the pair lights up with A-T (blue-orange) or G-C (green-purple)
complementary colors — simulating genome sequencing.
```

**Why it's unique:** This extends the existing `helix` design with semantic meaning — it's not just a spinner but a visual narrative of data processing. Perfect for bioinformatics, health tech, and AI training data platforms.

**Kinematics:**
- Based on the existing `helix` CSS architecture (18-rung double helix)
- Add a **scanner element**: a semi-transparent bright band that `translateY`s from 0% to 100%
- Each rung the scanner crosses briefly flashes to a complementary color pair
- Scanner travel duration is the `--wavelo-duration`; the helix rotation is always proportionally faster

---

#### 3D-13: `quantum-superposition` — Wavefunction Collapse Visualization

```
Visual: A particle shown simultaneously at multiple locations (probability
cloud: 6–8 ghost copies at varying opacities and positions) that
"collapses" periodically to a single definite point, then re-expands
into superposition.
```

**Why it's unprecedented:** This is a conceptual physics metaphor implemented purely in CSS. The visual language of quantum mechanics (probability clouds, wavefunction collapse) has never been done as a loading indicator.

**Kinematics:**
- 8 ghost copies of a dot at scattered positions, each at `opacity: 0.1–0.4`
- Collapse phase: all ghosts simultaneously animate to the same central point — `translate(0,0)` — while opacity increases and merges to a single bright dot
- Observed state: single bright dot holds for 0.3s
- Expansion phase: dot splits back into ghost copies that scatter outward with spring-like deceleration
- Cycle: collapse → observe → expand, loop

**Target contexts:** Quantum computing platforms, physics simulation, AI uncertainty visualization, scientific research tools.

---

#### 3D-14: `magnetic-field` — Electromagnetic Field Lines

```
Visual: A central magnetic dipole (North/South poles visible) with
8-12 curved magnetic field lines arching from one pole to the other
and rotating slowly around the dipole axis — like a physics textbook
diagram brought to life.
```

**Kinematics:**
- SVG paths for the curved field lines (precomputed bezier arcs)
- `stroke-dashoffset` animation drives "flow particles" along each field line
- The entire assembly `rotateY(360deg)` for 3D effect
- N pole glows `secondaryColor`, S pole glows `color`

**Target contexts:** Physics education, electrical engineering tools, electromagnetic simulation, scientific dashboards.

---

#### 3D-15: `aurora-borealis` — Northern Lights Shimmer

```
Visual: Sinusoidal translucent bands of color in cool greens/teals/purples
flowing and dancing like the Aurora Borealis — a fully atmospheric
CSS animation with zero JavaScript.
```

**Kinematics:**
- 3-5 layered `<span>` elements with large, slow, independently-phased `border-radius` morphing
- Each band uses a `linear-gradient` in aurora palette (teal, green, magenta, purple)
- Bands are semi-transparent and overlap, creating natural color mixing
- Very slow, organic timing (5–12s cycles) for a meditative, natural feel
- Perfect for "background" loading overlays on creative/artistic applications

**Target contexts:** Arctic tourism, weather apps, astronomy platforms, creative agencies, premium brand loading overlays.

---

### 5.11.4 Pure-CSS 3D Architectural & Performance Mandate

All 3D designs developed for Wavelo must adhere to four strict non-negotiable architectural mandates:

1. **Zero Runtime Dependencies:** No Three.js, Babylon.js, Spline, or heavy WebGL canvas runtimes. All 3D scenes must execute strictly via standards-based CSS 3D transforms (`preserve-3d`, `perspective`, `rotate3d`, `translateZ`) and SVG spatial projections.
2. **Compositor-Only Execution (0 Layout Recalculations):** Every 3D transform must run exclusively on the GPU compositor thread using `transform` and `opacity`. Animated properties must never trigger DOM reflows or style recalculations (verified by `npm run audit:layout`).
3. **Modular Bundle Budget (<2.5 KB Gzipped):** Individual 3D loader slices must remain lightweight, compact, and fully tree-shakable. Importing a single 3D loader must never bloat consumer application bundles.
4. **Accessible Graceful Degradation:** When `prefers-reduced-motion: reduce` is detected, 3D rotations must freeze at an aesthetically pleasing isometric angle or decelerate smoothly to an ultra-slow drift (0.05Hz) to prevent vestibular discomfort.

## 5.12 Catalog Registry

Every public loader must have centralized metadata containing:

- Unique identifier.
- Display name.
- Category.
- Spatial dimensionality ('2d' | '3d').
- Short description.
- Rendering implementation.
- Supported properties.
- Default configuration.
- Accessibility behavior.
- Preview metadata.
- Framework support.
- Documentation route.
- Stability status.

The registry must power the gallery, documentation, search, filters and catalog validation.

The registry must not force consumers to download every loader definition when they import a single loader.

---

# 6. Customization System

## 6.1 Customization Goals & Granular Configuration Mandate

Wavelo must provide exhaustive micro-level styling and macro-level behavioral control while keeping its public API understandable, strictly typed, and consistent across framework adapters.

Every single component design must be as configurable as physically and visually possible:
- **Micro-Level Styling:** Developers must have full control over colors (primary `color`, accent `secondaryColor`, container `backgroundColor`), surface theming (`theme`), dimensions (`size`, `width`, `height`, `strokeWidth`), and micro-geometric tokens (`--wavelo-radius`, `--wavelo-gap`, `--wavelo-parts`).
- **Macro-Level Behavior:** Complete control over motion timing (`duration`, `speed`, `--wavelo-ease`), kinetic direction (`direction`), playback state (`paused`), spatial layout (`inline` vs block), lifecycle mounting (`loading` with zero DOM/CSS cost when inactive), and accessibility/reduced-motion contracts.
- **Component-Specific Tailoring:** Rather than forcing a rigid one-size-fits-all model, parameters must be tailored to the authentic physics, geometry, and visual nature of each individual design (e.g., celestial star maps for `constellation`, 12:1 gear ratio for `clock-spinner`, 16-stop lemniscate for `infinity`, clinical ECG waveforms for `heartbeat`, and 4-phase state transitions for interactive micro-interactions).
- **Category Independence:** An architectural requirement that organizational categories never restrict, suppress, or gate any configuration parameter or render capability.
- **Honoured-Options Fidelity:** The library and documentation website mandate that every loader strictly exposes, documents, and displays controls only for parameters that the design genuinely honours and utilizes. If a parameter is not honoured by a design (such as `strokeWidth` on a solid skeleton or `value` on an indeterminate spinner), it is suppressed from the public options table and Studio controls to prevent confusing developers.

## 6.2 Common Properties

The following API is the proposed baseline:

| Property | Purpose |
|---|---|
| `type` | Select the loader design |
| `size` | Set the overall size |
| `width` | Set width when applicable |
| `height` | Set height when applicable |
| `color` | Set the primary color |
| `secondaryColor` | Set an optional secondary color |
| `backgroundColor` | Set an optional background |
| `speed` | Adjust animation speed |
| `duration` | Set animation duration where appropriate |
| `strokeWidth` | Configure line thickness |
| `theme` | Select the light, dark or system palette for skeleton surfaces |
| `direction` | Reverse the animation on the element that animates |
| `paused` | Pause the animation |
| `label` | Supply an accessible description (`aria-label`) |
| `labelledBy` | Space-separated DOM IDs referencing visible label elements (`aria-labelledby`) |
| `describedBy` | Space-separated DOM IDs referencing caption elements (`aria-describedby`) |
| `valueText` | Human-readable reading of progress value (`aria-valuetext`) |
| `decorative` | Suppress assistive announcements even when a label is supplied (`aria-hidden="true"`) |
| `loading` | Component mounting lifecycle binding (when `false`, renders 0 DOM nodes and 0 CSS bytes) |
| `count` | Repeat count for skeleton lines, items, or multi-part dot/bar rows |
| `inline` | Sits inline on text metrics (`inline-flex` / `inline-block`) |
| `className` | Add custom classes to the rendered element |
| `style` | Apply supported inline styles and custom properties (`LoaderStyle`) |
| `reducedMotion` | Control reduced-motion behavior (`'auto' | 'always' | 'never'`) |
| `data-testid` | Support test identification |
| `value` | Set a determinate progress value |
| `max` | Set the progress maximum |

Any `data-*` key is emitted as an attribute on the rendered element, so test and
analytics hooks need no library change. There is no `variant` option: alternate
looks are separate catalog designs or named presets, never a mode switch on an
existing one.

Specialized loaders also accept contract-defined data attributes:
- `data-wavelo-state`: Stateful micro-interactions (`'idle' | 'loading' | 'success' | 'error'`) supported by `success-ring`, `error-shake`, `button-confirm`, `offline-dot`, `save-indicator`, and `undo-progress`.
- `data-wavelo-constellation`: Astronomical constellation pattern selection (`'ursa-major' | 'orion' | 'cassiopeia' | 'cygnus' | 'ursa-minor'`) supported by `constellation`.

The final API must use one documented naming convention. Aliases should not be added without a demonstrated compatibility need.

## 6.3 Advanced Properties

Loader-specific options may include:

- Dot count.
- Bar count.
- Spacing.
- Radius.
- Border radius.
- Stroke caps.
- Animation delay.
- Stagger interval.
- Rotation direction.
- Scale range.
- Opacity range.
- Gradient colors.
- Gradient angle.
- Number of segments.
- Shape selection.
- Number of orbiting elements.
- Background opacity.
- Overlay position.
- Z-index.
- Progress value.
- Progress thickness.
- Skeleton line count.
- Skeleton dimensions.
- Skeleton radius.
- Shimmer intensity.
- Shimmer direction.
- Custom labels.
- Custom CSS variables.

These options must only appear on loaders for which they have meaningful behavior.

## 6.4 CSS Variables

Provide a stable, strictly scoped set of 23 CSS custom properties:

```css
:root {
  /* Dimensions & Geometry */
  --wavelo-size: 2.5rem;
  --wavelo-width: auto;
  --wavelo-height: auto;
  --wavelo-stroke: 3px;
  --wavelo-radius: 6px;
  --wavelo-gap: 0.5rem;
  --wavelo-parts: 3;

  /* Colors & Theming */
  --wavelo-color: #6366f1;
  --wavelo-secondary-color: #a5b4fc;
  --wavelo-success-color: #22c55e;
  --wavelo-error-color: #ef4444;
  --wavelo-background: transparent;
  --wavelo-scrim: rgba(15, 23, 42, 0.45);
  --wavelo-skeleton-base: #e5e7eb;
  --wavelo-skeleton-highlight: #f9fafb;

  /* Timing & Motion */
  --wavelo-duration: 1s;
  --wavelo-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --wavelo-direction: normal;
  --wavelo-play-state: running;

  /* Progress & Timelines */
  --wavelo-progress: 0%;
  --wavelo-count: 0;
  --wavelo-timeline: auto;

  /* Layering */
  --wavelo-z-index: 10;
}
```

These 23 custom properties are verified against the stylesheet rules and documented in `packages/core/src/types.ts` (`WaveloTokens`).

CSS variables must be scoped so that changing Wavelo configuration does not unexpectedly affect unrelated application elements.

## 6.5 Configuration Precedence

The implementation must define and document a deterministic precedence order for:

1. Library defaults.
2. Theme defaults.
3. Loader-specific defaults.
4. Component properties.
5. Explicit CSS variable overrides.

CSS variables must not unpredictably override configuration in one framework but behave differently in another.

## 6.6 Validation

The library must:

- Validate numeric values.
- Reject or normalize invalid sizes consistently.
- Prevent invalid animation durations.
- Handle unknown loader identifiers safely.
- Avoid injecting user-provided strings as executable code.
- Provide useful development-time warnings.
- Avoid excessive warnings in production.
- Preserve unrelated configuration when one property changes.

## 6.7 Three-Tier Customization Architecture

To provide developers with granular micro-level control without a one-size-fits-all model, options are structured across three distinct tiers:

1. **Tier 1 — Universal Baseline Settings (accepted by 100% of all 153 designs):** Universal structural, lifecycle, accessibility, and theming settings (`type`, `color`, `backgroundColor`, `theme`, `loading`, `inline`, `reducedMotion`, `label`, `labelledBy`, `describedBy`, `decorative`, `className`, `data-testid`, `style`). Accepted is not the same as visibly honoured: a design with no track to paint cannot show `backgroundColor`. Which settings each design actually reads is measured against its render, not asserted here, and `npm run audit:customization` re-measures it in CI.
2. **Tier 2 — Shared Geometric & Temporal Controls (84% – 97% of designs):** Core bounding box dimensions and cycle playback (`size`, `width`, `height`, `duration`, `speed`, `direction`, `paused`).
3. **Tier 3 — Design-Specific & Unique Settings:** Tailored parameters that reflect the specific physical, visual, and mathematical nature of each individual design. The counts are those the measured table reports today:
   - `strokeWidth`: Ring border weight, wire thickness, radar crosshairs, battery chassis and the 3D frames (46 designs).
   - `value`, `max`, `valueText`: Fill levels and accessible values for linear, circular, stepped, and queue progress indicators (18 designs).
   - `count`: Repeating track rows, milestone steps, batch upload queues, and dynamic dot/bar counts (26 designs).
   - `secondaryColor`: A second painted tone — dual rings, tracks, strands, embers, scrims and orbital tracks (62 designs).
   - `data-wavelo-state`: Reactive state transitions across `'idle'`, `'loading'`, `'success'`, and `'error'` for micro-interactions (6 designs).
   - `data-wavelo-constellation`: Astronomical constellation geometry selection (`'ursa-major'`, `'orion'`, `'cassiopeia'`, `'cygnus'`, `'ursa-minor'`).

### Category Independence & Parameter Integrity Verification

A formal audit verified that `Category` has ZERO runtime authority over configurations. No parameter or configuration key is restricted or blocked because of a component's Category:
- **Zero Configuration Gating:** Any component design accepts and honours whatever options its rendering slice and geometry support, regardless of whether it is cataloged under Spinners, Dots, Progress, Bars, Skeletons, Creative, Application, or AI.
- **Decoupled Render Slices:** 9 of the 12 render kinds span multiple categories (`dots` covers 5 categories; `skeleton` covers 3 categories; `wave` covers 5 categories; `progress` covers 2 categories; `ring` covers 3 categories; `shape` covers 3 categories; `orbit` covers 3 categories; `pulse` covers 3 categories; `rings` covers 3 categories).
- **Determinate Progress Semantics:** `supportsProgress` is governed strictly by `kind === 'progress'` in `packages/core/src/registry.ts`, allowing application patterns like `undo-progress` and `page-transition` to expose full `role="progressbar"` semantics and accept `value`, `max`, and `valueText`.

The authoritative component-by-component customization breakdown across all 153 designs—specifying micro-styling, macro-behavior, unique parameters, types, defaults, and what they control—is maintained in `docs/COMPONENT_CUSTOMIZATION_API.md`.

---

# 7. Framework Integration Requirements

## 7.1 React

Provide:

- Typed `Loader` component.
- Individual loader exports.
- Skeleton components.
- Progress components.
- Overlay components.
- Button-loading patterns.
- Hooks only where useful.

Example:

```tsx
import { Loader } from '@wavelo/react';

export function Example() {
  return (
    <Loader
      type="orbiting-dots"
      size={48}
      color="#6366f1"
      label="Loading data"
    />
  );
}
```

Requirements:

- Support the declared React version range.
- Avoid unnecessary re-renders.
- Clean up resources correctly.
- Support SSR where applicable.
- Avoid browser-global access during server rendering.
- Avoid hydration mismatches.
- Use framework-appropriate types and lifecycle patterns.

## 7.2 Angular

Provide:

- Angular-compatible loader components.
- Typed inputs.
- Skeleton and progress components.
- Loading directives where they improve usability.
- Standalone component support where compatible.
- Appropriate packaging and peer dependencies.

Illustrative usage:

```html
<wavelo-loader
  type="three-dots"
  [size]="48"
  color="#6366f1"
  label="Loading data">
</wavelo-loader>
```

Requirements:

- Test supported Angular versions.
- Respect component lifecycle.
- Avoid unnecessary change-detection work.
- Support the documented change-detection strategies.
- Avoid forcing applications to import unrelated framework adapters.

## 7.3 Vue

Provide:

- Typed loader components.
- Reactive properties.
- Skeleton and progress components.
- Appropriate server-rendering support.
- Documented CSS customization.
- Framework-native examples.

## 7.4 Svelte

Provide:

- Components or native custom-element usage.
- Reactive configuration.
- Skeleton and progress patterns.
- Supported SSR behavior.
- Documented styling and installation.

## 7.5 Web Components

Provide a custom-element integration for plain HTML and JavaScript.

Illustrative usage:

```html
<script
  type="module"
  src="/path/to/wavelo-loader.js">
</script>

<wavelo-loader
  type="pulsing-dots"
  size="48"
  color="#6366f1"
  label="Loading data">
</wavelo-loader>
```

Requirements:

- Safe custom-element registration.
- Documented attribute and property behavior.
- Correct lifecycle cleanup.
- CSS isolation strategy.
- No framework runtime dependency.
- Appropriate browser compatibility.
- Clear handling of repeated imports.

## 7.6 Compatibility Matrix

Before public release, define and test:

- Minimum supported framework versions.
- Current supported framework versions.
- Supported browsers.
- SSR compatibility.
- Hydration behavior.
- TypeScript versions.
- Node.js versions required for development and builds.

Compatibility must be verified rather than inferred from the fact that a package builds.

---

# 8. Developer Experience and API Consistency

## 8.1 Basic Usage

A common loading indicator must be easy to add without requiring advanced configuration.

The library must provide a sensible default loader and a small number of clear required properties.

## 8.2 Import Strategies

Support documented import patterns such as:

- General component import.
- Individual loader import.
- Skeleton-only import.
- Progress-only import.
- Optional overlay import.
- Framework-specific import.
- CSS-only or native custom-element usage where supported.

The final import API must not expose accidental internal paths.

## 8.3 Error Handling

Errors must be understandable and actionable.

The library must not silently render nothing when an invalid loader type is supplied without any development feedback.

At the same time, invalid configuration must not crash an entire production application unnecessarily.

## 8.4 Defaults

Defaults must be visually appropriate and accessible.

The common use case must not require developers to configure size, color, duration, labels and theme individually.

## 8.5 Migration Stability

Once an API is public and stable:

- Do not rename properties casually.
- Deprecate obsolete properties with migration guidance.
- Use semantic versioning.
- Document breaking changes.
- Provide automated migration tools only where they deliver real value.

---

# 9. Interactive Documentation Website

## 9.1 Main Objectives

The documentation website must help developers discover, configure, test and adopt loaders quickly.

## 9.2 Required Pages

### Home page

- Product overview.
- Feature summary.
- Installation instructions.
- Featured loaders.
- Framework navigation.

### Loader gallery

- Search.
- Category filters.
- Dimension filters (All dimensions, 2D, 3D).
- Live previews.
- Light and dark backgrounds.
- Size adjustment.
- Color selection.
- Speed adjustment.
- Framework selection.
- Reduced-motion preview.
- Copyable code.
- Direct links to individual loaders.

### Loader detail pages

Each page must include:

- Name and description.
- Live preview.
- Supported configuration.
- Defaults.
- Framework-specific examples.
- Import path.
- Accessibility notes.
- Related loaders.
- Version compatibility.

### API reference

Document public exports, properties, types, defaults and supported combinations.

### Recipes and examples

Provide practical examples for:

- Fetching API data.
- Loading tables.
- Form submission.
- Button loading.
- Image loading.
- Skeleton cards.
- Upload progress.
- Full-screen overlays.
- Infinite scrolling.
- Dashboard loading.

## 9.3 Playground Accuracy

The playground must be driven by the same loader metadata used by the actual library.

It must not present unsupported properties as functional controls.

Generated examples must be checked against real package APIs.

Copy actions must copy valid code for the selected framework. The gallery and studio must provide an interactive framework selector popover upon hovering or clicking "Copy" to allow direct 1-click selection across React, Vue, Svelte, Angular, Vanilla HTML, or Web Components. Every card must also feature a direct 1-click clipboard icon adjacent to the loader identifier (`type: '<id>'`) to copy the programmatic name directly. The studio editor must dynamically introspect each design's verified capability set and only expose configuration controls for options that the selected design genuinely honours and utilizes.

The website must never claim that code works in a framework unless that integration is actually implemented and tested.

## 9.4 Hosting & Deployment Platforms

Wavelo documentation must be accessible through three integrated tiers:

1. **In-Registry Documentation (npm Landing Pages):**
   - Each published package in the monorepo (`@wavelo/core`, `@wavelo/react`, `@wavelo/vue`, `@wavelo/svelte`, `@wavelo/angular`, `@wavelo/vanilla`, `@wavelo/web-components`) must contain a dedicated, standalone `README.md` packaged directly into its npm tarball.
   - Package landing pages on npmjs.com must immediately provide quickstart installation, peer dependency ranges, TypeScript usage examples, subtree provider setup, and SSR guidelines without requiring navigation away from npm.

2. **Interactive Web Documentation & Visual Playground (GitHub Pages / Custom Domain):**
   - Hosted via GitHub Pages (`.github/workflows/pages.yml`) and served from a dedicated domain (e.g., `wavelo.dev` or `princegoel0.github.io/wavelo`).
   - Powered by `apps/docs` as a zero-dependency, self-contained client application built from central catalog metadata.
   - Must provide an interactive configuration playground with live controls (size, stroke width, duration, progress value, colors, corner radius, reverse, pause, and dark mode), instant configuration code generation, a searchable gallery of all 153 loaders, dual-axis filtering (by functional category and 2D/3D dimensionality), and measured option chips verified in Chromium.

3. **In-Repository Knowledge Base (GitHub `/docs`):**
   - Maintained in the repository under `/docs` for source code auditing and offline engineering reference, including `COMPONENT_CUSTOMIZATION_API.md`, `FRAMEWORKS.md`, `RECIPES.md`, `COMPATIBILITY.md`, `PERFORMANCE.md`, and `BUNDLE_SIZE.md`.

## 9.5 Multi-Framework Documentation Architecture

To eliminate developer friction across diverse web ecosystems, documentation must maintain a unified four-part structure for every supported framework:

1. **Unified Configuration Contract:** Document that all framework adapters expose the exact same 27 configuration keys and 23 CSS custom properties (`--wavelo-*`) with deterministic precedence (Provider / context defaults < bound `loaderFor` component < call-site props).
2. **Framework-Specific Idiomatic Patterns:**
   - **React:** `<Loader>`, `<WaveloProvider defaults={...}>`, and `loaderFor(type, defaults)`.
   - **Vue:** `<WaveloLoader>`, `provideWaveloDefaults(...)`, and `loaderFor(type, defaults)`.
   - **Svelte:** `<WaveloLoader>` and context-based `provideWaveloDefaults(...)`.
   - **Angular:** Standalone `<wavelo-loader>` component and `WAVELO_DEFAULTS` injection token.
   - **Vanilla DOM & Custom Elements:** `createWavelo()`, `mountLoader()`, and native custom element `<wavelo-loader>` observing element attributes.
3. **SSR & Hydration Guidelines:** Explicitly document that client-side rendering automatically deduplicates and injects stylesheet slices via `ensureStyles`, while server-side rendering (Next.js, Nuxt, SvelteKit, Angular SSR) requires importing `@wavelo/core/styles.css` in root layouts to guarantee zero Flash of Unstyled Content (FOUC).

## 9.6 Deep-Dive Component API Reference

To document granular configurations without forcing a rigid one-size-fits-all model:

1. **Three-Tier Architecture Presentation:** Group component options into:
   - **Tier 1 (Universal Baseline):** Structural, lifecycle, accessibility, and styling settings accepted by 100% of designs (`type`, `color`, `backgroundColor`, `theme`, `loading`, `inline`, `reducedMotion`, ARIA labels, `className`, `style`).
   - **Tier 2 (Shared Geometric & Temporal):** Dimensions and playback controls (`size`, `width`, `height`, `duration`, `speed`, `direction`, `paused`).
   - **Tier 3 (Component-Specific Settings):** Specialized properties tailored to each design archetype (e.g. `strokeWidth`, `value`, `max`, `valueText`, `count`, `data-wavelo-state`, `data-wavelo-constellation`, and secondary accent colors).
2. **Authoritative Specification:** Maintain the exhaustive per-component breakdown in `docs/COMPONENT_CUSTOMIZATION_API.md`.
3. **Gallery Option Badges:** In the interactive gallery, display dynamic chips under each component preview card representing only the options actually honoured by that design (verified via Chromium computed-style measurements).

## 9.7 Automation, Invariants & Release Synchronization

Documentation must never drift from the underlying codebase. The following automated controls are mandatory:

1. **Continuous Documentation Drift Guard (`npm run docs:check`):**
   - The `scripts/validate-docs.mjs` script runs in CI on every push and pull request.
   - Enforces exact matches across code and docs for catalog counts (153 active designs, 231 named presets, 78 pattern presets), token counts (23 custom properties), configuration keys (27 keys), and measured bundle sizes. Any drift fails the build.
2. **Accessibility & Gallery Verification (`npm run docs:verify`):**
   - Validates that all 153 preview cards render without markup errors and asserts zero accessibility violations using `axe-core`.
3. **Automated Continuous Deployment (`.github/workflows/pages.yml`):**
   - Automatically builds `apps/docs` into `apps/docs/dist/index.html` and deploys to GitHub Pages on every merge to `main`.
4. **Atomic Release Synchronization (`.github/workflows/release.yml`):**
   - Releases are triggered on `main` when `RELEASE_ENABLED` is true. The release pipeline packages updated READMEs into publishable tarballs and deploys documentation simultaneously, ensuring that npm package pages and live web docs update atomically with every new version.

---

# 10. Accessibility Requirements

Accessibility is mandatory across all packages.

Requirements:

1. Support meaningful accessible labels.
2. Avoid announcing every animation frame.
3. Respect `prefers-reduced-motion`.
4. Provide static or reduced-motion alternatives.
5. Use correct progress semantics for determinate progress.
6. Do not invent percentage values for indeterminate loaders.
7. Avoid unnecessary screen-reader output from decorative elements.
8. Maintain suitable visual contrast.
9. Avoid relying exclusively on color to convey progress.
10. Do not automatically place every loader in an assertive live region.
11. Avoid trapping keyboard focus in overlays.
12. Provide clear guidance for announcing application loading-state changes.
13. Ensure interactive controls in the library are keyboard accessible.
14. Avoid flashing or motion patterns that create unnecessary accessibility risks.

The project must include automated accessibility checks and manual verification of important interaction patterns.

---

# 11. Performance and Bundle Efficiency

## 11.1 Performance Principles

- Prefer CSS animations for simple effects.
- Use SVG when vector geometry is suitable.
- Avoid continuous JavaScript animation loops when CSS is sufficient.
- Avoid unnecessary layout recalculations.
- Avoid creating hundreds of DOM elements for simple loaders.
- Avoid excessive timers and event listeners.
- Avoid rendering the full catalog when one loader is imported.
- Avoid loading the documentation website into consumer applications.
- Avoid unnecessary runtime dependencies.
- Avoid global CSS resets.
- Avoid heavy visual effects when simpler alternatives are sufficient.

## 11.2 Tree-Shaking

The packages must support modular imports and tree-shaking.

A developer importing a basic spinner must not automatically download every skeleton template, overlay component and creative animation.

Requirements:

- Explicit package exports.
- ESM builds.
- TypeScript declarations.
- Correct `sideEffects` metadata.
- CSS imports that preserve necessary styles.
- Automated bundle-analysis checks.
- Consumer installation tests.

Do not mark files as side-effect-free if importing them performs required registration or global initialization.

## 11.3 Bundle-Size Budgets

Initial proposed targets:

- One basic loader's incremental implementation cost: target 5 KB or less minified and gzipped.
- Shared core: target 10 KB or less minified and gzipped for the basic runtime, excluding optional adapters and separately imported assets.
- Adapter overhead: target 5 KB or less of additional library code where technically practical, excluding framework runtimes.

These are initial targets, not guaranteed measurements.

> **How they turned out.** The budgets `scripts/bundle.mjs` enforces today are 10,240 B for a
> single design chosen at build time (measured 9,073 B gzipped) and 51,200 B for the runtime
> renderer (measured 44,372 B). The 5 KB loader target is met at the small end of the catalog
> and missed by designs that share a crowded render kind, because a design imports its whole
> kind's rules; the 10 KB core target is missed by design — a runtime-selected renderer has to
> carry all twelve slices. The gap is recorded rather than closed quietly:
> `docs/BUNDLE_SIZE.md` states both targets' real outcome and why.

The project must establish real baseline measurements, define what is included in each budget, and revise targets only with documented justification.

CI must report bundle sizes and flag unexplained increases.

## 11.4 Rendering Performance

The team must measure representative loaders on desktop and mobile browsers.

Tests should examine:

- Frame stability.
- CPU overhead.
- Memory growth.
- DOM node count.
- Repeated mounting and unmounting.
- Large lists of skeletons.
- Multiple simultaneous loaders.
- Theme changes.
- Configuration updates.

Performance must be evaluated against the intended use case rather than making unsupported universal performance claims.

### Compositor-Only Motion Mandate

Animations must prioritize compositor-only properties (`transform`, `opacity`). Box-model mutations (`height`, `width`, `top`, `left`, `margin`, `padding`) trigger synchronous layout recalculations and are strictly disallowed unless mathematically and visually essential.

- **Automated Gate:** `npm run audit:layout` renders 150 instances of every loader in Chromium across two seconds, reads the browser's own layout counter, and fails on any design that costs a layout without a recorded reason.
- **Accounted Exemptions:** Any layout recalculation must be justified and recorded in `docs/PERFORMANCE.md` (currently `progress-scroll` and `multi-wave`).

---

# 12. Security, CSS Isolation and Reliability

## 12.1 Security

- Never execute user-supplied configuration as JavaScript.
- Avoid unsafe HTML insertion.
- Validate inputs.
- Avoid unnecessary network requests.
- Do not collect telemetry by default.
- Do not require credentials for library usage.
- Avoid hidden external dependencies.
- Protect documentation deployment credentials.
- Audit dependency vulnerabilities.
- Publish from protected release workflows.

## 12.2 CSS Isolation

The library must not unintentionally modify:

- Global fonts.
- Application colors.
- Global element styles.
- Other component classes.
- Host page animation settings.
- Unrelated CSS variables.

Use scoped classes and documented CSS variables.

For Web Components, document the chosen Shadow DOM or light DOM approach and its customization trade-offs.

## 12.3 Cleanup

Components must clean up:

- Event listeners.
- Timers.
- Observers.
- Animation resources.
- Subscriptions.
- Temporary DOM elements.

Prefer CSS animations that require no JavaScript cleanup when suitable.

## 12.4 SSR and Hydration

Where SSR is supported:

- Avoid browser-only globals during module initialization.
- Avoid non-deterministic initial markup.
- Prevent hydration mismatches.
- Ensure optional custom-element registration does not break server rendering.
- Document required client-only behavior.

---

# 13. Testing and Quality Assurance

## 13.1 Unit Tests

Test:

- Configuration defaults.
- Loader registry.
- Loader identifiers.
- Property validation.
- Progress calculations.
- Animation configuration.
- Theme behavior.
- Accessibility attributes.
- Custom-element registration.
- Cleanup.
- Export paths.
- CSS variable contracts.

## 13.2 Framework Integration Tests

React tests must cover mounting, updating, unmounting, SSR and hydration where supported.

Angular tests must cover input changes, lifecycle, change detection and documented component integration.

Vue and Svelte tests must cover their public component APIs and supported SSR behavior.

Web Component tests must cover registration, attributes, properties, lifecycle and styling.

## 13.3 Browser Tests

Use Playwright or equivalent tooling to test:

- Rendering.
- Configuration changes.
- Skeleton layouts.
- Progress values.
- Theme changes.
- Reduced-motion behavior.
- Accessibility attributes.
- Overflow and responsive layout.
- Repeated mount/unmount cycles.
- Console errors.
- Real usage examples.

Three engines run in CI. Chromium carries the full suite; Firefox and WebKit each run a
smoke suite (`npm run test:browser:firefox`, `npm run test:browser:webkit`) covering sheet
application, option and ancestor-token inheritance, painting for every design, the custom
element, and both timeline paths. WebKit stands in for Safari — the same engine, not an
Apple-shipped browser — and is where the scroll- and view-timeline enhancement is measured,
because Firefox 157 only exercises the fallback.

## 13.4 Package Installation Tests

The release pipeline must test actual packed packages.

For each package intended for publication:

1. Build the package.
2. Generate its npm tarball.
3. Install it in a clean test project.
4. Import its documented entry points.
5. Compile TypeScript examples.
6. Run applicable integration tests.
7. Verify required CSS and assets are included.
8. Confirm unrelated framework dependencies are not pulled in.

A successful monorepo build alone is insufficient evidence that the published package works.

## 13.5 Release Gates

A release candidate must pass:

- Linting and strict TypeScript type checking (`tsc --noEmit`).
- Unit and framework adapter test suites (52 tests).
- Cross-browser test suites (Chromium 36 tests, Gecko smoke 6 tests, WebKit smoke 7 tests).
- Layout recalculation profiler (`npm run audit:layout` — 151/153 zero-layout).
- Visual correctness audit (`npm run audit:visual:correctness`).
- Measured options customization verification (`npm run audit:customization`).
- Catalog drift validation (`npm run catalog`).
- Documentation invariant synchronization (`npm run docs:check`).
- Package archive tests (`npm run pack:check` and `npm run pack:verify`).
- Bundle-size budgets enforcement (`npm run measure`).
- Accessibility validation (`axe-core` clean).

No mandatory gate may be skipped without an explicit, recorded approval.

---

# 14. Repository Structure

The proposed monorepo structure is:

```text
wavelo/
├── apps/
│   └── docs/
├── packages/
│   ├── core/
│   ├── react/
│   ├── angular/
│   ├── vue/
│   ├── svelte/
│   └── web-components/
├── examples/
│   ├── vanilla/
│   ├── react/
│   ├── angular/
│   ├── vue/
│   └── svelte/
├── scripts/
├── tests/
│   ├── integration/
│   ├── browser/
│   └── package-validation/
├── .github/
│   └── workflows/
├── AGENTS.md
├── package.json
├── tsconfig.json
└── README.md
```

Only packages with implemented functionality may be published.

The repository must include a documented contribution process, local development instructions, test commands and release procedures.

---

# 15. npm Packaging and Versioning

## 15.1 Package Naming

The Wavelo brand has been selected for the project.

Before finalizing npm package names:

- Check exact package availability.
- Check the availability of the intended scope.
- Check relevant trademarks.
- Check domain availability.
- Review existing products with similar names.
- Confirm consistent naming across the package family.

The brand selection does not itself establish npm or trademark availability.

## 15.2 Versioning

Follow semantic versioning.

- Patch: backward-compatible fixes.
- Minor: backward-compatible functionality.
- Major: breaking API changes.

Use prereleases for integration testing.

Until `1.0.0` the whole surface is still being found, so a minor version (`0.x`) may
change configuration keys, option meanings or entry points, and each such change is
recorded in `CHANGELOG.md` under a `Breaking` line and in the migration guide. What
`0.x` never does is leave a caller guessing: an option that stops applying is
removed and reported, never silently ignored. From `1.0.0` the rules above apply in
full, and the measured option table plus the browser suites are what make a
"compatible" claim checkable.

Each package must have an accurate version, dependency declaration, changelog and compatibility statement.

## 15.3 Publishing

Automated publishing must occur only through an authorized release workflow.

Requirements:

- Protected credentials.
- Validated package metadata.
- Passing quality gates.
- Release notes.
- Version tags.
- Correct package access settings.
- Verification of published artifacts.
- A documented rollback or deprecation procedure.

Unreviewed pull requests must not publish packages automatically.

---

# 16. Development Phases

## Phase 1 — Requirements and architecture

Deliverables:

- Finalized package API.
- Architecture decision records.
- Package naming investigation.
- Repository setup.
- Loader metadata model.
- Dependency rules.
- Initial testing and build infrastructure.
- `AGENTS.md`.

Exit criterion: Approved architecture with reproducible builds.

## Phase 2 — Core engine

Deliverables:

- Shared configuration types.
- Validation and normalization.
- CSS variables.
- Theme system.
- Accessibility conventions.
- Initial 15–20 loaders.
- Unit tests.

Exit criterion: The core works independently of frontend frameworks.

## Phase 3 — Framework adapters

Deliverables:

- React integration.
- Angular integration.
- Web Component integration.
- Vue integration.
- Svelte integration or a validated native integration path.
- Framework examples.
- Integration tests.

Exit criterion: Every advertised adapter passes its compatibility and installation tests.

## Phase 4 — Catalog expansion

Deliverables:

- At least 60 distinct animation designs.
- At least 20 skeleton presets or primitives.
- At least 10 progress-indicator designs or variants.
- At least 10 application loading patterns.
- At least 100 documented presets and patterns overall.

Exit criterion: The unique catalog count is verified automatically and all published entries have working implementations.

## Phase 5 — Advanced customization

Deliverables:

- Common property system.
- Loader-specific options.
- Theme customization.
- CSS variable documentation.
- Composition primitives.
- Configuration validation.
- Type-safe APIs.

Exit criterion: Developers can customize common properties consistently and create useful variants without modifying library source code.

## Phase 6 — Documentation website

Deliverables:

- Home page.
- Searchable catalog.
- Interactive previews.
- Framework selector.
- Code copying.
- API reference.
- Examples and recipes.
- Responsive layouts.

Exit criterion: A developer can find, configure and integrate a loader using the published package.

## Phase 7 — Hardening and optimization

Deliverables:

- Accessibility review.
- Bundle-size measurements.
- Browser tests.
- SSR and hydration tests.
- CSS isolation review.
- Package archive tests.
- Security review.
- CI release gates.

Exit criterion: All mandatory release criteria pass.

## Phase 8 — Public release

Deliverables:

- Published stable packages.
- Public documentation.
- Changelog and version tags.
- Contribution guidelines.
- Support and issue-reporting process.

Exit criterion: All published packages install successfully in clean projects and meet their documented contracts.

---

# 17. PRD Audit Findings and Required Resolutions

This section records the main weaknesses identified in the earlier specification and how this version addresses them.

## Finding A — Loader quantity was too loosely defined

**Problem:** A requirement for 40 loaders did not establish how many were genuinely different or how catalog completeness would be verified.

**Resolution:** Require 60 distinct animation designs and 100 or more total documented presets and patterns. Maintain unique identifiers in a central registry and validate catalog counts automatically.

## Finding B — A shared core could become a dependency bottleneck

**Problem:** A core package containing every animation, framework adapter and UI feature could increase installation cost and complexity.

**Resolution:** Separate framework adapters, keep common definitions independent of frameworks, and verify individual imports through packed-package and bundle-analysis tests.

## Finding C — Framework parity could be misleading

**Problem:** The same property may behave differently in React, Angular, Vue and Web Components because of different rendering and lifecycle rules.

**Resolution:** Centralize configuration semantics, maintain framework-specific tests, and advertise only verified capabilities.

## Finding D — Excessive customization could make the API difficult

**Problem:** Exposing every conceivable property on every loader would create a confusing API and unsupported combinations.

**Resolution:** Standardize common properties and expose specialized properties only when relevant. Define defaults, validation, precedence and compatibility behavior explicitly.

## Finding E — Performance targets were not sufficiently measurable

**Problem:** Describing the library as lightweight without measuring actual published artifacts could hide dependency or bundle growth.

**Resolution:** Establish bundle-size budgets, measure incremental imports, inspect package archives and enforce CI checks.

## Finding F — Accessibility needed more specific acceptance criteria

**Problem:** Merely claiming reduced-motion and accessibility support does not prove that screen readers, progress indicators or overlays behave correctly.

**Resolution:** Include accessibility semantics, reduced-motion alternatives, automated checks and manual verification.

## Finding G — Documentation could drift from the implementation

**Problem:** Manually maintained examples and playground controls can become incompatible with the published API.

**Resolution:** Generate or validate examples against the real package APIs and central loader metadata.

## Finding H — A monorepo build does not guarantee a usable npm package

**Problem:** Missing files, incorrect exports, peer-dependency mistakes and absent CSS can cause failures after publishing.

**Resolution:** Test packed npm artifacts in clean projects before release.

## Finding I — More loaders could increase maintenance without adding value

**Problem:** Hundreds of nearly identical variants could make the library harder to maintain.

**Resolution:** Use reusable animation primitives, require meaningful visual or functional differences, and count unique designs separately from cosmetic variants.

## Finding J — SSR and cleanup were not sufficiently emphasized

**Problem:** Browser-only APIs and unmanaged timers or listeners can create failures in server-rendered applications and repeated component mounts.

**Resolution:** Make SSR, hydration and cleanup explicit requirements for integrations that advertise those capabilities.

---

# 18. Additional Product Improvements

The following improvements should be implemented where they deliver clear developer value.

## 18.1 Custom Loader Builder

The documentation playground should allow developers to:

- Select a base animation.
- Change its colors.
- Adjust its dimensions and timing.
- Change supported structural parameters.
- Preview reduced-motion behavior.
- Copy the resulting configuration.
- Export a supported CSS or SVG definition when practical.

Generated output must be valid and must not require private internal APIs.

## 18.2 Loader Composition

Provide reusable primitives for:

- Dots.
- Rings.
- Bars.
- Shapes.
- Pulses.
- Waves.
- Skeleton blocks.

Developers should be able to create useful combinations through a documented API.

Composition must not require unrestricted execution of arbitrary user-supplied JavaScript.

## 18.3 Preset Collections

Provide logical groups such as:

- Minimal.
- Classic.
- Creative.
- Dashboard.
- E-commerce.
- Skeletons.
- Progress.
- Branded.

Collections must be metadata groupings or efficient optional imports, not reasons to duplicate the underlying implementations.

## 18.4 Reduced-Motion and Static Variants

Where appropriate, provide:

- Static indicators.
- Reduced-motion variants.
- Configurable animation intensity.
- Disabled animation mode.

Reduced-motion behavior must work consistently regardless of whether a loader is imported through a framework adapter or used as a Web Component.

---

# 19. Definition of Done

A loader is complete only when:

1. Its identifier and metadata are registered.
2. Its implementation works.
3. Its supported properties are documented.
4. Its defaults are defined.
5. Its accessibility behavior is verified.
6. Its reduced-motion behavior is tested.
7. Its preview is available.
8. Its examples are valid.
9. Its bundle impact is measured where relevant.
10. Its framework compatibility is tested where advertised.

A framework integration is complete only when its public API, lifecycle behavior, SSR claims, TypeScript declarations, package exports and clean-install tests are verified.

A release is complete only when all mandatory release gates pass.

---

# 20. Version 1.0.0 Acceptance Criteria

The stable release must satisfy all mandatory criteria:

- At least 60 distinct animation designs (Shipped: 153 active designs).
- At least 100 total named presets and loading patterns (Shipped: 231 named presets).
- Dual classification: Every loader categorized by UX function and Spatial Dimensionality (`2d` vs `3d`).
- Compositor-only performance: Zero layout recalculations per frame across the catalog (with documented exceptions).
- All common spinner, dot, bar, skeleton, progress and overlay categories represented.
- React and Angular integrations implemented and tested.
- Vue, Svelte and Web Component integrations implemented and tested to the extent advertised.
- Common customization properties behave consistently.
- Specialized customization is documented.
- Tree-shaking and individual imports are verified.
- Accessibility and reduced-motion requirements pass.
- TypeScript declarations are available.
- Package exports and dependencies are correct.
- Published package archives install and run in clean sample projects.
- Documentation examples and playground controls match the actual APIs.
- SSR and hydration behavior are tested where supported.
- Bundle-size budgets are measured and enforced.
- Security and licensing checks pass.
- No unresolved critical defects remain.
- npm package names and publication permissions are confirmed.
- Release notes and compatibility documentation are complete.

---

# 21. Final Product Definition

Wavelo is a comprehensive, framework-independent loading and motion library that provides a large catalog of production-ready loading experiences, extensive customization, accessible defaults and lightweight framework-specific integrations.

The product succeeds when developers can solve common loading problems quickly, create distinctive loading experiences without excessive code, and integrate the library without introducing unnecessary dependencies, performance regressions or maintenance burdens.

**The defining principle is simple: maximum useful variety, minimum developer friction.**

**End of PRD — Wavelo Version 2.0**

---

# 22. Implementation Clarifications

The following clarifications are part of the v2 specification and resolve
implementation ambiguities discovered during technical review:

- The framework-independent core exposes a serializable rendering contract. DOM
  mounting and custom-element registration are separate integrations and must not
  run during module evaluation.
- The initial publish boundary is modular: the core is dependency-free, adapters
  declare only their relevant framework peer dependencies, and no adapter is
  pulled in by the core.
- A labelled loader exposes a status or progress semantic; an unlabelled decorative
  loader is hidden from assistive technology. Determinate progress must use only
  application-supplied values.
- `reducedMotion` supports `auto`, `always`, and `never`. `auto` follows the user
  preference media query, `always` disables animation, and `never` explicitly opts
  out of the library's reduced-motion rule.
- User-controlled CSS values are restricted to validated, scoped `--wavelo-*`
  variables. Configuration must never be treated as executable markup or code.
- The registry is the source of truth for catalog counts, documentation, search,
  previews, supported options and catalog validation.
- Dimensionality is a first-class metadata property: `LoaderDimension = '2d' | '3d'` on `LoaderDefinition`, exposed in the catalog as a 6-element tuple and surfaced via gallery filtering.
- The configuration surface is strictly bounded to 27 declared keys in `loaderConfigKeys`, verified by `config.ts` type-level constraints.
- The token surface consists of exactly 23 verified `--wavelo-*` properties declared in `WaveloTokens`.
- Micro-interactions communicate state changes via `data-wavelo-state` across `'idle'`, `'loading'`, `'success'`, and `'error'`.
- `LoaderDefinition.category` is strictly taxonomic metadata used by the documentation gallery filter and catalog organization. The runtime core, validators, and framework adapters never branch on or restrict configuration based on `category`.
- Bundle budgets are release gates only after measuring packed artifacts. Initial
  targets are 10 KB gzipped for the basic core runtime and 5 KB gzipped for an
  individual loader entry.
- Framework compatibility claims must name tested versions. A successful
  monorepo build alone does not establish framework, SSR, hydration or clean
  installation support.