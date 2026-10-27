# Compatibility

Wavelo's core is framework-independent and targets modern browsers with CSS custom
properties, CSS animations, and SVG support. The vanilla and Web Component packages
are the only integrations that run in this repository without a framework runtime.

The React, Angular, Vue, and Svelte packages expose real framework components around
the same serializable core configuration. The current package peer ranges are
deliberately limited to the versions exercised by the repository:

- React and React DOM `>=19.3.1 <20`
- Vue `>=3.5.44 <4`
- Svelte `>=5.57.3 <6`
- Angular core `>=22.2.3 <23`

The repository verifies React SSR, Vue SSR, Svelte component compilation, and
Angular SSR through Angular 22's `renderApplication` server bootstrap context,
in addition to Angular component metadata, TestBed updates, and lifecycle
cleanup. Hydration is not configured or advertised by these adapters. The
adapters do not touch browser globals during module evaluation.

Release validation must record the exact Node.js, TypeScript, browser, and framework
versions used for each published package.

## Catalog compatibility policy

The catalog currently exposes 81 public IDs: 69 active designs and 12
deprecated aliases. Deprecated IDs remain importable and render their canonical
visual behavior; new presets use canonical IDs. Alias metadata exposes `aliasOf`
so consumers can migrate without a breaking removal. The active catalog is
validated for unique visual signatures and remains above the PRD minimum of 60
designs.
