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
  82 public IDs, each with its own implementation; the catalog has no deprecated
  aliases.
- 12 render kinds, 12 stylesheet slices, 20 configuration keys, 44 `@keyframes`.
- `packages/core/src/catalog.ts` is the only authored catalog description.
  `src/loaders/*.ts`, `src/loaders/index.ts` and `src/ids.ts` are generated from
  it by `scripts/generate-catalog.mjs`; `npm run catalog` fails on drift.
- `progress-scroll` fills from the document's scroll position through a CSS
  scroll timeline, with no JavaScript at runtime; it is the twelfth render kind.
- Bridges for React, Angular, Vue, Svelte, vanilla DOM and Web Components, each
  accepting the whole configuration surface.

## Commands and results

| Command | Result |
| --- | --- |
| `npm run build` | Passed: core, catalog generation, all adapters, docs gallery |
| `npm run typecheck` | Passed under strict TypeScript |
| `npm test` | Passed: 37 tests across core, adapters, Angular TestBed and Angular SSR |
| `npm run catalog` | Passed: 82 IDs / 82 active / 117 presets / 12 slices, plus drift, alias-metadata, slice-ownership and keyframe-completeness checks |
| `npm run measure` | Passed: 10 entry points inside budget; single design 4,205 B gzip |
| `npm run docs:build` | Passed |
| `npm run docs:check` | Passed: documented counts, options and bundle figures match the built packages |
| `npm run test:browser` | Passed: 21 Chromium tests (see below) |
| `npm run audit:customization` | Passed: the measured option table matches what Chromium renders for all 82 designs |
| `npm run audit:visual` | Passed: 82-card contact sheet, desktop and 375px mobile |
| `npm run audit:visual:correctness` | Passed: 82 active designs — 76 with animations sampled as advancing, 5 static determinate-progress designs checked for value binding, and 1 scroll-driven design checked by its timeline type |
| `npm run pack:check` | Passed: seven publishable tarballs; `@wavelo/docs` also packs but is `"private": true` and is never published |
| `npm run release:validate` | Passed: `0.1.0` aligned across seven packages and not present on npm |
| `git diff --check` | Passed |
| GitHub Actions, `dev` at `19cffe1` | Passed: `verify` and `verify-browser` both green on the push run and the pull-request run, including `npx playwright install --with-deps chromium` on a clean runner |
| `dev` → `main` merge | Done as merge commit `603ecfc` through pull request #6, which also carried `b6e67b6` (colour cycle and skeleton visibility) that was on `dev` only |
| GitHub Actions, `main` at `603ecfc` | `CI` passed (`verify` 31s, `verify-browser` 48s); `Release packages`: `Validate release` green in 1m23s, **`Publish npm packages` skipped** because `RELEASE_ENABLED` is `false` — nothing was published |
| npm registry state | `0.1.0` not present for any of the seven names (`npm view @wavelo/core version` returns a 404); organization `wavelo` exists with `princegoel072` as owner |

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
- Twelve loaders across five kinds produce five `<style>` elements in the head and
  none inside a host.
- Every one of the 82 designs renders identically when given only the stylesheet
  slice its own entry point ships, checked against the combined sheet with
  clock-driven animations frozen at time zero and scroll-driven ones paused.
- The custom element renders, re-renders on attribute change, reports
  `role="progressbar"` with `aria-valuenow`, and defines once without error.
- A bad attribute value cannot blank the element: it keeps its last valid render,
  exposes `data-wavelo-error`, and produces exactly one `console.error` and no
  uncaught error out of the attribute callback.
- `--wavelo-*` properties in the element's `style` attribute reach the rendered
  element, while ordinary declarations in the same attribute stay host styling.
- `data-testid` and arbitrary `data-*` values survive to the DOM, including
  values containing quotes.
- Every determinate design reflects its configured `value` in the browser.
- `progress-scroll` fills from the document's scroll position: measured at 0%,
  50% and 100% of the scroll range, bound to a `ScrollTimeline` rather than the
  document clock, and labelled with `role="status"` and no invented
  `aria-valuenow`. With the `@supports` enhancement stripped from its slice, the
  same keyframes sweep on the clock instead of leaving an empty track.
- The default palette, the gradient designs and the overlay scrim actually paint,
  measured from rendered pixels rather than declared properties.
- Every design paints something visible, each one renders what its name says
  (part counts, border geometry, gradients), and no two designs render
  identically at any of four frozen animation frames.
- The gallery shows 82 cards, has zero axe violations, and logs no console or page
  errors.

These assertions were checked in both directions: reintroducing the original
`animation:` shorthand made the paused and reverse tests fail, editing one
generated loader made `npm run catalog` fail, re-importing a keyframe the base
already ships made the catalog check fail, and rebinding `progress-scroll` to
`animation-timeline: auto` made its scroll test fail. A passing suite therefore
means something.

## Packed-artifact verification

All seven tarballs were packed, installed into a fresh consumer project with
`npm install --ignore-scripts --legacy-peer-deps`, and exercised there (scratch
directory, since removed):

- Public subpaths resolve: `@wavelo/core`, `/registry`, `/dom`, `/styles`, `/css`,
  `/css/base`, `/css/kinds/ring`, `/loaders/ring`, `/styles.css`,
  `@wavelo/svelte/WaveloLoader.svelte`, and each adapter's root. `@wavelo/react`,
  `/vue` and `/angular` resolve only once their peers are installed, which is the
  point: the frameworks are declared as peers, never bundled.
- `dist/wavelo.css` ships, and its body under the banner comment equals
  `allStyles` exactly.
- Each design's slice equals `baseCss + kindCss` (checked for `ring` and for the new
  `scroll` kind), and `renderLoader({ type: 'ring' })` returns both the markup and
  the slice that the `ring` entry point returns.
- All 82 entry points import, render their own `wavelo--<id>` class, resolve to
  their own definition, and produce 82 distinct markup strings — no ID borrows
  another design's appearance.
- From the installed package, `progress-scroll` renders `role="status"` with no
  `aria-valuenow`, as documented for a bar whose percentage the page owns.
- React and Vue SSR output carries the configuration — including
  `type: 'progress-scroll'` — and contains no `<style>` element.
- `@wavelo/core` installs once — no nested copy under the adapters.
- A strict `tsc --noEmit --target ES2022 --module NodeNext` consumer compiled with
  `const id: LoaderId = 'progress-scroll'`, and assigning a non-catalog string to
  `LoaderId` was correctly rejected against the 82-member union.

Numbers from that run: 82 designs, 12 render kinds, 12 slices, 20 config keys,
base slice 2,050 B, ring slice 2,145 B, scroll slice 1,000 B, combined sheet 33,688 B
(33,763 B as shipped, with its banner comment).

## Visual correctness history

`docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md` is regenerated by
`npm run audit:visual:correctness` and now records per-design animation
play-state sampled twice, 250ms apart, instead of asserting only that an
animation name was declared. Its "Root cause found" section describes the
pre-remediation renderer and is kept as history.

## Remaining limitations

1. npm-side trusted publishing and provenance policy remain owner-side settings.
   The scope itself is settled: npm organization `wavelo` exists and
   `princegoel072` owns it. The first release publishes from CI with a granular
   token; trusted publishing and `--provenance` return per package afterwards.
2. CI has run this build on GitHub. After the `dev` → `main` merge, both `verify`
   and `verify-browser` passed, and the release workflow ran with `Validate
   release` green and `Publish npm packages` **skipped**, which proves the gate
   holds. `main` now requires both status checks with `strict: true`; approving
   reviews are set to `0` because GitHub forbids approving your own pull request
   and no other account has write access, so those two checks are the only merge
   gate on `main`.
3. Only Chromium is exercised. Safari and Firefox are untested, and the documented
   engine floor is inferred from the CSS features used.
4. Framework compatibility is demonstrated at one version per declared peer range.
5. Hydration is not implemented or claimed by the adapters.
6. Subjective motion quality still needs a human pass in a browser; the automated
   evidence proves each design animates, not that each animation looks right.
