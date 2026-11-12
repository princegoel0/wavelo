# @wavelo/react

React component for Wavelo, supporting React 16.8+, 17, 18, and 19. Import `Loader` and pass the shared loader
configuration as props — all 28 keys, including `data-*`.

```tsx
import { Loader } from '@wavelo/react';

<Loader type="ring" label="Loading data" size={48} paused={false} />
```

Set the house style once for a subtree, and bind a design to a component once, so
a call site says only what changed:

```tsx
import { WaveloProvider, loaderFor } from '@wavelo/react';

const ButtonSpinner = loaderFor('ring', { size: 16, color: '#ffffff', label: 'Saving' });

<WaveloProvider defaults={{ color: '#6366f1', size: 32, reducedMotion: 'auto' }}>
  <ButtonSpinner loading={busy} />   {/* provider < bound < call site */}
</WaveloProvider>
```

`WaveloProvider` is per render tree, never a module global, so server rendering
cannot leak one request's defaults into another. `loading={false}` renders no
element and no stylesheet.

The component renders markup only. On the client its stylesheet slice is added to
the document head once and shared by every loader using it; in server output the
page must include the sheet, normally by importing `@wavelo/core/styles.css` in
the entry file. `renderReactLoader(props, defaults)` returns `{ html, css, styleKey }`
if you want to place the markup yourself.

## React Server Components

`Loader` injects its slice in an effect, so the module that defines it declares a
client boundary. Importing it from a Server Component is therefore normal — no
`'use client'` wrapper of your own:

```tsx
// app/page.tsx — a Server Component
import { Loader } from '@wavelo/react';

export default function Page() {
  return <Loader type="ring" label="Loading" size={48} />;
}
```

For a loader whose markup is known while the page renders, `@wavelo/react/server`
stays on the server and sends no JavaScript:

```tsx
// app/page.tsx — a Server Component or a route handler
import { renderReactLoader } from '@wavelo/react/server';

const loader = renderReactLoader({ type: 'typing-dots', label: 'Assistant is typing' });

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: loader.html }} />;
}
```

`@wavelo/react/client` is the same surface named directly, for a file that wants to
declare the boundary itself.

Supported peer range: `react >=16.8.0` and optional `react-dom >=16.8.0`.

Interactive documentation & live preview gallery: https://princegoel0.github.io/wavelo/

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
