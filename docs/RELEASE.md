# Release

Publishing is intentionally not automated from this repository checkout and must
not happen without explicit approval.

```powershell
npm install
npm run build          # builds the core, regenerates catalog entry points, builds adapters
npm run check          # typecheck, 52 unit tests, catalog drift, docs sync, bundle budgets
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

## Adding another package

Wavelo is built so that a new family — a chart kit, a modal, a button set — is a new
workspace, not a restructure. `npm install @wavelo/core` and
`npm install @wavelo/react` stay exactly as they are, because:

- the workspace glob is `packages/*`, so a new directory is built, packed and tested by
  the existing scripts without touching them;
- every package publishes its own tarball from `dist`, `README.md` and `LICENSE`, with
  `"access": "public"` under one `@wavelo` scope;
- each package ships its own stylesheet — a consumer that never imports the new family
  never downloads its rules, and the loaders' 23.5 KB gzipped sheet does not grow;
- framework packages declare their framework as a peer and bundle none of it, and the
  core has no runtime dependency, so a second family cannot drag a first one's weight in;
- design ids are per registry, so a `bar` in a chart catalog is not the `bar` loader.

Three things are not automatic and must be updated when a package joins, all of them
lists of names rather than logic:

1. `.github/workflows/release.yml` — the publish loop names each tarball, and a package
   missing from it is built, validated and never published.
2. `scripts/validate-release.mjs` — `packageFiles` is what "one version across every
   package" is checked against.
3. `scripts/verify-packed.mjs` — `publishable` is the list the clean-install consumer
   project resolves its dependencies from.

Decide the naming before the first release after a new family, not after it: `@wavelo/react`
means *the React adapter for loaders* today. A UI kit that wants the same framework-first
name would have to rename a published package, which is a breaking change for every
consumer; a family-first name (`@wavelo/charts`, `@wavelo/ui`) never collides, and its own
adapters live inside it as subpaths or as `@wavelo/ui-react`.

## Versioning

Semver applies to the public surface: patch for backward-compatible fixes, minor for
backward-compatible functionality, major for breaking API changes. Prereleases are for
integration testing.

Until `1.0.0` the surface is still being found, so a minor version (`0.x`) may change
configuration keys, option meanings or entry points. Every such change is recorded in
`CHANGELOG.md` under a `Breaking` line and in [MIGRATION.md](MIGRATION.md). What `0.x`
never does is leave a caller guessing: an option that stops applying is removed and
reported, never silently ignored. From `1.0.0` the rules above apply in full, and
"compatible" stops being an assertion — `npm run audit:customization` re-measures which
options each design honours, and the Chromium, Gecko and WebKit suites re-render every
design in the catalog.

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
