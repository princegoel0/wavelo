# Wavelo

Wavelo is a dependency-light, framework-independent loading and motion library.
The repository contains a typed core, a generated modular catalog, DOM and Web
Component support, framework configuration bridges, and a registry-driven
documentation gallery.

The catalog holds 81 designs (69 active, 12 deprecated aliases) built from 11
render kinds and 11 stylesheet slices, and every adapter accepts the same
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

`size`, `width`, `height`, `color`, `secondaryColor`, `backgroundColor`, `speed`,
`duration`, `strokeWidth`, `theme`, `direction`, `paused`, `label`, `className`,
`style`, `reducedMotion`, `data-testid`, `value` and `max` all reach the rendered
element, and a test asserts each one. `direction` and `paused` drive the CSS
animation controls; `reducedMotion: 'always'` reduces motion without waiting for
the operating system, and `'never'` opts out when the system asks for it.

See [docs/COMPATIBILITY.md](docs/COMPATIBILITY.md) for the integration boundary,
[docs/FRAMEWORKS.md](docs/FRAMEWORKS.md) for verified usage examples,
[docs/BUNDLE_SIZE.md](docs/BUNDLE_SIZE.md) for measured sizes, and
[PRD.md](PRD.md) for the product requirements.
