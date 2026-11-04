import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// The component ships as Svelte source, so the consumer's build compiles it: preprocess
// is what lets our .svelte file be imported from node_modules.
const config = {
  preprocess: vitePreprocess(),
  kit: { adapter: adapter() }
};

export default config;
