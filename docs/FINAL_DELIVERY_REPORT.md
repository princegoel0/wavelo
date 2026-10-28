# Wavelo final delivery report

Report date: 2026-10-28, after the library review and the fixes it required.
Supersedes the 2026-10-27 report; the release-workflow defects it recorded and the
npm-side owner actions it listed are carried in
[RELEASE_READINESS_AUDIT.md](../RELEASE_READINESS_AUDIT.md).

## Recommendation

**Not ready to publish.** The code, documentation and package surface are in the
state the release checklist requires, and every check below was run against this
build. Publication stays blocked on owner-side npm trusted-publishing
configuration, which cannot be verified from this repository — see the audit's
"Trusted publishing configuration checklist".

No package was published to npm and no registry setting was changed.

## Scope and versions actually tested

- Node.js `v24.21.0`, npm `11.19.0`, TypeScript `5.9.3`
- React and React DOM `19.3.1`, Vue `3.5.44`, Svelte `5.57.3`,
  Angular core/compiler/platform `22.2.3`
- Playwright `1.64.1` with the Chromium build it pins, axe-core `4.14.0`,
  esbuild `0.28.2`, domino `2.1.8`

Peer ranges are declared in [COMPATIBILITY.md](COMPATIBILITY.md). One version per
declared range was tested; that does not prove compatibility across the whole
range, and only Chromium was exercised — Firefox and Safari are untested here.

## What the library is

- `@wavelo/core` renders escaped markup plus the stylesheet slice a design needs.
  81 public IDs: 69 active designs, 12 deprecated aliases that render their
  canonical design identically.
- 11 render kinds, 11 stylesheet slices, 20 configuration keys, 37 `@keyframes`.
- `packages/core/src/catalog.ts` is the only authored catalog description.
  `src/loaders/*.ts`, `src/loaders/index.ts` and `src/ids.ts` are generated from
  it by `scripts/generate-catalog.mjs`; `npm run catalog` fails on drift.
- Bridges for React, Angular, Vue, Svelte, vanilla DOM and Web Components, each
  accepting the whole configuration surface.

## Commands and results

| Command | Result |
| --- | --- |
| `npm run build` | Passed: core, catalog generation, all adapters, docs gallery |
| `npm run typecheck` | Passed under strict TypeScript |
| `npm test` | Passed: 25 tests across core, adapters, Angular TestBed and Angular SSR |
| `npm run catalog` | Passed: 81 IDs / 69 active / 116 presets / 11 slices, plus drift, alias-metadata and slice-ownership checks |
| `npm run measure` | Passed: 10 entry points inside budget; single design 3,617 B gzip |
| `npm run docs:build` | Passed |
| `npm run docs:check` | Passed: documented counts, options and bundle figures match the built packages |
| `npm run test:browser` | Passed: 10 Chromium tests (see below) |
| `npm run audit:visual` | Passed: 81-card contact sheet, desktop and 375px mobile |
| `npm run audit:visual:correctness` | Passed: 69 active designs — 62 with animations sampled as advancing, 7 static determinate-progress designs checked for value binding — and 12 aliases |
| `npm run pack:check` | Passed: seven publishable tarballs; `@wavelo/docs` also packs but is `"private": true` and is never published |
| `npm run release:validate` | Passed: `0.1.0` aligned across seven packages and not present on npm |
| `git diff --check` | Passed |

## Browser evidence

`tests/browser.test.mjs` asserts in Chromium:

- `paused` reports `animation-play-state: paused` **and** a `paused` play-state in
  `document.getAnimations()` for ring, dots, bars, skeleton and orbit designs,
  while the default configuration reports `running`.
- `direction: 'reverse'` reverses the animating element, and `dual-ring`'s
  authored counter-rotation survives it.
- `reducedMotion: 'always'` reduces with no OS preference; `'auto'` follows the
  OS; `'never'` opts out when the OS asks for reduction.
- `theme` keeps the light skeleton palette by default, switches to the dark one
  for `dark`, and follows `prefers-color-scheme` only for `system`.
- Twelve loaders across four kinds produce four `<style>` elements in the head and
  none inside a host.
- Every one of the 81 designs renders identically when given only the stylesheet
  slice its own entry point ships, checked against the combined sheet with
  animations frozen at time zero.
- The custom element renders, re-renders on attribute change, reports
  `role="progressbar"` with `aria-valuenow`, and defines once without error.
- `data-testid` and arbitrary `data-*` values survive to the DOM, including
  values containing quotes.
- The gallery shows 81 cards, has zero axe violations, and logs no console or page
  errors.

These assertions were checked in both directions: reintroducing the original
`animation:` shorthand made the paused and reverse tests fail, and editing one
generated loader made `npm run catalog` fail. A passing suite therefore means
something.

## Packed-artifact verification

All seven tarballs were packed, installed into a fresh consumer project with
`npm install --ignore-scripts`, and exercised there (scratch directory, since
removed):

- Public subpaths resolve: `@wavelo/core`, `/registry`, `/dom`, `/styles`, `/css`,
  `/css/base`, `/css/kinds/ring`, `/loaders/ring`, `/styles.css`,
  `@wavelo/svelte/WaveloLoader.svelte`, and each adapter's root.
- `dist/wavelo.css` ships and contains the catalog rules.
- The design's slice equals `baseCss + ringCss`; `circular()` renders byte-identical
  markup to `ring()`; `renderLoader({ type: 'ring' })` matches its own entry point.
- React and Vue SSR output carries the configuration and contains no `<style>`
  element, as documented.
- `@wavelo/core` installs once — no nested copy under the adapters.
- A strict `tsc --noEmit --target ES2022 --module NodeNext` consumer compiled, and
  assigning a non-catalog string to `LoaderId` was correctly rejected.

Numbers from that run: 81 designs, 11 slices, 20 config keys, base slice 4,435 B,
ring slice 1,072 B, combined sheet 23,371 B.

## Visual correctness history

`docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md` is regenerated by
`npm run audit:visual:correctness` and now records per-design animation
play-state sampled twice, 250ms apart, instead of asserting only that an
animation name was declared. Its "Root cause found" section describes the
pre-remediation renderer and is kept as history.

## Remaining limitations

1. npm trusted publishing, provenance policy, package ownership and the protected
   `npm` environment are owner-side settings that this repository cannot verify.
2. GitHub Actions paths were read, not executed; CI has not run this build.
3. Only Chromium is exercised. Safari and Firefox are untested, and the documented
   engine floor is inferred from the CSS features used.
4. Framework compatibility is demonstrated at one version per declared peer range.
5. Hydration is not implemented or claimed by the adapters.
6. Subjective motion quality still needs a human pass in a browser; the automated
   evidence proves each design animates, not that each animation looks right.
