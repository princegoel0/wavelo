# Contributing

Wavelo renders loading markup and its stylesheet, in seven packages, from one core. The
gates below are the contract: a change that passes them is a change that can be released,
and a claim that no measurement supports gets corrected before it ships.

## Set up

- Node 24 — the version CI uses. `engines` allows Node 20.11+, but the Angular toolchain
  in this repository needs 22.22.3+ or 24.15+.
- `npm ci` — the lockfile is committed, and the framework versions in the root
  `package.json` are the versions the compatibility claims are measured against. Change
  one deliberately, or not at all.
- `npx playwright install --with-deps chromium firefox webkit` for the browser suites.

`npm run build` then `npm run check` is the shortest path to a known-good tree.

## How the repository is arranged

| Path | What it is |
| --- | --- |
| `packages/core/src/catalog.ts` | the only authored description of a design — id, kind, labels, options |
| `packages/core/src/loaders/`, `src/ids.ts`, `src/honoured-options.ts` | generated from the catalog. Run `npm run catalog:generate`; do not hand-edit |
| `packages/core/src/css/` | the base sheet, one slice per kind, the keyframes |
| `packages/{react,vue,svelte,angular,vanilla,web-components}/` | thin bridges. Each one accepts the same configuration keys and does no rendering of its own |
| `apps/docs/` | the gallery and playground, built into one HTML file |
| `examples/` | five runnable projects, one per stack. `npm run verify:examples` compiles them |
| `release-audit/` | audit output and review artifacts. Ignored: nothing a consumer or a newcomer needs lives there |
| `PRD.md` | what the surface *is*. `docs/` is what it *does*, measured |
| `scripts/` | the gates. Each file says in its header what it refuses |

Three rules follow from that layout:

1. A feature lands in core, then every bridge, or it does not land. A bridge that accepts
   a key another bridge drops is the defect class this repository removes.
2. A documented capability names its measurement. Option support is not inferred from a
   design's name — `npm run audit:customization` re-measures which options each design
   actually honours, and `npm run docs:check` compares the documents against that table.
3. An audit writes its report to `release-audit/`, not to `docs/`. The tracked documents are
   the ones a stranger reads before they trust the package, and a dated measurement of the
   catalogue belongs beside the tool that took it.

## Before you open a pull request

| When | Run |
| --- | --- |
| always | `npm run check` — build, typecheck, the unit and adapter tests, `verify:angular`, `verify:react`, `verify:examples`, catalog drift, package metadata, docs sync, bundle budgets |
| a public option or entry point | `npm run verify:examples` — the five projects are compiled against the built packages, so a surface change that breaks how an app uses it fails here |
| the renderer or any CSS | `npm run test:browser` (Chromium: computed styles, slice injection and isolation, axe) |
| a keyframe or a transform | `npm run audit:layout` — a design that costs layout per frame needs its reason recorded in `scripts/layout-cost.mjs` |
| a design's geometry | `npm run docs:build && npm run test:visual`; `test:visual:update` rewrites `tests/visual-baselines/catalog-baselines.json`, so review that diff |
| package metadata, exports, build scripts | `npm run pack:verify` — installs the tarballs into a clean project and renders from them. It reaches the registry, so it is a release gate rather than a fast loop |
| Firefox or Safari behaviour | `npm run test:browser:firefox`, `npm run test:browser:webkit` |

A guard that has never failed is not evidence. When you add one, break it on purpose once
and put the result in the pull request.

## Adding a design

Add the catalog entry, the slice it belongs to and its keyframes, then
`npm run catalog:generate`. The counts in the documentation are read from the build, so
`npm run docs:check` tells you which sentences need to follow the new number. A design
animates with `transform` and `opacity`; anything that animates a layout property has to
say why in the layout audit.

## Style

- TypeScript strict, `type: module`, no runtime dependency in `@wavelo/core` — a guard
  refuses one.
- Comments explain a constraint or a workaround, not what the next line does.
- A public change gets a `CHANGELOG.md` line; a breaking one also gets
  [docs/MIGRATION.md](../docs/MIGRATION.md) and a `Breaking` line, because `0.x` minors
  may move the surface.
- Commit subjects are imperative and say what changed and why, in one clause.

## Questions

Open an issue. If you are unsure whether something is a defect or a design decision, the
answer is usually in `PRD.md` or in the header comment of the script that enforces it.
