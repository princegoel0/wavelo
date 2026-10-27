import { getLoaderDefinition } from './registry.js';
import { LoaderConfig, RenderResult } from './types.js';
import { renderLoaderWithDefinition } from './render.js';

export function renderLoader(input: LoaderConfig = {}): RenderResult {
  const requested = input.type ?? 'inline';
  return renderLoaderWithDefinition(input, getLoaderDefinition(requested));
}
