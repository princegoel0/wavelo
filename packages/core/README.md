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

The catalog holds 82 public IDs across 12 render kinds, and `src/loaders/*.ts`,
`src/loaders/index.ts` and `src/ids.ts` are generated from `src/catalog.ts`.
Regenerate with `npm run catalog:generate`; `npm run catalog` fails on drift.

## Options are measured, not listed by hand

`definition.options` for a design is generated from what actually changes its
render: `scripts/honoured-options.mjs` draws every design in Chromium with each key
set and unset and keeps the keys that made a difference, as a hex bitset decoded by
the registry. So `skeleton-card` advertises no `strokeWidth`, `ring` advertises no
`secondaryColor`, `progress-bar` advertises no `duration`, and `progress-scroll`
advertises no `speed` — its fill follows the scroll position, not the clock.
`npm run audit:customization` re-measures the table and fails when it drifts, so an
option that does nothing cannot be documented as one.

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
| `@wavelo/core` | types, registry, renderer, DOM helpers, style injection |
| `@wavelo/core/registry` | `loaderRegistry`, `presetRegistry`, `resolveCatalogEntry` |
| `@wavelo/core/loaders/<id>` | one design: its metadata and its stylesheet slice |
| `@wavelo/core/loaders` | barrel over all 82 designs |
| `@wavelo/core/css` | `kindStyles`, `baseCss`, `allStyles`, `designStyles` |
| `@wavelo/core/styles` | `ensureStyles`, `renderStylesheets`, `stylesheetMarkup` |
| `@wavelo/core/styles.css` | the complete catalog sheet, for a `<link>` or bundler |

## Accessibility

A labelled design renders `role="status"` (or `role="progressbar"` with
`aria-valuenow` when the design supports progress and `value` is set). An
unlabelled design renders `aria-hidden="true"`, so it can never announce nothing.
Skeleton surfaces stay hidden from assistive technology in both cases.
