# Wavelo

Wavelo is a dependency-light, framework-independent loading and motion library.
The repository contains a typed core, a generated modular catalog, DOM and Web
Component support, framework configuration bridges, and a registry-driven
documentation gallery.

The catalog holds 129 designs, each visually distinct, built from 12
render kinds and 12 stylesheet slices, and every adapter accepts the same
27 configuration keys.

Nine of them are the streaming lane (`typing-dots`, `thinking-glow`, `stream-cursor`,
`token-stream`, `ai-shimmer`, `neural-grid`, plus the composite `skeleton-chat`,
`skeleton-code` and `skeleton-inbox` layouts): what an assistant shows while it is
composing an answer, which no loading library has as a category. Thirteen more are the
progress family that real products report with a number — a battery, a half-ring gauge,
a counting bar whose percentage animates itself in CSS, a queue of files, steps that
number themselves, a countdown and a wave-filled level.

## Development

```powershell
npm install
npm run build          # compiles the core, regenerates catalog entry points, builds adapters
npm run check          # build, typecheck, unit tests, catalog drift, documentation sync, bundle budgets
npm run test:browser   # Chromium suite: computed styles, style injection, axe, gallery
npm run test:browser:firefox   # Gecko smoke suite: the sheet applies, fallbacks hold
npm run test:browser:webkit    # WebKit smoke suite: the timeline enhancement holds there
npm run docs:build
npm run docs:verify    # the built gallery holds every design and embeds its stylesheet
```

The package is not published by these commands. See [docs/RELEASE.md](docs/RELEASE.md)
before any release action.

## Core usage

```ts
import { renderLoader } from '@wavelo/core';

const loading = renderLoader({
  type: 'orbiting-dots',   // any catalog ID, typed
  label: 'Loading data',   // omit to render an aria-hidden element
  size: 48,
  color: '#6366f1',
  reducedMotion: 'auto'
});

loading.html;   // markup, no styles inside it
loading.css;    // the stylesheet slice this design needs
loading.styleKey; // identity of that slice, used for injection dedupe
```

`renderLoader` picks the design at runtime, so it carries every slice. When the
design is known at build time, import its own entry point and ship only what it
needs:

```ts
import { orbitingDots } from '@wavelo/core/loaders/orbiting-dots';

const loading = orbitingDots({ label: 'Loading data' });
```

## Scroll and view progress without JavaScript

`progress-scroll` is a reading-progress bar driven by a CSS scroll timeline: the
browser maps the document's scroll position onto the fill, with no scroll
listener, no state and no re-render. `progress-view` is the same idea on a view
timeline: the bar fills as the element it sits in travels through the viewport,
which is what a per-section or scroll-reveal indicator needs.

```ts
import { progressScroll } from '@wavelo/core/loaders/progress-scroll';
import { progressView } from '@wavelo/core/loaders/progress-view';

const page = progressScroll({ label: 'Reading progress' });
const section = progressView({ label: 'Section progress' });
```

Neither takes a `value`, because the percentage belongs to the page and the markup
does not invent one: labelled, they render `role="status"` rather than a
`progressbar` carrying a fabricated `aria-valuenow`. `progress-scroll` tracks the
document (`scroll(root block)`), which keeps working inside `overflow: hidden`
wrappers. `progress-view` tracks its own element by default; to follow a different
one, declare `view-timeline: --article block` on it and set
`style={{ '--wavelo-timeline': '--article' }}`. Where these timelines are
unsupported the same keyframes sweep on the document clock, so a bar shows
activity instead of an empty track.

## Route changes

`createRouteProgress` is the top-of-page bar every app writes for itself: it creeps
toward a ceiling while a route is loading, never claiming it is nearly finished, and
takes itself out when told.

```ts
import { createRouteProgress } from '@wavelo/core';

const bar = createRouteProgress();
router.beforeEach(() => bar.start());
router.afterEach(() => bar.done());
```

It carries no label by default, because a page announces a route change through its
own focus movement; pass `{ label: 'Loading page' }` to say it anyway. `set(42)` pins
the bar for a router that reports real progress, and nothing is scheduled or appended
during server rendering.

## Sizing that follows the page

Every dimension accepts container and viewport units, so a loader can size itself to
the box it is in rather than to a number chosen per call site:

```ts
renderLoader({ type: 'ring', size: '12cqi' }); // 12% of its query container
```

```css
.card { container-type: inline-size }
.card wavelo-loader { --wavelo-size: 25cqi }
```

## Configure it once, then just use it

Every token below can be set on any ancestor — `:root`, a layout wrapper, a
component class — and every loader inside inherits it. A value passed to one loader
overrides that one loader:

```css
:root{--wavelo-color:#6366f1;--wavelo-size:1.5rem;--wavelo-duration:1.2s;--wavelo-stroke:3px}
.dark-surface{--wavelo-color:#e0e7ff;--wavelo-skeleton-base:#1f2937;--wavelo-skeleton-highlight:#374151}
```

| token | config key it backs | default |
| --- | --- | --- |
| `--wavelo-size` | `size` — the square box most designs are built in | `2.5rem` |
| `--wavelo-width` / `--wavelo-height` | `width` / `height`, on the designs that are not a square | each design's own shape (a bar is `8rem` by `.5rem`) |
| `--wavelo-color` | `color`, and everything painted through `currentColor` | `#6366f1`, or `#a5b4fc` on a dark theme |
| `--wavelo-secondary-color` | `secondaryColor`, on the designs that layer a second colour | `#a5b4fc` |
| `--wavelo-background` | `backgroundColor` | `transparent`; the overlay designs fall back to the scrim |
| `--wavelo-scrim` | the translucent layer of `overlay` and `fullscreen`, normally via `theme` | `#fff`, or `#0f172a` on a dark theme |
| `--wavelo-duration` | `duration`, and `speed` as its multiplier | `1s` |
| `--wavelo-ease` | the timing function of each design's animation | the timing that design was authored with |
| `--wavelo-timeline` | the named scroll or view timeline `progress-view` follows | the bar's own `view(block)` |
| `--wavelo-stroke` | `strokeWidth` | `3px` in most rules; a battery shell and a gauge band are drawn thicker |
| `--wavelo-direction` | `direction` | `normal` |
| `--wavelo-play-state` | `paused` | `running` |
| `--wavelo-progress` | `value` / `max` on the determinate designs | `35%`, and it interpolates |
| `--wavelo-count` | the same `value` as a whole percentage, for the design that prints it | `0`, registered as an integer so a count can animate |
| `--wavelo-radius` | the corner radius of tracks, bars, steps and placeholders — not a design's own shape | each rule's own |
| `--wavelo-gap` | the space between the parts of a composite design | each rule's own |
| `--wavelo-z-index` | the layer of the fixed top bars and the full-screen overlay | `9999` |
| `--wavelo-skeleton-base` / `--wavelo-skeleton-highlight` | the shimmer, normally via `theme` | light or dark palette |

A token with no config twin — `--wavelo-radius`, `--wavelo-ease`, `--wavelo-gap`,
`--wavelo-scrim`, `--wavelo-z-index`, `--wavelo-timeline` and the skeleton palette —
is reachable only this way, and `npm run docs:check` fails if the sheet reads a
property that `WaveloTokens` does not declare or the table above does not document.

`@wavelo/core/tokens.css` declares as a `:root` block the tokens whose default every
design agrees on, for a team that would rather see and edit them than inherit them
from the sheet. It is generated from the stylesheet, so it can only list a property
that is safe to set globally — radius, gap, easing and the size chain stay in the
rules that read them — and a browser test asserts that loading it changes nothing.

For defaults that are configuration rather than styling — label, reduced-motion
policy, design choice — register them for a subtree. Each is per render tree, never
a global, so server rendering cannot leak one request's settings into another:

```tsx
import { WaveloProvider, Loader } from '@wavelo/react';

<WaveloProvider defaults={{ color: '#6366f1', size: 32, reducedMotion: 'auto', label: 'Loading' }}>
  <Loader type="ring" />            {/* inherits */}
  <Loader type="ring" size={64} />  {/* overrides */}
</WaveloProvider>
```

```ts
// Vue: provideWaveloDefaults({ size: 32 }) in a parent's setup
// Svelte: provideWaveloDefaults({ size: 32 }) during init; WaveloLoader reads it
// Angular: providers: [{ provide: WAVELO_DEFAULTS, useValue: { size: 32 } }]
// Core and vanilla: createWavelo({ size: 32 }).render({ type: 'ring' })
```

### Bind a design once, use it everywhere

A component that always shows the same design with the same house options is worth
making once, so a call site says what changed rather than repeating a configuration:

```tsx
import { loaderFor } from '@wavelo/react';

const ButtonSpinner = loaderFor('ring', { size: 16, color: '#ffffff', label: 'Saving' });

// later, in any component:
<ButtonSpinner loading={busy} />
```

```ts
// Vue: const ButtonSpinner = loaderFor('ring', { size: 16 }); <ButtonSpinner :loading="busy" />
// Core: const w = createWavelo({ type: 'ring', size: 16 }); w.render({ loading: busy });
```

Precedence runs outward to inward: registered defaults, then the bound component's
own options, then the props at the call site.

`loading` is the option that makes this work in one place. `false` renders no markup
and asks for no stylesheet, so a loader that is hidden costs nothing — you bind
visibility instead of mounting and unmounting a component, and the hidden state
leaves no empty element behind.

### Styling the box, and styling around it

Wavelo renders one element. Two channels reach it, and each has its own job:

```html
<style>
  .toolbar { display: flex; gap: .5rem; margin: 1rem 0 } /* host: layout and spacing */
  .toolbar wavelo-loader { --wavelo-size: 2rem }         /* loader: configuration     */
</style>

<div class="toolbar">
  <wavelo-loader type="ring" style="--wavelo-duration:2s"></wavelo-loader>
  <wavelo-loader type="three-dots"></wavelo-loader>
</div>
```

* The **host** — the wrapper you put around it, or the framework component's own
  element — takes ordinary CSS: `display`, `margin`, `flex`, `text-align`. Wavelo
  never reads those, and its styles never set them (`display:contents` on the
  adapter host means the host adds no box of its own).
* **`--wavelo-*` custom properties** configure the loader. Set them on the host, an
  ancestor, a class rule or `style`, and the loader reads them; the same names are
  configuration in `style` and in the custom element's `style` attribute, where
  every other declaration there stays ordinary styling.

Use `inline` when the loader belongs to a line of text: it aligns the box to the
middle of the line, and gives a block or grid design an inline twin, so a skeleton
line can replace one word rather than a paragraph.

## Stylesheets

Styles never travel inside component markup. A design's slice is added to the
document head once, and every loader that uses the same slice shares it:

```ts
import { mountLoader } from '@wavelo/core';

const detach = mountLoader(document.querySelector('#slot'), { type: 'ring', label: 'Loading' });
```

For server rendering, include the sheet in the head instead — import the static
file, or emit the slices you rendered with `renderStylesheets`:

```ts
import { allStyles } from '@wavelo/core/css';
import { renderStylesheets } from '@wavelo/core/styles';

// once, in the document head
renderStylesheets(results.map((result) => result.css));
```

Every adapter package documents the same rule. See
[docs/FRAMEWORKS.md](docs/FRAMEWORKS.md), and for a page under a `style-src` policy
without `'unsafe-inline'`, declare the nonce once and every injected slice carries it:

```html
<head><meta name="wavelo-csp-nonce" content="{nonce}"></head>
```

`ensureStyles`, `mountLoader` and `renderStylesheets` also take `{ nonce }` directly.

The documentation gallery doubles as a playground: `npm run docs:build` writes
`apps/docs/dist/index.html`, where every design shows the options it was measured to
honour and the controls above the grid write `--wavelo-*` properties the way a page's
own CSS would.

## What the configuration does

These 27 keys are the whole surface, and a test asserts each one reaches the
rendered element: `size`, `width`, `height`, `color`, `secondaryColor`,
`backgroundColor`, `speed`, `duration`, `strokeWidth`, `theme`, `direction`,
`paused`, `label`, `className`, `style`, `reducedMotion`, `data-testid`, `value`,
`max`, `labelledBy`, `describedBy`, `valueText`, `decorative`, `loading`, `count`,
`inline`, plus arbitrary `data-*` attributes.

`loading` decides whether there is a loader at all. `count` sets the number of
tracks in the designs that are built from repeating tracks — a stack of skeleton
lines, the rows of a skeleton table, the steps of a progress bar — and a design that
draws something else does not advertise it. `inline` puts the box on the text line.

The designs built from repeating tracks are where `count` pays. Each one is laid out
like the screen it stands in for, so the placeholder is the shape, not a grey box:

```tsx
import { loaderFor } from '@wavelo/react';

const Inbox = loaderFor('skeleton-inbox');
const Thread = loaderFor('skeleton-chat');
const CodeBlock = loaderFor('skeleton-code');

<Inbox count={4} />          {/* four rows: avatar, subject */}
<Thread count={5} />         {/* five bubbles, the newest lifts */}
<CodeBlock count={8} />      {/* lines beside a numbered gutter */}
```

The same three work through the core, where a value fills whole steps:
`renderLoader({ type: 'progress-steps', count: 6, value: 3 })` renders step 3 of 6.

Which of them a given design actually uses is measured rather than claimed.
`npm run audit:customization` renders every design in Chromium with each key set
and unset, and `loader.options` is built from what changed the render — so `ring`
reports `strokeWidth` but not `secondaryColor`, `skeleton-card` reports neither,
a static `progress-bar` reports no `duration`, `three-dots` reports no `count`
because three dots are three dots, and `fullscreen` reports no `inline` because a
fixed overlay is not on anybody's line of text.

`direction` and `paused` drive the CSS animation controls; `reducedMotion:
'always'` reduces motion without waiting for the operating system, and `'never'`
opts out when the system asks for it. `theme` is the palette of the page rather than
of one design: `dark` picks the colour a design falls back to, the skeleton shimmer
and the overlay scrim, `system` follows `prefers-color-scheme`, and an explicit
`color` or `backgroundColor` still wins. Colours accept `oklch()`, `lab()`, `hwb()`
and `color-mix()`; sizes accept `calc()`, container units and `var(--wavelo-*)`;
`style` carries custom properties and rejects a key it cannot apply rather than
dropping it quietly.

A design's own shape may pin a size — a ring is a circle, a top bar spans the page —
and then that key is not advertised for it. What no design may do is *cap* a size you
asked for: a 2 rem progress bar is 2 rem tall, a 32-pixel skeleton line is 32 pixels,
and the floors that used to enforce those caps are the defaults they fall back to.

For assistive technology: `label` names the loader, `labelledBy` names the visible
element that already does, `describedBy` points at explanatory text, `valueText`
supplies the reading of a determinate value (`70 of 100 MB`, not `70`), and
`decorative` hides the loader from assistive technology when something else already
announces it. Passing `aria-*` or `role` directly is rejected rather than ignored.

See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the integration boundary,
[docs/FRAMEWORKS.md](docs/FRAMEWORKS.md) for verified usage examples,
[docs/RECIPES.md](docs/RECIPES.md) for server rendering, CSP, Tailwind and container
queries, [docs/MIGRATION.md](docs/MIGRATION.md) for moving off an existing spinner,
[docs/BUNDLE_SIZE.md](docs/BUNDLE_SIZE.md) and
[docs/PERFORMANCE.md](docs/PERFORMANCE.md) for measured size and per-frame cost, and
[PRD.md](PRD.md) for the product requirements.
