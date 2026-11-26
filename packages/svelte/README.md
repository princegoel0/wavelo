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
of the 28 configuration keys reaches the core, and an `$effect` calls
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

`waveloState` and `waveloProgress` provide the same lifecycle and progress controls
as the React hooks and Vue composables, using Svelte stores:

```svelte
<script>
  import { onDestroy } from 'svelte';
  import { waveloProgress, waveloState } from '@wavelo/svelte';
  import WaveloLoader from '@wavelo/svelte/WaveloLoader.svelte';

  const status = waveloState();
  const progress = waveloProgress({ mode: 'linear', duration: 4000 });
  onDestroy(() => {
    status.destroy();
    progress.destroy();
  });
</script>

<WaveloLoader type="progress-bar" value={$progress} loading={$status === 'loading'} />
```

Call `start()`, `pause()`, `finish()`, `reset()` and `setProgress()` on the progress
store; use `startLoading()`, `setSuccess()`, `setError()`, `reset()` and `wrapAsync()`
on the state store.

Supported peer range: `svelte >=5.0.0 <6.0.0` (supporting all Svelte 5.x releases).

Interactive documentation & live preview gallery: https://princegoel0.github.io/wavelo/

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
