# Branded text loaders

`brand-loader` combines your brand text with seven text animations and an optional
ring, bar or three-dot indicator. Omit `value` for indefinite loading; provide
`value` and `max` for real progress. The same typed configuration works in every adapter.

```tsx
import { Loader } from '@wavelo/react';
import '@wavelo/core/styles.css';
import type { LoaderConfig } from '@wavelo/core';

const config = {
  type: 'brand-loader',
  color: '#6366f1',
  secondaryColor: '#22d3ee',
  duration: 1.8,
  strokeWidth: 3,
  brand: {
    text: 'ACME',
    caption: 'Preparing your workspace',
    animation: 'wave',
    indicator: 'ring',
    layout: 'stacked',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: 2,
    textColor: '#6366f1',
    captionColor: '#64748b',
    captionSize: 13,
    indicatorSize: 40,
    gap: 14,
    stagger: 0.08,
    amplitude: 6
  }
} satisfies LoaderConfig;

<Loader {...config} loading={busy} />
```

For a determinate version, add `value={loaded}` and `max={total}`, and use
`brand={{ ...config.brand, indicator: 'bar', indicatorSize: 180, showValue: true }}`.
Values from zero through `max` are supported; values outside that range are rejected.
The ring fills around its circumference, the bar fills horizontally, and the dots
fill sequentially. Text motion remains independent of the indicator's progress.

## Brand options

Pass these options inside `brand`. Unknown fields and invalid values throw
`LoaderConfigurationError` instead of being silently ignored.

| Option | Accepted values | Default |
| --- | --- | --- |
| `text` | Plain Unicode text, up to 80 code points | `Wavelo`; blank text uses this fallback |
| `caption` | Plain text, up to 160 code points | Omitted |
| `animation` | `wave`, `bounce`, `pulse`, `flip`, `shimmer`, `typewriter`, `none` | `wave` |
| `indicator` | `ring`, `bar`, `dots`, `none` | `ring` |
| `layout` | `stacked`, `inline` | `stacked` |
| `indicatorPosition` | `before`, `after` | `before` |
| `align` | `start`, `center`, `end` | `center` |
| `fontFamily` | CSS font-family list, including quoted family names | Inherited from the page |
| `fontSize` | Number in px, or CSS length | Root `size`, otherwise `2rem` |
| `fontWeight` | Number from 1–1000, `normal`, `bold` | `700` |
| `fontStyle` | `normal`, `italic`, `oblique` | Inherited |
| `letterSpacing` | Number in px (can be negative), or CSS length | Inherited |
| `lineHeight` | Unitless number from 0.5–4 | `1.3` |
| `textTransform` | `none`, `uppercase`, `lowercase`, `capitalize` | Inherited |
| `textColor` | CSS color | Root `color` |
| `trackColor` | CSS color | 20% of the indicator color |
| `captionColor` | CSS color; applies to caption and percentage | Root `color` |
| `captionSize` | Number in px, or CSS length | `0.4em` |
| `indicatorSize` | Number in px, or CSS length; ring diameter / bar or dots width | Ring `1.2em`, bar `5em`, dots `2em` |
| `gap` | Number in px, or CSS length | `0.6em` |
| `radius` | Number in px, or CSS length; bar corner radius | `999px` |
| `stagger` | Seconds between letters, 0–2 | `0.08` |
| `delay` | Seconds before text motion, 0–60 | `0` |
| `amplitude` | Vertical text movement in px, 0–100 | `6` |
| `easing` | `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`, or valid `cubic-bezier(...)` | Depends on animation |
| `showValue` | Boolean; visible percentage when `value` is supplied | `false` |

Length strings accept `px`, `rem`, `em`, `%`, `vw`, `vh`, and `ch`. Numerical lengths
are 0–500 px, except letter spacing, which also allows values down to −20 px.
Root `width`, `height`, `size`, `duration`, `speed`, `strokeWidth`, `theme`,
`backgroundColor`, `direction`, `paused`, `loading`, `inline`, `className`, and `style`
remain available. `secondaryColor` colors the indicator and shimmer accent.
`strokeWidth` sets the ring stroke and bar height. `count` does not change brand letters.

`wave`, `bounce`, `flip` and `typewriter` animate grapheme clusters individually.
`pulse`, `shimmer` and `none` preserve the whole text run, including cursive shaping.
Use those whole-text modes for scripts such as Arabic. Browsers without
`Intl.Segmenter` animate the whole word instead of splitting emoji or accents.
`stagger` affects letter animations; `amplitude` affects wave and bounce. A
typewriter cycle reveals and hides letters without changing the text's layout width.
`animation: 'none'` stops text motion; use `indicator: 'none'` as well for a static wordmark.

Load custom fonts yourself with your application's font setup or `@font-face`.
Wavelo does not download fonts. Variable-font axes, font features, shadows and other
CSS refinements can be supplied with `className`, inherited CSS, or `style`.

## Frameworks and modular imports

```ts
// Core: stylesheet and escaped markup for SSR or your own integration.
import { brandLoader } from '@wavelo/core/loaders/brand-loader';
const { html, css } = brandLoader({ brand: { text: 'ACME', animation: 'shimmer' } });

// Vanilla: mounts the loader and injects its stylesheet slice.
import { mountLoader } from '@wavelo/vanilla';
const detach = mountLoader(document.querySelector('#slot')!, {
  type: 'brand-loader', brand: { text: 'ACME', indicator: 'dots' }
});
```

Vue accepts `:brand="{ text: 'ACME', animation: 'pulse' }"` on `Loader` from
`@wavelo/vue`. Svelte accepts `brand={{ text: 'ACME' }}` on the default component
from `@wavelo/svelte/WaveloLoader.svelte`. Both accept the root configuration keys
as props. Angular's standalone `LoaderComponent` accepts
`<wavelo-loader type="brand-loader" [brand]="brandConfig" [value]="loaded" />`.

For a custom element, register `defineWaveloElements()` from `@wavelo/web-components`:

```html
<wavelo-loader
  type="brand-loader"
  brand='{"text":"ACME","animation":"shimmer","indicator":"bar","showValue":true}'
  value="45"
  max="100"
></wavelo-loader>
```

The `brand` attribute contains JSON. For arbitrary user text, set it with
`element.setAttribute('brand', JSON.stringify(config))` rather than building an
HTML attribute by string concatenation. Invalid attributes preserve the custom
element's last valid render and set `data-wavelo-error`.

`createWavelo`, providers, and `loaderFor` can establish your house configuration.
Nested `brand` fields merge with inherited defaults; fields you omit retain those
defaults. Explicit fields override them. Empty `caption` removes a default caption.

## Styling and accessibility

Stable selectors are `.wavelo--brand-loader`, `.wavelo__brand`,
`.wavelo__brand-text`, `.wavelo__brand-char`, `.wavelo__brand-caption`,
`.wavelo__brand-value` and `.wavelo__brand-indicator`. Indicators carry
`data-indicator="ring|bar|dots"`. Style those selectors from your own class when you
need controls beyond the typed options. Custom animations must preserve the shared
pause and reduced-motion behavior themselves.

The default accessible name is “your brand loading”. Override it with `label` or
`labelledBy`, and use `describedBy` or `valueText` for more context. Individual
letters, captions and indicators are hidden from assistive technology to avoid
duplicate announcements. A supplied `value` changes the root to `role="progressbar"`
with `aria-valuemin`, `aria-valuemax` and `aria-valuenow`; otherwise it uses `status`.
Use `decorative` when nearby content already announces the operation.

`paused` freezes text and indicator motion. `reducedMotion: 'auto'` respects the OS;
`'always'` reduces motion regardless of OS preference, leaving all text readable.
`'never'` is an explicit override. The loader never advances real progress on its own.

The gallery's Brand text loader selection exposes the options with live previews
and copyable code for each framework.
