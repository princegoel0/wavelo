<script>
  import '@wavelo/core/styles.css';
  import '../app.css';
  import { browser } from '$app/environment';
  import { afterNavigate, beforeNavigate } from '$app/navigation';
  import { createRouteProgress } from '@wavelo/core';

  // SvelteKit runs this file on the server as well, and the navigation lifecycle only
  // exists in the browser. `createRouteProgress` is inert without a document, but the
  // guards are the honest shape: a route bar belongs to the client.
  const bar = browser ? createRouteProgress({ color: '#6366f1' }, { trickle: 200, ceiling: 90, hold: 250 }) : null;

  if (browser) {
    beforeNavigate(() => bar?.start());
    afterNavigate(() => bar?.done());
  }

  let { children } = $props();
</script>

<!-- The sheet is imported here because Svelte renders on the server too, and an $effect
     does not run during that pass. -->
{@render children()}
