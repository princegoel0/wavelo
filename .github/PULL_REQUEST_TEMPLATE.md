<!--
What is changing, and why it matters, in a sentence or two. Then the evidence.
Delete this comment.
-->

## What changes

## How it was verified

Run what applies and paste the tail of each. `npm run check` is build, typecheck, unit
and adapter tests, the two package gates, catalog drift, package metadata, docs sync and
bundle budgets — it is not everything.

- [ ] `npm run check`
- [ ] `npm run test:browser` — renderer or CSS changed
- [ ] `npm run audit:layout` — a keyframe or transform changed
- [ ] `npm run docs:build && npm run test:visual` — a design's geometry changed
- [ ] `npm run audit:customization` — an option's behaviour changed
- [ ] `npm run pack:verify` — packaging, exports or a build script changed
- [ ] `node scripts/adversarial-suite.mjs` — validation or escaping changed

## Public surface

- [ ] No public change
- [ ] `CHANGELOG.md` has a line under `Unreleased`
- [ ] Breaking for a `0.x` minor: `Breaking:` line in `CHANGELOG.md` and a row in
      [docs/MIGRATION.md](../docs/MIGRATION.md)
- [ ] A new or changed option: `npm run catalog:generate` regenerated the honoured-options
      table, and the documents that quote option support were re-read against it
- [ ] A capability claim in a document names the measurement behind it, or says it is
      documented rather than tested

## If this adds a guard

- [ ] It was broken on purpose once, and the failure is quoted here

<!--
A guard that has never failed is not evidence. Show the failure you caused.
-->

## Screenshots

For anything a person sees: the gallery export, or a filmstrip of the animation across one
cycle. A still of a spinner at one frame proves very little.
