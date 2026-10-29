# Release

Publishing is intentionally not automated from this repository checkout and must
not happen without explicit approval.

```powershell
npm install
npm run build          # builds the core, regenerates catalog entry points, builds adapters
npm run check          # typecheck, 45 unit tests, catalog drift, docs sync, bundle budgets
npm run test:browser   # Chromium: computed styles, style injection, slice isolation, axe
npm run docs:build
npm run measure
npm pack --workspace @wavelo/core
```

`npm run catalog` compares the generated loader modules, barrel and `src/ids.ts`
against `packages/core/src/catalog.ts`; after changing the catalog run
`npm run catalog:generate` and commit the regenerated files. `npm run docs:check`
reads the counts and bundle figures from the build, so a stale document fails
rather than drifting silently.

Install the generated tarball in a clean temporary project, resolve every public
subpath — `@wavelo/core/loaders/<id>`, `@wavelo/core/css`, `@wavelo/core/styles`,
`@wavelo/core/styles.css` — compile a documented example with strict `tsc
--noEmit`, and inspect the contents before publishing. Confirm package names,
access, version, changelog, and license. Provenance is not available for the
first release, which publishes with a granular `NPM_TOKEN`; add npm trusted
publishing per package afterwards and restore `--provenance`. Only then run the
approved release workflow or `npm publish` for the reviewed package.

Consumers need to know one thing this repository cannot verify for them: no
adapter inlines CSS, so a server-rendered page must include
`@wavelo/core/styles.css` (or the slices it rendered) in its document head.
State it in the release notes.

Two repository variables decide what a workflow is allowed to do, and both are
the owner's to set:

- `RELEASE_ENABLED` (default `false`) — `release.yml` always validates, and only
  publishes when this equals exactly `true` and the ref is `main`. The `npm`
  environment additionally requires an approval from `princegoel0`.
- `GALLERY_ENABLED` (unset) — `pages.yml` builds and deploys the documentation
  gallery to GitHub Pages only when this equals `true`. It stays skipped while
  unset, so merging the workflow cannot fail a run on `main` or publish a site
  before Pages is pointed at "GitHub Actions" in the repository settings.

Neither gate publishes anything to npm, and no other workflow may be given
`pages: write` or `id-token: write`.

Never publish an unreviewed pull request. Use semantic versioning and record the
exact validation environment in release notes.
