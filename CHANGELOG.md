# Changelog

## 0.1.0

Not yet published.

- Dependency-free core that renders markup and styles separately: `renderLoader`
  returns escaped markup plus the stylesheet slice the design needs.
- Generated modular catalog: `packages/core/src/catalog.ts` is the single authored
  source; loader entry points, the loaders barrel and the typed `LoaderId` union
  are generated from it, and `npm run catalog` fails when they drift.
- 81 public IDs: 69 active designs and 12 deprecated aliases. Each alias renders
  its canonical design byte-for-byte, verified by test.
- 11 render kinds and 11 stylesheet slices, so importing one design ships its own
  rules instead of the whole catalog's. `@wavelo/core/styles.css` carries the
  complete sheet for server rendering.
- Stylesheets are injected into the document head once per distinct slice rather
  than inlined into every component instance.
- 20 configuration keys, all of which reach the rendered element and are covered
  by a test: `type`, `size`, `width`, `height`, `color`, `secondaryColor`,
  `backgroundColor`, `speed`, `duration`, `strokeWidth`, `theme`, `direction`,
  `paused`, `label`, `className`, `style`, `reducedMotion`, `data-testid`,
  `value`, `max`, plus arbitrary `data-*` attributes.
- `theme` selects the skeleton palette (`light` by default, `dark`, or `system`).
- `reducedMotion: 'always'` reduces motion without an operating-system
  preference; `'never'` opts out when one exists.
- `paused` and `direction` drive `animation-play-state` and
  `animation-direction` on the element that actually animates, verified against
  computed styles and `document.getAnimations()` in Chromium.
- Framework bridges for React, Angular, Vue, Svelte, vanilla DOM and Web
  Components, each accepting the full configuration surface.
- Registry-driven static documentation gallery, axe-checked in a real browser.
- Test suites: unit (markup, validation, catalog, aliases, entry points),
  adapter (SSR rendering, prop parity), and browser (computed styles, style
  injection, accessibility). Bundle budgets and catalog/doc drift are enforced
  in CI.
