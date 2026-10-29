# @wavelo/angular

Angular 22 component for Wavelo. Import `LoaderComponent` into a standalone
component and drive it with inputs.

```ts
import { Component } from '@angular/core';
import { LoaderComponent } from '@wavelo/angular';

@Component({
  standalone: true,
  imports: [LoaderComponent],
  template: '<wavelo-loader type="three-dots" label="Loading data" [size]="48" />'
})
export class Screen {}
```

Inputs cover all 27 configuration keys. Two names need care: `style` binds as
`waveloStyle`, because Angular already owns `[style]`, and `data-*` attributes on
the host are read into the configuration. `paused`, `loading`, `inline` and
`decorative` take a boolean binding, and a bare attribute (`paused`, `loading`) is
true the way HTML means it.

Defaults for a whole tree are a provider, not a global:

```ts
providers: [{ provide: WAVELO_DEFAULTS, useValue: { color: '#6366f1', size: 32 } }]
```

```html
<wavelo-loader type="ring" [loading]="busy" [count]="3" inline />
```

`[loading]="false"` renders no markup and injects no stylesheet; the host element
(`display: contents`) stays empty.

The host element is `display: contents`, change detection is `OnPush`, and the
rendered content is cleared on destroy. Only markup is written into the host;
`ensureStyles` puts the design's stylesheet slice in the document head, so a
server-rendered page should add `@wavelo/core/styles.css` to the server styles.

Supported peer range: `@angular/core >=22.2.3 <23`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
