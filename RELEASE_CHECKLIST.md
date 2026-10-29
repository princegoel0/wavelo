# Wavelo release checklist

Audit date: 2026-10-27, re-run 2026-10-28 after the library review
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
- [x] Verified `paused`, `direction` and all three `reducedMotion` modes in
  Chromium through computed styles and `document.getAnimations()` play-states,
  and confirmed the assertions fail if the CSS defect is reintroduced.
- [x] Verified each of the 82 designs renders identically from only its own
  stylesheet slice, so the modular entry points are complete.
- [x] Verified style slices are injected once per document (12 loaders across
  five render kinds produce five head elements, none inside a host).
- [x] Reviewed `.github/workflows/ci.yml`: it runs validation and packaging
  checks only; it does not publish or mutate npm.
- [x] Added a `verify-browser` CI job so computed-style and axe checks run on
  every push and pull request, not only in the release workflow.
- [x] Confirmed on GitHub that both jobs are green for `dev` at `19cffe1` and for
  `main` at `603ecfc`, including the Playwright install step on a clean runner.
- [x] Merged `dev` into `main` as `603ecfc` through pull request #6; the release
  workflow ran there with `Validate release` green and `Publish npm packages`
  skipped, because `RELEASE_ENABLED` is `false`.
- [x] Ran `npm run check`: passed; build with catalog generation, strict
  typecheck, 36 unit tests, catalog drift check, documentation sync, and bundle
  budgets.
- [x] Ran `npm run test:browser`: passed; 20 tests in Chromium.
- [x] Ran `npm run audit:customization`: passed; what each of the 82 designs
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
- [x] Ran `npm run audit:visual:correctness`: passed; 82 active designs, 76 with
  animations sampled as advancing in Chromium, 5 determinate-progress designs
  verified through value binding, and `progress-scroll` verified to run on a
  `ScrollTimeline` rather than the document clock. Every public ID has its own
  implementation, so no design borrows another name.
- [x] Verified the scroll-driven design by measurement, not by inspection: the
  fill is 0px at the top of the page, half the track at 50% of the scroll range
  and the full track at 100%, and it keeps working inside an `overflow: hidden`
  wrapper because the timeline is `scroll(root block)`. Rebinding it to `auto`
  fails the test.
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
- [ ] After `0.1.0`: configure npm trusted publishing per package, restore
  `--provenance`, and delete the `NPM_TOKEN` secret.
- [ ] Tag the release (for example `v0.1.0`) after publication. The repository
  has no tags and `release.yml` does not create one.

## Exact publish preparation commands

```powershell
npm ci
npx playwright install --with-deps chromium
npm run check
npm run test:browser
npm run docs:build
npm run docs:check
npm run audit:visual
npm run audit:visual:correctness
npm run pack:check
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
manual dispatch. Publishing is gated by the `RELEASE_ENABLED` repository
variable, the protected `npm` environment approval, and `github.ref ==
refs/heads/main`. When enabled it verifies all seven package versions are
consistent and not already on npm, packs and uploads the tarballs, then publishes
them in a fixed order with `--access public` using the `NPM_TOKEN` secret.

`@wavelo/core` publishes first and the loop stops at the first failure, so a bad
credential or scope cannot leave the six dependent packages half-published.
`--provenance` is intentionally absent for the first release: npm creates
provenance only for a package with a configured trusted publisher, which cannot
exist before the package does. Restore it per package for `0.1.x` and delete the
secret at that point.
