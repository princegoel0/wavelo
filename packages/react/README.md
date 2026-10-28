# @wavelo/react

React 19 component for Wavelo. Import `Loader` and pass the shared loader
configuration as props — all 20 keys, including `data-*`.

```tsx
import { Loader } from '@wavelo/react';

<Loader type="ring" label="Loading data" size={48} paused={false} />
```

The component renders markup only. On the client its stylesheet slice is added to
the document head once and shared by every loader using it; in server output the
page must include the sheet, normally by importing `@wavelo/core/styles.css` in
the entry file. `renderReactLoader(props)` returns `{ html, css, styleKey }` if
you want to place the markup yourself.

Supported peer range: `react >=19.3.1 <20` and `react-dom >=19.3.1 <20`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
