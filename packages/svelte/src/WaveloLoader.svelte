<script lang="ts">
  import { ensureStyles, renderLoader } from '@wavelo/core';
  import type { LoaderConfig } from '@wavelo/core';

  // Every LoaderConfig key is accepted: the props object is passed straight to
  // the core renderer, so the adapter can never fall behind the core surface.
  const config: LoaderConfig = $props();
  const rendered = $derived(renderLoader(config));

  $effect(() => {
    ensureStyles(rendered.css);
  });
</script>

<span class="wavelo-host">{@html rendered.html}</span>
