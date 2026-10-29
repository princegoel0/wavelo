# Visual catalog audit

## Review scope

- **Artifact:** [catalog-contact-sheet.png](../release-audit/catalog-contact-sheet.png)
- **Source of truth:** `loaderRegistry` (98 entries)
- **Preview contract:** the production documentation gallery, one consistent card
  size, shared preview dimensions, labels, descriptions, and the same generated
  core markup used by consumers.
- **Automated review:** gallery card count, catalog metadata, deterministic
  rendering, public modular imports, axe checks, reduced-motion behavior, and
  console/page-error checks are covered by the existing test suite.
- **Human visual review:** the contact sheet is the artifact for the owner's review
  at desktop size — blank output, clipping, inconsistent dimensions, broken labels
  and obvious cosmetic-only variants. That review is separate from automated
  validation and is not recorded as complete here: whether each animation looks
  right is still an owner decision, tracked in `RELEASE_CHECKLIST.md`.

## Decisions

All 98 entries rendered correctly in the review artifact with consistent card
dimensions, readable labels, and no desktop or mobile horizontal overflow.
None of them renders something other than what its name and description promise:
the name-contract test asserts the promised geometry per design, and the
distinctness test asserts that no two of the 98 share a rendered signature. What the decisions below
still flag is a taste question — whether a count or orientation variant earns its
own public ID — not a defect, and it is a post-release judgement rather than a
release blocker. No entry was removed during this audit because doing so requires
coordinated preset/API deprecation work.

| Design ID | Category | Review status | Findings | Decision |
|---|---|---|---|---|
| `circular` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Closed border with a rotating ::before accent arc, asserted by the name contract; a different mechanism from ring. |
| `ring` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Baseline ring; retain as canonical ring primitive. |
| `dual-ring` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Distinct nested structure; retain, but verify motion separation in a future animation review. |
| `arc` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | One drawn border side (a quarter turn), asserted by the name contract; retain. |
| `multi-arc` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Three arcs at three different insets (root plus both pseudo layers), asserted distinct from dual-ring; retain. |
| `dotted-circle` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `segmented-ring` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Dashed four-sided border, asserted by the name contract; retain as the stroke-pattern member of the ring family. |
| `half-circle` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ellipse` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `rotating-square` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `rotating-diamond` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `orbiting-dots` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `orbiting-circles` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `comet-orbit` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `gradient-ring` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `conic-ring` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `neon-ring` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `thin-line` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Measured hairline stroke (1px against the ring’s 3px); retain as the documented weight pair with thick-stroke. |
| `thick-stroke` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Measured heavy stroke, asserted at more than twice the ring’s; retain as the documented weight pair with thin-line. |
| `monochrome` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Half-filled rotating conic disc, asserted by the name contract; no longer a colour-only variant. |
| `svg-star` | spinner | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `three-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Canonical three-dot sequence; retain. |
| `four-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Dot-count variation of three/five dots; improve timing/arrangement or merge into configurable preset. |
| `five-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Dot-count variation of three/four dots; improve timing/arrangement or merge into configurable preset. |
| `bouncing-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `pulsing-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `fading-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `scaling-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `rotating-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `dot-wave` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `dot-matrix` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Three-by-three grid of nine parts with staggered pulse, asserted by the name contract; retain. |
| `grid-pulse` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `alternating-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Shares linear-dot structure with fading/staggered dots; improve alternating grouping. |
| `expanding-dot` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ripple-dot` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `staggered-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `vertical-dots` | dots | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Orientation variant of dot wave; retain only if vertical motion remains perceptually distinct. |
| `equalizer` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `bouncing-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with equalizer/growing bars; improve rhythm or merge. |
| `vertical-pulse-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with bouncing/growing bars; improve rhythm or merge. |
| `horizontal-pulse-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Orientation variant of bar family; retain if horizontal motion is intentional. |
| `waveform` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `audio-waveform` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Seven bars on its own wavelo-audio keyframe, asserted different from waveform; retain. |
| `fading-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with equalizer/growing bars; improve timing or merge. |
| `growing-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `alternating-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with equalizer/fading bars; improve grouping or merge. |
| `gradient-bars` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Gradient-filled bars, asserted against the equalizer’s flat fill; retain as the colour variant, and a theme preset would still be useful. |
| `segmented-bar` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `moving-stripe` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `traveling-highlight` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `oscillating-line` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `multi-wave` | bars | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ripple-circles` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares expanding-ring structure with expanding circles; improve ripple origin or merge. |
| `expanding-circles` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares expanding-ring structure with ripple circles; improve topology or merge. |
| `morphing-shapes` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `infinity` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `helix` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `cube` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Faceted gradient with preserve-3d on wavelo-cube; retain. |
| `polygon` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Pentagon clip-path on wavelo-polygon; retain. |
| `triangles` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Three clipped triangles orbiting at 120-degree offsets on wavelo-triangle-orbit; retain. |
| `folding-squares` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Two panels with a transparent seam on wavelo-fold; retain. |
| `nested-squares` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Three nested outlines at 8/25/42% insets with their own rotations; retain. |
| `concentric-pulse` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Three circles at 12/28/44% insets pulsing with staggered delays; retain. |
| `trip-orbit` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `liquid-blob` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `spiral` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `radar` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `particle-orbit` | creative | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `typing-dots` | ai | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `thinking-glow` | ai | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `stream-cursor` | ai | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `token-stream` | ai | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ai-shimmer` | ai | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `neural-grid` | ai | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-line` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-card` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Application-role variant of skeleton; retain with documented dimensions. |
| `skeleton-avatar` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-table` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-inbox` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-chat` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-code` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-metric` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-dashboard` | skeleton | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Application-role variant of skeleton; retain with documented dimensions. |
| `progress-bar` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-ring` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-steps` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Progress-specific structure; retain and verify multiple step segments interactively. |
| `progress-top` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-upload` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-scroll` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; scroll primitive, indeterminate semantics. | Scroll-driven fill with no JavaScript; retain, and note it is Chromium-only today with a clock-driven sweep as the fallback. |
| `progress-view` | progress | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; scroll primitive, indeterminate semantics. | View-timeline fill with no JavaScript: the bar tracks its own travel through the viewport, and `--wavelo-timeline` names another subject. Same clock-driven sweep where view timelines are missing. |
| `inline` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Application-role variant; retain because placement semantics differ. |
| `button` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Application-role variant; retain because placement semantics differ. |
| `overlay` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; overlay primitive, indeterminate semantics. | Application-role variant; retain because overlay semantics differ. |
| `fullscreen` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; overlay primitive, indeterminate semantics. | Application-role variant; retain because viewport semantics differ. |
| `page-transition` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `image-placeholder` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `infinite-scroll` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `background-operation` | application | Automated evidence; human motion-quality review pending | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |

## Follow-up risk

A screenshot cannot judge taste, but distinctness and motion are no longer taken
from one. The browser suite compares a computed-style signature for every design
(geometry, drawn borders, gradients, animation identity and timing, part layout)
and requires all 98 to differ, and the correctness audit samples each design's
animations twice, 250ms apart, so a frozen or duplicated design fails a test
rather than relying on a reviewer's memory. What remains genuinely unproven is
perceptual quality: whether a count or orientation variant deserves its own public
ID. That is a product call for after the release, and the closest groups to
revisit are the ring-family spinners, the dot counts, and the bar/wave families.
