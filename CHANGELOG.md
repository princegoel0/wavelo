# Changelog

## 0.1.0

Not yet published.

- Dependency-free core that renders markup and styles separately: `renderLoader`
  returns escaped markup plus the stylesheet slice the design needs.
- Generated modular catalog: `packages/core/src/catalog.ts` is the single authored
  source; loader entry points, the loaders barrel and the typed `LoaderId` union
  are generated from it, and `npm run catalog` fails when they drift.
- 111 public IDs, each with its own implementation and no deprecated aliases. A
  browser test asserts that no two designs render identically, and that designs
  whose names promise a count (four dots, a 3x3 matrix, seven bars) render it.
- The streaming lane: `typing-dots`, `thinking-glow`, `stream-cursor`, `token-stream`,
  `ai-shimmer` and `neural-grid` under a new `ai` category, for the state between
  sending a prompt and receiving an answer. Four composite skeletons join them —
  `skeleton-inbox`, `skeleton-chat`, `skeleton-code` and `skeleton-metric` — plus five
  single-box designs: `conic-ring` and `comet-orbit`, both carved out of a conic
  gradient by a radial mask, `neon-ring`, which turns while its glow swells,
  `liquid-blob`, whose corner radii keep changing while it stays in place, and
  `trip-orbit`, three arcs a third of a turn apart.
- 12 render kinds and 12 stylesheet slices, so importing one design ships its own
  rules instead of the whole catalog's. `@wavelo/core/styles.css` carries the
  complete sheet for server rendering.
- Thirteen determinate progress designs, because a level is not a spinner: `battery`,
  `half-ring`, `wave-fill`, `count`, `dots-fill`, `label-inline`, `gradient-ring`,
  `multi-step`, `upload-multi`, `ai-generate`, `skill`, `timer` and `orbit-fill`. Two of
  them are the interesting ones. `count` prints its own percentage with a CSS counter
  over a registered `<integer>` property, so the number animates to its new value with no
  timer, no JavaScript and no re-render; `label-inline` prints the caller's `valueText`
  through `attr()`, which is the same string `aria-valuetext` carries, so the label and the
  announcement cannot drift apart. A queue of files divides one value across its tracks,
  and the renderer decides which units are filled because CSS cannot compare a value
  against an index.
- `--wavelo-count`, the twentieth custom property: the same determinate value as a whole
  percentage, written only for the designs that can draw a value.
- `progress-scroll`: a reading-progress bar driven by a CSS scroll timeline
  (`animation-timeline: scroll(root block)`), so the document's scroll position
  fills the bar with no JavaScript, no scroll listener and no re-render. It takes
  no `value` and therefore never fabricates an `aria-valuenow`; where scroll
  timelines are unsupported the same keyframes sweep on the document clock. Both
  paths are asserted in Chromium, including the fill width at 0%, 50% and 100% of
  the scroll range.
- Stylesheets are injected into the document head once per distinct slice rather
  than inlined into every component instance.
- 27 configuration keys: `type`, `size`, `width`, `height`, `color`,
  `secondaryColor`, `backgroundColor`, `speed`, `duration`, `strokeWidth`, `theme`,
  `direction`, `paused`, `label`, `className`, `style`, `reducedMotion`,
  `data-testid`, `value`, `max`, `labelledBy`, `describedBy`, `valueText`,
  `decorative`, `loading`, `count`, `inline`, plus arbitrary `data-*` attributes.
- Each design advertises only the keys it actually honours.
  `scripts/honoured-options.mjs` renders every design in Chromium with each key set
  and unset, and the measurement becomes `LoaderDefinition.options`, the gallery's
  option list and the documentation: `skeleton-card` no longer advertises a
  `strokeWidth` it never reads, `ring` no longer advertises `secondaryColor`, and a
  static track no longer advertises `duration`. `npm run audit:customization`
  re-measures the table and fails CI when it drifts. The probe now settles two frames
  before it reads, because a scroll- or view-driven animation is sampled while frames
  render and the frozen transform differed between two identical pages; the mask is one
  of the properties it compares, so a stroke that carves a ring rather than drawing a
  border is measured as honoured. `npm run audit:layout` keeps every copy it measures
  inside the viewport for the same reason: Chromium does not animate boxes it cannot
  see, so 150 copies stacked in normal flow let one design report 120 layouts on a run
  and 0 on the next, and the 0 looked like a design that had stopped costing layout.
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
  would leak one request's theme into the next under server rendering. Registered
  defaults may also name a design, so an app chooses its loader once.
- `loaderFor(type, defaults)` in React and Vue returns a component bound to one
  design and its house options, so a call site reads `<ButtonSpinner loading={busy} />`
  instead of repeating a configuration. Precedence runs outward to inward: registered
  defaults, the bound component's own options, then the call site.
- `loading` binds visibility to a value instead of mounting and unmounting a
  component: `false` returns empty `html` and empty `css`, `ensureStyles` ignores an
  empty slice, and the adapters emit no element, so a hidden loader costs nothing and
  leaves nothing behind.
- `count` repeats the tracks of the designs that are authored from them — a stack of
  skeleton lines (the last one short, as a paragraph ends), table rows, dashboard
  tiles, card text lines, progress steps — validated as a whole number of 1 to 12.
  A single counted line stacks inside an auto-sized grid track whose percentage
  children resolve to zero width, so the stack declares its own `minmax(0, 1fr)`.
- `inline` puts a loader on the text line: middle alignment for an inline-level box,
  and an inline twin (`inline-block`/`inline-grid`) for every design authored as a
  block or a grid, so a skeleton line can replace one word rather than a paragraph.
  A fixed overlay advertises neither, because there it changes nothing.
- Vue declared `paused`, `decorative`, `loading` and `inline` as `Boolean` props,
  which Vue resolves to `false` when the call site passes nothing: a registered
  default was erased, and a loader nobody asked to hide was hidden. They are now
  declared without a type, so an absent prop stays absent and the core's single
  boolean rule (`''` and `'true'` mean true; `false`, `'false'` and `'0'` mean
  false) applies on every path.
- The measured option table now ignores the element's own `class` when deciding
  whether a key did something, so a key is credited for the effect it has on screen
  rather than for switching a mechanism on. That is what makes `fullscreen` report no
  `inline` while `ring` reports it.
- The styling a config key does not cover is a token, and the tokens now reach the
  rules that draw: `--wavelo-radius` on bars, tracks, steps and placeholders (not on
  a design's own shape), `--wavelo-gap` on every composite that spaces its parts,
  `--wavelo-ease` as the timing function of every authored animation, keeping each
  design's own timing as the fallback, and `--wavelo-z-index` on the fixed top bars
  and the full-screen layer, which now default to `9999` because an overlay that a
  page can scroll under is not an overlay.
- No design caps a size it is given. `min-width`/`min-height` floors and
  `max-height` ceilings became the defaults of the rules that had them, so a 2 rem
  progress bar is 2 rem tall, a skeleton card takes the height asked for, and a
  skeleton line takes its width. `height` is now measured as honoured on 15 more
  designs, `width` on `dot-matrix` and `grid-pulse`; `progress-scroll` no longer
  reads `size` because it fills its container instead.
- `fullscreen` draws its scrim: it was declared with the same translucent layer as
  `overlay` in the prose but with no background in the sheet, so a full-screen
  loading layer showed the page behind it at full strength.
- `theme` is the page's palette rather than only the skeleton's. `dark` also sets the
  colour a design falls back to (`#a5b4fc`) and the overlay scrim (`#0f172a`),
  `system` follows `prefers-color-scheme`, and an explicit `color` or
  `backgroundColor` still wins — so `theme` moved from 6 designs to every design in the catalog.
- `npm run docs:check` now compares the custom properties three ways: what the sheet
  reads, what `WaveloTokens` declares and what the README table documents. A token in
  only one of those places fails the build.
- `progress-view`: a bar driven by a CSS **view** timeline, so it fills as the
  element it sits in travels through the viewport - the per-section and
  scroll-reveal case that `progress-scroll` (document scroll) cannot express. It
  tracks its own element by default; `--wavelo-timeline` names another subject
  declared with `view-timeline`, and where view timelines are missing the same
  keyframes sweep on the document clock. Its options are measured like everyone
  else's, so it advertises no `duration`, no `speed` and no `value`.
- `createRouteProgress()`: the top-of-page bar for route changes, which creeps
  toward a ceiling while a navigation is in flight, takes a real percentage from a
  router that has one, and removes itself after `done()` - with no label, because a
  page announces a route change through focus movement. It is inert during server
  rendering, and it mounts the `progress-top` design through the same renderer as
  everything else.
- Container-query sizing is documented and tested end to end: `size: '12cqi'` and an
  ancestor's `--wavelo-size: 25cqi` both resolve against the loader's query
  container, in a browser, not just in the type.
- A design missing from the measured option table now renders with no options and
  fails `npm run catalog` by name, instead of throwing when the registry is
  imported - which made it impossible to measure a catalog that had just grown.
- A page under a `style-src` content security policy works without `'unsafe-inline'`:
  every injected `<style>` carries the nonce declared by
  `<meta name="wavelo-csp-nonce">`, and `ensureStyles`, `mountLoader`,
  `createLoaderElement` and `renderStylesheets` take it explicitly for a caller who
  knows it. The nonce is read per injection rather than kept in a module, so two
  responses rendered in one process cannot share one. Verified against a real CSP
  header in Chromium, including the counterfactual that the same page without the
  meta element is unstyled.
- `npm run packages:check` asserts the manifest of every published package — name,
  description, licence, author, `engines.node`, repository directory, keywords,
  `sideEffects`, peers, and that every path in its `exports` map exists in the build
  output with a declaration beside it. All seven packages now carry `author`,
  `engines`, `repository.directory`, `publishConfig.access` and search keywords; the
  adapters declare `sideEffects: false` so a bundler may drop what is unused.
- The documentation gallery shows each design's **measured** option list as chips, so
  the table that used to live only in `loaderRegistry` is what a visitor reads.
- A configuration playground sits above the gallery: pick a design, move size,
  stroke, duration, value, colour, radius, paused, reverse and dark surface, and the
  stage writes `--wavelo-*` properties on the box around the loader — the same
  mechanism a page's own CSS uses — while the code block below writes the equivalent
  configuration object.
- New: [docs/RECIPES.md](docs/RECIPES.md) for server rendering per framework, content
  security policy, Tailwind v4 `@theme`, dark mode and container-query sizing, each
  line marked tested or documented; and
  [docs/MIGRATION.md](docs/MIGRATION.md) for moving off react-spinners, loaders.css,
  react-content-loader, MUI and Chakra skeletons and NProgress, including the
  differences that will bite — `speed` means the opposite of what it means there, and
  an unlabelled loader is `aria-hidden` rather than "Loading…".
- Four bar designs stopped costing the browser a layout on every frame. `equalizer`,
  `gradient-bars`, `growing-bars` and `alternating-bars` animated `height: 20% → 100%`;
  they now animate `transform: scaleY(.2 → 1)` on a full-height box anchored to the
  bottom, which measured 119–120 layouts per two seconds across 150 copies before and
  0 after. The change was kept on a measurement, not an argument: every bar's box was
  compared at three points of the animation cycle across all eight bar designs and
  matched within 0.6 px, and the residual difference is recorded — about 0.5% of
  pixels, all on the caps, because a vertical scale also compresses the 2 px corner
  radius while the bar is short. The same conversion was tried on `waveform`, failed
  that geometry check by 30 px, and was reverted: its slide is a percentage of a
  height that is itself animating.
- `progress-view`'s fill became a scale rather than a width, for the same reason — a
  reading indicator that re-lays-out the page while you scroll is the one thing it
  must not do.
- `npm run audit:layout` measures the layout and style-recalculation counters of every
  design in Chromium and fails when one costs a layout per frame with no recorded
  reason, and when a recorded reason stops being true. Three designs remain
  layout-driven and each says why in `docs/PERFORMANCE.md`.
- A dead keyframe went: `wavelo-bars` was imported by the bars slice and named by the
  kind's default rule, which every design in that family overrides, so nothing ever
  ran it. 126 bytes off the catalog sheet.
- New: [docs/PERFORMANCE.md](docs/PERFORMANCE.md) — per-frame cost, per-kind slice
  bytes, and which command measures each claim.
- `@wavelo/core/tokens.css` — the `--wavelo-*` defaults as a `:root` block, for a page
  that wants them declared and editable rather than inherited from the sheet. It is
  generated from the built stylesheet and lists a property only where every rule that
  reads it agrees on the same default, which is why radius, gap, easing and the
  `--wavelo-size` chain are absent: one global value would flatten designs that
  author their own. A Chromium test compares 13 designs with and without it and
  requires every computed value to match.
- An unknown `type` now leaves a trace where it is looked at: the element carries
  `data-wavelo-fallback="<what was asked for>"` beside the default design's own
  classes, alongside the `resolution` and `fallback` the result already reported. A
  preset that resolved and an absent `type` carry nothing, because neither is a
  mistake.
- Design resolution is a `Map` lookup rather than a scan of the catalog, which
  happens on every render.
- The PRD said pnpm, Vitest and `pnpm-workspace.yaml`; the repository is npm
  workspaces, `node --test` and one `tsconfig.json`. Corrected, and the versioning
  section now says what may change during `0.x` and what never does.
- A Gecko smoke suite (`npm run test:browser:firefox`, in CI next to the Chromium
  suite): the sheet applies in Firefox, geometry, stroke, the dark palette,
  `paused`, `direction`, `reducedMotion` and ancestor tokens all reach the loader,
  every design paints something, the custom element re-renders, and the two timeline
  designs run on the document clock. Measured on Firefox 157:
  `animation-timeline: scroll()` and `view()` are unsupported, so the fallback this
  library documents is what that engine actually gets — previously it was a claim
  with one engine behind it.
- A WebKit smoke suite (`npm run test:browser:webkit`, in CI beside the other two),
  standing in for Safari with Playwright's build of the same engine. It closes the other
  half of that claim: measured on WebKit 27.2, `scroll()` and `view()` are supported, so
  the two timeline designs run on a real `ScrollTimeline` and `ViewTimeline` there. Each
  path is now measured on a browser, one on each side of the support line. The suite also
  checks that a conic gradient is carved by a mask and that a registered `<integer>`
  reaches a CSS counter, both of which the progress tranche depends on.
- Registry-driven static documentation gallery, axe-checked in a real browser.
- Test suites: unit (markup, validation, catalog, entry points),
  adapter (SSR rendering, prop parity), and browser (computed styles, style
  injection, accessibility). Bundle budgets and catalog/doc drift are enforced
  in CI.
