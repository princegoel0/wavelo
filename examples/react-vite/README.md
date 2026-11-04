# React + Vite

```sh
npm install
npm run dev
```

| File | The thing worth copying |
| --- | --- |
| `src/main.tsx` | `WaveloProvider` once at the root: house colour, size and the reduced-motion policy. No stylesheet import — the first loader injects its own slice |
| `src/SaveButton.tsx` | `loaderFor('ring', { size: 16, label: 'Saving' })` bound once, then `<Spinner loading={busy} />`. An idle loader renders nothing, so the button keeps its width in both states |
| `src/RouteBar.tsx` | one `createRouteProgress()` for the app, `start()` on navigation and `done()` when the view lands |
| `src/FeedSkeleton.tsx` | `skeleton-feed` with `count={3}` — the placeholder is the shape of the list that replaces it |
| `src/InlineLoader.tsx` | `inline`, `size="1em"` and `decorative` for a loader that belongs to a sentence already saying it |

`@wavelo/core` is a dependency here because `createRouteProgress` lives in the core, which
is what lets the same bar work in every framework.

Reduced motion is on by inheritance: `reducedMotion: 'auto'` reads the operating system
setting, so turning it on in the OS and reloading shows the still state of every design
with no second stylesheet and no JavaScript change.
