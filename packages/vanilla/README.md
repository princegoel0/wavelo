# @wavelo/vanilla

Vanilla DOM helpers for mounting Wavelo designs, with no framework peer
dependency.

```ts
import { mountLoader, createLoaderElement } from '@wavelo/vanilla';

const detach = mountLoader(document.querySelector('#slot'), { type: 'ring', label: 'Loading data' });
document.body.append(createLoaderElement({ type: 'orbiting-dots', label: 'Loading' }));
```

`mountLoader` injects the design's stylesheet slice into the document head — once
per distinct slice, however many loaders use it — writes the markup into the
container, and returns a detach function that clears the container without
removing styles another loader may still be using.

`ensureStyles`, `renderStylesheets` and `stylesheetMarkup` are re-exported for
callers that render markup themselves. To use the full catalog sheet in a
stylesheet pipeline, import `@wavelo/core/styles.css` instead of calling
`ensureStyles`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
