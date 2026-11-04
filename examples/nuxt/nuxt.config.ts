export default defineNuxtConfig({
  // The sheet is global CSS, so a server-rendered page arrives styled and the client never
  // waits for an effect to inject the rules it needs.
  css: ['@wavelo/core/styles.css'],
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false }
});
