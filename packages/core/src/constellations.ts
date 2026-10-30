/**
 * The star geometries `constellation` ships. Each name is one block of rules in the
 * dots slice keyed on `data-wavelo-constellation`, and each is also a preset.
 *
 * Its own module rather than a list inside `catalog.ts`: `render.ts` has to validate a
 * page's choice, and pulling the catalog into that path would put every design's row in
 * a bundle that ships one design.
 */
export const constellationPatterns = ['ursa-major', 'orion', 'cassiopeia', 'cygnus', 'ursa-minor'] as const;
export type ConstellationPattern = (typeof constellationPatterns)[number];
export const defaultConstellation: ConstellationPattern = 'ursa-major';

export function isConstellationPattern(value: unknown): value is ConstellationPattern {
  return typeof value === 'string' && (constellationPatterns as readonly string[]).includes(value);
}
