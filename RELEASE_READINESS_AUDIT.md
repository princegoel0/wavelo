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
| HIGH | "Modular" cost 78% of a single-design bundle | One imported loader shipped 20,629 B of the 26,556 B minified bundle as CSS for all 81 designs. | Fixed: styles are split into a shared base plus 11 render-kind slices. One design now ships 3,617 B gzipped (budget tightened from 7,168 to 4,096), and every design is re-rendered in the browser using only its own slice to prove the slices are complete. |
| HIGH | Stylesheets were duplicated per instance | `mountLoader` tagged its `<style>` with `data-wavelo-style` but nothing ever queried it; twelve loaders meant twelve copies. Measured 201.7 KB of duplicate CSS and 1,810 parsed rules in the DOM. | Fixed: `ensureStyles` injects each distinct slice into the head once. No adapter inlines CSS any more. |
| MEDIUM | Three sources of truth for the catalog | The alias map was duplicated in `registry.ts` and `render.ts`; 86 loader modules hand-copied their metadata; five modules (`orbit`, `pulse`, `spinner`, `skeleton`, `progress`) used IDs absent from the registry, so `import { orbit }` rendered orbiting-dots while `renderLoader({ type: 'orbit' })` rendered inline. | Fixed: `src/catalog.ts` is the only authored source; entry points, the barrel and the `LoaderId` union are generated, the phantom modules are gone, and `npm run catalog` diffs generated content against the committed files. |
| MEDIUM | Dead options | `theme`, `variant` and the `data-*` index signature were typed and documented but never used; `normalizeConfig`'s unknown-type branch and `getLoaderDefinition`'s `'pulse'` default were unreachable. | Fixed: `theme` drives the skeleton palette, `data-*` is emitted, `variant` is removed from the type and the PRD, and the dead branches are gone. A test renders all 20 keys and asserts each reaches the element. |
| MEDIUM | Adapters accepted 7 of 20 keys | Vue, Svelte and Angular declared seven props each while `docs/COMPATIBILITY.md` promised "the same serializable core configuration". | Fixed: every adapter takes the full surface, derived from `loaderConfigKeys` in core, with parity asserted per adapter. |
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
| INFO | Visual acceptance remains limited | Each design's animations are now sampled through `document.getAnimations()` twice, 250ms apart, so "it animates" is measured rather than inferred; axe and computed-style checks run in Chromium. A screenshot still cannot prove subjective quality, and Firefox and Safari are not exercised. | Owner's interactive browser review remains the stated release condition; automated evidence no longer claims to substitute for it. |

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
- Publishes the artifact tarballs with `--provenance`.
- Grants OIDC permission only to the publishing job.
- Uses a non-overlapping `npm-release` concurrency group.

The validation job has no publish credentials or OIDC write permission.

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

## Trusted publishing configuration checklist

### GitHub owner actions

- [x] Create the protected environment named `npm`.
- [x] Configure `princegoel0` as a required reviewer for the `npm` environment.
- [x] Restrict the `npm` environment to protected branches.
- [ ] Configure npm trusted publishing for repository
  `princegoel0/wavelo`, workflow `release.yml`, and environment `npm`.
- [x] Keep repository variable `RELEASE_ENABLED=false` during development.
- [x] Protect `main` and require the CI `verify` check before
  merging from `dev`.
- [x] Require pull requests, one approval, conversation resolution, and prevent
  force pushes to `main`.
- [ ] Set repository variable `RELEASE_ENABLED=true` only after release approval.

### npm owner actions

For each of the seven package names:

- [ ] Confirm the package name is available or owned by the intended npm
  organization/account.
- [ ] Configure GitHub trusted publishing for the exact repository and
  workflow identity.
- [ ] Confirm public access policy and provenance expectations.
- [ ] After publication, verify provenance attestations on npm.

Workflow presence alone does not prove any of these settings are configured.
No npm login, token creation, account change, or registry mutation was done.

## Validation commands and observed results

| Command | Result |
|---|---|
| `npm run check` | Passed: build with catalog generation, strict typecheck, 25 unit tests, catalog drift check, documentation sync, bundle budgets |
| `npm run catalog` | Passed: 81 public IDs, 69 active designs, 116 presets, 11 stylesheet slices; verified to fail on a drifted generated file |
| `npm run docs:check` | Passed: documented counts, options and bundle figures match the built packages |
| `npm run docs:build` | Passed |
| `npm run test:browser` | Passed: 10 tests — paused, direction, all three reducedMotion modes against both OS settings, theme palettes, slice injection counts, per-design slice isolation for 81 designs, custom element re-render, data attributes, gallery + axe |
| `npm run audit:visual` | Passed: 81 designs, contact sheet regenerated |
| `npm run audit:visual:correctness` | Passed: 69 active designs (62 animating, 7 static by design) and 12 aliases |
| `npm run pack:check` | Passed for all seven workspaces |
| `npm run release:validate` | Passed: aligned `0.1.0`, exact versions not published |
| `npm pack --workspaces --dry-run --json` | Passed; seven intended tarballs and expected files |
| `npm ls --workspaces --depth=0` | Passed; aligned workspace dependency graph |
| `git diff --check` | Passed |
| GitHub Actions workflow execution | Not run locally; requires GitHub |
| npm trusted publishing/provenance | Not verifiable without owner configuration and publication |

The latest bundle measurements, all within the budgets in `scripts/bundle.mjs`:

- Individual design entry point: 3,617 B gzip (two designs: 4,007 B)
- Core renderer (runtime-selected design): 8,268 B gzip
- Full catalog: 8,276 B gzip
- React: 8,487 B gzip
- Vue: 8,795 B gzip
- Angular: 9,578 B gzip
- Svelte: 8,269 B gzip
- Web Components: 8,867 B gzip
- Vanilla: 8,423 B gzip
- `@wavelo/core/styles.css`, the whole catalog sheet: 3,570 B gzip

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
