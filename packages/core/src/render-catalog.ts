import { designStyles } from './css/index.js';
import { renderLoaderWithDefinition } from './render.js';
import { resolveCatalogEntry } from './registry.js';
import type { LoaderConfig, RenderResult } from './types.js';

/**
 * Renders any catalog design by ID. An unknown ID falls back to the default
 * design and sets `fallback: true`. Because the design is chosen at runtime this
 * entry point carries every stylesheet slice; `@wavelo/core/loaders/<id>`
 * imports only the slice its own design needs.
 */
export function renderLoader(input: LoaderConfig = {}): RenderResult {
  const resolution = resolveCatalogEntry(input.type);
  const result = renderLoaderWithDefinition(
    { ...input, type: resolution.id },
    resolution.definition,
    designStyles(resolution.definition.kind)
  );
  return resolution.source === 'default' ? { ...result, fallback: true } : result;
}
