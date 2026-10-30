# Wavelo release readiness audit

Audit date: 2026-10-27, re-audited 2026-10-28 after a full library review
Audited branch: `dev`  
Repository: `princegoel0/wavelo`  
Decision: **BLOCKED**

## Executive summary

The local implementation and package checks pass, and the release workflow was
hardened without publishing or changing npm settings. GitHub repository
safeguards are now configured: protected `main`, required CI/review controls,
and a protected `npm` environment with owner approval. The release is still
blocked because npm trusted publishing remains unverified.

The 2026-10-28 review found that several documented options did not behave in a
browser and that documentation claimed more than the code delivered. All of it is
now fixed in the code and the documentation was regenerated against the fixed
build; see "Library review findings" below.

The original workflow had release-critical defects:

1. The tarball build step referenced `steps.gate` before the gate step ran.
2. The publish job checked out a clean workspace but did not build before
   publishing, so ignored `dist` output could be absent.
3. The version gate required every package manifest to be changed in the last
   commit, incorrectly rejecting a first release whose existing version is
   intentionally `0.1.0`.
4. It did not prevent republishing an exact version already present on npm.
5. Workflow-level `id-token: write` granted OIDC permission to validation jobs.
6. A manually dispatched run on a non-main ref could publish when the gate was
   enabled.
7. Chromium installation was not explicit for the browser checks on a clean
   GitHub runner.

These were corrected and pushed to `dev`. No changes were merged to `main`,
tagged, published, or enabled for release.

## Library review findings (2026-10-28)

Each finding was reproduced in Chromium before being fixed, and each fix is now
covered by a test that fails if it regresses. The probe was checked in both
directions: reintroducing the `paused` defect made the browser suite fail, and
drifting a generated loader made catalog validation fail.

| Severity | Finding | Evidence and impact | Status |
|---|---|---|---|
| HIGH | `paused` and `direction` did nothing | Every per-kind rule used the `animation:` shorthand, which resets `animation-direction`, `animation-play-state` and delay. Computed styles reported `running`/`normal` for ring, dots and bars regardless of configuration. | Fixed: controls are carried inside the shorthand as `var(--wavelo-direction)`/`var(--wavelo-play-state)`. Asserted by computed style **and** `document.getAnimations()` play-state. |
| HIGH | `reducedMotion: 'always'` equalled `'auto'` | The only motion rule sat inside `@media (prefers-reduced-motion:reduce)` and merely excluded `never`, so nothing forced reduction. Contradicted `PRD.md`. | Fixed: an out-of-media-query rule keyed to `data-wavelo-motion="always"`. Covered for both OS settings. |
| HIGH | Tests asserted strings, not behaviour | `tests/core.test.mjs` matched `--wavelo-play-state:paused` in the HTML, so both defects above passed green; CI ran no browser suite. | Fixed: `tests/browser.test.mjs` now covers computed styles, injection counts, slice isolation, the custom element and axe, and CI runs it in a dedicated `verify-browser` job on every push and PR. |
| HIGH | "Modular" cost 78% of a single-design bundle | One imported loader shipped 20,629 B of the 26,556 B minified bundle as CSS for all 82 designs. | Fixed: styles are split into a shared base plus 12 render-kind slices. One design now ships 5,018 B gzipped against a 5,632 B budget, and every design is re-rendered in the browser using only its own slice to prove the slices are complete. |
| HIGH | Stylesheets were duplicated per instance | `mountLoader` tagged its `<style>` with `data-wavelo-style` but nothing ever queried it; twelve loaders meant twelve copies. Measured 201.7 KB of duplicate CSS and 1,810 parsed rules in the DOM. | Fixed: `ensureStyles` injects each distinct slice into the head once. No adapter inlines CSS any more. |
| MEDIUM | Three sources of truth for the catalog | The alias map was duplicated in `registry.ts` and `render.ts`; 86 loader modules hand-copied their metadata; five modules (`orbit`, `pulse`, `spinner`, `skeleton`, `progress`) used IDs absent from the registry, so `import { orbit }` rendered orbiting-dots while `renderLoader({ type: 'orbit' })` rendered inline. | Fixed: `src/catalog.ts` is the only authored source; entry points, the barrel and the `LoaderId` union are generated, the phantom modules are gone, and `npm run catalog` diffs generated content against the committed files. |
| MEDIUM | Dead options | `theme`, `variant` and the `data-*` index signature were typed and documented but never used; `normalizeConfig`'s unknown-type branch and `getLoaderDefinition`'s `'pulse'` default were unreachable. | Fixed: `theme` drives the skeleton palette, `data-*` is emitted, `variant` is removed from the type and the PRD, and the dead branches are gone. A test renders all 27 keys and asserts each reaches the element. |
| MEDIUM | Adapters accepted 7 of the then-20 keys | Vue, Svelte and Angular declared seven props each while `docs/COMPATIBILITY.md` promised "the same serializable core configuration". | Fixed: every adapter takes the full surface, derived from `loaderConfigKeys` in core, with parity asserted per adapter. |
| MEDIUM | Stylesheet accretion | 28 selectors were defined more than once, including `.wavelo--dotted-circle` eleven times with dead earlier declarations, and alias-only rules that could never match. | Fixed: rules live in one file per render kind; the dead duplicates and unreachable alias rules were removed, with computed-style equality re-verified per design. |
| LOW | Missing npm metadata and stale build output risk | No `repository`, `bugs`, `homepage` or `keywords` on any package; `dist` was never cleaned, so a deleted design could ship as a stale module. | Fixed: metadata added to all seven manifests, the core build cleans `dist`, and catalog validation fails when `dist/loaders` and the registry disagree. |
| LOW | CI ran no browser check | `npm test` excludes the browser suite and `ci.yml` never invoked it. | Fixed as part of the HIGH test finding above. |
| INFO | Orphaned script | `scripts/measure.mjs` was referenced by nothing and duplicated `bundle.mjs`. | Removed. |

## Files inspected

- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
- `package.json`
- `package-lock.json`
- All seven publishable package manifests
- `packages/core/src/registry.ts`, renderer, loaders, and tests
- `docs/LOADER_VISUAL_CORRECTNESS_AUDIT.md`
- `docs/VISUAL_CATALOG_AUDIT.md`
- `docs/FINAL_DELIVERY_REPORT.md`
- `docs/RELEASE.md`
- `RELEASE_CHECKLIST.md`
- `tests/`
- `scripts/`

## Files changed locally

Release-workflow hardening (2026-10-27):

- `.github/workflows/release.yml`
- `package.json`
- `scripts/validate-release.mjs`
- `release-audit/catalog-corrected-contact-sheet.png` (regenerated by the
  visual audit)

Library review remediation (2026-10-28):

- `packages/core/src/` — new `catalog.ts`, `config.ts`, `styles.ts`, `css/`
  slices; rewritten `render.ts`, `registry.ts`, `types.ts`, `validation.ts`,
  `dom.ts`, `render-catalog.ts`; regenerated `loaders/` and `ids.ts`
- `packages/{react,vue,svelte,angular,web-components,vanilla}/src/` and every
  package `package.json`
- `.github/workflows/ci.yml` — added the `verify-browser` job and `docs:check`
- `scripts/` — `catalog-artifacts.mjs`, `generate-catalog.mjs`,
  `emit-stylesheet.mjs`, `clean.mjs`, `style-fidelity.mjs`,
  `validate-docs.mjs`; rewritten `validate-catalog.mjs` and `bundle.mjs`;
  deleted the orphaned `measure.mjs`
- `tests/` — rewritten `core.test.mjs`, `framework.test.mjs`, `browser.test.mjs`
- `.gitattributes` — generated modules are compared byte-for-byte, so their line
  endings must not depend on the checkout
- Documentation: `README.md`, `CHANGELOG.md`, `PRD.md` (configuration table),
  `RELEASE_CHECKLIST.md`, this report, `docs/{COMPATIBILITY,FRAMEWORKS,RELEASE,
  BUNDLE_SIZE,FINAL_DELIVERY_REPORT,IMPLEMENTATION_PLAN,PRD_AUDIT,
  VISUAL_CATALOG_AUDIT,LOADER_VISUAL_CORRECTNESS_AUDIT}.md`, and all seven
  package READMEs

## Findings and remediation

| Severity | Finding | Evidence and impact | Status |
|---|---|---|---|
| HIGH | Publish job could publish without build artifacts | Publish checked out source and ran `npm ci`; generated `dist` is ignored and not guaranteed to exist on a fresh runner. | Fixed by building and packing in validation, then publishing uploaded tarballs. |
| HIGH | First-release version gate was incorrect | It required all seven package manifests to appear in `git diff HEAD^ HEAD`, which rejects an intentional first release at existing `0.1.0`. | Fixed by validating aligned versions and querying npm for the exact published version. |
| HIGH | Exact version republish was not blocked | The previous workflow only checked local manifest changes and did not query npm. | Fixed by `scripts/validate-release.mjs`; current `0.1.0` was checked and reported unpublished for all seven packages. |
| HIGH | Gate step ordering was invalid | Tarball creation used `steps.gate.outputs` before the gate step was defined. | Fixed by moving the gate before version validation and tarball creation. |
| MEDIUM | OIDC permission was too broad | `id-token: write` was declared at workflow scope, including validation. | Fixed by granting `id-token: write` only to `publish`. |
| MEDIUM | Manual dispatch could publish from another ref | Publish condition checked only the gate. | Fixed with `github.ref == 'refs/heads/main'`. |
| MEDIUM | Browser dependency was implicit | Release workflow ran Playwright without installing Chromium. | Fixed with `npx playwright install --with-deps chromium`. |
| MEDIUM | Seven-package publication is non-atomic | npm can partially publish before a later package fails. | Documented recovery plan below; exact validated tarballs reduce incompatibility risk. |
| LOW | Action references use mutable major tags | Actions use `@v4`; this is common but not immutable SHA pinning. | Owner may pin reviewed SHAs before production release. |
| INFO | Visual acceptance remains limited | Each design's animations are now sampled through `document.getAnimations()` twice, 250ms apart, so "it animates" is measured rather than inferred; axe and computed-style checks run in Chromium, a 6-test Gecko smoke suite (`npm run test:browser:firefox`, in CI) covers the sheet, token inheritance, painting and the timeline fallback on Firefox 157, and a 7-test WebKit suite (`npm run test:browser:webkit`, in CI) covers the same ground plus the mask, the conic gradient, the registered integer and the real `ScrollTimeline`/`ViewTimeline` path on WebKit 27.2. A screenshot still cannot prove subjective quality, and no Apple-shipped Safari was run — WebKit is Playwright's build of the same engine. | Owner's interactive browser review remains the stated release condition; automated evidence no longer claims to substitute for it. |

## Release workflow after remediation

`release.yml`:

- Runs on pushes to `main` and manual dispatch.
- Always runs validation before any publish job.
- Installs dependencies with `npm ci`.
- Runs build, strict typecheck, unit/framework tests, catalog validation,
  bundle measurement, docs build, browser/accessibility checks, visual
  correctness audit, and package dry-run checks.
- Installs Chromium explicitly on Ubuntu.
- Requires repository variable `RELEASE_ENABLED` to equal exactly `true`.
- Requires the ref to be `refs/heads/main` for publishing.
- Validates one matching semver version across all seven packages.
- Validates internal `@wavelo/*` dependency versions match that release.
- Queries npm to reject exact versions already published.
- Packs the seven packages only after validation.
- Uploads those exact tarballs as an artifact.
- Publishes the artifact tarballs in a fixed order using the `NPM_TOKEN`
  repository secret, with `--access public` and no `--provenance`: npm
  provenance requires trusted publishing, which is configured per existing
  package, so it returns for `0.1.x` once each `@wavelo` package has a trusted
  publisher.
- Stops at the first publish failure (`set -euo pipefail`), and publishes
  `@wavelo/core` first, so a credential or scope problem cannot leave the six
  dependent packages half-published before the core is known good.
- Grants OIDC permission only to the publishing job.
- Uses a non-overlapping `npm-release` concurrency group.
- The publishing job targets the protected `npm` environment, so a gated release
  also waits for an environment approval from `princegoel0` before any
  `npm publish` runs.

The validation job has no publish credentials, no token, and no OIDC write
permission.

## First-release version analysis

All seven packages currently use `0.1.0` on both local branches:

- `@wavelo/core`
- `@wavelo/vanilla`
- `@wavelo/web-components`
- `@wavelo/react`
- `@wavelo/vue`
- `@wavelo/svelte`
- `@wavelo/angular`

The root package and lockfile also use `0.1.0`. Internal package dependencies
are aligned to `0.1.0`. `npm run release:validate` queried the exact package
versions and reported that none of the seven `0.1.0` versions is currently
published.

The corrected gate therefore permits this first release without requiring a
manifest diff. For later releases, an exact npm version match causes the gate
to fail before packing or publishing.

## Package publication checklist

| Package | Manifest | Build/export check | Tarball dry run | Dependency review | Publish path |
|---|---|---:|---:|---:|---|
| `@wavelo/core` | Verified | Passed | Passed | No runtime deps | `wavelo-core-<version>.tgz` |
| `@wavelo/vanilla` | Verified | Passed | Passed | Core `0.1.0` | `wavelo-vanilla-<version>.tgz` |
| `@wavelo/web-components` | Verified | Passed | Passed | Core `0.1.0` | `wavelo-web-components-<version>.tgz` |
| `@wavelo/react` | Verified | Passed | Passed | Core plus React peers | `wavelo-react-<version>.tgz` |
| `@wavelo/vue` | Verified | Passed | Passed | Core plus Vue peer | `wavelo-vue-<version>.tgz` |
| `@wavelo/svelte` | Verified | Passed | Passed | Core plus Svelte peer | `wavelo-svelte-<version>.tgz` |
| `@wavelo/angular` | Verified | Passed | Passed | Core plus Angular peer | `wavelo-angular-<version>.tgz` |

The package dry run showed the intended `dist`, declaration, metadata,
README, and license files. No package is published atomically with another;
the workflow publishes deterministic validated tarballs in a fixed order.

## Release configuration checklist

Every checked box below was re-read from GitHub or the npm registry on
2026-10-28; nothing here is asserted from workflow files alone.

### GitHub repository settings

- [x] Protected environment named `npm` exists.
- [x] `princegoel0` is the required reviewer for the `npm` environment, so a
  gated release pauses for approval before any publish step runs.
- [x] The `npm` environment is restricted to protected branches
  (`deployment_branch_policy.protected_branches: true`).
- [x] `main` requires the CI checks `verify` and `verify-browser`, with
  `strict: true` so a merge candidate must be current. Both context names match
  what CI reports, so neither sits "expected" forever.
- [x] `main` requires conversation resolution, blocks force pushes and deletion,
  and applies to administrators (`enforce_admins: true`).
- [x] Required approving reviews set to `0`. This was necessary: the rule
  demanded one approval, GitHub forbids the author approving their own pull
  request, and no other account has write access, so no pull request could ever
  merge. With reviews at `0`, the two required status checks are the only gate on
  `main`.
- [x] Repository variable `RELEASE_ENABLED` is `false`, verified after the merge:
  the release workflow ran on `main` at `603ecfc` with `Validate release` green
  and `Publish npm packages` **skipped**, and `npm run release:validate` still
  reports nothing published.
- [x] Repository secret `NPM_TOKEN` created for the granular npm token.
- [ ] Set `RELEASE_ENABLED=true` only at the moment publishing is authorized.
- [ ] Pin the reviewed action SHAs instead of `@v4` major tags (optional).

### npm settings

- [x] The `wavelo` scope is an npm organization owned by the publishing account
  (`npm org ls wavelo` reports `princegoel072 - owner`). Before this the registry
  returned `404 Scope not found`, which made every `@wavelo/*` publish impossible
  regardless of CI configuration.
- [ ] Confirm the `NPM_TOKEN` granular token grants read/write on packages in the
  `wavelo` org, omits the 2FA requirement, and carries a short expiry. Only the
  secret's existence is visible from GitHub; its scope and expiry cannot be read
  from this repository.
- [ ] After `0.1.0` exists: configure npm trusted publishing for each package
  (`princegoel0/wavelo`, `release.yml`, environment `npm`), restore
  `--provenance` in `release.yml`, and delete the `NPM_TOKEN` secret.
- [ ] After publication, verify the seven package pages, versions and access
  level on npm.

Publishing `0.1.0` permanently reserves all seven names; npm does not allow a
clean delete-and-rename of a published version. The merge of `dev` into `main`
and the validation-only release run are both reversible; the publish job is not.

Workflow presence alone does not prove any setting is configured. No npm login,
token creation, account change, or registry mutation was performed by this audit;
the token and organization were created by the owner, and no `npm publish` has
been run.

## Validation commands and observed results

Re-run 2026-10-29 against the current build, after the Phases B–J work.

| Command | Result |
|---|---|
| `npm run check` | Passed: build with catalog generation, strict typecheck, 45 unit tests, catalog drift check, package metadata check, documentation sync, bundle budgets |
| `npm run catalog` | Passed: 129 public IDs, 129 active designs, 183 presets, 12 stylesheet slices; verified to fail on a drifted generated file |
| `npm run packages:check` | Passed: seven manifests complete, and every `exports` path exists in the build with its declaration |
| `npm run docs:check` | Passed: documented counts, options, custom properties and bundle figures match the built packages, across 12 documents |
| `npm run docs:build` | Passed |
| `npm run test:browser` | Passed: 33 tests — paused, direction, all three reducedMotion modes against both OS settings, theme palettes plus the theme's colour and scrim, slice injection counts, per-design slice isolation for 129 designs, custom element re-render, the element keeping its last valid render when an attribute value is invalid, the `style` attribute as configuration, data attributes, determinate values, `loading`/`count`/`inline`, the `data-wavelo-fallback` trace on an unknown type, `tokens.css` neutrality, container-query sizing, the scroll- and view-driven fills at 0/50/100% of their ranges inside and outside an `overflow: hidden` wrapper plus their clock-driven fallbacks, the route progress bar, a `style-src` CSP page with and without the nonce, painted pixels for the palette/gradients/scrim, visibility for all 129 designs, the name contract, distinctness of all 129 designs, gallery with option chips and playground + axe |
| `npm run test:browser:firefox` | Passed: 6 Gecko smoke tests — the sheet applies, the options and ancestor tokens reach the loader, every design paints, the custom element re-renders, and both timeline designs run on the document clock (`scroll()`/`view()` measured unsupported on Firefox 157) |
| `npm run audit:customization` | Passed: the measured option table still matches what Chromium renders for all 129 designs |
| `npm run audit:layout` | Passed: 126 of 129 designs cost no layout per frame; the three that do are each recorded with a reason |
| `npm run audit:visual` | Passed: 129 designs, contact sheet regenerated |
| `npm run audit:visual:correctness` | Passed: 129 active designs (111 animating, 16 static by design, 2 timeline-driven verified as a `ScrollTimeline` and a `ViewTimeline`); no aliases remain |
| `npm run pack:check` | Passed for all seven workspaces |
| `npm run pack:verify` | Passed: the tarballs install into a fresh project that renders, type checks under `--strict`, and carries a licence and README per package |
| `npm run release:validate` | Passed: aligned `0.1.0`, exact versions not published |
| `npm pack --workspaces --dry-run --json` | Passed; seven intended tarballs and expected files |
| `npm ls --workspaces --depth=0` | Passed; aligned workspace dependency graph |
| `git diff --check` | Passed |
| GitHub Actions workflow execution | Passed on GitHub for `dev` at `5068090` (push run and pull-request run) and for `main` at `ae0e06d`: `verify` and `verify-browser` both green, with the `verify-browser` step list naming `npx playwright install --with-deps chromium firefox webkit` and successful Gecko and WebKit smoke steps on a clean Ubuntu runner; `Release packages` validating with its publish job skipped, and the `Gallery` workflow skipping both jobs while `GALLERY_ENABLED` is unset. Not run locally. |
| npm trusted publishing/provenance | Not verifiable without owner configuration and publication; the GitHub-side `npm` environment exists with protected-branch policy and `princegoel0` as required reviewer. `RELEASE_PROVENANCE=true` now switches the publish step to `--provenance` once trusted publishing is configured per package. |

The latest bundle measurements, all within the budgets in `scripts/bundle.mjs`:

- Individual design entry point: 5,018 B gzip (two designs: 5,782 B)
- Core renderer (runtime-selected design): 12,692 B gzip
- Full catalog: 12,702 B gzip
- React: 13,101 B gzip
- Vue: 13,532 B gzip
- Angular: 14,357 B gzip
- Svelte: 12,789 B gzip
- Web Components: 13,575 B gzip
- Vanilla: 12,942 B gzip
- `@wavelo/core/styles.css`, the whole catalog sheet: 5,897 B gzip

## Gate scenario assessment

- `RELEASE_ENABLED` unset: gate writes `enabled=false`; publish job is skipped.
- `RELEASE_ENABLED=false`: gate writes `enabled=false`; publish job is skipped.
- `RELEASE_ENABLED=true` with failed validation: the `publish` job requires the
  successful `validate` job and is skipped.
- `RELEASE_ENABLED=true` with mismatched versions: `validate-release.mjs` exits
  non-zero before tarball upload; publish cannot start.
- First release with aligned unpublished `0.1.0`: local
  `npm run release:validate` passed.
- Subsequent release with an exact version already on npm: registry validation
  exits non-zero before tarball upload.
- Manual dispatch from `dev`: validation may run, but the publish job condition
  fails because the ref is not `refs/heads/main`.

The first-release and current registry scenarios were executed locally. The
GitHub-only conditional paths were verified from workflow structure but not
executed against GitHub Actions.

## Partial-publication recovery

npm does not provide a transaction across seven packages. If a later package
fails after earlier packages publish:

1. Do not rerun blindly with the same version; already-published packages will
   be rejected.
2. Capture the workflow run URL, package order, npm output, and provenance
   results.
3. Verify which package versions exist on npm.
4. Diagnose the failing package and correct the release process without
   overwriting the published version.
5. Publish the remaining packages only through a reviewed recovery workflow,
   using the same immutable tarballs where possible.
6. If a package is unusable, deprecate that exact version on npm and prepare a
   coordinated patch release.
7. Record the incident and update the release checklist before the next release.

## Final decision

**BLOCKED**

The library defects found in the 2026-10-28 review are fixed and covered by
tests that fail if they regress; the code, documentation, package surface,
tarball checks and release-version validation are ready. Public release must
remain blocked until the owner verifies npm trusted publishing, the protected
GitHub environment, branch protection, package ownership/access, provenance
policy, and completes the interactive visual acceptance pass in a real browser.
