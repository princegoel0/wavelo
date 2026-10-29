<script lang="ts">
  import { getContext, hasContext } from 'svelte';
  import { ensureStyles, mergeWaveloConfig, renderLoader } from '@wavelo/core';
  import type { LoaderConfig, WaveloDefaults } from '@wavelo/core';

  // The key `provideWaveloDefaults` in ./index.ts stores under. Inlined because the
  // shipped component is compiled by the consumer's bundler, which resolves only
  // package imports; a test asserts the two stay identical.
  const WAVELO_DEFAULTS_KEY = 'wavelo:defaults';

  // Every LoaderConfig key is accepted: the props object is passed straight to
  // the core renderer, so the adapter can never fall behind the core surface.
  const config: LoaderConfig = $props();
  const defaults = hasContext(WAVELO_DEFAULTS_KEY) ? getContext<WaveloDefaults>(WAVELO_DEFAULTS_KEY) : null;
  const rendered = $derived(renderLoader(mergeWaveloConfig(defaults, config)));

  $effect(() => {
    ensureStyles(rendered.css);
  });
</script>

<span class="wavelo-host">{@html rendered.html}</span>
