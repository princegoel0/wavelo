# @wavelo/vue

Vue 3 component for Wavelo. Import `Loader` and pass the shared loader
configuration as props.

```vue
<script setup>
  import { Loader } from '@wavelo/vue';
</script>

<template>
  <Loader type="ring" label="Loading data" :size="48" :paused="true" />
</template>
```

Import the sheet once in your entry file, e.g. `import '@wavelo/core/styles.css'`.

The component declares every configuration key except `data-*`, which arrive as
fallthrough attributes and are merged into the configuration; `inheritAttrs` is
off, so nothing else leaks to the DOM. Use binding syntax for booleans — a bare
`paused` attribute is a string in Vue.

Only markup is rendered into the component. `ensureStyles` adds the design's
stylesheet slice to the document head once on the client; a server-rendered page
must include the sheet itself.

Supported peer range: `vue >=3.5.44 <4`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
