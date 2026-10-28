# @wavelo/web-components

Framework-free custom element for Wavelo. Register it explicitly in browser code,
then use it in markup.

```html
<link rel="stylesheet" href="/node_modules/@wavelo/core/styles.css">
<script type="module">
  import { defineWaveloElements } from '@wavelo/web-components';
  defineWaveloElements();
</script>

<wavelo-loader type="ring" label="Loading data" stroke-width="5" paused></wavelo-loader>
```

The element observes one attribute per configuration key, in kebab case
(`stroke-width`, `secondary-color`, `reduced-motion`), plus any `data-*`
attribute. Numeric keys are parsed as numbers, `paused` is false only for
`"false"` or `"0"`, and changing an observed attribute re-renders.

The element renders into the light DOM and calls `ensureStyles`, so the
stylesheet slice goes into the document head once and is shared with any other
loader using it. Link `@wavelo/core/styles.css`, or omit the link entirely and let
the element inject what it needs.

`defineWaveloElements` is safe to repeat and does nothing during server module
evaluation; importing this package on a server never touches `HTMLElement` or
`customElements`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
