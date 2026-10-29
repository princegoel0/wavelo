# Wavelo final delivery report

Report date: 2026-10-29, after the market-position work (Phases B–J) and the fixes
it required. Supersedes the 2026-10-28 report; the release-workflow defects it
recorded and the npm-side owner actions it listed are carried in
[RELEASE_READINESS_AUDIT.md](../RELEASE_READINESS_AUDIT.md).

## Status

**Every check this repository can run passes against this build.** Publication is the
owner's decision alone — it has not been made, requested or attempted here — and it
also needs the npm-side trusted-publishing configuration that `--provenance` depends on
(see "Trusted publishing configuration checklist" in the audit).

No package was published to npm and no registry setting was changed.
`RELEASE_ENABLED` remains `false`.

## Scope and versions actually tested

- Node.js `v24.21.0`, npm `11.19.0`, TypeScript `5.7.x`
- React and React DOM `19.3.1`, Vue `3.5.44`, Svelte `5.57.3`,
  Angular core/compiler/platform `22.2.3`
- Playwright with the Chromium build it pins, axe-core `4.14.0`, esbuild `0.28.2`,
  domino `2.1.8`

Peer ranges are declared in [COMPATIBILITY.md](COMPATIBILITY.md). One version per
declared range was tested; that does not prove compatibility across the whole range.
Chromium is exercised fully; Firefox 157 by a smoke suite (sheet applied, geometry,
palette, motion options, ancestor tokens, every design painting, the custom element,
and the timeline designs on the document clock). Safari is not exercised here.

## What the library is

- `@wavelo/core` renders escaped markup plus the stylesheet slice a design needs.
  83 public IDs, each with its own implementation; no deprecated aliases.
- 12 render kinds, 12 stylesheet slices, 27 configuration keys, 19 `--wavelo-*`
  custom properties, 44 `@keyframes`, 120 named presets.
- `packages/core/src/catalog.ts` is the only authored catalog description.
  `src/loaders/*.ts`, `src/loaders/index.ts` and `src/ids.ts` are generated from it by
  `scripts/generate-catalog.mjs`; `npm run catalog` fails on drift.
- **Every option a design advertises is measured**, not listed by hand:
  `scripts/honoured-options.mjs` renders each design in Chromium with each key set and
  unset, and the difference becomes `LoaderDefinition.options`, the gallery's chips
  and the documentation.
- Configuration that a page sets once: `--wavelo-*` properties on any ancestor or
  class rule, plus registered defaults per render tree (`WaveloProvider`,
  `provideWaveloDefaults`, `WAVELO_DEFAULTS`, `createWavelo`) and bound components
  (`loaderFor`). No module singleton, so server rendering cannot leak one request's
  settings into another.
- Two bars the browser drives with no JavaScript: `progress-scroll` from the document
  scroll position, `progress-view` from a view timeline. `createRouteProgress` is the
  top-of-page route bar.
- Bridges for React, Angular, Vue, Svelte, vanilla DOM and Web Components, each
  accepting the whole configuration surface.

## Commands and results

| Command | Result |
| --- | --- |
| `npm run build` | Passed: core, catalog generation, all adapters, docs gallery |
| `npm run typecheck` | Passed under strict TypeScript |
| `npm test` | Passed: 45 tests across core, adapters, Angular TestBed and Angular SSR |
| `npm run catalog` | Passed: 83 IDs / 83 active / 120 presets / 12 slices, plus drift, alias-metadata, slice-ownership and keyframe-completeness checks |
| `npm run packages:check` | Passed: 7 manifests complete, and every path an `exports` map names exists in the build with its declaration |
| `npm run docs:check` | Passed: 83 designs, 27 configuration keys, 19 custom properties and every bundle figure match the built packages, in 12 documents |
| `npm run measure` | Passed: 10 entry points inside budget; single design 5,018 B gzip, runtime renderer 12,692 B |
| `npm run test:browser` | Passed: 32 Chromium tests (see below) |
| `npm run test:browser:firefox` | Passed: 6 Gecko tests — the sheet applies, `paused`/`direction`/`reducedMotion`/`theme` and ancestor tokens reach the loader, every design paints, the custom element re-renders, and both timeline designs run on the document clock (`scroll()`/`view()` unsupported on Firefox 157) |
| `npm run audit:customization` | Passed: the measured option table matches what Chromium renders for all 83 designs |
| `npm run audit:layout` | Passed: 80 of 83 designs cost no layout per frame; the three that do are each accounted for |
| `npm run audit:visual` | Passed: 83-card contact sheet, desktop and 375px mobile |
| `npm run audit:visual:correctness` | Passed: 83 active designs — 76 animating, 5 static determinate-progress designs bound to their value, 2 timeline-driven designs bound to a `ScrollTimeline` and a `ViewTimeline` |
| `node scripts/style-fidelity.mjs isolated` | Passed: 0 differences between the combined sheet and each design rendered with only its own slice |
| `npm run pack:check` | Passed: seven publishable tarballs; `@wavelo/docs` also packs but is `"private": true` and is never published |
| `npm run pack:verify` | Passed: the tarballs install into a fresh project that renders, type checks under `--strict`, and finds a licence and README in every package |
| `npm run release:validate` | Passed: `0.1.0` aligned across seven packages and not present on npm |
| `git diff --check` | Passed |
| GitHub Actions, pull request #12 head at `279677a` | Passed: `verify` and `verify-browser` green on both the push and pull-request runs, now including `npx playwright install --with-deps chromium firefox` and the Gecko smoke suite on a clean runner |
| `dev` → `main` merge | Done as merge commit `f1c47a0` through pull request #12, which carried the Tier 1 gaps (fallback trace, `tokens.css`, Map lookup, PRD corrections, Gecko suite); earlier passes landed as `138b1f1` (#11), `5dcbdf2` (#10, Phases B–J) and `603ecfc` (#6) |
| GitHub Actions, `main` at `f1c47a0` | `CI` passed (`verify`, `verify-browser`); `Release packages`: `Validate release` success, **`Publish npm packages` skipped** because `RELEASE_ENABLED` is `false` — nothing was published |
| npm registry state | `0.1.0` not present for any of the seven names (`npm view @wavelo/core version` returns a 404) |

## Browser evidence

`tests/browser.test.mjs` asserts in Chromium:

- `paused` reports `animation-play-state: paused` **and** a `paused` play-state in
  `document.getAnimations()` for ring, dots, bars, skeleton and orbit designs, while
  the default configuration reports `running`.
- `direction: 'reverse'` reverses the animating element, and `dual-ring`'s authored
  counter-rotation survives it.
- `reducedMotion: 'always'` reduces with no OS preference; `'auto'` follows the OS;
  `'never'` opts out when the OS asks for reduction.
- `theme` is the page's palette: the light skeleton palette by default, the dark one
  for `dark`, `prefers-color-scheme` only for `system`, and the fallback colour and
  overlay scrim follow it too.
- A configured size is kept: a 32-pixel bar is 32 pixels tall, and `--wavelo-radius`,
  `--wavelo-ease` and `--wavelo-z-index` reach the rules that draw them.
- A `cqi` size resolves against the loader's own query container — 50 px in a 200 px
  container, 150 px in a 600 px one, and the same through an ancestor's
  `--wavelo-size`.
- `loading: false` mounts nothing: no markup, no stylesheet element, and the empty
  slice is never injected.
- `count` stacks skeleton tracks that each paint and shimmer, the last one short, and
  `inline` puts a line on the text line at text metrics.
- Twelve loaders across five kinds produce five `<style>` elements in the head and
  none inside a host.
- Every one of the 83 designs renders identically when given only the stylesheet slice
  its own entry point ships, checked against the combined sheet with clock-driven
  animations frozen at time zero and timeline-driven ones paused.
- The custom element renders, re-renders on attribute change, reports
  `role="progressbar"` with `aria-valuenow`, and defines once without error; a bad
  attribute value keeps the last valid render, exposes `data-wavelo-error`, and logs
  one `console.error` with no uncaught error.
- `--wavelo-*` properties in the element's `style` attribute reach the rendered
  element, while ordinary declarations in the same attribute stay host styling.
- `labelledBy`, `describedBy`, `valueText` and `decorative` work through both the
  config object and element attributes; passing `aria-*` or `role` directly throws.
- A determinate value change interpolates, because `--wavelo-progress` is registered
  with `@property` and transitioned: 10% → 90% is sampled mid-flight between the two.
- `progress-scroll` fills from the document's scroll position at 0%, 50% and 100% of
  the range — inside an `overflow: hidden` wrapper as well as outside it — bound to a
  `ScrollTimeline`; `progress-view` fills from its own travel through the viewport,
  bound to a `ViewTimeline`. With the `@supports` enhancement stripped, the same
  keyframes sweep on the clock for both instead of leaving an empty track.
- `createRouteProgress` creeps toward its ceiling, takes a real percentage, fills and
  removes itself, adds one stylesheet element for all its renders, and stays silent to
  assistive technology unless a label is asked for.
- A page served with `style-src 'nonce-…'` and no `'unsafe-inline'` renders styled:
  the injected slice carries the nonce from `<meta name="wavelo-csp-nonce">`, no
  violation is reported, and the same page without the meta element is unstyled.
- The default palette, the gradient designs and the overlay scrim actually paint,
  measured from rendered pixels rather than declared properties.
- Every design paints something visible, each renders what its name says (part counts,
  border geometry, gradients), and no two designs render identically at any of four
  frozen animation frames.
- The gallery shows 83 cards with their measured option chips, drives the playground's
  tokens and code output, has zero axe violations, and logs no console or page errors.

These assertions were checked in both directions: reintroducing the original
`animation:` shorthand made the paused and reverse tests fail, editing one generated
loader made `npm run catalog` fail, re-importing a keyframe the base already ships made
the catalog check fail, rebinding `progress-scroll` to `animation-timeline: auto` made
its scroll test fail, a Vue `Boolean` prop that resolved an absent value to `false`
made the bound-component test fail, and removing the CSP meta element made the CSP test
unstyled. A passing suite therefore means something.

## Packed-artifact verification

`npm run pack:verify` is now a command rather than a manual pass. It packs every
workspace, installs the tarballs into a fresh project whose only other dependencies
are the framework peers (with `@wavelo/core` overridden to the tarball under test, so
nothing is fetched from the registry), and asserts there that:

- the installed registry holds the same 83 designs the source built;
- `@wavelo/core`, `@wavelo/core/loaders/ring` and `@wavelo/core/styles.css` all
  resolve, the modular entry carries its own rules and not another design's, and the
  shipped sheet keeps the reduced-motion rules;
- `createWavelo` defaults reach a render from the installed package, and
  `createRouteProgress` is inert without a DOM (`element === null`, every method a
  no-op);
- importing `@wavelo/web-components` on a server does not touch `HTMLElement`;
- `@wavelo/svelte` ships the `src/WaveloLoader.svelte` its exports map names;
- a `--strict` `tsc --target ES2022 --module NodeNext` consumer compiles against the
  packed declarations for all seven packages, including `loaderFor`,
  `WaveloProvider`, `WAVELO_DEFAULTS`, `provideWaveloDefaults` and the token-typed
  `style`;
- every installed package carries `LICENSE`, `README.md`, `dist/index.js` and
  `dist/index.d.ts`.

Sizes from this build: base slice 2,521 B raw, ring slice 2,240 B, scroll slice
2,139 B, combined sheet 39,384 B raw and 5,897 B gzipped.

## Visual correctness history

`docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md` is regenerated by
`npm run audit:visual:correctness` and records per-design animation play-state sampled
twice, 250ms apart, and the timeline type of each timeline-driven design, instead of
asserting only that an animation name was declared. Its "Root cause found" section
describes the pre-remediation renderer and is kept as history.

## Remaining limitations

1. npm-side trusted publishing and provenance policy remain owner-side settings. The
   scope is settled: npm organization `wavelo` exists and `princegoel072` owns it. The
   first release publishes from CI with a granular token; `RELEASE_PROVENANCE=true`
   switches the publish step to `--provenance` once trusted publishing is configured
   for each package.
2. `RELEASE_ENABLED` is `false`, so the publish job is skipped on every run. Flipping
   it is the owner's decision and has not been made here.
3. Firefox is exercised by a smoke suite, not the full one: 6 tests covering the
   sheet applying, the motion and theme options, ancestor tokens, visibility of every
   design, the custom element and the timeline fallbacks. Safari remains untested, and
   the documented engine floor is inferred from the CSS features used — notably CSS
   scroll-driven animations, which were measured as unsupported in Firefox 157, where
   the timeline designs run on the document clock instead.
4. Framework compatibility is demonstrated at one version per declared peer range.
5. Hydration is not implemented or claimed by the adapters.
6. Subjective motion quality still needs a human pass in a browser; the automated
   evidence proves each design animates and costs no layout it can avoid, not that each
   animation looks right.
7. The `waveform` and `multi-wave` designs animate `height` rather than a transform,
   and `progress-scroll` animates `width`: each is recorded with its reason in
   [PERFORMANCE.md](PERFORMANCE.md), and `npm run audit:layout` fails if a fourth
   appears without one.
