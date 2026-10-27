# @wavelo/core

Framework-independent loading animations with typed configuration, accessible
semantics, reduced-motion support, modular registry metadata, and a small DOM helper.

```ts
import { renderLoader } from '@wavelo/core';

const result = renderLoader({ type: 'orbit', label: 'Loading data', size: 48 });
document.body.innerHTML = result.html;
```

The core has no runtime dependencies. Use the `@wavelo/core/loaders/<id>` entry
points for individual loader metadata without importing the full registry.
