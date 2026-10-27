# Wavelo release checklist

Audit date: 2026-10-27  
Audited version: `0.1.0`

## Completed

- [x] Verified all seven publishable package names and versions:
  `@wavelo/core`, `@wavelo/vanilla`, `@wavelo/web-components`,
  `@wavelo/react`, `@wavelo/vue`, `@wavelo/svelte`, and `@wavelo/angular`.
- [x] Verified MIT license metadata, package-local `README.md`, and
  package-local `LICENSE` in every tarball.
- [x] Verified `main`, `types`, ESM package format, package exports, files
  allowlists, runtime dependencies, and framework peer dependencies.
- [x] Generated fresh tarballs for all seven packages.
- [x] Installed all seven tarballs into a new clean consumer with
  `npm install --ignore-scripts`; install completed with 0 vulnerabilities.
- [x] Verified runtime imports from all seven packed packages.
- [x] Compiled packed-package TypeScript declarations with strict
  `tsc --noEmit`.
- [x] Verified all 12 deprecated aliases remain importable, render without
  fallback, and report their canonical visual signatures.
- [x] Verified alias presets target canonical IDs.
- [x] Verified the changelog, root README, MIT license, compatibility policy,
  release instructions, and deprecation documentation.
- [x] Reviewed `.github/workflows/ci.yml`: it runs validation and packaging
  checks only; it does not publish or mutate npm.
- [x] Ran `npm run check`: passed; 17 tests, catalog validation, and bundle
  budgets passed.
- [x] Ran `npm run test:browser`: passed.
- [x] Ran `npm run docs:build`: passed.
- [x] Ran `npm run pack:check`: passed.
- [x] Ran `npm run audit:visual`: passed.
- [ ] Resolve the remaining visual-review limitation documented in
  `docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md`; release recommendation remains
  **NO-GO** until active-loader motion is reviewed interactively.

## Owner actions before publishing

- [ ] Confirm the intended public registry access policy and npm provenance
  settings in the release environment.
- [ ] Confirm package version `0.1.0` is the intended initial release and that
  no package has already been published under these names.
- [ ] Review the final tarball file lists and changelog once more.
- [ ] Obtain explicit approval to publish; this audit performed no npm login,
  publish, version mutation, or registry operation.
- [ ] Configure npm trusted publishing for this GitHub repository/workflow and
  create the protected `npm` environment.
- [ ] Set the repository variable `RELEASE_ENABLED=true` only when automatic
  publishing from `main` is approved. With the variable unset or false, the
  release workflow validates but does not publish.
- [ ] Update all seven package versions consistently in the merge to `main`.
  The release workflow rejects a gated release when any package version is
  unchanged or the versions differ.

## Exact publish preparation commands

```powershell
npm ci
npx playwright install chromium
npm run check
npm run test:browser
npm run docs:build
npm run audit:visual
npm run pack:check
npm pack --workspaces --pack-destination .\release-audit\approved-tarballs
```

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
