# SvelteKit

```sh
npm install
npm run dev
npm run check
```

| File | The thing worth copying |
| --- | --- |
| `src/routes/+layout.svelte` | the sheet imported once for the whole site, and `createRouteProgress()` wired to `beforeNavigate` and `afterNavigate` |
| `svelte.config.js` | `vitePreprocess` — the component ships as Svelte source, so the consumer's build compiles it |
| `src/routes/+page.svelte` | `provideWaveloDefaults()` for the route's house style and `skeleton-feed` while the data arrives |
| `src/lib/SaveButton.svelte` | `$state` driving `data-wavelo-state` — no hook needed, because the morph is an attribute |

`renderSvelteLoader` from `@wavelo/svelte` is the server half: it returns markup and the
slice it needs, with no component instance and no `$effect` (which would not run during SSR
anyway).

SvelteKit's own wiring here follows the framework's documented API and is not executed by
this repository's suite. The library calls are: `npm run verify:examples` compiles every
`.svelte` file in this folder with the Svelte compiler, for both the client and the server
build, and refuses an import the built package does not export.
