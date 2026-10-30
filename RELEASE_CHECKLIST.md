# Wavelo release checklist

Audit date: 2026-10-27, re-run 2026-10-28 after the library review, and re-run
2026-10-29 after the Phases B–J work (measured options, global configuration,
accessibility surface, ergonomics, styling tokens, view timelines, distribution
trust and per-frame cost).
Audited version: `0.1.0`

## Completed

- [x] Verified all seven publishable package names and versions:
  `@wavelo/core`, `@wavelo/vanilla`, `@wavelo/web-components`,
  `@wavelo/react`, `@wavelo/vue`, `@wavelo/svelte`, and `@wavelo/angular`.
- [x] Added `repository`, `bugs`, `homepage` and `keywords` to all seven
  manifests, and `./package.json` exports plus a `@wavelo/core/styles.css`
  subpath to the core.
- [x] Verified MIT license metadata, package-local `README.md`, and
  package-local `LICENSE` in every tarball.
- [x] Verified `main`, `types`, ESM package format, package exports, files
  allowlists, runtime dependencies, and framework peer dependencies, by
  resolving every public subpath from a clean consumer project.
- [x] Generated fresh tarballs for all seven packages.
- [x] Installed all seven tarballs into a new clean consumer with
  `npm install --ignore-scripts`; imports, SSR rendering, slice sizes and
  strict `tsc --noEmit` all passed, with one hoisted copy of `@wavelo/core`.
- [x] Verified runtime imports from all seven packed packages.
- [x] Compiled packed-package TypeScript declarations with strict
  `tsc --noEmit`, and confirmed the typed `LoaderId` rejects a non-catalog ID.
- [x] Verified every public ID renders its own design: no two designs render
  identically at four animation frames, every design paints something visible,
  and designs whose names promise a count or a stroke weight render it.
- [x] Verified presets target catalog IDs.
- [x] Verified the streaming tranche (six `ai` designs, four composite skeletons, five
  single-box designs) against the same gates the existing catalog passes: no two render
  identically, every design animates or is exempt by name, each renders what its name
  says, and 95 of the 98 cost no layout per frame.
- [x] Re-based the bundle budgets from the measurement rather than the aspiration, and
  added a `busiest-loader` case for `skeleton-card`: the skeleton slice carries five new
  designs, so the sampled `ring` bundle could no longer show what a crowded kind costs.
  The claim that a build-time design "does not move when the catalog grows" was corrected
  in `scripts/bundle.mjs` and `docs/BUNDLE_SIZE.md` — it moves when a sibling joins its
  kind, and now fails a gate when it does.
- [x] Fixed a race in the customization probe: a scroll- or view-driven animation is
  sampled while frames render, so two identical pages could freeze at different
  transforms and credit a key no rule reads. It now settles two frames from the same
  scroll offset before reading, and compares the mask, so a stroke that carves a ring is
  measured rather than assumed. `npm run audit:layout` had the same class of bug: it
  stacked 150 copies in normal flow, so most were off screen, Chromium did not animate
  them, and one design measured 120 layouts on a run and 0 on the next — which the
  audit read as "this design stopped costing layout". It now keeps every copy inside the
  viewport, and three consecutive runs agree to within 5%.
- [x] Verified `paused`, `direction` and all three `reducedMotion` modes in
  Chromium through computed styles and `document.getAnimations()` play-states,
  and confirmed the assertions fail if the CSS defect is reintroduced.
- [x] Verified each of the 111 designs renders identically from only its own
  stylesheet slice, so the modular entry points are complete.
- [x] Verified style slices are injected once per document (12 loaders across
  five render kinds produce five head elements, none inside a host).
- [x] Reviewed `.github/workflows/ci.yml`: it runs validation and packaging
  checks only; it does not publish or mutate npm.
- [x] Added a `verify-browser` CI job so computed-style and axe checks run on
  every push and pull request, not only in the release workflow.
- [x] Confirmed on GitHub that both jobs are green for `dev` at `5068090` and for
  `main` at `ae0e06d`, including the Playwright install step for all three engines on a
  clean runner.
- [x] Merged the WebKit suite, the versioning policy in `docs/RELEASE.md` and the
  peer-isolation assertion as `ae0e06d` through pull request #18. The `verify-browser`
  job's step list on that run names `Run npx playwright install --with-deps chromium
  firefox webkit`, `Gecko smoke test` and `WebKit smoke test`, each successful — so the
  third engine is evidence, not a file that exists. On `main`: `CI` passed, `Release
  packages` validated and **skipped** publish, `Gallery` skipped both jobs.
- [x] Confirmed on GitHub that both jobs are green for `dev` at `92e02f6` and for
  `main` at `8cbef17`, including the Playwright install step for both engines on a
  clean runner.
- [x] Merged the progress tranche as `8cbef17` through pull request #16 after `verify`
  and `verify-browser` passed on both the push and pull-request runs; on `main` the
  `CI` workflow passed, `Release packages` ran `Validate release` successfully and
  **skipped** `Publish npm packages`, and `Gallery` **skipped** both jobs. All seven
  npm names re-checked after the merge: still `E404` for `0.1.0`.
- [x] Merged the streaming tranche as `f3e6dd7` through pull request #14 after `verify`
  and `verify-browser` passed on both the push and pull-request runs; on `main` the
  `CI` workflow passed, the `Release packages` workflow ran `Validate release`
  successfully and **skipped** `Publish npm packages` (`RELEASE_ENABLED` is `false`),
  and the new `Gallery` workflow **skipped** both jobs because `GALLERY_ENABLED` is
  unset — so the deploy path is merged but has never run, and nothing was published.
- [x] Merged the Tier 1 gap work as `f1c47a0` through pull request #12 after `verify`
  and `verify-browser` passed on both the push and pull-request runs; on `main` the
  `CI` workflow passed and the `Release packages` workflow ran `Validate release`
  successfully and **skipped** `Publish npm packages`, because `RELEASE_ENABLED` is
  `false`.
- [x] Merged the Phases B–J work as `5dcbdf2` through pull request #10 after both
  required checks passed on the pull request; on `main` the `CI` workflow passed and
  the `Release packages` workflow ran `Validate release` successfully and **skipped**
  `Publish npm packages`, because `RELEASE_ENABLED` is `false`.
- [x] Merged `dev` into `main` as `603ecfc` through pull request #6; the release
  workflow ran there with `Validate release` green and `Publish npm packages`
  skipped, because `RELEASE_ENABLED` is `false`.
- [x] Ran `npm run check`: passed; build with catalog generation, strict typecheck,
  45 unit tests, catalog drift check, package metadata check, documentation sync, and
  bundle budgets.
- [x] Ran `npm run test:browser`: passed; 32 tests in Chromium.
- [x] Ran `npm run test:browser:firefox`: passed; 6 Gecko smoke tests — the sheet
  applies, `paused`/`direction`/`reducedMotion`/`theme` and ancestor tokens reach the
  loader, every design paints, the custom element re-renders, and both timeline
  designs run on the document clock. Measured on Firefox 157: `scroll()` and `view()`
  timelines are unsupported, so the documented fallback is what that engine gets.
  Wired into both CI jobs.
- [x] Ran `npm run test:browser:webkit`: passed; 7 WebKit smoke tests in the same shape.
  Measured on WebKit 27.2 (Playwright's build of Safari's engine, not an Apple-shipped
  browser): `scroll()` and `view()` **are** supported, so `progress-scroll` and
  `progress-view` run on a real `ScrollTimeline` and `ViewTimeline` there rather than on
  the document clock — which is how each timeline path came to be measured on a browser,
  one on each side of the support line. The suite also asserts that a conic gradient is
  carved by a mask and that a registered `<integer>` reaches a CSS counter. Wired into
  both CI jobs.
- [x] Mirrored the versioning policy into `docs/RELEASE.md`: what semver means for this
  surface, what a `0.x` may change, and the one thing it never does — leave a caller
  guessing about an option that stopped applying.
- [x] Asserted PRD 13.4 item 8 in `pack:verify`: every adapter declares its framework as
  a peer, lists none of them as a dependency, carries no nested copy, and depends on
  nothing outside the workspace.
- [x] Verified an unknown `type` leaves a trace in the DOM: the element carries
  `data-wavelo-fallback="<asked for>"` beside the default design, while a resolved
  preset and an absent type carry nothing. Asserted in the unit suite and through the
  custom element in Chromium.
- [x] Added `@wavelo/core/tokens.css`, generated from the built sheet and listing only
  the properties every design agrees on; a Chromium test compares 13 designs with and
  without it and requires every computed value to match, and `pack:verify` checks the
  path resolves from the installed tarball.
- [x] Corrected the PRD where it described a different repository (pnpm, Vitest,
  `pnpm-workspace.yaml`, `tsconfig.base.json`) and stated what may change during `0.x`.
- [x] Verified the accessibility options end to end: `labelledBy`, `describedBy`,
  `valueText` and `decorative` work from the config object and from element
  attributes, and foreign `aria-*`/`role` keys throw instead of being dropped.
- [x] Verified a determinate value animates: `--wavelo-progress` is registered with
  `@property`, and a 10% → 90% change is measured passing through an intermediate
  value in Chromium.
- [x] Ran `npm run audit:customization`: passed; what each of the 111 designs
  advertises is measured in Chromium, not maintained by hand, so an option that
  changes nothing cannot be advertised.
- [x] Verified the custom element survives an invalid attribute value: it keeps its
  last valid render, sets `data-wavelo-error`, logs exactly one console error, and
  throws nothing out of its lifecycle callback.
- [x] Ran `npm run docs:build`: passed.
- [x] Ran `npm run docs:check`: passed; documented counts and bundle figures are
  read from the build, so a stale document fails the pipeline.
- [x] Ran `npm run pack:check`: passed.
- [x] Ran `npm run audit:visual`: passed.
- [x] Ran `npm run audit:visual:correctness`: passed; 111 active designs, 93 with
  animations sampled as advancing in Chromium, 16 determinate designs that are static by
  design and verified through value binding instead, and 2 timeline-driven designs
  verified by their
  timeline type — a `ScrollTimeline` for `progress-scroll` and a `ViewTimeline` for
  `progress-view`. Every public ID has its own implementation, so no design borrows
  another name.
- [x] Verified the scroll-driven design by measurement, not by inspection: the
  fill is 0px at the top of the page, half the track at 50% of the scroll range
  and the full track at 100%, and it keeps working inside an `overflow: hidden`
  wrapper because the timeline is `scroll(root block)`. Rebinding it to `auto`
  fails the test.
- [x] Verified the ergonomics options end to end: `loading: false` emits no markup and
  no stylesheet and the adapters emit no element; `count` stacks skeleton tracks that
  each paint and shimmer; `inline` puts a line on the text line at text metrics; and
  `loaderFor` binds a design and its house options in React and Vue with precedence
  registered defaults → bound options → call-site props.
- [x] Verified registered defaults work on every bridge and cannot leak: each is per
  render tree, never a module singleton, and an absent Vue boolean prop stays absent
  rather than resolving to `false`.
- [x] Verified that a configured size is kept: the `min-width`/`min-height` floors and
  `max-height` ceilings became defaults, and `height` is now measured as honoured on 15
  more designs while `width` reaches `dot-matrix` and `grid-pulse`.
- [x] Verified the styling tokens reach the rules that draw them: `--wavelo-radius`,
  `--wavelo-ease`, `--wavelo-gap`, `--wavelo-z-index`, `--wavelo-scrim` and
  `--wavelo-timeline`, with `npm run docs:check` failing if the sheet reads a property
  that `WaveloTokens` does not declare or the README table does not document.
- [x] Verified container-query sizing in Chromium: `size: '25cqi'` and an ancestor's
  `--wavelo-size: 10cqi` resolve against the loader's own query container.
- [x] Verified a page served with `style-src 'nonce-…'` and no `'unsafe-inline'`
  renders styled through the nonce in `<meta name="wavelo-csp-nonce">`, and that the
  same page without it is unstyled.
- [x] Verified `createRouteProgress` in the browser: it creeps toward its ceiling,
  accepts a real percentage, fills and removes itself, injects one stylesheet for all
  its renders, and is inert on a server.
- [x] Ran `npm run packages:check`: passed; the seven manifests carry author,
  `engines.node`, repository directory, keywords, `sideEffects`, peers and a public
  publish config, and every path their `exports` maps name exists in the build with
  its declaration beside it.
- [x] Ran `npm run pack:verify`: passed; the tarballs install into a fresh project
  that renders through them, type checks a `--strict` consumer against the packed
  declarations, and finds a licence and README in every package.
- [x] Ran `npm run audit:layout`: passed; 108 of 111 designs cost no layout per frame,
  and the three that do are each recorded with the reason a transform would take away.
  Four bar designs were moved from `height` to `scaleY` on that measurement, with the
  geometry compared at three points of the cycle before the change was kept.
- [x] Reviewed the documentation set for the new surface: `docs/RECIPES.md` (server
  rendering per framework, CSP, Tailwind v4, dark mode, container queries),
  `docs/MIGRATION.md` (react-spinners, loaders.css, react-content-loader, MUI, Chakra
  and NProgress, with the `speed` and `isLoaded` inversions called out),
  `docs/PERFORMANCE.md`, and the gallery's option chips and configuration playground.
- [ ] Human interactive review of motion quality in a real browser remains an
  owner decision; automated evidence proves each design animates, not that each
  animation looks right.

## Owner actions before publishing

Re-checked against GitHub and the npm registry on 2026-10-28.

- [x] `verify` **and** `verify-browser` are required status checks for `main`,
  with `strict: true`. Both names match what CI reports.
- [x] Required approving reviews set to `0` — the rule could never be satisfied,
  because GitHub forbids approving your own pull request and no other account has
  write access. The two status checks are now the only merge gate on `main`.
- [x] npm organization `wavelo` created and owned by `princegoel072`
  (`npm org ls wavelo`). Previously the scope did not exist, which blocked every
  `@wavelo/*` publish.
- [x] `NPM_TOKEN` repository secret created for the granular npm token, and
  `release.yml` updated to authenticate with it and publish without
  `--provenance` (npm provenance needs trusted publishing, which can only be
  configured for a package that already exists).
- [ ] Confirm the `NPM_TOKEN` token itself grants read/write on packages in the
  `wavelo` org, omits the 2FA requirement, and expires soon. Only the secret's
  existence is visible from GitHub.
- [ ] Confirm package version `0.1.0` is the intended initial release; verified
  unpublished for all seven names on 2026-10-28.
- [ ] Review the final tarball file lists and changelog once more.
- [ ] Obtain explicit approval to publish. Publishing reserves all seven names
  permanently and is not cleanly reversible.
- [ ] Set the repository variable `RELEASE_ENABLED=true` only at the moment
  publishing is authorized. It is currently `false`, and after the `dev` → `main`
  merge the release workflow ran with `Publish npm packages` **skipped**.
- [ ] Approve the `npm` environment deployment when the gated run asks for it.
- [ ] After `0.1.0`: configure npm trusted publishing per package, set the
  `RELEASE_PROVENANCE` repository variable to `true`, and delete the `NPM_TOKEN`
  secret.
- [ ] Tag the release (for example `v0.1.0`) after publication. The repository
  has no tags and `release.yml` does not create one.

## Exact publish preparation commands

```powershell
npm ci
npx playwright install --with-deps chromium firefox
npm run check
npm run test:browser
npm run test:browser:firefox
npm run docs:build
npm run docs:check
npm run audit:customization
npm run audit:layout
npm run audit:visual
npm run audit:visual:correctness
npm run pack:check
npm run pack:verify
npm pack --workspaces --pack-destination .\release-audit\approved-tarballs
```

`npm pack --workspaces` also produces `wavelo-docs-0.1.0.tgz`; `@wavelo/docs` is
`"private": true`, so npm refuses to publish it and only the seven other tarballs
are release inputs.

Inspect the seven tarballs in `release-audit\approved-tarballs`, then install
them into a fresh consumer and repeat the runtime/type checks. Do not publish
until the owner actions above are complete.

## Manual publication steps requiring approval

1. Authenticate to npm in the intended release environment using the
   organization’s approved credential and provenance policy.
2. Verify the package names, version, tarball contents, changelog, and license
   one final time.
3. Publish only the seven intended package directories, for example:

   ```powershell
   npm publish --workspace @wavelo/core --access public
   npm publish --workspace @wavelo/vanilla --access public
   npm publish --workspace @wavelo/web-components --access public
   npm publish --workspace @wavelo/react --access public
   npm publish --workspace @wavelo/vue --access public
   npm publish --workspace @wavelo/svelte --access public
   npm publish --workspace @wavelo/angular --access public
   ```

4. Verify the published manifests and package pages after publication.
5. Record the npm package URLs, publication timestamp, provenance result, and
   final release notes.

These publication commands were documented only; none was executed during the
audit.

## Automatic release workflow

`.github/workflows/release.yml` runs validation on every push to `main` and on
manual dispatch — build, check, browser suite, the customization, layout and visual
audits, package metadata, `pack:check` and `pack:verify` — and publishes only when the
`RELEASE_ENABLED` repository variable is `true`, the protected `npm` environment
approves, and `github.ref == refs/heads/main`. When enabled it verifies all seven
package versions are consistent and not already on npm, packs and uploads the
tarballs, then publishes them in a fixed order with `--access public` using the
`NPM_TOKEN` secret.

`@wavelo/core` publishes first and the loop stops at the first failure, so a bad
credential or scope cannot leave the six dependent packages half-published.
`--provenance` is off for the first release: npm creates provenance only for a package
with a configured trusted publisher, which cannot exist before the package does. Once
trusted publishing is configured for all seven, set `RELEASE_PROVENANCE=true` and the
same step publishes with provenance; delete `NPM_TOKEN` at that point.
