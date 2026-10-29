# Migrating to Wavelo

Mappings from the loaders people replace, and the differences that will bite. The
design ids below all exist in the catalog — browse all 111 designs with their measured options
in the gallery (`npm run docs:build`, then open `apps/docs/dist/index.html`) before
choosing.

## react-spinners

```diff
- import { ClipLoader } from 'react-spinners';
- <ClipLoader loading={busy} color="#6366f1" size={48} speed={2} cssOverride={{ margin: 'auto' }} />
+ import { Loader } from '@wavelo/react';
+ <Loader type="ring" loading={busy} color="#6366f1" size={48} speed={0.5} style={{ margin: 'auto' }} />
```

| react-spinners | Closest Wavelo design |
| --- | --- |
| `ClipLoader` | `ring` |
| `RingLoader` | `dual-ring` |
| `CircleLoader` | `circular` |
| `MoonLoader` | `orbiting-dots` |
| `PulseLoader` | `three-dots` |
| `SyncLoader` | `pulsing-dots` |
| `BeatLoader`, `DotLoader` | `bouncing-dots` |
| `RiseLoader` | `vertical-dots` |
| `HashLoader` | `grid-pulse` |
| `RotatingSquareLoader` | `rotating-square` |
| `ScaleLoader` | `growing-bars` |
| `BarLoader` | `moving-stripe` |
| `ClockLoader` | `arc` |

Two incumbents can map to one design (`BeatLoader` and `DotLoader` above), and no
mapping claims pixel parity — it names the design that reads the same way.

## loaders.css

The class-based sheet maps to a design id plus the tokens that sheet hardcoded:

| `loaders.css` class | Wavelo |
| --- | --- |
| `ball-pulse` | `pulsing-dots` |
| `ball-grid-pulse` | `grid-pulse` |
| `ball-beat` | `bouncing-dots` |
| `square-spin` | `rotating-square` |
| `triangle-skew-spin` | `triangles` |
| `semi-circle-spin` | `half-circle` |
| `line-spin-fade-loader` | `fading-bars` |
| `ball-spin-fade-loader` | `fading-dots` |
| `spinner` | `multi-arc` |

```diff
- <div class="sk-spinner sk-spinner-pulse"></div>
+ <script type="module">
+   import { defineWaveloElements } from '@wavelo/web-components';
+   defineWaveloElements();
+ </script>
+ <wavelo-loader type="expanding-dot" label="Loading"></wavelo-loader>
```

## react-content-loader, MUI and Chakra skeletons

| You have | Wavelo |
| --- | --- |
| MUI `Skeleton` with the text variant, `width={200} height={16}` | `type="skeleton-line" width={200} height={16}` |
| …and `animation={false}` | add `paused` — it freezes the shimmer rather than removing it |
| the circular variant, `width={48} height={48}` | `type="skeleton-avatar" size={48}` |
| the rectangular variant, `width="100%" height={120}` | `type="image-placeholder" width="100%" height={120}` |
| `react-content-loader` with three rects inside | `type="skeleton-line" count={3}` |
| Chakra `Skeleton` with `isLoaded={ready}` | `loading={!ready}` on any skeleton design — the two words mean opposite things |
| Chakra `Skeleton` wrapping content, `startColor`/`endColor` | `style={{ '--wavelo-skeleton-base': …, '--wavelo-skeleton-highlight': … }}`, or `theme` for the whole page |

```tsx
<Loader type="skeleton-card" loading={!ready} />
```

## NProgress

```diff
- import NProgress from 'nprogress';
- import 'nprogress/nprogress.css';
- NProgress.start(); NProgress.done();
+ import { createRouteProgress } from '@wavelo/core';
+ const bar = createRouteProgress();
+ bar.start(); bar.done();
```

`set(n)` replaces `NProgress.set(n)`, `destroy()` replaces `NProgress.remove()`, and
the trickle and ceiling are options instead of a patched config object. There is no
second stylesheet to import: the bar is the `progress-top` design, injected like every
other slice.

## A hand-written spinner

The usual shape is a `@keyframes` block, a fixed size, a hardcoded colour and a
`display: none` toggle:

```diff
- .spinner { width: 24px; height: 24px; border: 3px solid #6366f1; border-radius: 50%;
-            animation: spin 1s linear infinite; }
- <div class="spinner" hidden={!busy} aria-label="Loading" />
+ <Loader type="ring" loading={busy} size={24} label="Loading" />
```

and the house style moves into one place instead of every rule:

```css
:root { --wavelo-color: #6366f1; --wavelo-size: 1.5rem; --wavelo-duration: 0.9s }
```

## What is different, on purpose

| You are used to | Wavelo | Why |
| --- | --- | --- |
| `speed={2}` meaning "twice as long" | `speed: 2` means twice as **fast** (`duration` is `1 / speed` seconds); pass `speed: 0.5` for the slower animation, or set `duration` directly | one meaning for one word |
| a default `aria-label="Loading…"` | no label means `aria-hidden="true"` | a loader that announces nothing beats one that announces the wrong thing; pass `label`, `labelledBy` or `describedBy` |
| styles inlined per component | markup only; slices injected once per distinct slice, or one `<link>` for SSR | twelve loaders on a page used to carry twelve copies of the stylesheet |
| `cssOverride` | `style`, which accepts any CSS property as well as `--wavelo-*` | the same escape hatch, typed |
| `size` plus `unit="em"` | `size: '2em'` — dimensions take units, `calc()`, container and viewport units | no second knob for one value |
| a README list of props per spinner | `loader.options`, measured in Chromium against the design's own render | an option that changes nothing cannot be advertised |
| one bundle with every animation | `@wavelo/core/loaders/<id>` ships one design's rules | the modular-catalog claim is measured, per entry point |
| a Lottie or GIF file | not covered | Wavelo draws loading affordances from CSS; an authored vector animation belongs to a player |

## Keeping an existing look

Bind the design once and the call sites stop repeating it:

```tsx
import { loaderFor, WaveloProvider } from '@wavelo/react';

const BrandSpinner = loaderFor('ring', { color: '#6366f1', size: 24, label: 'Loading' });

<WaveloProvider defaults={{ reducedMotion: 'auto' }}>
  <BrandSpinner loading={busy} />
</WaveloProvider>
```
