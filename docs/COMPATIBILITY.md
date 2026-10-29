# Compatibility

Wavelo's core is framework-independent. It renders markup and styles separately
and depends on these browser features: CSS custom properties (including `var()`
inside the `animation` shorthand), CSS keyframe animations, `color-mix()`,
`conic-gradient()`, `clip-path()`, `prefers-reduced-motion`, `prefers-color-scheme`,
and CSS grid or flex for the composite skeleton designs. `color-mix()` sets the
floor: Chrome and Edge 111, Safari 16.2, Firefox 113.

One design goes further and uses scroll-driven animations: `progress-scroll` binds
its fill to `animation-timeline: scroll(root block)`. That is a progressive
enhancement, not part of the floor — inside `@supports (animation-timeline:
scroll())`, with the same keyframes running on the document clock as a repeating
sweep where it is unsupported.

The library does not render SVG, does not use JavaScript animation, and does not
depend on the Web Animations API at runtime — the custom element and DOM helpers
only read `document.head` and create elements.

**Verified engine:** Chromium, through Playwright, in `npm run test:browser` and in
CI. Firefox and Safari have not been exercised by this suite; the versions above
are the requirement implied by the CSS features used, not a claim that they were
tested.

## Where a value comes from

A rendered loader writes only what its caller chose. Everything else resolves in
CSS, in this order:

1. the loader's own option, written inline on the element;
2. a registered default (`WaveloProvider`, `provideWaveloDefaults`,
   `WAVELO_DEFAULTS`, `createWavelo({...})`), merged into the config before the
   loader's own options;
3. a `--wavelo-*` custom property on any ancestor, or on the element through
   `className`;
4. the fallback in the rule that reads the token.

Inline always beats inherited, which is exactly why unset options are not written
inline any more: a page that sets `--wavelo-size` on `:root` would otherwise lose to
the renderer's own default. Registration is per render tree rather than a module
global, so a server that renders many requests in one process cannot leak one
caller's theme into another's markup.

## Configuration surface

The catalog holds 82 public IDs, each with its own implementation, built from
12 render kinds and 12 stylesheet slices. Every adapter accepts the
same 27 configuration keys — `type`, `size`, `width`, `height`, `color`,
`secondaryColor`, `backgroundColor`, `speed`, `duration`, `strokeWidth`, `theme`,
`direction`, `paused`, `label`, `className`, `style`, `reducedMotion`,
`data-testid`, `value`, `max`, `labelledBy`, `describedBy`, `valueText`,
`decorative`, `loading`, `count`, `inline` — plus arbitrary `data-*` values.
`tests/framework.test.mjs` renders every key through every adapter and asserts each
one reaches the element, so a bridge that falls behind the core fails the build.

| Integration | How the surface is reached |
| --- | --- |
| `@wavelo/core` | `renderLoader(config)`; `type` is the typed `LoaderId` union with a `string` escape hatch for runtime values |
| `@wavelo/core/loaders/<id>` | one design, config minus `type`; ships only that design's slice |
| `@wavelo/react` | the whole props object is passed to the core |
| `@wavelo/vue` | declared props for every key except `data-*`, which arrive as fallthrough attributes and are merged into the config. The boolean keys are declared without a type: Vue casts an absent `Boolean` prop to `false`, which would override a registered default and hide a loader nobody asked to hide |
| `@wavelo/angular` | 27 inputs; `style` binds as `waveloStyle` because Angular reserves `[style]`; host `data-*` attributes are merged into the config |
| `@wavelo/svelte` | `$props()` is forwarded to the core whole, so any key reaches it |
| `@wavelo/web-components` | one attribute per key in kebab case (`stroke-width`, `secondary-color`, `reduced-motion`), plus any `data-*` |
| `@wavelo/vanilla` | re-exports `mountLoader`, `createLoaderElement`, `createWavelo` and the style helpers |

Boolean options (`paused`, `decorative`, `loading`, `inline`) need binding syntax in
Vue and Svelte (`:paused="true"`, `paused={true}`); a bare attribute reads as a
string there. On the custom element, `paused=""` is true and `paused="false"` is
false — and the same strings in a JavaScript config object mean the same thing, so
the two paths cannot disagree.

## Value grammar and measured options

Colours accept hex, CSS colour keywords and any colour function — `rgb()`, `hsl()`,
`oklch()`, `lab()`, `hwb()`, `color-mix()` — and reject anything containing a
character that could end a declaration or start a block, so a value cannot escape
the inline style it lands in.

Sizes accept `auto`, a number with a unit of up to five letters (`px`, `rem`, `%`,
`ch`, `cqi`, `svh`, `q` …), and the functions `calc()`, `min()`, `max()`, `clamp()`,
`env()` and `var(--wavelo-*)`. Numbers passed as strings on an attribute are
coerced; strings that are not valid CSS are rejected with a message naming the key.

`style` carries custom properties and **throws** on a key it cannot apply, because a
silently discarded option is the failure mode this library exists to remove.

`LoaderDefinition.options` is not a hand-maintained list. `scripts/honoured-options.mjs`
renders every design in Chromium with each key set and unset and records which keys
changed the render; `npm run audit:customization` repeats that measurement in CI and
fails if the committed table drifts. A design therefore cannot advertise an option
that does nothing: `skeleton-card` has no `strokeWidth`, `ring` has no
`secondaryColor`, `progress-bar` has no `duration`, `progress-scroll` has no
`speed` because its fill follows the scroll position rather than the clock,
`three-dots` has no `count` because three dots are three dots, and `fullscreen` has
no `inline` because a fixed overlay sits on nobody's line of text. The class name a
key switches on is left out of the comparison, so what is measured is the effect,
not the mechanism.

## Determinate progress

Seven designs render a value: `progress-bar`, `progress-ring`, `progress-steps`,
`progress-top`, `progress-upload`, `segmented-bar` and `page-transition`. They
are the designs whose render kind is `progress`, which is also what decides their
accessibility contract — a labelled render exposes `role="progressbar"` with
`aria-valuemin`, `aria-valuemax` and `aria-valuenow`, and `value` is clamped to
`[0, max]` by validation. A design of any other kind ignores `value` for
semantics even if one is passed.

`progress-top` is `position: fixed` by design, because it is a page-edge
indicator; contain it in a preview or card the way the documentation gallery
does. `progress-steps` fills whole steps: `ceil(value / max * 5)` of five.

`progress-scroll` is deliberately not one of the seven. Its fill comes from the
document's scroll position, so there is no value for JavaScript to report: a
labelled render exposes `role="status"` with no `aria-valuenow`, and passing
`value` changes nothing. It is the `scroll` render kind, which is why the
contract above and the tests that enforce it do not apply to it; its own test
scrolls the document and measures the fill at 0%, 50% and 100% of the range.

## Styles and server rendering

Client code needs nothing: `ensureStyles` puts each distinct slice in
`document.head` once, and every loader using that slice reuses it.

Server rendering is the one thing an app must do deliberately. Because no
adapter inlines CSS, a server-rendered page must include the sheet in its head —
import `@wavelo/core/styles.css` through the bundler, or emit the slices that
were rendered with `renderStylesheets`. A page that skips this step renders
correct markup with no styling. This is the trade for not shipping one copy of
the stylesheet per component instance.

## Framework versions

Peer ranges are deliberately limited to the versions this repository exercises:

- React and React DOM `>=19.3.1 <20`
- Vue `>=3.5.44 <4`
- Svelte `>=5.57.3 <6`
- Angular core `>=22.2.3 <23`

The `@wavelo/svelte` component ships as source and needs `vitePreprocess` (or
`svelte-package`) in the consumer's build.

## What is verified, and where

- React SSR output, Vue SSR output, Angular SSR through `renderApplication`,
  Angular TestBed updates and lifecycle cleanup, Angular component metadata, and
  Svelte compilation for both client and server with no legacy-syntax warnings —
  `tests/framework.test.mjs`, part of `npm test` and CI.
- Computed styles in Chromium for `paused`, `direction` and all three
  `reducedMotion` values against both OS settings, the skeleton palette for each
  `theme`, style-slice injection counts, per-design slice isolation for all 82
  IDs, the scroll-driven fill measured against the document's scroll position and
  its clock-driven fallback, custom-element attribute re-rendering, the element's
  behaviour on an invalid attribute value, and axe over the whole gallery —
  `tests/browser.test.mjs`, run by `npm run test:browser` in a dedicated CI job.
- The measured option table above, re-measured by `npm run audit:customization` in
  the same CI job.
- Hydration is not configured or advertised by these adapters; they render
  markup into a container rather than reconciling it.
- No adapter touches browser globals during module evaluation, so all of them
  import cleanly during server rendering.

Release validation must record the exact Node.js, TypeScript, browser and
framework versions used for each published package.

## Catalog compatibility policy

Every public ID renders its own design. The catalog previously carried 12
deprecated aliases that borrowed a canonical design while keeping a name that
promised something else: "Four dots" rendered three dots, "Thick stroke" rendered
the same 3px ring as "Ring", and "Dot matrix" rendered three dots in a row. Those
IDs now have real implementations, so nothing needs deprecating before the first
release.

The alias mechanism (`aliasOf`, `deprecated`, and the metadata mirroring that goes
with it) stays in the registry for future renames, and `npm run catalog` rejects
an alias whose metadata disagrees with its target; the catalog currently has zero
aliases. Two browser tests guard the property that matters: no two designs may
render identically, and every design must paint something visible.

### Presets and resolution

`renderLoader` reports how the requested `type` became the design that rendered:

| `resolution` | meaning | `fallback` |
| --- | --- | --- |
| `'exact'` | a catalog ID, rendered as itself | `false` |
| `'preset'` | a pattern preset such as `download-progress`, rendering the design it names | `false` |
| `'alias'` | a deprecated ID, rendering its canonical design | `false` |
| `'default'` | an ID that matches nothing, rendering `inline` | `true` |

`fallback` therefore means exactly "your request was not understood", and a preset
hit is never reported as one. All 35 pattern presets resolve to the design they
declare; a unit test walks the whole table.
