# Changelog

## 0.1.0

Not yet published.

- Dependency-free core that renders markup and styles separately: `renderLoader`
  returns escaped markup plus the stylesheet slice the design needs.
- Generated modular catalog: `packages/core/src/catalog.ts` is the single authored
  source; loader entry points, the loaders barrel and the typed `LoaderId` union
  are generated from it, and `npm run catalog` fails when they drift.
- 82 public IDs, each with its own implementation and no deprecated aliases. A
  browser test asserts that no two designs render identically, and that designs
  whose names promise a count (four dots, a 3x3 matrix, seven bars) render it.
- 12 render kinds and 12 stylesheet slices, so importing one design ships its own
  rules instead of the whole catalog's. `@wavelo/core/styles.css` carries the
  complete sheet for server rendering.
- `progress-scroll`: a reading-progress bar driven by a CSS scroll timeline
  (`animation-timeline: scroll(root block)`), so the document's scroll position
  fills the bar with no JavaScript, no scroll listener and no re-render. It takes
  no `value` and therefore never fabricates an `aria-valuenow`; where scroll
  timelines are unsupported the same keyframes sweep on the document clock. Both
  paths are asserted in Chromium, including the fill width at 0%, 50% and 100% of
  the scroll range.
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
- All seven determinate progress designs render their documented contract,
  verified by measurement in Chromium: the ring is square so its conic fill reads
  as a circle, `progress-steps` fills whole steps in proportion to the value,
  `segmented-bar` fills to the value instead of saturating at 20%,
  `progress-upload` and `page-transition` have their own motion and no longer
  render pixel-identical to `progress-bar`, and `page-transition` exposes
  `progressbar` semantics because determinate behaviour now follows the render
  kind rather than the catalog category.
- Colours that are not set are no longer emitted as self-referencing custom
  properties, which CSS resolves to nothing: the default palette, the gradient
  designs and the overlay scrim now paint, and a page-level `--wavelo-color`
  override reaches the designs that inherit it.
- Skeleton `card`, `table` and `dashboard` presets paint their parts: percentage
  widths inside an auto-sized grid track resolved to zero, so the shimmer had
  nothing to show. The tracks are now sized with `minmax(0, 1fr)` and the presets
  carry a usable minimum box.
- Registry-driven static documentation gallery, axe-checked in a real browser.
- Test suites: unit (markup, validation, catalog, entry points),
  adapter (SSR rendering, prop parity), and browser (computed styles, style
  injection, accessibility). Bundle budgets and catalog/doc drift are enforced
  in CI.
