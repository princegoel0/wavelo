# WAVelo
## Universal Loading & Motion Library

**Tagline:** Motion made simple.

**Document:** Product Requirements Document (PRD)  
**Version:** 2.0  
**Status:** Revised specification — ready for technical review  
**Product type:** Open-source, cross-framework npm library  
**Primary objective:** Deliver a comprehensive, customizable, lightweight and accessible loading system for modern web applications.

---

# 1. Executive Summary

## 1.1 Product Vision

Wavelo is a universal loading-animation and loading-state library that allows developers to integrate polished loading experiences into web applications with minimal code.

The library will support React, Angular, Vue, Svelte and plain HTML/JavaScript through a shared, framework-independent architecture and optional framework-specific integrations.

Wavelo will provide a comprehensive collection of classic spinners, creative animations, skeleton placeholders, progress indicators, loading overlays and application loading patterns.

Developers must be able to select an existing design, customize it extensively, or compose their own variations without having to build animations from scratch.

## 1.2 Product Promise

**Choose a loader. Customize it. Use it in any supported framework.**

Wavelo must provide:

- A large, organized collection of ready-to-use loaders.
- A consistent and predictable public API.
- Extensive customization without requiring custom CSS for common use cases.
- Minimal installation and integration effort.
- Optional framework integrations without unnecessary dependencies.
- Accessible behavior and reduced-motion support.
- Efficient rendering and small incremental bundle costs.
- A visual documentation website with interactive previews and working examples.
- Reliable versioning, compatibility testing and npm distribution.

## 1.3 Core Problem

Developers currently encounter several problems when implementing loading experiences:

1. Repeatedly writing or adapting CSS animations.
2. Installing separate packages for different loading patterns.
3. Difficulty finding a loader that matches their interface.
4. Inconsistent configuration across different components.
5. Excessive dependencies or unnecessarily large bundles.
6. Difficulties integrating loading indicators into multiple frontend frameworks.
7. Inadequate accessibility and reduced-motion behavior.
8. Limited documentation and examples.
9. Styling conflicts with the host application.
10. Unreliable SSR, hydration or framework integration behavior.
11. Difficulty creating custom variations of existing loaders.
12. Unnecessary maintenance when an animation library is upgraded.

Wavelo must address these issues rather than introducing another layer of complexity.

## 1.4 Product Principles

The following principles are mandatory:

1. **Simple by default:** Common use cases must require minimal code.
2. **Customizable when needed:** Advanced configuration must be available without making basic usage complicated.
3. **Framework-independent core:** The core must not require a frontend framework.
4. **Modular distribution:** Developers should import only what they use.
5. **Consistent APIs:** Common options must behave consistently across adapters.
6. **Accessible by default:** Accessibility must not be an optional paid feature or separate tier.
7. **Performance-conscious:** Avoid unnecessary JavaScript, dependencies, timers and rendering work.
8. **Honest compatibility:** Only advertise integrations and versions that have been tested.
9. **Composition over duplication:** Create new variants from reusable animation primitives whenever practical.
10. **Production-ready:** Documentation, tests, packaging and maintenance are part of the product, not post-release extras.

---

# 2. Goals and Non-Goals

## 2.1 Primary Goals

- Support the major frontend frameworks.
- Deliver at least 60 distinct animation designs and at least 100 ready-to-use loader, skeleton, progress and loading-state presets.
- Include the common and popular loading patterns developers expect.
- Provide a consistent configuration API.
- Support extensive visual customization.
- Keep individual imports efficient.
- Provide a searchable interactive gallery.
- Meet accessibility and reduced-motion requirements.
- Publish reliable TypeScript-enabled npm packages.
- Provide working examples for every advertised integration.
- Establish a sustainable contribution and release process.

The catalog targets are minimum release goals, not a limit. Additional designs may be added when they provide meaningful visual or functional variety.

## 2.2 Non-Goals

Wavelo is not intended to:

- Replace a general-purpose animation engine.
- Replace application state management.
- Automatically detect every asynchronous operation.
- Provide backend task queues or distributed job processing.
- Require accounts, API keys or a hosted service.
- Force developers to install every framework adapter.
- Include hundreds of superficial variations that differ only by color.
- Promise identical rendering on every device.
- Automatically intercept network requests or alter application behavior.
- Ship unnecessary features in the core merely to increase the catalog size.

---

# 3. Target Users and Use Cases

## 3.1 Target Users

- Frontend developers.
- Full-stack developers.
- SaaS product teams.
- Design-system engineers.
- E-commerce developers.
- Dashboard and admin-panel developers.
- Open-source maintainers.
- Developers building internal enterprise applications.

## 3.2 Primary Use Cases

Wavelo must support:

- Loading data from an API.
- Loading entire pages or application sections.
- Submitting forms.
- Loading buttons and actions.
- Loading product images.
- Displaying placeholder cards while content loads.
- Showing skeleton tables and dashboard layouts.
- Tracking upload and download progress.
- Indicating background operations.
- Showing progress through multi-step operations when measurable progress is available.
- Creating branded loading experiences.
- Reusing a consistent loading design across different frameworks.

---

# 4. Product Architecture

## 4.1 Architectural Decision

Wavelo will use a shared, framework-independent core with optional framework adapters and an optional native Web Component integration.

The architecture must not require developers to use Web Components when a native framework component is more suitable.

The shared core will define:

- Loader metadata.
- Public configuration types.
- Shared validation and normalization.
- Reusable animation definitions.
- CSS variables and design tokens.
- Accessibility conventions.
- Theme configuration.
- Progress calculations.
- Loader composition primitives.

Framework adapters will translate framework-native properties and lifecycle behavior into the shared rendering model.

## 4.2 Proposed Packages

The following names are provisional and must be checked for npm availability.

| Package | Purpose |
|---|---|
| `@wavelo/core` | Shared types, definitions, utilities and framework-independent primitives |
| `@wavelo/react` | Native React components and hooks |
| `@wavelo/angular` | Angular components and directives |
| `@wavelo/vue` | Vue components and composables |
| `@wavelo/svelte` | Svelte components and bindings |
| `@wavelo/web-components` | Native custom elements for framework-independent browser usage |

If a suitable npm scope is unavailable, select a consistent alternative naming scheme.

Not every package must be published on day one. Each package must have a working implementation, documented purpose and automated tests before release.

## 4.3 Dependency Rules

- The core must not depend on React, Angular, Vue or Svelte.
- Framework adapters must declare framework dependencies as peer dependencies where appropriate.
- The Web Components package must not require a framework runtime.
- Development dependencies must not accidentally become runtime dependencies.
- Optional integrations must not be installed automatically by the core.
- Circular dependencies between packages are prohibited.
- A framework adapter must not duplicate the full animation implementation when it can reuse the core.
- No adapter may require unrelated adapters.

## 4.4 Technology Stack

The proposed stack is:

- TypeScript.
- CSS animations and transforms.
- SVG for suitable vector-based animations.
- Web Components for native browser integration.
- npm workspaces.
- A modern library build tool with explicit entry points and TypeScript declarations.
- Node's built-in test runner for unit and adapter tests.
- Playwright for browser integration tests.
- A documentation framework supporting interactive examples.
- GitHub Actions or an equivalent CI system.

The final tools and versions must be selected after validating compatibility with the supported frameworks.

---

# 5. Comprehensive Loader Catalog

## 5.1 Catalog Strategy

Wavelo must maximize useful variety without creating a maintenance burden.

The release target is:

- At least 60 distinct animation designs.
- At least 20 skeleton presets or primitives.
- At least 10 progress-indicator designs or variants.
- At least 10 application-level loading patterns.
- At least 100 named, documented presets and loading patterns overall.

Categories may overlap where a design legitimately belongs to more than one category. The final catalog count must be calculated from a central registry using unique identifiers, not by counting aliases or cosmetic variations as new designs.

Every entry must have a documented purpose, working implementation and gallery preview.

## 5.2 Category A — Classic Spinners

Provide common, familiar indicators:

1. Circular border spinner.
2. Ring spinner.
3. Dual-ring spinner.
4. Rotating arc.
5. Multiple rotating arcs.
6. Dotted circular spinner.
7. Segmented ring.
8. Half-circle spinner.
9. Elliptical spinner.
10. Rotating square.
11. Rotating diamond.
12. Rotating geometric shapes.
13. Orbiting dots.
14. Orbiting circles.
15. Gradient ring.
16. Thin-line spinner.
17. Thick-stroke spinner.
18. Minimal monochrome spinner.
19. Branded spinner.
20. Custom SVG spinner.

These designs must support common size, color, speed and accessibility settings where applicable.

## 5.3 Category B — Dots and Bouncing Loaders

1. Three-dot loader.
2. Four-dot loader.
3. Five-dot loader.
4. Bouncing dots.
5. Sequentially pulsing dots.
6. Fading dots.
7. Scaling dots.
8. Rotating dots.
9. Orbiting dot.
10. Dot wave.
11. Dot matrix.
12. Grid pulse.
13. Alternating dots.
14. Expanding dot.
15. Ripple dot.
16. Staggered dot animation.
17. Circular dot sequence.
18. Vertical bouncing dots.

Dot count, spacing, size, color and animation timing must be configurable where relevant.

## 5.4 Category C — Bars and Waveforms

1. Equalizer bars.
2. Bouncing bars.
3. Vertical pulse bars.
4. Horizontal pulse bars.
5. Waveform.
6. Audio-style waveform.
7. Sequential fading bars.
8. Growing and shrinking bars.
9. Alternating bars.
10. Gradient bars.
11. Segmented progress bars.
12. Moving stripe indicator.
13. Traveling highlight.
14. Oscillating line.
15. Multi-wave animation.

These patterns must support configurable bar count where the design allows, spacing, height, color and speed.

## 5.5 Category D — Geometric and Creative Loaders

1. Ripple circles.
2. Expanding circles.
3. Morphing shapes.
4. Infinity loop.
5. DNA-style helix.
6. Cube rotation.
7. Three-dimensional-style cube animation.
8. Rotating polygon.
9. Rotating triangles.
10. Rotating squares.
11. Folding squares.
12. Nested rings.
13. Nested squares.
14. Pulsing concentric circles.
15. Spiral animation.
16. Rotating orbit system.
17. Elastic ring.
18. Liquid-style motion.
19. Blinking grid.
20. Moving geometric blocks.
21. Sliding blocks.
22. Wave distortion effect.
23. Rotating segmented shapes.
24. Circular radar sweep.
25. Particle orbit.

Effects must be implemented using appropriate CSS, SVG or other justified rendering methods. Heavy techniques must not be used when a simpler method achieves the same result.

## 5.6 Category E — Skeleton Loading

Provide composable skeleton primitives and ready-to-use layouts:

1. Text line.
2. Multiple text lines.
3. Paragraph block.
4. Circular avatar.
5. Rectangular avatar.
6. Image placeholder.
7. Video thumbnail.
8. Basic card.
9. Profile card.
10. Product card.
11. Product grid.
12. Article layout.
13. Profile page.
14. Table row.
15. Table body.
16. Table with header.
17. Dashboard cards.
18. Dashboard layout.
19. Sidebar navigation.
20. Form layout.
21. List item.
22. Notification item.
23. Chat message.
24. Comment thread.
25. Statistics card.
26. Chart placeholder.
27. Image gallery.
28. Pricing card.
29. E-commerce product details.
30. Custom skeleton block.

Skeleton primitives must allow developers to build their own layouts without depending on predefined templates.

Skeletons must support static and animated variants, dimensions, spacing, shape, radius, background and highlight colors.

The default behavior should avoid unnecessary movement when the user prefers reduced motion.

## 5.7 Category F — Progress Indicators

1. Horizontal indeterminate bar.
2. Determinate horizontal bar.
3. Circular determinate progress.
4. Circular indeterminate progress.
5. Segmented progress.
6. Step progress.
7. Thin top-of-page progress.
8. Gradient progress bar.
9. Progress with percentage text.
10. Progress with custom label.
11. Ring progress.
12. Multi-stage progress.
13. Upload progress.
14. Download progress.
15. File-processing progress.

Determinate progress must reflect values supplied by the application. The library must never invent progress measurements.

## 5.8 Category G — Application Loading Patterns

1. Inline loading indicator.
2. Button loading state.
3. Icon-button loading state.
4. Section-level loading overlay.
5. Container loading overlay.
6. Full-screen loading overlay.
7. Modal loading indicator.
8. Page-transition indicator.
9. Image loading placeholder.
10. Lazy-content placeholder.
11. Form submission loading state.
12. Search-results loading state.
13. Infinite-scroll loading indicator.
14. Background-operation indicator.
15. Multi-step operation indicator.

These patterns must integrate with application state without automatically taking control of unrelated application behavior.

## 5.9 Category H — Specialized and Branded Variants

Provide a controlled extension catalog for:

- Minimal loaders.
- Monochrome loaders.
- Gradient loaders.
- Brand-colored loaders.
- Dark-surface loaders.
- Light-surface loaders.
- High-contrast variants.
- Compact inline variants.
- Large display variants.
- Custom SVG-based loaders.

These variants should reuse shared definitions whenever possible.

## 5.10 Catalog Registry

Every public loader must have centralized metadata containing:

- Unique identifier.
- Display name.
- Category.
- Short description.
- Rendering implementation.
- Supported properties.
- Default configuration.
- Accessibility behavior.
- Preview metadata.
- Framework support.
- Documentation route.
- Stability status.

The registry must power the gallery, documentation, search, filters and catalog validation.

The registry must not force consumers to download every loader definition when they import a single loader.

---

# 6. Customization System

## 6.1 Customization Goals

Wavelo must provide broad visual control while keeping its public API understandable.

Common configuration must remain consistent across framework adapters.

## 6.2 Common Properties

The following API is the proposed baseline:

| Property | Purpose |
|---|---|
| `type` | Select the loader design |
| `size` | Set the overall size |
| `width` | Set width when applicable |
| `height` | Set height when applicable |
| `color` | Set the primary color |
| `secondaryColor` | Set an optional secondary color |
| `backgroundColor` | Set an optional background |
| `speed` | Adjust animation speed |
| `duration` | Set animation duration where appropriate |
| `strokeWidth` | Configure line thickness |
| `theme` | Select the light, dark or system palette for skeleton surfaces |
| `direction` | Reverse the animation on the element that animates |
| `paused` | Pause the animation |
| `label` | Supply an accessible description |
| `className` | Add custom classes to the rendered element |
| `style` | Apply supported inline styles |
| `reducedMotion` | Control reduced-motion behavior |
| `data-testid` | Support test identification |
| `value` | Set a determinate progress value |
| `max` | Set the progress maximum |

Any `data-*` key is emitted as an attribute on the rendered element, so test and
analytics hooks need no library change. There is no `variant` option: alternate
looks are separate catalog designs or named presets, never a mode switch on an
existing one.

The final API must use one documented naming convention. Aliases should not be added without a demonstrated compatibility need.

## 6.3 Advanced Properties

Loader-specific options may include:

- Dot count.
- Bar count.
- Spacing.
- Radius.
- Border radius.
- Stroke caps.
- Animation delay.
- Stagger interval.
- Rotation direction.
- Scale range.
- Opacity range.
- Gradient colors.
- Gradient angle.
- Number of segments.
- Shape selection.
- Number of orbiting elements.
- Background opacity.
- Overlay position.
- Z-index.
- Progress value.
- Progress thickness.
- Skeleton line count.
- Skeleton dimensions.
- Skeleton radius.
- Shimmer intensity.
- Shimmer direction.
- Custom labels.
- Custom CSS variables.

These options must only appear on loaders for which they have meaningful behavior.

## 6.4 CSS Variables

Provide a stable set of CSS custom properties, for example:

```css
:root {
  --wavelo-color: #6366f1;
  --wavelo-secondary-color: #a5b4fc;
  --wavelo-size: 2.5rem;
  --wavelo-duration: 1s;
  --wavelo-stroke-width: 3px;
  --wavelo-skeleton-base: #e5e7eb;
  --wavelo-skeleton-highlight: #f9fafb;
}
```

These are illustrative tokens. The final names, defaults and units must be documented and tested.

CSS variables must be scoped so that changing Wavelo configuration does not unexpectedly affect unrelated application elements.

## 6.5 Configuration Precedence

The implementation must define and document a deterministic precedence order for:

1. Library defaults.
2. Theme defaults.
3. Loader-specific defaults.
4. Component properties.
5. Explicit CSS variable overrides.

CSS variables must not unpredictably override configuration in one framework but behave differently in another.

## 6.6 Validation

The library must:

- Validate numeric values.
- Reject or normalize invalid sizes consistently.
- Prevent invalid animation durations.
- Handle unknown loader identifiers safely.
- Avoid injecting user-provided strings as executable code.
- Provide useful development-time warnings.
- Avoid excessive warnings in production.
- Preserve unrelated configuration when one property changes.

---

# 7. Framework Integration Requirements

## 7.1 React

Provide:

- Typed `Loader` component.
- Individual loader exports.
- Skeleton components.
- Progress components.
- Overlay components.
- Button-loading patterns.
- Hooks only where useful.

Example:

```tsx
import { Loader } from '@wavelo/react';

export function Example() {
  return (
    <Loader
      type="orbit"
      size={48}
      color="#6366f1"
      label="Loading data"
    />
  );
}
```

Requirements:

- Support the declared React version range.
- Avoid unnecessary re-renders.
- Clean up resources correctly.
- Support SSR where applicable.
- Avoid browser-global access during server rendering.
- Avoid hydration mismatches.
- Use framework-appropriate types and lifecycle patterns.

## 7.2 Angular

Provide:

- Angular-compatible loader components.
- Typed inputs.
- Skeleton and progress components.
- Loading directives where they improve usability.
- Standalone component support where compatible.
- Appropriate packaging and peer dependencies.

Illustrative usage:

```html
<wavelo-loader
  type="dots"
  [size]="48"
  color="#6366f1"
  label="Loading data">
</wavelo-loader>
```

Requirements:

- Test supported Angular versions.
- Respect component lifecycle.
- Avoid unnecessary change-detection work.
- Support the documented change-detection strategies.
- Avoid forcing applications to import unrelated framework adapters.

## 7.3 Vue

Provide:

- Typed loader components.
- Reactive properties.
- Skeleton and progress components.
- Appropriate server-rendering support.
- Documented CSS customization.
- Framework-native examples.

## 7.4 Svelte

Provide:

- Components or native custom-element usage.
- Reactive configuration.
- Skeleton and progress patterns.
- Supported SSR behavior.
- Documented styling and installation.

## 7.5 Web Components

Provide a custom-element integration for plain HTML and JavaScript.

Illustrative usage:

```html
<script
  type="module"
  src="/path/to/wavelo-loader.js">
</script>

<wavelo-loader
  type="pulse"
  size="48"
  color="#6366f1"
  label="Loading data">
</wavelo-loader>
```

Requirements:

- Safe custom-element registration.
- Documented attribute and property behavior.
- Correct lifecycle cleanup.
- CSS isolation strategy.
- No framework runtime dependency.
- Appropriate browser compatibility.
- Clear handling of repeated imports.

## 7.6 Compatibility Matrix

Before public release, define and test:

- Minimum supported framework versions.
- Current supported framework versions.
- Supported browsers.
- SSR compatibility.
- Hydration behavior.
- TypeScript versions.
- Node.js versions required for development and builds.

Compatibility must be verified rather than inferred from the fact that a package builds.

---

# 8. Developer Experience and API Consistency

## 8.1 Basic Usage

A common loading indicator must be easy to add without requiring advanced configuration.

The library must provide a sensible default loader and a small number of clear required properties.

## 8.2 Import Strategies

Support documented import patterns such as:

- General component import.
- Individual loader import.
- Skeleton-only import.
- Progress-only import.
- Optional overlay import.
- Framework-specific import.
- CSS-only or native custom-element usage where supported.

The final import API must not expose accidental internal paths.

## 8.3 Error Handling

Errors must be understandable and actionable.

The library must not silently render nothing when an invalid loader type is supplied without any development feedback.

At the same time, invalid configuration must not crash an entire production application unnecessarily.

## 8.4 Defaults

Defaults must be visually appropriate and accessible.

The common use case must not require developers to configure size, color, duration, labels and theme individually.

## 8.5 Migration Stability

Once an API is public and stable:

- Do not rename properties casually.
- Deprecate obsolete properties with migration guidance.
- Use semantic versioning.
- Document breaking changes.
- Provide automated migration tools only where they deliver real value.

---

# 9. Interactive Documentation Website

## 9.1 Main Objectives

The documentation website must help developers discover, configure, test and adopt loaders quickly.

## 9.2 Required Pages

### Home page

- Product overview.
- Feature summary.
- Installation instructions.
- Featured loaders.
- Framework navigation.

### Loader gallery

- Search.
- Category filters.
- Live previews.
- Light and dark backgrounds.
- Size adjustment.
- Color selection.
- Speed adjustment.
- Framework selection.
- Reduced-motion preview.
- Copyable code.
- Direct links to individual loaders.

### Loader detail pages

Each page must include:

- Name and description.
- Live preview.
- Supported configuration.
- Defaults.
- Framework-specific examples.
- Import path.
- Accessibility notes.
- Related loaders.
- Version compatibility.

### API reference

Document public exports, properties, types, defaults and supported combinations.

### Recipes and examples

Provide practical examples for:

- Fetching API data.
- Loading tables.
- Form submission.
- Button loading.
- Image loading.
- Skeleton cards.
- Upload progress.
- Full-screen overlays.
- Infinite scrolling.
- Dashboard loading.

## 9.3 Playground Accuracy

The playground must be driven by the same loader metadata used by the actual library.

It must not present unsupported properties as functional controls.

Generated examples must be checked against real package APIs.

Copy actions must copy valid code for the selected framework.

The website must never claim that code works in a framework unless that integration is actually implemented and tested.

---

# 10. Accessibility Requirements

Accessibility is mandatory across all packages.

Requirements:

1. Support meaningful accessible labels.
2. Avoid announcing every animation frame.
3. Respect `prefers-reduced-motion`.
4. Provide static or reduced-motion alternatives.
5. Use correct progress semantics for determinate progress.
6. Do not invent percentage values for indeterminate loaders.
7. Avoid unnecessary screen-reader output from decorative elements.
8. Maintain suitable visual contrast.
9. Avoid relying exclusively on color to convey progress.
10. Do not automatically place every loader in an assertive live region.
11. Avoid trapping keyboard focus in overlays.
12. Provide clear guidance for announcing application loading-state changes.
13. Ensure interactive controls in the library are keyboard accessible.
14. Avoid flashing or motion patterns that create unnecessary accessibility risks.

The project must include automated accessibility checks and manual verification of important interaction patterns.

---

# 11. Performance and Bundle Efficiency

## 11.1 Performance Principles

- Prefer CSS animations for simple effects.
- Use SVG when vector geometry is suitable.
- Avoid continuous JavaScript animation loops when CSS is sufficient.
- Avoid unnecessary layout recalculations.
- Avoid creating hundreds of DOM elements for simple loaders.
- Avoid excessive timers and event listeners.
- Avoid rendering the full catalog when one loader is imported.
- Avoid loading the documentation website into consumer applications.
- Avoid unnecessary runtime dependencies.
- Avoid global CSS resets.
- Avoid heavy visual effects when simpler alternatives are sufficient.

## 11.2 Tree-Shaking

The packages must support modular imports and tree-shaking.

A developer importing a basic spinner must not automatically download every skeleton template, overlay component and creative animation.

Requirements:

- Explicit package exports.
- ESM builds.
- TypeScript declarations.
- Correct `sideEffects` metadata.
- CSS imports that preserve necessary styles.
- Automated bundle-analysis checks.
- Consumer installation tests.

Do not mark files as side-effect-free if importing them performs required registration or global initialization.

## 11.3 Bundle-Size Budgets

Initial proposed targets:

- One basic loader's incremental implementation cost: target 5 KB or less minified and gzipped.
- Shared core: target 10 KB or less minified and gzipped for the basic runtime, excluding optional adapters and separately imported assets.
- Adapter overhead: target 5 KB or less of additional library code where technically practical, excluding framework runtimes.

These are initial targets, not guaranteed measurements.

The project must establish real baseline measurements, define what is included in each budget, and revise targets only with documented justification.

CI must report bundle sizes and flag unexplained increases.

## 11.4 Rendering Performance

The team must measure representative loaders on desktop and mobile browsers.

Tests should examine:

- Frame stability.
- CPU overhead.
- Memory growth.
- DOM node count.
- Repeated mounting and unmounting.
- Large lists of skeletons.
- Multiple simultaneous loaders.
- Theme changes.
- Configuration updates.

Performance must be evaluated against the intended use case rather than making unsupported universal performance claims.

---

# 12. Security, CSS Isolation and Reliability

## 12.1 Security

- Never execute user-supplied configuration as JavaScript.
- Avoid unsafe HTML insertion.
- Validate inputs.
- Avoid unnecessary network requests.
- Do not collect telemetry by default.
- Do not require credentials for library usage.
- Avoid hidden external dependencies.
- Protect documentation deployment credentials.
- Audit dependency vulnerabilities.
- Publish from protected release workflows.

## 12.2 CSS Isolation

The library must not unintentionally modify:

- Global fonts.
- Application colors.
- Global element styles.
- Other component classes.
- Host page animation settings.
- Unrelated CSS variables.

Use scoped classes and documented CSS variables.

For Web Components, document the chosen Shadow DOM or light DOM approach and its customization trade-offs.

## 12.3 Cleanup

Components must clean up:

- Event listeners.
- Timers.
- Observers.
- Animation resources.
- Subscriptions.
- Temporary DOM elements.

Prefer CSS animations that require no JavaScript cleanup when suitable.

## 12.4 SSR and Hydration

Where SSR is supported:

- Avoid browser-only globals during module initialization.
- Avoid non-deterministic initial markup.
- Prevent hydration mismatches.
- Ensure optional custom-element registration does not break server rendering.
- Document required client-only behavior.

---

# 13. Testing and Quality Assurance

## 13.1 Unit Tests

Test:

- Configuration defaults.
- Loader registry.
- Loader identifiers.
- Property validation.
- Progress calculations.
- Animation configuration.
- Theme behavior.
- Accessibility attributes.
- Custom-element registration.
- Cleanup.
- Export paths.
- CSS variable contracts.

## 13.2 Framework Integration Tests

React tests must cover mounting, updating, unmounting, SSR and hydration where supported.

Angular tests must cover input changes, lifecycle, change detection and documented component integration.

Vue and Svelte tests must cover their public component APIs and supported SSR behavior.

Web Component tests must cover registration, attributes, properties, lifecycle and styling.

## 13.3 Browser Tests

Use Playwright or equivalent tooling to test:

- Rendering.
- Configuration changes.
- Skeleton layouts.
- Progress values.
- Theme changes.
- Reduced-motion behavior.
- Accessibility attributes.
- Overflow and responsive layout.
- Repeated mount/unmount cycles.
- Console errors.
- Real usage examples.

Three engines run in CI. Chromium carries the full suite; Firefox and WebKit each run a
smoke suite (`npm run test:browser:firefox`, `npm run test:browser:webkit`) covering sheet
application, option and ancestor-token inheritance, painting for every design, the custom
element, and both timeline paths. WebKit stands in for Safari — the same engine, not an
Apple-shipped browser — and is where the scroll- and view-timeline enhancement is measured,
because Firefox 157 only exercises the fallback.

## 13.4 Package Installation Tests

The release pipeline must test actual packed packages.

For each package intended for publication:

1. Build the package.
2. Generate its npm tarball.
3. Install it in a clean test project.
4. Import its documented entry points.
5. Compile TypeScript examples.
6. Run applicable integration tests.
7. Verify required CSS and assets are included.
8. Confirm unrelated framework dependencies are not pulled in.

A successful monorepo build alone is insufficient evidence that the published package works.

## 13.5 Release Gates

A release candidate must pass:

- Linting.
- Type checking.
- Unit tests.
- Framework integration tests.
- Production builds.
- Browser tests.
- Accessibility checks.
- Package archive tests.
- Bundle-size checks.
- Dependency and license checks.
- Documentation example validation.

No mandatory gate may be skipped without an explicit, recorded approval.

---

# 14. Repository Structure

The proposed monorepo structure is:

```text
wavelo/
├── apps/
│   └── docs/
├── packages/
│   ├── core/
│   ├── react/
│   ├── angular/
│   ├── vue/
│   ├── svelte/
│   └── web-components/
├── examples/
│   ├── vanilla/
│   ├── react/
│   ├── angular/
│   ├── vue/
│   └── svelte/
├── scripts/
├── tests/
│   ├── integration/
│   ├── browser/
│   └── package-validation/
├── .github/
│   └── workflows/
├── AGENTS.md
├── package.json
├── tsconfig.json
└── README.md
```

Only packages with implemented functionality may be published.

The repository must include a documented contribution process, local development instructions, test commands and release procedures.

---

# 15. npm Packaging and Versioning

## 15.1 Package Naming

The Wavelo brand has been selected for the project.

Before finalizing npm package names:

- Check exact package availability.
- Check the availability of the intended scope.
- Check relevant trademarks.
- Check domain availability.
- Review existing products with similar names.
- Confirm consistent naming across the package family.

The brand selection does not itself establish npm or trademark availability.

## 15.2 Versioning

Follow semantic versioning.

- Patch: backward-compatible fixes.
- Minor: backward-compatible functionality.
- Major: breaking API changes.

Use prereleases for integration testing.

Until `1.0.0` the whole surface is still being found, so a minor version (`0.x`) may
change configuration keys, option meanings or entry points, and each such change is
recorded in `CHANGELOG.md` under a `Breaking` line and in the migration guide. What
`0.x` never does is leave a caller guessing: an option that stops applying is
removed and reported, never silently ignored. From `1.0.0` the rules above apply in
full, and the measured option table plus the browser suites are what make a
"compatible" claim checkable.

Each package must have an accurate version, dependency declaration, changelog and compatibility statement.

## 15.3 Publishing

Automated publishing must occur only through an authorized release workflow.

Requirements:

- Protected credentials.
- Validated package metadata.
- Passing quality gates.
- Release notes.
- Version tags.
- Correct package access settings.
- Verification of published artifacts.
- A documented rollback or deprecation procedure.

Unreviewed pull requests must not publish packages automatically.

---

# 16. Development Phases

## Phase 1 — Requirements and architecture

Deliverables:

- Finalized package API.
- Architecture decision records.
- Package naming investigation.
- Repository setup.
- Loader metadata model.
- Dependency rules.
- Initial testing and build infrastructure.
- `AGENTS.md`.

Exit criterion: Approved architecture with reproducible builds.

## Phase 2 — Core engine

Deliverables:

- Shared configuration types.
- Validation and normalization.
- CSS variables.
- Theme system.
- Accessibility conventions.
- Initial 15–20 loaders.
- Unit tests.

Exit criterion: The core works independently of frontend frameworks.

## Phase 3 — Framework adapters

Deliverables:

- React integration.
- Angular integration.
- Web Component integration.
- Vue integration.
- Svelte integration or a validated native integration path.
- Framework examples.
- Integration tests.

Exit criterion: Every advertised adapter passes its compatibility and installation tests.

## Phase 4 — Catalog expansion

Deliverables:

- At least 60 distinct animation designs.
- At least 20 skeleton presets or primitives.
- At least 10 progress-indicator designs or variants.
- At least 10 application loading patterns.
- At least 100 documented presets and patterns overall.

Exit criterion: The unique catalog count is verified automatically and all published entries have working implementations.

## Phase 5 — Advanced customization

Deliverables:

- Common property system.
- Loader-specific options.
- Theme customization.
- CSS variable documentation.
- Composition primitives.
- Configuration validation.
- Type-safe APIs.

Exit criterion: Developers can customize common properties consistently and create useful variants without modifying library source code.

## Phase 6 — Documentation website

Deliverables:

- Home page.
- Searchable catalog.
- Interactive previews.
- Framework selector.
- Code copying.
- API reference.
- Examples and recipes.
- Responsive layouts.

Exit criterion: A developer can find, configure and integrate a loader using the published package.

## Phase 7 — Hardening and optimization

Deliverables:

- Accessibility review.
- Bundle-size measurements.
- Browser tests.
- SSR and hydration tests.
- CSS isolation review.
- Package archive tests.
- Security review.
- CI release gates.

Exit criterion: All mandatory release criteria pass.

## Phase 8 — Public release

Deliverables:

- Published stable packages.
- Public documentation.
- Changelog and version tags.
- Contribution guidelines.
- Support and issue-reporting process.

Exit criterion: All published packages install successfully in clean projects and meet their documented contracts.

---

# 17. PRD Audit Findings and Required Resolutions

This section records the main weaknesses identified in the earlier specification and how this version addresses them.

## Finding A — Loader quantity was too loosely defined

**Problem:** A requirement for 40 loaders did not establish how many were genuinely different or how catalog completeness would be verified.

**Resolution:** Require 60 distinct animation designs and 100 or more total documented presets and patterns. Maintain unique identifiers in a central registry and validate catalog counts automatically.

## Finding B — A shared core could become a dependency bottleneck

**Problem:** A core package containing every animation, framework adapter and UI feature could increase installation cost and complexity.

**Resolution:** Separate framework adapters, keep common definitions independent of frameworks, and verify individual imports through packed-package and bundle-analysis tests.

## Finding C — Framework parity could be misleading

**Problem:** The same property may behave differently in React, Angular, Vue and Web Components because of different rendering and lifecycle rules.

**Resolution:** Centralize configuration semantics, maintain framework-specific tests, and advertise only verified capabilities.

## Finding D — Excessive customization could make the API difficult

**Problem:** Exposing every conceivable property on every loader would create a confusing API and unsupported combinations.

**Resolution:** Standardize common properties and expose specialized properties only when relevant. Define defaults, validation, precedence and compatibility behavior explicitly.

## Finding E — Performance targets were not sufficiently measurable

**Problem:** Describing the library as lightweight without measuring actual published artifacts could hide dependency or bundle growth.

**Resolution:** Establish bundle-size budgets, measure incremental imports, inspect package archives and enforce CI checks.

## Finding F — Accessibility needed more specific acceptance criteria

**Problem:** Merely claiming reduced-motion and accessibility support does not prove that screen readers, progress indicators or overlays behave correctly.

**Resolution:** Include accessibility semantics, reduced-motion alternatives, automated checks and manual verification.

## Finding G — Documentation could drift from the implementation

**Problem:** Manually maintained examples and playground controls can become incompatible with the published API.

**Resolution:** Generate or validate examples against the real package APIs and central loader metadata.

## Finding H — A monorepo build does not guarantee a usable npm package

**Problem:** Missing files, incorrect exports, peer-dependency mistakes and absent CSS can cause failures after publishing.

**Resolution:** Test packed npm artifacts in clean projects before release.

## Finding I — More loaders could increase maintenance without adding value

**Problem:** Hundreds of nearly identical variants could make the library harder to maintain.

**Resolution:** Use reusable animation primitives, require meaningful visual or functional differences, and count unique designs separately from cosmetic variants.

## Finding J — SSR and cleanup were not sufficiently emphasized

**Problem:** Browser-only APIs and unmanaged timers or listeners can create failures in server-rendered applications and repeated component mounts.

**Resolution:** Make SSR, hydration and cleanup explicit requirements for integrations that advertise those capabilities.

---

# 18. Additional Product Improvements

The following improvements should be implemented where they deliver clear developer value.

## 18.1 Custom Loader Builder

The documentation playground should allow developers to:

- Select a base animation.
- Change its colors.
- Adjust its dimensions and timing.
- Change supported structural parameters.
- Preview reduced-motion behavior.
- Copy the resulting configuration.
- Export a supported CSS or SVG definition when practical.

Generated output must be valid and must not require private internal APIs.

## 18.2 Loader Composition

Provide reusable primitives for:

- Dots.
- Rings.
- Bars.
- Shapes.
- Pulses.
- Waves.
- Skeleton blocks.

Developers should be able to create useful combinations through a documented API.

Composition must not require unrestricted execution of arbitrary user-supplied JavaScript.

## 18.3 Preset Collections

Provide logical groups such as:

- Minimal.
- Classic.
- Creative.
- Dashboard.
- E-commerce.
- Skeletons.
- Progress.
- Branded.

Collections must be metadata groupings or efficient optional imports, not reasons to duplicate the underlying implementations.

## 18.4 Reduced-Motion and Static Variants

Where appropriate, provide:

- Static indicators.
- Reduced-motion variants.
- Configurable animation intensity.
- Disabled animation mode.

Reduced-motion behavior must work consistently regardless of whether a loader is imported through a framework adapter or used as a Web Component.

---

# 19. Definition of Done

A loader is complete only when:

1. Its identifier and metadata are registered.
2. Its implementation works.
3. Its supported properties are documented.
4. Its defaults are defined.
5. Its accessibility behavior is verified.
6. Its reduced-motion behavior is tested.
7. Its preview is available.
8. Its examples are valid.
9. Its bundle impact is measured where relevant.
10. Its framework compatibility is tested where advertised.

A framework integration is complete only when its public API, lifecycle behavior, SSR claims, TypeScript declarations, package exports and clean-install tests are verified.

A release is complete only when all mandatory release gates pass.

---

# 20. Version 1.0.0 Acceptance Criteria

The stable release must satisfy all mandatory criteria:

- At least 60 distinct animation designs.
- At least 100 total named presets and loading patterns.
- All common spinner, dot, bar, skeleton, progress and overlay categories represented.
- React and Angular integrations implemented and tested.
- Vue, Svelte and Web Component integrations implemented and tested to the extent advertised.
- Common customization properties behave consistently.
- Specialized customization is documented.
- Tree-shaking and individual imports are verified.
- Accessibility and reduced-motion requirements pass.
- TypeScript declarations are available.
- Package exports and dependencies are correct.
- Published package archives install and run in clean sample projects.
- Documentation examples and playground controls match the actual APIs.
- SSR and hydration behavior are tested where supported.
- Bundle-size budgets are measured and enforced.
- Security and licensing checks pass.
- No unresolved critical defects remain.
- npm package names and publication permissions are confirmed.
- Release notes and compatibility documentation are complete.

---

# 21. Final Product Definition

Wavelo is a comprehensive, framework-independent loading and motion library that provides a large catalog of production-ready loading experiences, extensive customization, accessible defaults and lightweight framework-specific integrations.

The product succeeds when developers can solve common loading problems quickly, create distinctive loading experiences without excessive code, and integrate the library without introducing unnecessary dependencies, performance regressions or maintenance burdens.

**The defining principle is simple: maximum useful variety, minimum developer friction.**

**End of PRD — Wavelo Version 2.0**

---

# 22. Implementation Clarifications

The following clarifications are part of the v2 specification and resolve
implementation ambiguities discovered during technical review:

- The framework-independent core exposes a serializable rendering contract. DOM
  mounting and custom-element registration are separate integrations and must not
  run during module evaluation.
- The initial publish boundary is modular: the core is dependency-free, adapters
  declare only their relevant framework peer dependencies, and no adapter is
  pulled in by the core.
- A labelled loader exposes a status or progress semantic; an unlabelled decorative
  loader is hidden from assistive technology. Determinate progress must use only
  application-supplied values.
- `reducedMotion` supports `auto`, `always`, and `never`. `auto` follows the user
  preference media query, `always` disables animation, and `never` explicitly opts
  out of the library's reduced-motion rule.
- User-controlled CSS values are restricted to validated, scoped `--wavelo-*`
  variables. Configuration must never be treated as executable markup or code.
- The registry is the source of truth for catalog counts, documentation, search,
  previews, supported options and catalog validation.
- Bundle budgets are release gates only after measuring packed artifacts. Initial
  targets are 10 KB gzipped for the basic core runtime and 5 KB gzipped for an
  individual loader entry.
- Framework compatibility claims must name tested versions. A successful
  monorepo build alone does not establish framework, SSR, hydration or clean
  installation support.