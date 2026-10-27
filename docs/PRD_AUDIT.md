# Wavelo PRD audit

## Scope

The root `PRD.md` is the authoritative product specification. It is coherent and
ambitious, but it describes a multi-package ecosystem without defining the smallest
shippable runtime contract. This audit turns those requirements into implementation
decisions without weakening the v1 acceptance criteria.

## Decisions and resolved gaps

| Area | Gap | Resolution |
| --- | --- | --- |
| Distribution | The PRD names packages but does not define the initial publish boundary. | The repository is an npm workspace with a publishable `@wavelo/core` package and adapter packages whose source and exports are tested. Each adapter is dependency-free at runtime; framework peer dependencies are optional integration concerns. |
| Rendering | A framework-independent rendering contract is implied but not explicit. | Core exposes `renderLoader(config): RenderResult`, a serializable model with HTML/SVG markup, scoped styles, ARIA attributes, and cleanup. DOM mounting is a separate vanilla helper. |
| Loader identity | `type` and registry behavior are specified, but unknown-type behavior is not deterministic. | Unknown types throw a typed `LoaderConfigurationError` in development and resolve to the documented `pulse` fallback in production. The fallback is observable through the returned metadata. |
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

## Remaining product choices

The PRD does not specify a visual brand system beyond example colors, so the
implementation uses neutral CSS tokens and leaves branding to configuration. Exact
framework major-version support remains a release-time compatibility decision and is
not overstated by the adapter packages.
