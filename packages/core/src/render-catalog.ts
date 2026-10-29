import { designStyles } from './css/index.js';
import { renderLoaderWithDefinition } from './render.js';
import { resolveCatalogEntry } from './registry.js';
import type { LoaderConfig, RenderResult } from './types.js';

/**
 * Renders any catalog design by ID. A pattern preset ID renders the design it
 * names (`resolution: 'preset'`); an unknown ID falls back to the default design
 * with `fallback: true`. Because the design is chosen at runtime this entry point
 * carries every stylesheet slice; `@wavelo/core/loaders/<id>` imports only the
 * slice its own design needs.
 */
export function renderLoader(input: LoaderConfig = {}): RenderResult {
  const resolution = resolveCatalogEntry(input.type);
  return renderLoaderWithDefinition(
    { ...input, type: resolution.id },
    resolution.definition,
    designStyles(resolution.definition.kind),
    resolution.source,
    // The renderer is handed the resolved design as `type`, so what the caller asked
    // for travels separately — that is the value worth reporting when it matched
    // nothing.
    input.type
  );
}
