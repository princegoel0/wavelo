<script setup lang="ts">
import { Wavelo } from '@wavelo/vue';
</script>

<!-- The sheet is global CSS (nuxt.config.ts), so nothing here injects styles. The route
     bar mounts itself on document.body when a page starts rendering. -->
<NuxtPage />

<footer class="page-footer">
  <Wavelo type="typing-dots" :inline="true" size="1em" :decorative="true" />
  <span>content cached</span>
</footer>
