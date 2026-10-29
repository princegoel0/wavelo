# @wavelo/svelte

Svelte 5 integration for Wavelo: the `WaveloLoader.svelte` component plus a
rendering bridge for stores and tests.

```svelte
<script>
  import WaveloLoader from '@wavelo/svelte/WaveloLoader.svelte';
</script>

<WaveloLoader type="progress-bar" label="Uploading" value={50} max={100} theme="dark" />
```

The component forwards its `$props()` object straight to `renderLoader`, so any
of the 27 configuration keys reaches the core, and an `$effect` calls
`ensureStyles`. Only markup is rendered into the component; a server-rendered
page includes the sheet itself, e.g. `@wavelo/core/styles.css`.

Set the house style once during a parent's initialisation and every loader in the
subtree inherits it — props on the component still win:

```svelte
<script>
  import { provideWaveloDefaults } from '@wavelo/svelte';
  provideWaveloDefaults({ color: '#6366f1', size: 32 });
</script>

<WaveloLoader type="ring" loading={busy} />
```

The component ships as Svelte source, so the consumer's build needs
`vitePreprocess` (or run it through `svelte-package`). `renderSvelteLoader(props)`
returns `{ html, css, styleKey }` without a component tree.

Supported peer range: `svelte >=5.57.3 <6`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
