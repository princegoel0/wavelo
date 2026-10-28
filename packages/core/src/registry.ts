import { catalogAliases, catalogEntries, defaultLoaderId, patternPresets } from './catalog.js';
import type { LoaderDefinition, RenderKind } from './types.js';

const BORDER_KINDS: RenderKind[] = ['ring', 'rings', 'progress', 'overlay', 'skeleton'];

function optionsFor(definition: LoaderDefinition): string[] {
  const options = ['size', 'color', 'speed', 'duration', 'paused', 'direction', 'reducedMotion', 'theme', 'label', 'className', 'style'];
  if (definition.kind !== 'skeleton' && definition.kind !== 'overlay') options.push('width', 'height');
  if (BORDER_KINDS.includes(definition.kind)) options.push('strokeWidth');
  if (definition.kind === 'shape' || definition.kind === 'orbit') options.push('secondaryColor');
  if (definition.supportsProgress) options.push('value', 'max');
  return options.sort();
}

/**
 * Public catalog entries. An alias entry keeps its own ID and metadata but
 * carries `aliasOf`, which is how every entry point resolves it to the design
 * it renders.
 */
export const loaderRegistry: readonly LoaderDefinition[] = catalogEntries.map(([id, name, category, kind, description]) => {
  const definition: LoaderDefinition = {
    id,
    name,
    category,
    kind,
    description,
    options: [],
    supportsProgress: category === 'progress',
    stability: 'stable',
    visualSignature: id
  };
  definition.options = optionsFor(definition);
  return definition;
});

for (const definition of loaderRegistry) {
  const aliasOf = catalogAliases[definition.id];
  if (!aliasOf) continue;
  const canonical = loaderRegistry.find((loader) => loader.id === aliasOf);
  if (!canonical) throw new Error(`Catalog alias "${definition.id}" points at missing design "${aliasOf}".`);
  definition.deprecated = true;
  definition.aliasOf = aliasOf;
  definition.visualSignature = aliasOf;
  definition.stability = 'experimental';
  // An alias renders its target, so its rendering metadata must describe the
  // target. Only the public ID, name and description stay the alias's own.
  definition.kind = canonical.kind;
  definition.supportsProgress = canonical.supportsProgress;
  definition.options = [...canonical.options];
}

export const presetRegistry = [
  ...loaderRegistry.map((loader) => ({ id: loader.id, name: loader.name, type: loader.aliasOf ?? loader.id })),
  ...patternPresets.map(([id, type]) => ({ id, name: id.replace(/-/g, ' '), type }))
];

export type ResolutionSource = 'exact' | 'alias' | 'default';

export interface ResolvedCatalogEntry {
  /** The ID whose rules and markup are actually rendered. */
  id: string;
  definition: LoaderDefinition;
  source: ResolutionSource;
}

function byId(id: string): LoaderDefinition | undefined {
  return loaderRegistry.find((loader) => loader.id === id);
}

/** The design rendered for a catalog ID, following alias declarations. */
export function resolveCatalogEntry(type: string | undefined): ResolvedCatalogEntry {
  const requested = type ?? defaultLoaderId;
  const entry = byId(requested);
  if (entry) {
    if (!entry.aliasOf) return { id: entry.id, definition: entry, source: 'exact' };
    const canonical = byId(entry.aliasOf) ?? entry;
    return { id: canonical.id, definition: canonical, source: 'alias' };
  }
  const fallbackEntry = byId(defaultLoaderId);
  if (!fallbackEntry) throw new Error(`Catalog is missing its default design "${defaultLoaderId}".`);
  return { id: fallbackEntry.id, definition: fallbackEntry, source: 'default' };
}

/** Registry entry for a public ID, aliases included. */
export function getLoaderDefinition(type = defaultLoaderId): LoaderDefinition {
  return byId(type) ?? byId(defaultLoaderId)!;
}

/** The design a public ID renders, resolving aliases. */
export function getCanonicalLoaderDefinition(definition: LoaderDefinition): LoaderDefinition {
  return definition.aliasOf ? byId(definition.aliasOf) ?? definition : definition;
}

export { catalogAliases, defaultLoaderId };
