# Loader visual correctness audit

## Scope and evidence

- **Inspected:** all 69 active designs, plus the 12 deprecated aliases.
- **Generated artifact:** [catalog-corrected-contact-sheet.png](../release-audit/catalog-corrected-contact-sheet.png).
- **Website under test:** the rebuilt `apps/docs/dist/index.html`, served by the
  same static gallery test path.
- **Automated evidence:** every card was located by its public ID; actual DOM
  classes, child-part counts, computed CSS animation names, progress CSS
  variables, desktop rendering, and 375px mobile overflow were inspected.
- **Human evidence:** the corrected contact sheet was visually reviewed for
  recognizable geometry, blank previews, clipping, inconsistent sizing, and
  obvious generic fallback output. A static image cannot prove animation timing
  or subjective quality, so the report does not treat it as sole proof.

## Root cause found

The previous renderer dispatched most IDs only by broad `kind` and emitted
identical child structures. Many descriptions therefore had no corresponding
ID-specific geometry or animation. Progress rings also did not bind their
configured value to the visual ring fill. Deprecated aliases rendered under
their alias definitions instead of the canonical implementation.

## Results

All 69 active designs now have an explicit implementation contract
in the renderer. The corrected renderer adds ID-specific markup/CSS for dot
paths, orbit geometry, bar timing, waveforms, ripples, helix, infinity, radar,
progress fills, skeleton compositions, and creative shapes. The 12 aliases
resolve to their canonical definitions while preserving their public imports.

| ID | Displayed name | Expected shape/behavior | Actual renderer evidence | Animation result | Verification |
|---|---|---|---|---|---|
| `ring` | Ring | An open circular stroke rotates around its center. | kind=ring; parts=1; classes=wavelo wavelo--ring wavelo--ring; animations=wavelo-spin | animated CSS contract present | PASS |
| `dual-ring` | Dual ring | Two concentric strokes rotate in opposite directions. | kind=rings; parts=1; classes=wavelo wavelo--rings wavelo--dual-ring; animations=wavelo-spin, wavelo-spin | animated CSS contract present | PASS |
| `dotted-circle` | Dotted circle | Eight dots travel around a circular path. | kind=dots; parts=8; classes=wavelo wavelo--dots wavelo--dotted-circle; animations=wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit | animated CSS contract present | PASS |
| `half-circle` | Half circle | A partial circular arc sweeps around its center. | kind=ring; parts=1; classes=wavelo wavelo--ring wavelo--half-circle; animations=wavelo-spin | animated CSS contract present | PASS |
| `ellipse` | Elliptical spinner | An elliptical stroke rotates on its long axis. | kind=ring; parts=1; classes=wavelo wavelo--ring wavelo--ellipse; animations=wavelo-spin | animated CSS contract present | PASS |
| `rotating-square` | Rotating square | A square morphs and rotates as one solid shape. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--rotating-square; animations=wavelo-shape | animated CSS contract present | PASS |
| `rotating-diamond` | Rotating diamond | A diamond rotates as a four-sided shape. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--rotating-diamond; animations=wavelo-shape | animated CSS contract present | PASS |
| `orbiting-dots` | Orbiting dots | Five solid dots visibly orbit a central point. | kind=orbit; parts=5; classes=wavelo wavelo--orbit wavelo--orbiting-dots; animations=wavelo-orbit, wavelo-orbit, wavelo-orbit, wavelo-orbit, wavelo-orbit | animated CSS contract present | PASS |
| `orbiting-circles` | Orbiting circles | Outlined circles visibly orbit a central point. | kind=orbit; parts=5; classes=wavelo wavelo--orbit wavelo--orbiting-circles; animations=wavelo-orbit, wavelo-orbit, wavelo-orbit, wavelo-orbit, wavelo-orbit | animated CSS contract present | PASS |
| `gradient-ring` | Gradient ring | A ring with a secondary-color gradient rotates. | kind=ring; parts=1; classes=wavelo wavelo--ring wavelo--gradient-ring; animations=wavelo-spin | animated CSS contract present | PASS |
| `svg-star` | SVG star | A star silhouette rotates and morphs. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--svg-star; animations=wavelo-shape | animated CSS contract present | PASS |
| `three-dots` | Three dots | Three dots pulse in sequence. | kind=dots; parts=3; classes=wavelo wavelo--dots wavelo--three-dots; animations=wavelo-pulse, wavelo-pulse, wavelo-pulse | animated CSS contract present | PASS |
| `bouncing-dots` | Bouncing dots | Five dots bounce vertically with staggered timing. | kind=dots; parts=5; classes=wavelo wavelo--dots wavelo--bouncing-dots; animations=wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot | animated CSS contract present | PASS |
| `pulsing-dots` | Pulsing dots | Three dots pulse as a compact sequence. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--pulsing-dots; animations=wavelo-pulse, wavelo-pulse, wavelo-pulse | animated CSS contract present | PASS |
| `fading-dots` | Fading dots | Five dots fade in sequence without changing position. | kind=dots; parts=5; classes=wavelo wavelo--dots wavelo--fading-dots; animations=wavelo-fade-dot, wavelo-fade-dot, wavelo-fade-dot, wavelo-fade-dot, wavelo-fade-dot | animated CSS contract present | PASS |
| `scaling-dots` | Scaling dots | Three dots scale rhythmically. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--scaling-dots; animations=wavelo-scale-dot, wavelo-scale-dot, wavelo-scale-dot | animated CSS contract present | PASS |
| `rotating-dots` | Rotating dots | Dots rotate around a center rather than translating linearly. | kind=orbit; parts=5; classes=wavelo wavelo--orbit wavelo--rotating-dots; animations=wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit, wavelo-dot-orbit | animated CSS contract present | PASS |
| `dot-wave` | Dot wave | Five dots move vertically as a wave. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--dot-wave; animations=wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave | animated CSS contract present | PASS |
| `grid-pulse` | Grid pulse | A compact dot matrix pulses as a group. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--grid-pulse; animations=wavelo-pulse, wavelo-pulse, wavelo-pulse | animated CSS contract present | PASS |
| `alternating-dots` | Alternating dots | Odd and even dots move in opposite phases. | kind=dots; parts=5; classes=wavelo wavelo--dots wavelo--alternating-dots; animations=wavelo-alt-dot, wavelo-alt-dot-reverse, wavelo-alt-dot, wavelo-alt-dot-reverse, wavelo-alt-dot | animated CSS contract present | PASS |
| `expanding-dot` | Expanding dot | A single dot expands and contracts. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--expanding-dot; animations=wavelo-pulse, wavelo-pulse, wavelo-pulse | animated CSS contract present | PASS |
| `ripple-dot` | Ripple dot | A central dot emits expanding rings. | kind=rings; parts=1; classes=wavelo wavelo--rings wavelo--ripple-dot; animations=wavelo-spin, wavelo-spin | animated CSS contract present | PASS |
| `staggered-dots` | Staggered dots | Five dots bounce with staggered phase offsets. | kind=dots; parts=5; classes=wavelo wavelo--dots wavelo--staggered-dots; animations=wavelo-stagger-dot, wavelo-stagger-dot, wavelo-stagger-dot, wavelo-stagger-dot, wavelo-stagger-dot | animated CSS contract present | PASS |
| `vertical-dots` | Vertical bouncing dots | Dots bounce in a vertical stack. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--vertical-dots; animations=wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot | animated CSS contract present | PASS |
| `equalizer` | Equalizer bars | Five bars change height in an audio equalizer pattern. | kind=bars; parts=5; classes=wavelo wavelo--bars wavelo--equalizer; animations=wavelo-equalizer, wavelo-equalizer, wavelo-equalizer, wavelo-equalizer, wavelo-equalizer | animated CSS contract present | PASS |
| `bouncing-bars` | Bouncing bars | Bars bounce as separate vertical columns. | kind=bars; parts=5; classes=wavelo wavelo--bars wavelo--bouncing-bars; animations=wavelo-bounce-bar, wavelo-bounce-bar, wavelo-bounce-bar, wavelo-bounce-bar, wavelo-bounce-bar | animated CSS contract present | PASS |
| `vertical-pulse-bars` | Vertical pulse bars | Bars pulse vertically with opacity changes. | kind=bars; parts=5; classes=wavelo wavelo--bars wavelo--vertical-pulse-bars; animations=wavelo-pulse-bar, wavelo-pulse-bar, wavelo-pulse-bar, wavelo-pulse-bar, wavelo-pulse-bar | animated CSS contract present | PASS |
| `horizontal-pulse-bars` | Horizontal pulse bars | A horizontal bar composition pulses in width. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--horizontal-pulse-bars; animations=wavelo-horizontal-pulse, wavelo-horizontal-pulse, wavelo-horizontal-pulse, wavelo-horizontal-pulse, wavelo-horizontal-pulse | animated CSS contract present | PASS |
| `waveform` | Waveform | Five bars form a moving waveform. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--waveform; animations=wavelo-waveform, wavelo-waveform, wavelo-waveform, wavelo-waveform, wavelo-waveform | animated CSS contract present | PASS |
| `fading-bars` | Fading bars | Bars fade in sequence while retaining their geometry. | kind=bars; parts=5; classes=wavelo wavelo--bars wavelo--fading-bars; animations=wavelo-fade-bar, wavelo-fade-bar, wavelo-fade-bar, wavelo-fade-bar, wavelo-fade-bar | animated CSS contract present | PASS |
| `growing-bars` | Growing bars | Bars grow and shrink to different heights. | kind=bars; parts=5; classes=wavelo wavelo--bars wavelo--growing-bars; animations=wavelo-grow-bar, wavelo-grow-bar, wavelo-grow-bar, wavelo-grow-bar, wavelo-grow-bar | animated CSS contract present | PASS |
| `alternating-bars` | Alternating bars | Odd and even bars use complementary timing. | kind=bars; parts=5; classes=wavelo wavelo--bars wavelo--alternating-bars; animations=wavelo-grow-bar, wavelo-fade-bar, wavelo-grow-bar, wavelo-fade-bar, wavelo-grow-bar | animated CSS contract present | PASS |
| `segmented-bar` | Segmented bar | A determinate segmented progress track displays progress. | kind=progress; parts=5; classes=wavelo wavelo--progress wavelo--segmented-bar; animations=none | static by design | PASS |
| `moving-stripe` | Moving stripe | Diagonal stripes travel continuously. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--moving-stripe; animations=wavelo-stripe, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave | animated CSS contract present | PASS |
| `traveling-highlight` | Traveling highlight | A highlight sweeps across the loader. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--traveling-highlight; animations=wavelo-highlight, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave | animated CSS contract present | PASS |
| `oscillating-line` | Oscillating line | A line oscillates vertically. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--oscillating-line; animations=wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave, wavelo-wave | animated CSS contract present | PASS |
| `multi-wave` | Multi-wave | Multiple bars move in opposing wave phases. | kind=wave; parts=5; classes=wavelo wavelo--wave wavelo--multi-wave; animations=wavelo-waveform, wavelo-waveform-reverse, wavelo-waveform, wavelo-waveform-reverse, wavelo-waveform | animated CSS contract present | PASS |
| `ripple-circles` | Ripple circles | Several expanding circular ripples are emitted. | kind=rings; parts=3; classes=wavelo wavelo--rings wavelo--ripple-circles; animations=wavelo-spin, wavelo-spin, wavelo-ripple, wavelo-ripple, wavelo-ripple | animated CSS contract present | PASS |
| `expanding-circles` | Expanding circles | Concentric circles expand and contract. | kind=rings; parts=3; classes=wavelo wavelo--rings wavelo--expanding-circles; animations=wavelo-spin, wavelo-spin, wavelo-expand-ring, wavelo-expand-ring, wavelo-expand-ring | animated CSS contract present | PASS |
| `morphing-shapes` | Morphing shapes | A solid shape changes radius and rotation. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--morphing-shapes; animations=wavelo-shape | animated CSS contract present | PASS |
| `infinity` | Infinity loop | Two loops form a recognizable figure-eight and move in opposition. | kind=rings; parts=2; classes=wavelo wavelo--rings wavelo--infinity; animations=wavelo-spin, wavelo-spin, wavelo-infinity, wavelo-infinity | animated CSS contract present | PASS |
| `helix` | DNA helix | Alternating particles and connecting curves form a DNA-like helix. | kind=wave; parts=6; classes=wavelo wavelo--wave wavelo--helix; animations=wavelo-helix-line, wavelo-helix-line, wavelo-helix, wavelo-helix, wavelo-helix, wavelo-helix, wavelo-helix, wavelo-helix | animated CSS contract present | PASS |
| `cube` | Cube rotation | A faceted cube-like shape rotates in three dimensions. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--cube; animations=wavelo-cube | animated CSS contract present | PASS |
| `polygon` | Rotating polygon | A five-sided polygon rotates and scales. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--polygon; animations=wavelo-polygon | animated CSS contract present | PASS |
| `triangles` | Rotating triangles | Three triangle elements orbit with separate phase offsets. | kind=shape; parts=3; classes=wavelo wavelo--shape wavelo--triangles; animations=wavelo-triangle, wavelo-triangle-orbit, wavelo-triangle-orbit, wavelo-triangle-orbit | animated CSS contract present | PASS |
| `folding-squares` | Folding squares | Two square panels fold around a central seam. | kind=shape; parts=1; classes=wavelo wavelo--shape wavelo--folding-squares; animations=wavelo-fold | animated CSS contract present | PASS |
| `nested-squares` | Nested squares | Three nested square outlines rotate at different rates. | kind=rings; parts=3; classes=wavelo wavelo--rings wavelo--nested-squares; animations=wavelo-spin, wavelo-spin, wavelo-square-spin, wavelo-square-spin, wavelo-square-spin | animated CSS contract present | PASS |
| `concentric-pulse` | Concentric pulse | Three circular outlines pulse from different radii. | kind=rings; parts=3; classes=wavelo wavelo--rings wavelo--concentric-pulse; animations=wavelo-spin, wavelo-spin, wavelo-concentric, wavelo-concentric, wavelo-concentric | animated CSS contract present | PASS |
| `spiral` | Spiral | A spiral-like conic stroke rotates. | kind=ring; parts=1; classes=wavelo wavelo--ring wavelo--spiral; animations=wavelo-spin | animated CSS contract present | PASS |
| `radar` | Radar sweep | A conic radar sweep rotates inside a circular boundary. | kind=ring; parts=1; classes=wavelo wavelo--ring wavelo--radar; animations=wavelo-radar | animated CSS contract present | PASS |
| `particle-orbit` | Particle orbit | Small particles travel around a central orbit. | kind=orbit; parts=5; classes=wavelo wavelo--orbit wavelo--particle-orbit; animations=wavelo-orbit, wavelo-orbit, wavelo-orbit, wavelo-orbit, wavelo-orbit | animated CSS contract present | PASS |
| `skeleton-line` | Skeleton text line | A single placeholder line has a moving shimmer. | kind=skeleton; parts=0; classes=wavelo wavelo--skeleton wavelo--skeleton-line; animations=wavelo-shimmer | animated CSS contract present | PASS |
| `skeleton-card` | Skeleton card | A card-shaped placeholder contains independently shimmering lines. | kind=skeleton; parts=3; classes=wavelo wavelo--skeleton wavelo--skeleton-card; animations=wavelo-shimmer, wavelo-shimmer, wavelo-shimmer | animated CSS contract present | PASS |
| `skeleton-avatar` | Skeleton avatar | A circular avatar placeholder shimmers. | kind=skeleton; parts=1; classes=wavelo wavelo--skeleton wavelo--skeleton-avatar; animations=wavelo-shimmer | animated CSS contract present | PASS |
| `skeleton-table` | Skeleton table | Multiple table-row placeholders shimmer. | kind=skeleton; parts=6; classes=wavelo wavelo--skeleton wavelo--skeleton-table; animations=wavelo-shimmer, wavelo-shimmer, wavelo-shimmer, wavelo-shimmer, wavelo-shimmer, wavelo-shimmer | animated CSS contract present | PASS |
| `skeleton-dashboard` | Skeleton dashboard | A dashboard grid placeholder shimmers. | kind=skeleton; parts=5; classes=wavelo wavelo--skeleton wavelo--skeleton-dashboard; animations=wavelo-shimmer, wavelo-shimmer, wavelo-shimmer, wavelo-shimmer, wavelo-shimmer | animated CSS contract present | PASS |
| `progress-bar` | Progress bar | A determinate horizontal fill reflects the configured value. | kind=progress; parts=1; classes=wavelo wavelo--progress wavelo--progress-bar; animations=none | static by design | PASS |
| `progress-ring` | Progress ring | A determinate circular fill reflects the configured value. | kind=progress; parts=1; classes=wavelo wavelo--progress wavelo--progress-ring; animations=none | static by design | PASS |
| `progress-steps` | Progress steps | Five determinate steps reflect the configured value. | kind=progress; parts=5; classes=wavelo wavelo--progress wavelo--progress-steps; animations=none | static by design | PASS |
| `progress-top` | Top progress | A determinate three-pixel top edge reflects progress. | kind=progress; parts=1; classes=wavelo wavelo--progress wavelo--progress-top; animations=none | static by design | PASS |
| `progress-upload` | Upload progress | A determinate upload track reflects progress. | kind=progress; parts=1; classes=wavelo wavelo--progress wavelo--progress-upload; animations=none | static by design | PASS |
| `inline` | Inline loading | A compact inline dot indicator pulses. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--inline; animations=wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot | animated CSS contract present | PASS |
| `button` | Button loading | A compact button-state indicator pulses without changing layout. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--button; animations=wavelo-pulse, wavelo-pulse, wavelo-pulse | animated CSS contract present | PASS |
| `overlay` | Section overlay | A section overlay contains a centered pulsing indicator. | kind=overlay; parts=1; classes=wavelo wavelo--overlay wavelo--overlay; animations=wavelo-pulse | animated CSS contract present | PASS |
| `fullscreen` | Full-screen overlay | A viewport-sized overlay contains a centered pulsing indicator. | kind=overlay; parts=1; classes=wavelo wavelo--overlay wavelo--fullscreen; animations=wavelo-pulse | animated CSS contract present | PASS |
| `page-transition` | Page transition | A determinate transition bar spans the page edge. | kind=progress; parts=1; classes=wavelo wavelo--progress wavelo--page-transition; animations=none | static by design | PASS |
| `image-placeholder` | Image placeholder | An image-sized surface shimmers. | kind=skeleton; parts=0; classes=wavelo wavelo--skeleton wavelo--image-placeholder; animations=wavelo-shimmer | animated CSS contract present | PASS |
| `infinite-scroll` | Infinite scroll | A compact row of dots bounces. | kind=dots; parts=5; classes=wavelo wavelo--dots wavelo--infinite-scroll; animations=wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot, wavelo-bounce-dot | animated CSS contract present | PASS |
| `background-operation` | Background operation | A compact background-operation pulse is visible. | kind=pulse; parts=3; classes=wavelo wavelo--pulse wavelo--background-operation; animations=wavelo-pulse, wavelo-pulse, wavelo-pulse | animated CSS contract present | PASS |

## Remaining limitations

Automated computed-style checks prove that the intended DOM/CSS contracts exist;
they do not prove that every motion is aesthetically distinct on every device.
The contact sheet and browser checks are therefore retained as evidence, while
future visual review should continue to use real browser playback rather than
metadata or unique IDs alone.
