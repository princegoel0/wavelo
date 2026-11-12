# Security policy

Wavelo is a stylesheet and a markup renderer. It has no network layer, no storage, no
`eval`, no runtime code generation, and no install-time scripts — the seven published
packages declare `build` and nothing that npm can run while installing, which
`npm run packages:check` refuses to let drift.

What it does touch is the DOM, and that is where a defect would matter.

## What counts

A configuration value becomes part of an HTML string or a CSS declaration. The renderer
escapes or rejects it first. A security report here is a case where that does not hold:

- markup injected through `className`, `label`, `valueText`, an id, or a `data-*` value;
- a CSS declaration injected through `style`, `color`, `backgroundColor`, `duration` or
  any other value that reaches a custom property;
- an ARIA attribute the configuration did not ask for, or one that should have been
  refused and was not;
- an object merged into defaults from an untrusted source (prototype pollution);
- something in a published tarball that is not in this repository.

Non-issues: a design that looks wrong, a size you disagree with, and anything about a
page Wavelo is *not* rendering into. A loading spinner cannot read your session; it can
only draw.

## Where the guarantees are already enforced

- `packages/core/src/validation.ts` — the allow-lists. Every string that reaches markup
  is character-checked and length-capped, every number is bounded, colours and dimensions
  are patterned, and `role` / `aria-*` keys are refused outright because the renderer owns
  them. `escapeHtml` runs on the attribute values as a second barrier.
- `scripts/adversarial-suite.mjs` — the cases above, run as `ADV-SEC-01` through
  `ADV-SEC-05` (class injection, HTML in a label, CSS in a colour, CSS in a style object,
  foreign ARIA attributes), plus hostile-authoring-context and accessibility cases.
  Run it with `node scripts/adversarial-suite.mjs`.
- `npm run test:browser` — a page served with `style-src` and no `'unsafe-inline'`, where
  the loader is only styled if it carries the document's nonce.
- `npm run pack:verify` — installs the tarballs themselves into a clean project and
  renders from them, so what ships is what is tested.

## Reporting

Report privately through a [security advisory](https://github.com/princegoel0/wavelo/security/advisories/new).
Do not open a public issue for an exploitable defect. If that form is not available to you,
open an issue whose title is only `security report` with no detail in it: the maintainer
converts it into a private advisory and closes the issue.

There is no formal response-time SLA: this is a pre-1.0 project maintained by one person.
What is real is the shape of the fix — forward-port it in the next release, publish it as
soon as it is verified, and file a CVE for anything with an actual exploit path. Version
numbers already published are never rewritten or unpublished: a fixed release replaces
them, and the defective ones are deprecated with a message that says what to move to.

`docs/RELEASE.md` describes the publish order and what happens when it stops halfway. The
release workflow prints only the length and prefix of its registry credential before it
publishes anything, and its `npm` environment requires a human approval.
