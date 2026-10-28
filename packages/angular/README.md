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

Inputs cover all 20 configuration keys. Two names need care: `style` binds as
`waveloStyle`, because Angular already owns `[style]`, and `data-*` attributes on
the host are read into the configuration. `paused` takes a boolean binding.

The host element is `display: contents`, change detection is `OnPush`, and the
rendered content is cleared on destroy. Only markup is written into the host;
`ensureStyles` puts the design's stylesheet slice in the document head, so a
server-rendered page should add `@wavelo/core/styles.css` to the server styles.

Supported peer range: `@angular/core >=22.2.3 <23`.

See [docs/FRAMEWORKS.md](../../docs/FRAMEWORKS.md) and
[docs/COMPATIBILITY.md](../../docs/COMPATIBILITY.md).
