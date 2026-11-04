# Nuxt 3

```sh
npm install
npm run dev
```

| File | The thing worth copying |
| --- | --- |
| `nuxt.config.ts` | `css: ['@wavelo/core/styles.css']` — the sheet is global CSS, so a server-rendered page arrives styled |
| `plugins/route-bar.client.ts` | `createRouteProgress()` started and finished by Nuxt's `page:start` and `page:finish` hooks |
| `pages/index.vue` | `provideWaveloDefaults()` for the subtree's house style, `skeleton-feed` while `useAsyncData` is pending |
| `components/SaveButton.vue` | `useWaveloState()` driving one `button-confirm` design through its four states |

The loader in `app.vue` is the same component the browser would render; `ensureStyles` does
not run during SSR, which is why the sheet comes from the config and not from the component.

Wiring for Nuxt itself — the plugin hooks and the `css` entry — follows the framework's
documented API and is not executed by this repository's suite; the library calls in these
files are checked by `npm run verify:examples` against the built packages.
