# @wavelo/core

Framework-independent loading animations with typed configuration, accessible
semantics, reduced-motion support, a generated modular catalog, and a small DOM
helper. No runtime dependencies.

```ts
import { renderLoader } from '@wavelo/core';

const result = renderLoader({ type: 'ring', label: 'Loading data', size: 48 });

result.html;        // <span class="wavelo wavelo--ring wavelo--ring" …>
result.css;         // the stylesheet slice this design needs
result.styleKey;    // identity of that slice, for injection dedupe
result.resolution;  // 'exact' | 'preset' | 'alias' | 'default'
result.fallback;    // true only when the requested type matched nothing
```

## Choosing a design at build time

`renderLoader` resolves the design from a string at runtime, so it carries every
slice. When the design is known, import its own module:

```ts
import { orbitingDots } from '@wavelo/core/loaders/orbiting-dots';

const result = orbitingDots({ label: 'Loading data' });
```

The catalog holds 83 public IDs across 12 render kinds, and `src/loaders/*.ts`,
`src/loaders/index.ts` and `src/ids.ts` are generated from `src/catalog.ts`.
Regenerate with `npm run catalog:generate`; `npm run catalog` fails on drift.

## Options are measured, not listed by hand

`definition.options` for a design is generated from what actually changes its
render: `scripts/honoured-options.mjs` draws every design in Chromium with each key
set and unset and keeps the keys that made a difference, as a hex bitset decoded by
the registry. So `skeleton-card` advertises no `strokeWidth`, `ring` advertises no
`secondaryColor`, `progress-bar` advertises no `duration`, `progress-scroll`
advertises no `speed` — its fill follows the scroll position, not the clock —
`three-dots` advertises no `count`, and `fullscreen` advertises no `inline`.
`npm run audit:customization` re-measures the table and fails when it drifts, so an
option that does nothing cannot be documented as one. The comparison ignores the
element's own `class`, so a key is credited for what it changes on screen, not for
switching a mechanism on.

## Visibility, repetition and flow

Three options cover the shape of a loader rather than its look:

```ts
renderLoader({ type: 'ring', label: 'Loading', loading: false });
// { html: '', css: '', … } — nothing to mount and no slice to inject

renderLoader({ type: 'skeleton-line', count: 3 });
// a stack of three tracks; the last one ends short, like a paragraph does

renderLoader({ type: 'skeleton-line', inline: true });
// sized by `width`/`height`, on the text line, instead of a 10-rem block
```

`loading: false` is the only value that hides a loader, and it hides it completely:
the returned `html` and `css` are empty, the adapters emit no element, and
`ensureStyles` ignores the empty slice. `count` applies to the designs that are
authored as repeating tracks — the skeleton line, card, table and dashboard, and
`progress-steps` — and is validated as a whole number between 1 and 12. `inline`
aligns an inline-level box and gives a block or grid design its inline twin.

## Styles

Nothing inlines CSS into the rendered markup. Add a slice to the document head
once, and every loader sharing it reuses that element:

```ts
import { ensureStyles, renderStylesheets, mountLoader } from '@wavelo/core';

ensureStyles(result.css);
const detach = mountLoader(document.querySelector('#slot'), { type: 'ring', label: 'Loading' });
```

For server rendering, put the sheet in the head yourself — import
`@wavelo/core/styles.css`, or emit the slices you rendered:

```ts
import { renderStylesheets } from '@wavelo/core/styles';

head(renderStylesheets(pages.map((page) => page.css)));
```

## Entry points

| Path | Contents |
| --- | --- |
| `@wavelo/core` | types, registry, renderer, DOM helpers, style injection, `createWavelo` and `mergeWaveloConfig` for registered defaults, `createRouteProgress` |
| `@wavelo/core/registry` | `loaderRegistry`, `presetRegistry`, `resolveCatalogEntry` |
| `@wavelo/core/loaders/<id>` | one design: its metadata and its stylesheet slice |
| `@wavelo/core/loaders` | barrel over all 83 designs |
| `@wavelo/core/css` | `kindStyles`, `baseCss`, `allStyles`, `designStyles` |
| `@wavelo/core/styles` | `ensureStyles`, `renderStylesheets`, `stylesheetMarkup` |
| `@wavelo/core/styles.css` | the complete catalog sheet, for a `<link>` or bundler |

## Theme

`theme` is the palette of the page rather than of one design: `dark` sets the colour
a loader falls back to (`#a5b4fc`), the skeleton shimmer and the overlay scrim;
`system` follows `prefers-color-scheme`; an explicit `color` or `backgroundColor`
still wins. The properties it drives — `--wavelo-color`, `--wavelo-scrim`,
`--wavelo-skeleton-base` and `--wavelo-skeleton-highlight` — can be set directly when
a page wants a palette of its own, and `--wavelo-radius`, `--wavelo-ease`,
`--wavelo-gap` and `--wavelo-z-index` reach the styling a config key does not cover.

## Route progress

```ts
import { createRouteProgress } from '@wavelo/core';

const bar = createRouteProgress({ color: '#6366f1' }, { trickle: 300, ceiling: 90, hold: 250 });
bar.start();          // on the navigation
bar.set(60);          // or report a real percentage
bar.done();           // fill, hold, then take it out
```

The bar is the `progress-top` design mounted into a `display: contents` wrapper, so
it adds no box of its own; `destroy()` takes it out immediately. It carries no label
unless you give it one, because the page already announces a route change through
focus movement. On a server nothing is scheduled or appended and every method is a
no-op, so a component can create one unconditionally.

## Accessibility

A labelled design renders `role="status"` (or `role="progressbar"` with
`aria-valuenow` when the design supports progress and `value` is set). An
unlabelled design renders `aria-hidden="true"`, so it can never announce nothing.
Skeleton surfaces stay hidden from assistive technology in both cases.

Naming and reading are options, not fixed choices:

| option | output |
| --- | --- |
| `label` | `aria-label`, and the element becomes named |
| `labelledBy` | `aria-labelledby`, for a caption that is already on the page |
| `describedBy` | `aria-describedby` |
| `valueText` | `aria-valuetext` alongside `aria-valuenow`, so "70 of 100 MB" replaces the bare number |
| `decorative` | `aria-hidden="true"` even when labelled |

`aria-*` and `role` are owned by the renderer: passing them as config throws, with a
message naming the option that does what the caller meant.
