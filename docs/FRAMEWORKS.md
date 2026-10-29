# Framework usage

Every bridge renders the same core markup contract and accepts the same 20
configuration keys; only the lifecycle plumbing differs. None of them inline CSS
— `ensureStyles` puts each stylesheet slice in the document head once, and for
server rendering you include the sheet yourself.

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

`renderReactLoader(props)` returns the core result (`html`, `css`, `styleKey`)
when you need to place the markup yourself.

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
`@wavelo/core/styles.css` to the server bundle's styles.

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
attributes and are merged into the configuration. Use binding syntax for
booleans (`:paused="true"`); a bare `paused` attribute is a string.
`inheritAttrs` is off, so only `data-*` attributes reach the core.

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
container without removing a stylesheet other loaders may be using.

## Choosing a design at build time

Framework components select by string at runtime, so their bundles carry every
stylesheet slice. If one design is enough, import it directly and the bundler
drops the rest:

```ts
import { orbitingDots } from '@wavelo/core/loaders/orbiting-dots';
```

See [BUNDLE_SIZE.md](BUNDLE_SIZE.md) for the measured difference.
