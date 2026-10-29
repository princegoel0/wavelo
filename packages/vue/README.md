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
off, so nothing else leaks to the DOM.

Set defaults for a subtree in a parent's setup, or bind a design once:

```vue
<script setup>
  import { provideWaveloDefaults, loaderFor } from '@wavelo/vue';
  provideWaveloDefaults({ color: '#6366f1', size: 32 });
  const ButtonSpinner = loaderFor('ring', { size: 16 });
</script>

<template>
  <ButtonSpinner :loading="busy" />   <!-- provider < bound < call site -->
</template>
```

The boolean options (`paused`, `decorative`, `loading`, `inline`) are declared
without a type, because Vue casts an absent `Boolean` prop to `false` and that would
override a registered default. `<Loader paused>` and `:paused="true"` both pause it;
`:paused="false"` runs.

Only markup is rendered into the component. `ensureStyles` adds the design's
stylesheet slice to the document head once on the client; a server-rendered page
must include the sheet itself.

Supported peer range: `vue >=3.5.44 <4`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
