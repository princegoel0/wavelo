# Release

Two things live in this file. The first half is how **Wavelo** releases, with the commands and
gates this repository actually has. The second half is a **portable runbook** — the same sequence
stripped of Wavelo specifics, to copy into another project and fill in its commands.

---

# Part 1 — Wavelo

Publishing is intentionally not automated from this repository checkout and must
not happen without explicit approval.

```powershell
npm install
npm run build          # builds the core, regenerates catalog entry points, builds adapters
npm run check          # typecheck, 53 unit tests, verify:angular, catalog drift, docs sync, bundle budgets
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

`@wavelo/angular` is built with `ngc` in partial mode, because a component compiled
by `tsc` alone carries no Ivy definition and an AOT application rejects it with
`NG2012` while every JIT unit test stays green. `npm run verify:angular` proves the
shipped artifact is library-compiled, that its Angular peer floor is not older than
the `minVersion` it emits, and that a consumer component written the way
[FRAMEWORKS.md](FRAMEWORKS.md) describes compiles against it.

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
  never downloads its rules, and the loaders' 34,699 B gzipped catalog sheet does not grow;
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
  environment additionally requires an approval from `princegoel0`. Set it back to
  `false` after a release, so the next merge cannot queue a publish attempt.
- `GALLERY_ENABLED` (unset) — `pages.yml` builds and deploys the documentation
  gallery to GitHub Pages only when this equals `true`. It stays skipped while
  unset, so merging the workflow cannot fail a run on `main` or publish a site
  before Pages is pointed at "GitHub Actions" in the repository settings.

Neither gate publishes anything to npm, and no other workflow may be given
`pages: write` or `id-token: write`.

`main` requires a pull request with the `verify` and `verify-browser` checks green and the
branch up to date with `main`, so merging `main` back into `dev` before opening a PR is
normal, not noise. Never publish an unreviewed pull request, and record the exact
validation environment in release notes.

## The order of operations, in one line each

Source change → `catalog:generate` → local verification in full → commit and push `dev` → CI →
version bump across every manifest, dependency and version-stamped document → `release:validate`
→ re-verify → PR to `main` → **human merges** → `Validate release` job → **human approves the
`npm` environment deployment** → registry preflight and dry-run of every tarball → publish loop →
read `dist-tags` and each version document back from the registry → tag and release notes →
gallery deploys → `RELEASE_ENABLED` back to `false`.

---

# Part 2 — Portable release runbook

Copy this half into a new project and replace the verbs with that project's commands.

## One-time setup

| What to build | Generic form | The failure it prevents |
|---|---|---|
| Single authored source | One file or registry everything else is generated from; generated outputs committed, never hand-edited | Two sources of truth drift, and the hand-edited one wins quietly |
| Named verification targets | `check`, `validate`, `verify`, `audit`, `pack`, `release:validate` as scripts | A release becomes a memory test of which commands to remember |
| Measured claims | Every number or capability stated in docs is recomputed and compared by a check | Restated figures rot while the build stays green |
| Split decisions | "is it correct" runs everywhere; "does it go live" is a separate job with its own trigger | A passing test suite turning into a publication |
| Kill switch | One config flag the live step requires, defaulting to off | Merging anything becoming a release decision |
| Human gate on the live step | Deployment environment with a required approver, approval scoped per run | One bad merge publishing irreversibly |
| No cancellation across a publish | Concurrency group that queues, never cancels, the live job | A half-published release with burned versions |
| Branch protection | PR required, named required checks, up-to-date required, admin enforcement on | "It passed locally" carrying the decision |
| Pinned test toolchain | Every framework or SDK you test against declared explicitly | A resolver auto-installing a new major your checks never anticipated |
| Consumer-shaped proof | For each integration, a test using the consumer's real toolchain and mode | Unit tests green while the published artifact is unusable |

## Every release

1. **Change the source, then regenerate.** If a generated file must be hand-edited, the generator is wrong.
2. **Verify locally, completely**: build, types, unit tests, real-environment tests, static audits, docs sync, packaging checks, size or performance budgets. Skipping here only moves the failure later.
3. **Push the working branch and let CI run the identical list.** Fix the tree, not the pipeline.
4. **Pick the version by the written policy**, not by feel: fix → patch, backward-compatible capability → minor, breakage → major.
5. **Bump everywhere the version appears** — root manifest, each published artifact, internal cross-dependencies, lockfile, changelog header, any document stamping "current version" — then run a validator that checks alignment *and* that the number is not already taken.
6. **Re-verify after the bump.** A bump is a change like any other.
7. **Write the changelog for the consumer**: what they can now do, what is broken in earlier versions, and what you could not verify.
8. **Open the PR and stop.** A merge is a human act; a previous approval is not a standing one. Name the consequence in the request: "merging queues a publish of 1.4.0".
9. **Let the merge start validation, keep validation separate from publication, and keep publication behind an approval.** Three states, three gates.
10. **Preflight the irreversible write**: authenticate and print the *shape* of a credential, never the value; confirm the destination accepts you; dry-run every unit of work; only then do the work. A preflight that writes nothing makes partial failure survivable.
11. **Publish and read each result individually.** A pipeline exit code is not evidence that all artifacts are live.
12. **Verify from the consumer's side.** Query the registry or CDN and re-read what users read; assume replica and cache lag in both directions — absence is not proof, and neither is presence.
13. **Tag and write release notes from the same verified state**, including limits you could not test.
14. **Deploy secondary surfaces** — docs, gallery, changelog page — and confirm each URL answers.
15. **Turn the kill switch off again.** This is a release step, not a follow-up.

## When something published is wrong

Take the least destructive option that achieves the goal, in this order:

1. **Deprecate** the affected versions with a message saying what breaks and what to move to. Reversible, breaks no lockfile, warns every installer.
2. **Publish forward** — the fix as the next version, with the defect named in the changelog.
3. **Unpublish** only when the content itself must not be installable. Windows apply (npm: 72 hours per version), removed version numbers are burned permanently, dependents with exact pins start failing with 404s, and caches keep serving the tarball regardless.
4. **Never delete a published name** unless a quarantine period and orphaned dependents are acceptable.

## Reversibility map

| Action | Reversible? | Blast radius |
|---|---|---|
| Push a branch | Yes | nobody |
| Open a PR | Yes | nobody until merged |
| Merge to the release branch | Only by revert | everyone who pulls |
| Publish a version | Effectively no | every consumer, forever |
| Deprecate | Yes | consumers who install it |
| Unpublish | No | consumers with exact pins |
| Rename or retire a published identifier | No | every consumer |

## Habits

- Name the irreversibility in the same sentence as the request for approval.
- Fix the root cause, then add the measurement that would have caught it — content first, guard second.
- Prove a guard fails before trusting that it passes: break it once on purpose.
- When a check fails, suspect your own instrumentation before the world: stale probes, unfrozen samples, perturbations that never applied.
- Re-read state before acting on it, not merely before reporting it.
- Keep the publishing step small and idempotent, so re-running is harmless.
- Do not write metadata into anyone's commits or releases that they did not ask for.
