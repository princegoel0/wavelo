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
- [x] Verified all 12 deprecated aliases remain importable, render without
  fallback, produce byte-identical markup to their canonical design, and mirror
  its `kind`, `options` and progress support in metadata.
- [x] Verified alias presets target canonical IDs.
- [x] Verified `paused`, `direction` and all three `reducedMotion` modes in
  Chromium through computed styles and `document.getAnimations()` play-states,
  and confirmed the assertions fail if the CSS defect is reintroduced.
- [x] Verified each of the 81 designs renders identically from only its own
  stylesheet slice, so the modular entry points are complete.
- [x] Verified style slices are injected once per document (12 loaders across
  five render kinds produce five head elements, none inside a host).
- [x] Reviewed `.github/workflows/ci.yml`: it runs validation and packaging
  checks only; it does not publish or mutate npm.
- [x] Added a `verify-browser` CI job so computed-style and axe checks run on
  every push and pull request, not only in the release workflow.
- [x] Confirmed on GitHub that both jobs are green for `dev` at `41cf7c3`,
  including the Playwright install step on a clean runner.
- [x] Ran `npm run check`: passed; build with catalog generation, strict
  typecheck, 25 unit tests, catalog drift check, documentation sync, and bundle
  budgets.
- [x] Ran `npm run test:browser`: passed; 10 tests in Chromium.
- [x] Ran `npm run docs:build`: passed.
- [x] Ran `npm run docs:check`: passed; documented counts and bundle figures are
  read from the build, so a stale document fails the pipeline.
- [x] Ran `npm run pack:check`: passed.
- [x] Ran `npm run audit:visual`: passed.
- [x] Ran `npm run audit:visual:correctness`: passed; 69 active designs, 62 with
  animations sampled as advancing in Chromium and 7 determinate-progress designs
  verified through value binding, plus 12 aliases.
- [ ] Human interactive review of motion quality in a real browser remains an
  owner decision; automated evidence proves each design animates, not that each
  animation looks right.

## Owner actions before publishing

- [ ] Add `verify-browser` to the required status checks for `main`. Protection
  currently requires only `verify`, so a failing computed-style or axe suite
  would not block a merge.
- [ ] Configure npm trusted publishing on npmjs.com for repository
  `princegoel0/wavelo`, workflow `release.yml`, and environment `npm`. The GitHub
  side is already in place: the `npm` environment exists with a protected-branch
  policy and `princegoel0` as required reviewer.
- [ ] Confirm the intended public registry access policy and npm provenance
  settings for the release.
- [ ] Confirm package version `0.1.0` is the intended initial release and that
  no package has already been published under these names.
- [ ] Review the final tarball file lists and changelog once more.
- [ ] Obtain explicit approval to publish; this audit performed no npm login,
  publish, version mutation, or registry operation.
- [ ] Set the repository variable `RELEASE_ENABLED=true` only when automatic
  publishing from `main` is approved. Verified 2026-10-28: it is currently
  `false`, so a merge to `main` validates but publishes nothing.
- [ ] Update all seven package versions consistently in the merge to `main`.
  The release workflow rejects a gated release when any package version is
  unchanged or the versions differ.
- [ ] Decide whether to tag the release (for example `v0.1.0`). The repository
  has no tags at all today, and `release.yml` does not create one after
  publishing.

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
variable and the protected `npm` environment. When enabled, it verifies that
all seven package versions changed consistently, then publishes each package
with npm provenance using GitHub Actions OIDC. No npm token is stored in the
repository.
