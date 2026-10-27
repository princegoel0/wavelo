<script lang="ts">
  import { renderLoader } from '@wavelo/core';

  export let type: string | undefined;
  export let size: number | string | undefined;
  export let color: string | undefined;
  export let label: string | undefined;
  export let value: number | undefined;
  export let max: number | undefined;
  export let reducedMotion: 'auto' | 'always' | 'never' | undefined;

  $: rendered = renderLoader({ type, size, color, label, value, max, reducedMotion });
</script>

<span>{@html `<style>${rendered.css}</style>${rendered.html}`}</span>
