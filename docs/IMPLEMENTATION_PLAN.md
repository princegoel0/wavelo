# Wavelo implementation plan

Status: the plan below is implemented. It records how the work was sequenced, not
the current contract — for that read [README.md](../README.md),
[docs/COMPATIBILITY.md](COMPATIBILITY.md), [docs/FRAMEWORKS.md](FRAMEWORKS.md),
[docs/BUNDLE_SIZE.md](BUNDLE_SIZE.md) and
[docs/FINAL_DELIVERY_REPORT.md](FINAL_DELIVERY_REPORT.md), which `npm run
docs:check` keeps aligned with the build.

## Completed phases

1. **Audit** — inspected the root PRD, identified missing runtime and release
   contracts, and recorded resolutions in `docs/PRD_AUDIT.md`.
2. **Architecture** — established an npm workspace with a dependency-free core,
   modular registry/rendering exports, DOM/Web Component support, framework adapters,
   and a registry-driven static docs app.
3. **Core** — implement typed configuration, validation, accessibility semantics,
   reduced-motion handling, HTML rendering, DOM mounting, CSS isolation, and the
   catalog registry.
4. **Catalog** — implement distinct CSS/SVG renderers and named presets covering all
   required categories and counts.
5. **Integrations** — implement vanilla/Web Component runtime helpers plus React,
   Angular, Vue, and Svelte components that preserve the core contract, SSR safety,
   reactive updates, and lifecycle cleanup.
6. **Documentation** — build a searchable static gallery using the core registry and
   live previews.
7. **Verification** — run type checks, unit/framework tests, Angular TestBed and
   Angular server-rendering checks, Playwright + axe browser checks, catalog
   checks, package checks, docs build, bundle reports, and the visual catalog
   audit. Hydration and per-framework browser fixtures remain outside the
   advertised support surface.
8. **Release preparation** — add package exports, metadata, CI, changelog, and
   instructions without publishing.

## Engineering constraints

- No runtime dependencies in `@wavelo/core`.
- No arbitrary HTML or JavaScript execution from configuration.
- No invented progress values.
- No global CSS selectors or global registration at module evaluation time.
- Keep each loader entry independently importable.
- Prefer CSS animations and deterministic markup over JavaScript animation loops.

## Final audit status

Angular SSR is verified with Angular 22's `renderApplication` server context,
and the complete 81-card catalog has a desktop contact sheet, mobile layout
check, and per-design review in `docs/VISUAL_CATALOG_AUDIT.md`. The release
now has 69 active visual signatures and 12 documented deprecated aliases for
cosmetic/count variants. Generic shape entries have distinct geometry rules,
presets target canonical IDs, and the release audit is currently **NO-GO** pending final review of the
renderer-specific visual correctness artifact. The latest correction split
catalog lookup from modular rendering so individual loader imports no longer
include catalog metadata, scoped full-screen previews inside documentation
cards, and measured the new production bundles. The detailed evidence is in
`docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md`.

## Visual correctness remediation

- Rebuilt the renderer around ID-specific geometry and animation contracts for
  all 69 active designs; deprecated aliases still resolve to their canonical
  implementations.
- Rebuilt `apps/docs/dist/index.html` and captured
  `release-audit/catalog-corrected-contact-sheet.png`.
- Automated audit: 69 active designs and 12 aliases located, CSS/DOM contracts
  present, progress-ring value binding present, and desktop/mobile overflow
  checks passed.
- Human screenshot review found no page-level overlay after the documentation
  preview fix, but a static contact sheet cannot establish motion quality for
  every design. Public release remains on hold until that limitation is
  accepted or supplemented by interactive visual review.
