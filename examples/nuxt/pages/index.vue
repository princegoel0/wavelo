<script setup lang="ts">
import { Loader, provideWaveloDefaults } from '@wavelo/vue';
import SaveButton from '../components/SaveButton.vue';

// House style for this subtree: colour, size and the reduced-motion policy are set once
// here, and every loader below — including the ones inside components — inherits them.
provideWaveloDefaults({ color: '#6366f1', size: 24, reducedMotion: 'auto' });

// useAsyncData runs on the server and in the browser. The skeleton is therefore what a
// first paint looks like, and the loader is the same component in both places.
const { data, pending } = await useAsyncData('stories', () =>
  new Promise((resolve) => setTimeout(() => resolve(['A loader that never moved the text', 'Reduced motion, twice, in one sheet']), 1200))
);
</script>

<template>
  <main class="page">
    <h1>Wavelo in Nuxt</h1>

    <Loader v-if="pending" type="skeleton-feed" :count="3" label="Loading stories" />
    <ul v-else>
      <li v-for="story in data ?? []" :key="story">{{ story }}</li>
    </ul>

    <SaveButton />

    <p>
      Publishing
      <Loader type="three-dots" inline size="1em" decorative :loading="pending" />
    </p>
  </main>
</template>
