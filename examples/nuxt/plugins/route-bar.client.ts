import { createRouteProgress } from '@wavelo/core';

// Nuxt's own page lifecycle is the honest place to start and stop a route bar: page:start
// fires when a route begins rendering and page:finish when it is on screen. Between them
// the bar creeps toward its ceiling instead of pretending the route is nearly done. On the
// server the same call returns an inert bar, so no document is touched during SSR.
export default defineNuxtPlugin((nuxtApp) => {
  const bar = createRouteProgress({ color: '#6366f1' }, { trickle: 200, ceiling: 90, hold: 250 });

  nuxtApp.hook('page:start', () => bar.start());
  nuxtApp.hook('page:finish', () => bar.done());
});
