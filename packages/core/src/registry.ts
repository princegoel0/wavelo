import { catalogAliases, catalogEntries, defaultLoaderId, patternPresets } from './catalog.js';
import { honouredKeyNames, honouredOptions } from './honoured-options.js';
import type { LoaderDefinition, ResolutionSource } from './types.js';

/**
 * The keys a design actually honours, measured in Chromium against the built
 * stylesheet by `scripts/honoured-options.mjs` and stored as a hex bitset. This is
 * what the docs, the gallery and the adapter prop tables advertise, so an option
 * that changes nothing cannot be listed.
 *
 * A design missing from the table yields no options rather than throwing: the
 * measurement script itself renders every design, so it must be able to run against
 * a catalog that has just grown. `npm run catalog` fails on the empty list instead,
 * with the design's name, and `npm run catalog:generate` is what fixes it.
 */
function optionsFor(definition: LoaderDefinition): string[] {
  const bits = honouredOptions[definition.id];
  if (!bits) return [];
  const keys: string[] = [];
  for (let index = 0; index < honouredKeyNames.length; index++) {
    const digit = Number.parseInt(bits[bits.length - 1 - Math.floor(index / 4)], 16);
    if (digit & (1 << index % 4)) keys.push(honouredKeyNames[index]);
  }
  return keys.sort();
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
    // Determinate behaviour belongs to the render kind, not the marketing
    // category: `page-transition` is an application pattern that still renders a
    // value-driven bar, so it must expose progressbar semantics.
    supportsProgress: kind === 'progress',
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

/**
 * Every design by public ID, including aliases. Resolving a `type` happens on each
 * render, so it is a lookup rather than a scan of the catalog.
 */
const definitionsById = new Map(loaderRegistry.map((loader) => [loader.id, loader]));

export const presetRegistry = [
  ...loaderRegistry.map((loader) => ({ id: loader.id, name: loader.name, type: loader.aliasOf ?? loader.id })),
  ...patternPresets.map(([id, type]) => ({ id, name: id.replace(/-/g, ' '), type }))
];

export type { ResolutionSource } from './types.js';

/** Pattern preset ID to the catalog design it stands for. */
const presetTargets = new Map(presetRegistry.map((preset) => [preset.id, preset.type]));

/** The design a usage-shaped preset names, when the preset exists. */
export function getPresetTarget(presetId: string): string | undefined {
  return presetTargets.get(presetId);
}

export interface ResolvedCatalogEntry {
  /** The ID whose rules and markup are actually rendered. */
  id: string;
  definition: LoaderDefinition;
  source: ResolutionSource;
}

function byId(id: string): LoaderDefinition | undefined {
  return definitionsById.get(id);
}

/** The design rendered for a catalog ID or a pattern preset, following aliases. */
export function resolveCatalogEntry(type: string | undefined): ResolvedCatalogEntry {
  const requested = type ?? defaultLoaderId;
  const entry = byId(requested);
  if (entry) {
    if (!entry.aliasOf) return { id: entry.id, definition: entry, source: 'exact' };
    const canonical = byId(entry.aliasOf) ?? entry;
    return { id: canonical.id, definition: canonical, source: 'alias' };
  }
  // A usage-shaped preset is a real request, not a mistake: `download-progress`
  // means the design it names, and the caller must be able to tell that apart
  // from an unknown ID.
  const presetTarget = presetTargets.get(requested);
  if (presetTarget) {
    const presetEntry = byId(presetTarget);
    if (presetEntry) return { id: presetEntry.id, definition: presetEntry, source: 'preset' };
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
