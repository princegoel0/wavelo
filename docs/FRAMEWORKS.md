# Framework usage

Every bridge renders the same core markup contract and accepts the same 27
configuration keys; only the lifecycle plumbing differs. None of them inline CSS
— `ensureStyles` puts each stylesheet slice in the document head once, and for
server rendering you include the sheet yourself.

## Set it once, then use it

Each bridge has one place to register the options a page or subtree shares, and each
is scoped to a render tree rather than a module, so server rendering cannot leak one
request's settings into another:

| Bridge | Registered defaults | Design bound once |
| --- | --- | --- |
| React | `<WaveloProvider defaults={…}>` | `loaderFor(type, defaults)` |
| Vue | `provideWaveloDefaults(…)` in a parent's setup | `loaderFor(type, defaults)` |
| Svelte | `provideWaveloDefaults(…)` during init | `<WaveloLoader>` with the context's defaults |
| Angular | `providers: [{ provide: WAVELO_DEFAULTS, useValue: … }]` | a component that sets the inputs |
| Web Components | CSS custom properties on an ancestor | — |
| Core and vanilla | `createWavelo(defaults)` | `createWavelo({ type: … })` |

Precedence is always the same, outward to inward: registered defaults, then a bound
component's own options, then what the call site passes. Defaults may name a design
(`{ type: 'ring' }`), so an app can choose its loader once and never repeat it.

## React

```tsx
import { Loader } from '@wavelo/react';

export function Screen() {
  return <Loader type="orbiting-dots" label="Loading data" size={48} paused={false} />;
}
```

`Loader` renders on the server and calls `ensureStyles` in an effect on the
client. For SSR, import the sheet once in your entry:

```ts
import '@wavelo/core/styles.css';
```

`renderReactLoader(props, defaults)` returns the core result (`html`, `css`,
`styleKey`) when you need to place the markup yourself. A component that always
shows one design is worth making once:

```tsx
import { WaveloProvider, loaderFor } from '@wavelo/react';

const ButtonSpinner = loaderFor('ring', { size: 16, color: '#ffffff', label: 'Saving' });

export function SaveButton({ busy }) {
  return (
    <WaveloProvider defaults={{ reducedMotion: 'auto' }}>
      <ButtonSpinner loading={busy} />
    </WaveloProvider>
  );
}
```

`loading={false}` renders no element at all — no markup, no stylesheet, no empty
host left behind.

## Angular

```ts
import { Component } from '@angular/core';
import { LoaderComponent } from '@wavelo/angular';

@Component({
  standalone: true,
  imports: [LoaderComponent],
  template: '<wavelo-loader type="three-dots" label="Loading data" [size]="48" />'
})
export class Screen {}
```

Inputs cover the whole surface. `style` binds as `waveloStyle`, because Angular
already owns `[style]`:

```html
<wavelo-loader type="ring" [waveloStyle]="{ '--wavelo-radius': '12px' }" />
```

`data-*` attributes on the host are read into the configuration. The component
uses `OnPush`, updates on input changes, clears its content on destroy, and the
host element is `display: contents` so it does not affect layout. For SSR add
`@wavelo/core/styles.css` to the server bundle's styles. Defaults for a whole tree
are a provider:

```ts
providers: [{ provide: WAVELO_DEFAULTS, useValue: { color: '#6366f1', size: 32 } }]
```

## Vue

```ts
import { createApp } from 'vue';
import { Loader } from '@wavelo/vue';
import '@wavelo/core/styles.css';

createApp({
  components: { Loader },
  template: '<Loader type="ring" label="Loading data" :size="48" :paused="true" />'
}).mount('#app');
```

The component declares every key except `data-*`, which arrive as fallthrough
attributes and are merged into the configuration. `inheritAttrs` is off, so only
`data-*` attributes reach the core.

The boolean options (`paused`, `decorative`, `loading`, `inline`) are declared
without a type. Vue casts an absent `Boolean` prop to `false`, which would erase a
registered default and hide a loader nobody asked to hide, so an absent prop stays
absent here; `<Loader paused>` and `:paused="true"` both pause, `:paused="false"`
runs. A bound component reads the same way:

```ts
import { provideWaveloDefaults, loaderFor } from '@wavelo/vue';

provideWaveloDefaults({ color: '#6366f1' });      // in a parent's setup
const ButtonSpinner = loaderFor('ring', { size: 16 });
```

```html
<ButtonSpinner :loading="busy" />
```

## Svelte

```svelte
<script>
  import WaveloLoader from '@wavelo/svelte/WaveloLoader.svelte';
</script>

<WaveloLoader type="progress-bar" label="Uploading" value={50} max={100} theme="dark" />
```

The component forwards its `$props()` object straight to `renderLoader`, so any
configuration key reaches the core, and an `$effect` calls `ensureStyles`. It
ships as source, so the consumer's build needs `vitePreprocess`. In SSR, add
`@wavelo/core/styles.css` to the head once.

```svelte
<script>
  import { provideWaveloDefaults } from '@wavelo/svelte';
  provideWaveloDefaults({ size: 32, reducedMotion: 'auto' });
</script>

<WaveloLoader type="ring" loading={busy} />
```

## Web Components

```html
<head><link rel="stylesheet" href="/node_modules/@wavelo/core/styles.css"></head>
<script type="module">
  import { defineWaveloElements } from '@wavelo/web-components';
  defineWaveloElements();
</script>

<wavelo-loader type="orbiting-dots" label="Loading data" stroke-width="5" reduced-motion="never"></wavelo-loader>
```

Attributes are the configuration keys in kebab case, plus any `data-*`. Setting
an observed attribute re-renders; `defineWaveloElements` is safe to call more
than once and does nothing during server module evaluation. The element renders
into the light DOM, so its slice lands in the document head like everyone else's.

`--wavelo-*` custom properties in the `style` attribute are read as configuration
and applied to the rendered element; the rest of that attribute stays ordinary host
styling, so `<wavelo-loader style="margin-top:1rem">` behaves as it looks. A value
that fails validation cannot blank the loader: it keeps the last valid render,
sets `data-wavelo-error` to the message and logs one console error, rather than
throwing out of the attribute callback.

## Vanilla DOM

```ts
import { mountLoader } from '@wavelo/vanilla';

const detach = mountLoader(document.querySelector('#slot'), { type: 'ring', label: 'Loading' });
```

`mountLoader` injects the slice and returns a detach function that clears the
container without removing a stylesheet other loaders may be using. To configure a
whole app once, bind the defaults:

```ts
import { createWavelo } from '@wavelo/vanilla';

const wavelo = createWavelo({ type: 'ring', color: '#6366f1', size: 32 });
wavelo.render();                               // house ring
wavelo.render({ type: 'orbiting-dots' });      // house style, other design
wavelo.merge({ loading: panel.isOpen });       // a config object for mountLoader
```

## Route progress

`createRouteProgress` comes from the core, so every bridge uses it the same way —
start it on the navigation, finish it when the new view is there:

```tsx
// React: one bar for the layout, started where a route suspends or fetches
function useRouteBar() {
  const bar = useMemo(() => createRouteProgress(), []);
  useEffect(() => () => bar.destroy(), []);
  return bar;
}

function Profile({ id }) {
  const bar = useRouteBar();
  useEffect(() => {
    bar.start();
    return () => bar.done();
  }, [id]);
  return <Loader type="skeleton-line" count={4} loading={!profile} />;
}
```

```ts
// Vue Router
const bar = createRouteProgress();
router.beforeEach(() => bar.start());
router.afterEach(() => bar.done());
```

```ts
// Angular router events
ngOnInit() {
  const bar = createRouteProgress();
  this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => bar.start());
  this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => bar.done());
}
```

The bar is the `progress-top` design, so `color`, `height` and `--wavelo-*` options
apply to it like any other loader, and `set(60)` reports a real percentage when the
router has one. It is inert during server rendering, so creating one at module scope
is safe.

## Host styling, and Wavelo styling

A loader is one element, and two channels reach it. Ordinary CSS on the host — the
wrapper you put around it, or a framework component's own element — controls layout:
`display`, `margin`, `flex`, `gap`, `text-align`. Wavelo never reads those, and its
own rules never set them; the adapter host is `display: contents`, so it adds no box
of its own and your wrapper is the box you are styling.

`--wavelo-*` custom properties are configuration. They can be set in `style` on the
loader, on any ancestor, or in a class rule, and the loader reads the nearest one:

```html
<style>
  .panel { padding: 1rem }                              /* host layout */
  .panel wavelo-loader { --wavelo-color: #94a3b8 }      /* loader configuration */
</style>

<div class="panel">
  <wavelo-loader type="ring" style="--wavelo-size:2rem"></wavelo-loader>
</div>
```

On the custom element the same `style` attribute carries both kinds: the
`--wavelo-*` declarations are read as configuration and everything else stays
ordinary styling. `inline` is the option for a loader that belongs to a line of text
rather than to a block of its own.

## Choosing a design at build time

Framework components select by string at runtime, so their bundles carry every
stylesheet slice. If one design is enough, import it directly and the bundler
drops the rest:

```ts
import { orbitingDots } from '@wavelo/core/loaders/orbiting-dots';
```

See [BUNDLE_SIZE.md](BUNDLE_SIZE.md) for the measured difference, and
[RECIPES.md](RECIPES.md) for server rendering, content security policy and Tailwind
wiring per framework.
