# Framework usage

The adapter packages render the same core markup and CSS contract, while keeping
framework lifecycle and SSR behavior idiomatic.

## React

```tsx
import { Loader } from '@wavelo/react';

export function Screen() {
  return <Loader type="orbiting-dots" label="Loading data" size={48} />;
}
```

`Loader` is SSR-safe and recomputes when its props change.

## Angular

```ts
import { Component } from '@angular/core';
import { LoaderComponent } from '@wavelo/angular';

@Component({
  standalone: true,
  imports: [LoaderComponent],
  template: '<wavelo-loader type="dots" label="Loading data" [size]="48" />'
})
export class Screen {}
```

The component uses `OnPush` change detection, updates on input changes, and clears
its rendered content on destroy.

## Vue

```ts
import { createApp } from 'vue';
import { Loader } from '@wavelo/vue';

createApp({
  components: { Loader },
  template: '<Loader type="ring" label="Loading data" :size="48" />'
}).mount('#app');
```

The component renders through Vue's reactive render function and can be rendered
through Vue SSR.

## Svelte

```svelte
<script>
  import WaveloLoader from '@wavelo/svelte/WaveloLoader.svelte';
</script>

<WaveloLoader type="progress-bar" label="Uploading" value={50} max={100} />
```

## Web Components

```html
<script type="module">
  import { defineWaveloElements } from '@wavelo/web-components';
  defineWaveloElements();
</script>

<wavelo-loader type="orbiting-dots" label="Loading data"></wavelo-loader>
```

The registration call is explicit and safe to repeat. It does not run during SSR
module evaluation.
