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
- 24 configuration keys: `type`, `size`, `width`, `height`, `color`,
  `secondaryColor`, `backgroundColor`, `speed`, `duration`, `strokeWidth`, `theme`,
  `direction`, `paused`, `label`, `className`, `style`, `reducedMotion`,
  `data-testid`, `value`, `max`, `labelledBy`, `describedBy`, `valueText` and
  `decorative`, plus arbitrary `data-*` attributes.
- Each design advertises only the keys it actually honours.
  `scripts/honoured-options.mjs` renders every design in Chromium with each key set
  and unset, and the measurement becomes `LoaderDefinition.options`, the gallery's
  option list and the documentation: `skeleton-card` no longer advertises a
  `strokeWidth` it never reads, `ring` no longer advertises `secondaryColor`, and a
  static track no longer advertises `duration`. `npm run audit:customization`
  re-measures the table and fails CI when it drifts.
- Pattern presets resolve: `renderLoader({ type: 'download-progress' })` renders
  `progress-upload`, reports `resolution: 'preset'`, and is not a fallback. An
  unknown ID reports `resolution: 'default'` with `fallback: true`, which is now the
  only case meaning "not understood".
- Validation is stricter where it matters and wider where it didn't: colours accept
  `oklch()`, `lab()`, `hwb()`, `color-mix()` and keywords while anything that could
  break out of a declaration is rejected; dimensions accept container and query
  units plus `calc()`, `min()`, `max()`, `clamp()`, `env()` and `var(--wavelo-*)`.
  `style` now throws on a key it cannot apply instead of dropping it silently.
- `<wavelo-loader>` reads `--wavelo-*` properties from its `style` attribute, and a
  bad attribute value no longer blanks the element: it keeps the last valid render,
  sets `data-wavelo-error`, and logs one console error rather than throwing out of a
  lifecycle callback. `paused` means the same thing in a config object and in an
  attribute.
- `theme` selects the skeleton palette (`light` by default, `dark`, or `system`).
- `reducedMotion: 'always'` reduces motion without an operating-system
  preference; `'never'` opts out when one exists.
- `paused` and `direction` drive `animation-play-state` and
  `animation-direction` on the element that actually animates, verified against
  computed styles and `document.getAnimations()` in Chromium.
- Accessibility is configurable rather than fixed: `labelledBy` and `describedBy`
  reference visible text, `valueText` gives assistive technology a reading of a
  determinate value instead of a bare number, and `decorative` hides a labelled
  loader when a caption already announces it. Passing `aria-*` or `role` directly is
  rejected with a message naming the option that does the job, instead of being
  dropped on the floor.
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
- Global defaults now work. A value the caller did not choose is no longer written
  into every element's `style` attribute; each token's default lives in the rule that
  reads it, so `--wavelo-size`, `--wavelo-duration`, `--wavelo-stroke`,
  `--wavelo-direction`, `--wavelo-play-state` and the colours can be set once on
  `:root` or a class and reach every loader inside, with a loader's own options
  winning. An unconfigured loader renders with no `style` attribute at all.
- `style` carries any CSS declaration — `position`, `marginTop`, camelCase or
  kebab-case — not just `--wavelo-*`, and the token names are a typed `WaveloTokens`
  interface, so they autocomplete instead of being guessed.
- `--wavelo-progress` is registered with `@property`, so a determinate value
  animates between readings instead of jumping, including the conic ring where a
  width transition cannot help.
- Defaults can be registered for a subtree without a global: `WaveloProvider` and
  `useWaveloDefaults` in React, `provideWaveloDefaults` in Vue and Svelte, the
  `WAVELO_DEFAULTS` injection token in Angular, and `createWavelo()` in the core and
  vanilla packages. Nothing lives in a module singleton, because a shared default
  would leak one request's theme into the next under server rendering.
- Registry-driven static documentation gallery, axe-checked in a real browser.
- Test suites: unit (markup, validation, catalog, entry points),
  adapter (SSR rendering, prop parity), and browser (computed styles, style
  injection, accessibility). Bundle budgets and catalog/doc drift are enforced
  in CI.
