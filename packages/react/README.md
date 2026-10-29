# @wavelo/react

React 19 component for Wavelo. Import `Loader` and pass the shared loader
configuration as props — all 27 keys, including `data-*`.

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

Supported peer range: `react >=19.3.1 <20` and `react-dom >=19.3.1 <20`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
