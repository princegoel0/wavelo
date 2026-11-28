<script setup lang="ts">
  import { Loader } from '@wavelo/vue';

  const config = {
    type: 'brand-loader',
    brand: { text: 'ACME', animation: 'shimmer' },
    value: 50,
    max: 100
  } as const;
</script>

<template>
  <Loader v-bind="config" />
</template>
