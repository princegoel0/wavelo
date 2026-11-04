examples/
  README.md                    what each project demonstrates and how to run it
  react-vite/                  Vite + React 19 SPA
  next-app-router/             Next.js App Router: server shell, client island
  nuxt/                        Nuxt 3 with the sheet in global CSS
  sveltekit/                   SvelteKit with runes
  angular-standalone/          Angular 22 standalone component, AOT

Each project is its own npm package on purpose: no workspace linking, no shared
lockfile, so `npm install && npm run dev` inside any folder is the real thing a
consumer would type. The `@wavelo/*` versions they declare are the releases that
carry the API each one uses.

`npm run verify:examples` from the repository root checks these files against the
built packages — it compiles the Svelte and Vue sources, type checks the React and
Angular ones, and refuses any `@wavelo/*` import the shipped declarations do not
export. Run it after changing the library surface; an example that no longer
compiles is a bug in the library or in the example, never a documentation detail.

## The four patterns every example shows

| Pattern | Why it is the one worth copying |
| --- | --- |
| a spinner inside a button | the button must not change width when the label is replaced, and the loader must be announced |
| a route progress bar | one bar for the whole app, driven by navigation, not by each page |
| a skeleton for a block of content | shape first: the layout must not jump when the data arrives |
| inline in running text | a loader that sits on the text line without pushing it down |

House style, reduced motion and the `data-*` passthrough are configured in each
project's root so the call sites stay short.
