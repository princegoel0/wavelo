<script>
  import WaveloLoader from '@wavelo/svelte/WaveloLoader.svelte';

  // The Svelte package has no state hook, and none is needed: `data-wavelo-state` is an
  // attribute, so the page's own $state drives the morph.
  let state = $state('idle');
  let saved = $state(0);
  let timer;

  const save = async () => {
    clearTimeout(timer);
    state = 'loading';
    await new Promise((resolve) => setTimeout(resolve, 1400));
    state = 'success';
    saved += 1;
    timer = setTimeout(() => (state = 'idle'), 1600);
  };

  $effect(() => () => clearTimeout(timer));
</script>

<form
  class="save-row"
  onsubmit={(event) => {
    event.preventDefault();
    save();
  }}
>
  <button type="submit" disabled={state === 'loading'} aria-busy={state === 'loading'}>
    {state === 'success' ? 'Saved' : state === 'loading' ? 'Saving' : 'Save draft'}
  </button>
  <WaveloLoader type="button-confirm" size={20} data-wavelo-state={state} loading={state !== 'idle'} />
  <span>{saved} saved</span>
</form>
