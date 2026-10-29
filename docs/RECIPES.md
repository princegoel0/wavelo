# Recipes

Copy-paste integrations for the cases that decide whether a loading library is
worth installing. Each one says what it was verified by: **tested** means it runs in
this repository's suite, **documented** means the API is real and the wiring is the
framework's own, which this repository does not install.

The rule behind all of them is the same two facts: Wavelo renders markup and never
inlines CSS, and every dimension, colour and timing is a `--wavelo-*` custom property
(see the token table in [../README.md](../README.md)).

## Server rendering

Include the sheet once in the document head. Importing it through the bundler is the
shortest path; `renderStylesheets` is the one that ships only the slices the page
actually rendered.

```ts
import { renderStylesheets } from '@wavelo/core/styles';

head(renderStylesheets(results.map((result) => result.css)));
```

| Stack | Recipe | Verified by |
| --- | --- | --- |
| React 19 `renderToStaticMarkup` | `renderReactLoader(props, defaults)` returns `{ html, css }`; put the markup in the body and the slices in the head, or import `@wavelo/core/styles.css` once | tested (`tests/framework.test.mjs`) |
| Vue 3 `renderToString` | `renderVueLoader(props, defaults)`, same split; `ensureStyles` runs in `watchEffect` on the client only | tested |
| Angular SSR `renderApplication` | add `node_modules/@wavelo/core/styles.css` to the server builder's `styles` | tested (`tests/angular-ssr.test.mjs`) |
| Svelte 2+ `render()` / SvelteKit | import the sheet in `src/app.css` or `+layout.ts`; the component calls `ensureStyles` in an `$effect`, which does not run during SSR | component compiles for the server (tested); SvelteKit wiring is documented |
| Next.js app router | `import '@wavelo/core/styles.css'` in the root layout, and mark the component that renders a loader `'use client'` — `Loader` uses an effect | documented |
| Nuxt 3 | add `@wavelo/core/styles.css` to `css: []` in `nuxt.config.ts` and register the component in a plugin | documented |
| Astro | `import '@wavelo/core/styles.css'` in the layout, or render the markup at build time with `renderLoader` from an `.astro` file — the core has no framework peer | documented |
| Vite / plain SPA | nothing: `ensureStyles` injects each slice on first use and shares it | tested |

A server-rendered page that skips the sheet still renders correct markup — with no
styling. That is the deliberate trade for not shipping one copy of the stylesheet per
component instance.

## Content security policy

Under `style-src` without `'unsafe-inline'`, an injected `<style>` needs the page's
nonce. Declare it once and every injection carries it:

```html
<head><meta name="wavelo-csp-nonce" content="{nonce}"></head>
```

`ensureStyles(css, { nonce })`, `mountLoader(element, config, { nonce })` and
`renderStylesheets(slices, { nonce })` take it explicitly when the caller knows it.
The nonce is read per injection, never stored in a module, so two responses rendered
in one process cannot share one. Tested in `tests/browser.test.mjs` against a real
CSP header, including the counterfactual: the same page without the meta element is
unstyled.

## Tailwind CSS v4

Tailwind v4 exposes its own tokens as custom properties, so a Wavelo token can read
them directly — no plugin, no build step:

```css
@import 'tailwindcss';

@theme {
  --color-brand: oklch(0.58 0.19 264);
}

:root {
  --wavelo-color: var(--color-brand);
  --wavelo-duration: 1.2s;
  --wavelo-stroke: 3px;
}
```

Per-surface styling uses ordinary selectors, which reach the loader because it renders
in the light DOM:

```css
.dark-panel {
  --wavelo-color: var(--color-brand);
  --wavelo-skeleton-base: var(--color-neutral-800);
  --wavelo-skeleton-highlight: var(--color-neutral-700);
}

@utility loader-small {
  --wavelo-size: 1em;
}
```

Set the token rather than the property it backs. Wavelo's own rules declare `width`,
`height`, `color`, `display`, `background` and the animation longhands from those
tokens, and an injected slice is appended to `<head>` — after the page's own
stylesheet in document order — so a utility like `size-6` or `text-brand` loses to it
on equal specificity. The token always wins, and so does the `color`/`size` option,
which lands as an inline declaration on the element itself.

## Dark mode

`theme` is the page's palette, not one design's colour: it sets the fallback colour,
the skeleton shimmer and the overlay scrim together.

```tsx
<Loader type="skeleton-card" theme="system" />
```

`system` follows `prefers-color-scheme`; `dark` and `light` force it. An explicit
`color` or `backgroundColor` still wins, and a page that wants a palette of its own
sets `--wavelo-color` and `--wavelo-scrim` in a rule instead.

## Sizing that follows the container

```css
.card { container-type: inline-size }
```

```ts
renderLoader({ type: 'ring', size: '12cqi' });           // 12% of the card
renderLoader({ type: 'progress-bar', width: '100%' });  // the card's width
```

Container and viewport units are accepted wherever a dimension is, and
`tests/browser.test.mjs` measures a `cqi`-sized loader inside two containers of
different widths.

## Route progress

```ts
import { createRouteProgress } from '@wavelo/core';

const bar = createRouteProgress();
router.beforeEach(() => bar.start());
router.afterEach(() => bar.done());
```

See [FRAMEWORKS.md](FRAMEWORKS.md) for the React, Vue and Angular wiring, and
[../packages/core/README.md](../packages/core/README.md) for `set()`, `destroy()` and
why the bar carries no label by default.
