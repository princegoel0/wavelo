<script setup lang="ts">
import { ref } from 'vue';
import { loaderFor, useWaveloState } from '@wavelo/vue';

const Feedback = loaderFor('button-confirm', { size: 20 });
const { state, stateProps, wrapAsync } = useWaveloState({ resetTimeout: 1600 });
const saved = ref(0);

const save = () =>
  wrapAsync(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    saved.value += 1;
  });
</script>

<template>
  <form @submit.prevent="save" class="save-row">
    <button type="submit" :disabled="state === 'loading'" :aria-busy="state === 'loading'">
      {{ state === 'success' ? 'Saved' : state === 'loading' ? 'Saving' : 'Save draft' }}
    </button>
    <!-- One design for the whole lifecycle. stateProps is `loading` plus
         `data-wavelo-state`; the extra binding keeps it visible long enough to finish the
         success morph. -->
    <component :is="Feedback" v-bind="{ ...stateProps, loading: state !== 'idle' }" />
    <span>{{ saved }} saved</span>
  </form>
</template>
