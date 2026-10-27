# Wavelo final delivery report

## Audit recommendation

**NO-GO for public release at this audit stage; npm publication still requires
explicit user approval.** The catalog now has 69 active,
visually-signature-unique designs and 12 deprecated aliases with preserved
public IDs. Angular SSR and the automated release checks pass. The latest visual
correctness audit verifies renderer contracts and generated previews, but a
static contact sheet cannot prove every animation's subjective visual quality.
No npm
publication was attempted.

No package was published to npm.

## Scope and versions actually tested

- Node.js `v24.21.0`
- npm `11.19.0`
- TypeScript `5.9.3`
- React and React DOM `19.3.1`
- Vue `3.5.44`
- Svelte `5.57.3`
- Angular core/compiler/platform packages `22.2.3`
- Playwright `1.64.1` with Chromium
- axe-core `4.14.0`
- esbuild `0.28.2`

The package peer ranges are documented in [COMPATIBILITY.md](COMPATIBILITY.md).
Testing one version in each declared major range does not prove compatibility
with every future minor or patch release.

## Exact commands and results

The following commands were run from the repository root after the latest
source changes:

| Command | Result |
| --- | --- |
| `npm ci` | Passed; dependency installation reported 0 vulnerabilities |
| `npm ci --dry-run` | Passed; npm reported only the expected esbuild install-script approval warning |
| `npm run build` | Passed for core, all packages, and docs |
| `npm run typecheck` | Passed with strict TypeScript settings |
| `npm test` | Passed: 17 tests |
| `npm run test:browser` | Passed: Playwright gallery plus axe, reduced-motion, console-error, and page-error assertions |
| `npm run catalog` | Passed: 81 public IDs, 69 active designs, and 116 named presets |
| `npm run audit:visual` | Passed: 81-card desktop contact sheet, mobile layout check, and per-design audit report |
| `npm run measure` | Passed; all gzip budgets passed after renderer-specific CSS |
| `npm run docs:build` | Passed |
| `npm run pack:check` | Passed for all workspace packages |

The 17 tests include core rendering and validation, every modular loader entry,
React SSR, Vue SSR, Svelte compilation, Angular metadata/lifecycle checks,
Angular TestBed DOM rendering/update/destroy behavior, Angular server rendering,
Web Components SSR import, and the browser gallery test.

## Package tarball audit

Fresh tarballs were generated with `npm pack --workspace <package>
--pack-destination release-audit/final-tarballs` for each publishable package.
The tarballs were installed into a new `release-audit/final-consumer` fixture
with exact tested framework versions and `npm install --ignore-scripts`.

| Package | Tarball | Clean install/runtime imports | TypeScript declarations |
| --- | --- | --- | --- |
| `@wavelo/core` | Passed | Passed | Passed |
| `@wavelo/vanilla` | Passed | Passed | Passed |
| `@wavelo/web-components` | Passed | Passed, including SSR-safe import | Passed |
| `@wavelo/react` | Passed | Passed | Passed |
| `@wavelo/vue` | Passed | Passed | Passed |
| `@wavelo/svelte` | Passed | Passed | Passed |
| `@wavelo/angular` | Passed | Passed | Passed |

The consumer runtime script imports the public APIs from all seven packages,
renders representative configurations, checks the modular core loader import,
and verifies the Web Components registration function is callable in Node.
`verify-all.ts` compiled with:

```powershell
npx tsc --strict --noEmit --target ES2022 --module NodeNext `
  --moduleResolution NodeNext --skipLibCheck verify-all.ts
```

Packed file lists included the required `dist` output, declarations, package
metadata, README/license files where declared, and the Svelte component source.
The package manifests explicitly include `dist` because the repository
`.gitignore` ignores generated output.

## Visual correctness remediation

- **Inspected:** 69 active designs and 12 deprecated aliases.
- **Matched before:** not numerically recorded by the prior audit; no
  retrospective count is fabricated.
- **Implementation changes:** all 69 active IDs received an explicit
  renderer contract or corrected existing contract.
- **Automated post-change pass:** 69/69 active designs, with determinate
  progress designs validated through value binding rather than motion.
- **Before:** the previous renderer dispatched many IDs only by broad `kind`,
  causing generic output and a progress ring without value-driven fill.
- **Changed:** ID-specific markup/CSS and animation contracts were added for
  orbit paths, dotted circles, bar timing, waveforms, ripples, infinity,
  radar, shapes, skeleton compositions, progress fills, and application
  states. Catalog lookup was split from the modular renderer to preserve
  tree-shaking. Documentation previews now constrain intentional full-screen
  loaders to their cards.
- **Automated result:** `npm run audit:visual:correctness` passed with 69
  active designs and 12 aliases; every active card exposed the expected
  renderer class and animation contract, except intentionally static
  determinate progress designs, which were checked for progress binding.
- **Human visual evidence:** the corrected contact sheet was reviewed for
  blank output, clipping, page-level overlays, and recognizable geometry.
  Static screenshots do not prove animation timing or complete subjective
  distinctness, so those remain a release limitation rather than a verified
  claim.

## Updated bundle measurements

`npm run measure` passed with the production esbuild fixtures:

| Entry | Minified | Gzipped | Budget |
|---|---:|---:|---:|
| Individual loader | 26,562 | 5,782 | 7,168 |
| Core renderer | 34,386 | 7,670 | 10,240 |
| Full catalog | 34,389 | 7,676 | 10,240 |
| React | 34,555 | 7,781 | 9,216 |
| Vue | 34,647 | 7,806 | 9,216 |
| Angular | 36,539 | 8,687 | 10,240 |
| Svelte | 34,393 | 7,672 | 9,216 |

## Framework verification boundaries

- **React:** component rendering, prop updates, and SSR verified against React
  19.3.1 and React DOM 19.3.1.
- **Vue:** component rendering/updates and SSR verified against Vue 3.5.44.
- **Svelte:** published component source compilation and typed rendering bridge
  verified against Svelte 5.57.3.
- **Angular:** standalone metadata/lifecycle tests, a real Angular TestBed
  fixture, and server rendering verified initial rendering, `setInput` updates,
  `fixture.destroy()` cleanup, and `renderApplication` output against Angular
  22.2.3. The server fixture runs without browser globals and passes the
  server bootstrap context required by Angular 22.
- **Vanilla/Web Components:** package imports and runtime helpers verified;
  Web Components registration is explicit and safe to import during SSR.

Hydration is not advertised or configured by this package, so hydration was not
claimed or tested. Browser fixtures for each framework were also not created;
the browser test covers the generated documentation gallery and core output
rather than every framework runtime.

## Bundle measurements

`npm run measure` uses production esbuild consumer fixtures, minification, and
gzip measurement. Framework runtimes are externalized so the values represent
Wavelo overhead. The command also checks that an individual-loader bundle does
not contain unrelated catalog metadata and enforces the budgets shown below.

| Entry | Minified | Gzipped | Budget |
| --- | ---: | ---: | ---: |
| Individual loader | 12,488 bytes | 3,738 bytes | 5,120 bytes |
| Core renderer | 20,316 bytes | 5,798 bytes | 10,240 bytes |
| Full catalog | 20,319 bytes | 5,804 bytes | 10,240 bytes |
| React adapter | 20,485 bytes | 5,905 bytes | 7,168 bytes |
| Vue adapter | 20,577 bytes | 5,928 bytes | 7,168 bytes |
| Angular adapter | 22,469 bytes | 6,785 bytes | 7,168 bytes |
| Svelte adapter | 20,323 bytes | 5,801 bytes | 7,168 bytes |

These are verified measurements from the latest source, not estimates. The
individual-loader entry remains below its budget and was checked for catalog
metadata leakage.

## Catalog validation and quality

The registry contains 81 public identifiers, 69 active designs, 12 deprecated
aliases, and 116 named presets. Automated validation checks unique identifiers,
active visual signatures, alias targets, required categories, metadata, valid
preset targets, public modular imports, customization serialization,
accessibility output, reduced-motion serialization, and documentation coverage.
The gallery renders all 81 cards and the browser test confirms all cards load
without console or page errors.

The human review is recorded in [VISUAL_CATALOG_AUDIT.md](VISUAL_CATALOG_AUDIT.md)
and its [contact sheet](../release-audit/catalog-contact-sheet.png). It found
near-duplicate ring, dot, and bar/wave groups. Cosmetic/count variants were
converted to 12 deprecated aliases, and their presets now target canonical
designs. Public imports remain available for backward compatibility. Generic
shape entries were improved with distinct cube, polygon, triangle, and folding
geometry. The active catalog therefore satisfies the PRD minimum of 60
genuinely distinct catalog signatures based on documented behavior groups,
while the report explicitly avoids claiming that a static screenshot proves
subjective animation quality.

## Accessibility and documentation

The Playwright/axe test passed with no reported axe violations. It also verified
the gallery card count, reduced-motion animation duration, and absence of
browser console/page errors. Core tests cover labels, status/progress semantics,
safe configuration validation, and reduced-motion output.

The static docs build passed and includes search/filtering, live registry-driven
previews, copyable examples, framework documentation, API references, and
release instructions. The examples were checked through the packed consumer
imports where applicable. The docs site is a static build artifact; deployment
is intentionally outside this repository audit.

## Release metadata and known limitations

- MIT license, README, changelog, package exports, workspace builds, CI, and
  release instructions are present.
- Core has no runtime dependencies.
- No npm publication or registry mutation was attempted.
- Angular SSR is verified through the committed server-rendering test; hydration
  is not supported or advertised.
- Framework browser fixtures beyond the core/gallery browser test remain
  unverified.
- The remaining subjective risk is animation perception within the documented
  ring, dot, bar/wave, and skeleton families; cosmetic aliases are excluded
  from the active distinct-design count.
- Compatibility is verified only at the versions listed above.

## Reproduction commands

```powershell
npm ci
npx playwright install chromium
npm run check
npm run test:browser
npm run docs:build
npm run audit:visual
npm run pack:check
```

Publishing still requires explicit approval. The catalog-quality blocker has
been resolved through canonical active designs, documented aliases, renderer
improvements, and repeat validation; no npm publication was performed.
