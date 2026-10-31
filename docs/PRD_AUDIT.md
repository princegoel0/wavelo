# Wavelo PRD audit

Status: decisions taken before the first implementation pass, kept as history.
Two rows no longer describe the shipped code and were corrected in the
2026-10-28 review: every design but one is CSS boxes, gradients and `clip-path` —
`svg-star` emits real SVG — and styles are no longer carried inside component output — see
[docs/COMPATIBILITY.md](COMPATIBILITY.md) and
[docs/BUNDLE_SIZE.md](BUNDLE_SIZE.md) for the current contract. The `variant`
option listed in the PRD configuration table was removed rather than
implemented: alternate looks are separate designs or named presets.

## Scope

The root `PRD.md` is the authoritative product specification. It is coherent and
ambitious, but it describes a multi-package ecosystem without defining the smallest
shippable runtime contract. This audit turns those requirements into implementation
decisions without weakening the v1 acceptance criteria.

## Decisions and resolved gaps

| Area | Gap | Resolution |
| --- | --- | --- |
| Distribution | The PRD names packages but does not define the initial publish boundary. | The repository is an npm workspace with a publishable `@wavelo/core` package and adapter packages whose source and exports are tested. Each adapter is dependency-free at runtime; framework peer dependencies are optional integration concerns. |
| Rendering | A framework-independent rendering contract is implied but not explicit. | Core exposes `renderLoader(config): RenderResult`, a serializable model with escaped HTML markup, ARIA attributes, and the stylesheet slice the design needs. Styles are injected into the document head rather than carried in the markup. DOM mounting is a separate vanilla helper. |
| Loader identity | `type` and registry behavior are specified, but unknown-type behavior is not deterministic. | Unknown types never throw and there is no dev/prod split. `registry.ts` falls back to `defaultLoaderId` — `inline` — and reports it three ways: `resolution: 'default'`, `fallback: true` and a `data-wavelo-fallback` attribute naming what was asked for. Resolve to the documented `pulse` fallback in production. The fallback is observable through the returned metadata. |
| Accessibility | Requirements prohibit incorrect announcements but do not define defaults. | Loaders are decorative by default when no label is supplied. A label adds `role="status"` and an accessible name; determinate progress uses `role="progressbar"` and validated `aria-valuenow`. |
| Reduced motion | Both user preference and an explicit option are required, but precedence is unstated. | `reducedMotion: 'auto' | 'always' | 'never'`, with `always` taking priority, `never` opting out, and `auto` following CSS `prefers-reduced-motion`. |
| Customization safety | CSS-variable overrides are required but arbitrary style injection is risky. | Only validated CSS custom properties with the `--wavelo-` prefix are emitted. User strings are escaped before markup generation. |
| Tree shaking | The PRD requires modularity but does not prescribe import boundaries. | Registry metadata is split from rendering; named loader modules are generated as small wrappers over shared primitives. Package exports expose core, registry, individual loaders, and DOM helpers. |
| Framework claims | “Supported” could be mistaken for “all versions.” | Adapters are real framework components with SSR/lifecycle tests where available. The compatibility matrix in `docs/COMPATIBILITY.md` records the tested surface and avoids unsupported version promises. |
| Documentation | The website must be accurate but its deployment is unspecified. | `apps/docs` is a static, dependency-free site driven by the same registry data and includes search, filters, live previews, and copyable examples. |
| Measurement | Bundle budgets are targets without a measurement command. | `npm run measure` builds the package and reports gzip sizes for the core entry and an individual loader entry. CI fails when the documented budgets are exceeded. |
| Release | Publishing instructions are required but publication must be gated. | Publishing is deliberately absent from scripts. `docs/RELEASE.md` documents `npm pack`, clean-install verification, provenance, and the explicit approval step required before `npm publish`. |

## Implementation acceptance checklist

- [x] Framework-independent TypeScript core with no runtime dependencies.
- [x] Strongly typed configuration, validation, registry metadata, accessibility, and
  reduced-motion behavior.
- [x] At least 60 genuinely different registered animation renderers.
- [x] At least 100 named presets and patterns, including skeleton, progress, and
  application loading patterns.
- [x] Vanilla DOM and Web Component integrations.
- [x] React, Angular, Vue, and Svelte adapter source with documented, SSR-safe
  framework components and lifecycle bridges.
- [x] Static searchable documentation driven from the registry.
- [x] Unit, type, package, accessibility-contract, and catalog-count checks.
- [x] Build, package, bundle measurement, changelog, and release documentation.

## Requirements the PRD states that are still open

Checked against the tree on 2026-10-31, not carried forward from a plan. Each line says
what the PRD asks (with its line), what exists, and what is missing — so the gap can be
sized without re-reading 1,500 lines.

| PRD requirement | State | What is actually there |
|---|---|---|
| 13.5 (1061) lint gate in CI | **not met** | no `lint` script in the root `package.json`, no `eslint.config.*` in the tree |
| 12.1 (945) dependency-vulnerability audit | **not met** | no `npm audit` in `ci.yml` or `release.yml`; `scripts/verify-packed.mjs` installs with `--no-audit`. Licences are checked (`validate-packages.mjs`) |
| 14 (1092-1097) per-framework example apps | **not met** | no `examples/` directory; `docs/FRAMEWORKS.md` carries snippets and `pack:verify` type-checks a generated consumer |
| 14 (1105) `AGENTS.md` | **not met** | absent from disk and from `git ls-files` |
| 14 (1100-1102) `tests/{integration,browser,package-validation}` layout | **partially met** | `tests/` is seven flat `.mjs` files covering all three roles |
| 14 (1113) contribution and issue process | **not met** | no `CONTRIBUTING.md`, no `.github/ISSUE_TEMPLATE`, `.github/` holds only `workflows/` |
| 15.3 (1164-1167) release tags and a rollback/deprecation procedure | **partially met** | `release.yml` never tags; `docs/RELEASE.md` covers the 0.x breaking-change policy but names no rollback |
| 15.2 (1146) `Breaking` lines in the changelog | **not met** | `CHANGELOG.md` has no `Breaking` section, though 0.x removed the `variant` key and 22 design IDs |
| 9.2 (788-805) docs-site pages: framework selection, reduced-motion preview, per-loader detail, direct links, API reference, install | **partially met** | `apps/docs` is one page: search, filter, size/colour/speed/stroke/radius, dark mode and copy exist; `reducedMotion` is filtered out of the playground |
| 4.1 / 18.2 (1372-1386) composition primitives | **not met** | core exports no composition API |
| 11.4 (915-925) mobile, CPU and memory measurements | **not met** | only `scripts/layout-cost.mjs`, Chromium desktop |
| 13.2 (1009) React unmount and hydration tests | **not met** | no `hydrateRoot` or unmount test; `docs/COMPATIBILITY.md` declines to advertise hydration |
| 6.6 (571) development-time warnings | **partially met** | only `packages/web-components`; core reports an unknown type through `resolution`, `fallback` and `data-wavelo-fallback` rather than warning |
| 18.3 preset collections | **partially met** | `*-collection` presets exist for the main families; no minimal or branded set |
| 20 (1458) publication | **open by decision** | 0.1.0 aligned across 7 packages, unpublished; owner actions in `RELEASE_CHECKLIST.md` |

Two of these are worth a decision rather than a fix. The lint gate and `npm audit` are the
only PRD-mandated quality checks that no script performs, and both are cheap to add; the
example apps are the one requirement whose value drops now that `pack:verify` installs a
real consumer from the packed tarballs and type-checks it against the shipped declarations.

## Remaining product choices

The PRD does not specify a visual brand system beyond example colors, so the
implementation uses neutral CSS tokens and leaves branding to configuration. Exact
framework major-version support remains a release-time compatibility decision and is
not overstated by the adapter packages.
