# Visual catalog audit

## Review scope

- **Artifact:** [catalog-contact-sheet.png](../release-audit/catalog-contact-sheet.png)
- **Source of truth:** `loaderRegistry` (81 entries)
- **Preview contract:** the production documentation gallery, one consistent card
  size, shared preview dimensions, labels, descriptions, and the same generated
  core markup used by consumers.
- **Automated review:** gallery card count, catalog metadata, deterministic
  rendering, public modular imports, axe checks, reduced-motion behavior, and
  console/page-error checks are covered by the existing test suite.
- **Human visual review:** the contact sheet was inspected at desktop size for
  blank output, clipping, inconsistent dimensions, broken labels, obvious
  cosmetic-only variants, and responsive card layout. Human review is separate
  from automated validation and does not claim that animation quality can be
  proven from a static screenshot alone.

## Decisions

All 81 entries rendered correctly in the review artifact with consistent card
dimensions, readable labels, and no desktop or mobile horizontal overflow.
The decisions below explicitly flag cosmetic variants and generic shape
implementations for improvement or merging; they are not being counted as
evidence of 81 independently novel animations. No entry was removed during this
audit because doing so requires coordinated preset/API deprecation work.

| Design ID | Category | Review status | Findings | Decision |
|---|---|---|---|---|
| `circular` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Near-duplicate of ring/arc; improve with a genuinely different mechanism or merge into ring. |
| `ring` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Baseline ring; retain as canonical ring primitive. |
| `dual-ring` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Distinct nested structure; retain, but verify motion separation in a future animation review. |
| `arc` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Near-duplicate of circular/ring; improve arc geometry and motion or merge. |
| `multi-arc` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares nested-ring structure with dual-ring/segmented-ring; improve geometry or merge. |
| `dotted-circle` | spinner | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `segmented-ring` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Stroke-style variation of ring family; improve segmentation or merge. |
| `half-circle` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ellipse` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `rotating-square` | spinner | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `rotating-diamond` | spinner | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `orbiting-dots` | spinner | Human reviewed | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `orbiting-circles` | spinner | Human reviewed | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `gradient-ring` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `thin-line` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Cosmetic stroke-width variant of ring; move to customization or replace. |
| `thick-stroke` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Cosmetic stroke-width variant of ring; move to customization or replace. |
| `monochrome` | spinner | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Color/theme variation rather than a distinct design; move to theme preset or replace. |
| `svg-star` | spinner | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `three-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Canonical three-dot sequence; retain. |
| `four-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Dot-count variation of three/five dots; improve timing/arrangement or merge into configurable preset. |
| `five-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Dot-count variation of three/four dots; improve timing/arrangement or merge into configurable preset. |
| `bouncing-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `pulsing-dots` | dots | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `fading-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `scaling-dots` | dots | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `rotating-dots` | dots | Human reviewed | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `dot-wave` | dots | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `dot-matrix` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Static dot-count variation of dot sequence; improve matrix layout or merge. |
| `grid-pulse` | dots | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `alternating-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Shares linear-dot structure with fading/staggered dots; improve alternating grouping. |
| `expanding-dot` | dots | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ripple-dot` | dots | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `staggered-dots` | dots | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `vertical-dots` | dots | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Orientation variant of dot wave; retain only if vertical motion remains perceptually distinct. |
| `equalizer` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `bouncing-bars` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with equalizer/growing bars; improve rhythm or merge. |
| `vertical-pulse-bars` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with bouncing/growing bars; improve rhythm or merge. |
| `horizontal-pulse-bars` | bars | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Orientation variant of bar family; retain if horizontal motion is intentional. |
| `waveform` | bars | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `audio-waveform` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Near-duplicate of waveform; replace with a distinct waveform topology or merge. |
| `fading-bars` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with equalizer/growing bars; improve timing or merge. |
| `growing-bars` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `alternating-bars` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Shares bar primitive with equalizer/fading bars; improve grouping or merge. |
| `gradient-bars` | bars | Human reviewed | Rendered in the consistent gallery card; bars primitive, indeterminate semantics. | Cosmetic color variation of bars; move to theme preset or replace. |
| `segmented-bar` | progress | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `moving-stripe` | bars | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `traveling-highlight` | bars | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `oscillating-line` | bars | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `multi-wave` | bars | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `ripple-circles` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares expanding-ring structure with expanding circles; improve ripple origin or merge. |
| `expanding-circles` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares expanding-ring structure with ripple circles; improve topology or merge. |
| `morphing-shapes` | creative | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `infinity` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `helix` | creative | Human reviewed | Rendered in the consistent gallery card; wave primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `cube` | creative | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Rendered as generic rotating shape; replace with an actual cube topology. |
| `polygon` | creative | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Rendered as generic rotating shape; add polygon-specific geometry before release. |
| `triangles` | creative | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Rendered as generic rotating shape; add visible triangle geometry before release. |
| `folding-squares` | creative | Human reviewed | Rendered in the consistent gallery card; shape primitive, indeterminate semantics. | Rendered as generic rotating shape; add folding panels before release. |
| `nested-squares` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares nested shape structure with dual-ring; improve square-specific motion. |
| `concentric-pulse` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Shares concentric structure with ripple/expanding circles; improve pulse staging. |
| `spiral` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `radar` | creative | Human reviewed | Rendered in the consistent gallery card; ring-family primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `particle-orbit` | creative | Human reviewed | Rendered in the consistent gallery card; orbit primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-line` | skeleton | Human reviewed | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-card` | skeleton | Human reviewed | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Application-role variant of skeleton; retain with documented dimensions. |
| `skeleton-avatar` | skeleton | Human reviewed | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-table` | skeleton | Human reviewed | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `skeleton-dashboard` | skeleton | Human reviewed | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Application-role variant of skeleton; retain with documented dimensions. |
| `progress-bar` | progress | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-ring` | progress | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-steps` | progress | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Progress-specific structure; retain and verify multiple step segments interactively. |
| `progress-top` | progress | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `progress-upload` | progress | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `inline` | application | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Application-role variant; retain because placement semantics differ. |
| `button` | application | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Application-role variant; retain because placement semantics differ. |
| `overlay` | application | Human reviewed | Rendered in the consistent gallery card; overlay primitive, indeterminate semantics. | Application-role variant; retain because overlay semantics differ. |
| `fullscreen` | application | Human reviewed | Rendered in the consistent gallery card; overlay primitive, indeterminate semantics. | Application-role variant; retain because viewport semantics differ. |
| `page-transition` | application | Human reviewed | Rendered in the consistent gallery card; progress primitive, progress semantics enabled. | Retain; rendered correctly and no immediate layout defect found. |
| `image-placeholder` | application | Human reviewed | Rendered in the consistent gallery card; skeleton primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `infinite-scroll` | application | Human reviewed | Rendered in the consistent gallery card; dots primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |
| `background-operation` | application | Human reviewed | Rendered in the consistent gallery card; pulse primitive, indeterminate semantics. | Retain; rendered correctly and no immediate layout defect found. |

## Follow-up risk

Static inspection cannot prove animation distinctness, timing quality, or
perceptual separation in every near-duplicate group. The closest groups are
the ring-family spinner entries, dot sequences, bar/wave entries, generic shape
entries, and skeleton application states. Entries marked "improve" or "merge"
remain release blockers until their implementation or API decision is completed.
