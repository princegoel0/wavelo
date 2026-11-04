# Next.js App Router

Requires `@wavelo/react@0.5.0`, the release that carries the Server Component boundary.
With 0.4.0 installed, `Loader` has no declared boundary and each file that renders it needs
its own `'use client'` line.

```sh
npm install
npm run dev
```

| File | The thing worth copying |
| --- | --- |
| `app/layout.tsx` | the sheet imported once in the root layout — a server-rendered page has no effect that could inject it |
| `app/page.tsx` | `renderReactLoader` from `@wavelo/react/server` for the first-paint placeholder: markup in the HTML, no JavaScript for the loader |
| `app/loading.tsx` | `<Loader>` in a route-level `loading.tsx`, which is a Server Component — no directive needed here |
| `components/save-button.tsx` | `useWaveloState()` driving one design through idle, loading, success and error |

The rule the whole example follows: a loader whose state is known while the page renders is
server markup; a loader that changes after hydration is a client component. Wavelo has an
entry for each, and the package declares the boundary so your files do not have to.
