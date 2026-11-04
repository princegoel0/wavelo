<script>
  import WaveloLoader from '@wavelo/svelte/WaveloLoader.svelte';
  import { provideWaveloDefaults } from '@wavelo/svelte';
  import { onMount } from 'svelte';
  import SaveButton from '$lib/SaveButton.svelte';

  // House style for everything under this route. It is context, not a module global, so a
  // server render cannot leak one request's defaults into another.
  provideWaveloDefaults({ color: '#6366f1', size: 24, reducedMotion: 'auto' });

  let stories = $state(null);
  // The loader's own visibility is the only state this page tracks.
  const pending = $derived(stories === null);

  onMount(() => {
    const timer = setTimeout(() => {
      stories = ['A loader that never moved the text', 'Reduced motion, twice, in one sheet'];
    }, 1400);
    return () => clearTimeout(timer);
  });
</script>

<main class="page">
  <h1>Wavelo in SvelteKit</h1>

  {#if pending}
    <WaveloLoader type="skeleton-feed" count={3} label="Loading stories" />
  {:else}
    <ul>
      {#each stories as story}
        <li>{story}</li>
      {/each}
    </ul>
  {/if}

  <SaveButton />

  <p>
    Syncing
    <WaveloLoader type="three-dots" inline size="1em" decorative loading={pending} />
  </p>
</main>
