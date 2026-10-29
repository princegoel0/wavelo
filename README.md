# Wavelo

Wavelo is a dependency-light, framework-independent loading and motion library.
The repository contains a typed core, a generated modular catalog, DOM and Web
Component support, framework configuration bridges, and a registry-driven
documentation gallery.

The catalog holds 82 designs, each visually distinct, built from 12
render kinds and 12 stylesheet slices, and every adapter accepts the same
20 configuration keys.

## Development

```powershell
npm install
npm run build          # compiles the core, regenerates catalog entry points, builds adapters
npm run check          # build, typecheck, unit tests, catalog drift, documentation sync, bundle budgets
npm run test:browser   # Chromium suite: computed styles, style injection, axe, gallery
npm run docs:build
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

## Scroll progress without JavaScript

`progress-scroll` is a reading-progress bar driven by a CSS scroll timeline: the
browser maps the document's scroll position onto the fill, with no scroll
listener, no state and no re-render.

```ts
import { progressScroll } from '@wavelo/core/loaders/progress-scroll';

const bar = progressScroll({ label: 'Reading progress' });
```

It takes no `value`, because the percentage belongs to the page and the markup
does not invent one: labelled, it renders `role="status"` rather than a
`progressbar` carrying a fabricated `aria-valuenow`. It tracks the document
(`scroll(root block)`), which keeps working inside `overflow: hidden` wrappers;
set `animation-timeline` yourself to drive it from an inner scroll container.
Where scroll timelines are unsupported the same keyframes sweep on the document
clock, so the bar shows activity instead of an empty track.

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
| `--wavelo-size` | `size` (and `width`/`height` when they are unset) | `2.5rem` |
| `--wavelo-width` / `--wavelo-height` | `width` / `height` | falls back to `--wavelo-size` |
| `--wavelo-color` | `color`, and everything painted through `currentColor` | `#6366f1` |
| `--wavelo-secondary-color` | `secondaryColor`, on the designs that layer a second colour | `#a5b4fc` |
| `--wavelo-background` | `backgroundColor` | `transparent` (the overlay keeps its own scrim) |
| `--wavelo-duration` | `duration`, and `speed` as its multiplier | `1s` |
| `--wavelo-stroke` | `strokeWidth` | `3px` |
| `--wavelo-direction` | `direction` | `normal` |
| `--wavelo-play-state` | `paused` | `running` |
| `--wavelo-progress` | `value` / `max` on the determinate designs | `35%`, and it interpolates |
| `--wavelo-skeleton-base` / `--wavelo-skeleton-highlight` | the shimmer, normally via `theme` | light or dark palette |
| `--wavelo-radius` | skeleton/placeholder corner radius | `.4rem` |

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
[docs/FRAMEWORKS.md](docs/FRAMEWORKS.md).

## What the configuration does

These 20 keys are the whole surface, and a test asserts each one reaches the
rendered element: `size`, `width`, `height`, `color`, `secondaryColor`,
`backgroundColor`, `speed`, `duration`, `strokeWidth`, `theme`, `direction`,
`paused`, `label`, `className`, `style`, `reducedMotion`, `data-testid`, `value`
and `max`, plus arbitrary `data-*` attributes.

Which of them a given design actually uses is measured rather than claimed.
`npm run audit:customization` renders every design in Chromium with each key set
and unset, and `loader.options` is built from what changed the render — so `ring`
reports `strokeWidth` but not `secondaryColor`, `skeleton-card` reports neither,
and a static `progress-bar` reports no `duration`, because none of those would do
anything.

`direction` and `paused` drive the CSS animation controls; `reducedMotion:
'always'` reduces motion without waiting for the operating system, and `'never'`
opts out when the system asks for it. Colours accept `oklch()`, `lab()`, `hwb()`
and `color-mix()`; sizes accept `calc()`, container units and `var(--wavelo-*)`;
`style` carries custom properties and rejects a key it cannot apply rather than
dropping it quietly.

See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the integration boundary,
[docs/FRAMEWORKS.md](docs/FRAMEWORKS.md) for verified usage examples,
[docs/BUNDLE_SIZE.md](docs/BUNDLE_SIZE.md) for measured sizes, and
[PRD.md](PRD.md) for the product requirements.
