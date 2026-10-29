import type { LoaderConfig } from './types.js';

/**
 * Every `LoaderConfig` key that a framework adapter must expose. Adding a key
 * to `LoaderConfig` without listing it here fails the type check, and
 * `npm run catalog` checks that each adapter declares the whole list.
 */
const declaredKeys = [
  'type',
  'size',
  'width',
  'height',
  'color',
  'secondaryColor',
  'backgroundColor',
  'speed',
  'duration',
  'strokeWidth',
  'theme',
  'direction',
  'paused',
  'label',
  'className',
  'style',
  'reducedMotion',
  'data-testid',
  'value',
  'max',
  'labelledBy',
  'describedBy',
  'valueText',
  'decorative',
  'loading',
  'count',
  'inline'
] as const satisfies readonly (keyof LoaderConfig)[];

type Unlisted = Exclude<keyof LoaderConfig, (typeof declaredKeys)[number] | `data-${string}`>;
// Assigning `true` only type-checks when every config key is listed above.
const allKeysListed: Unlisted extends never ? true : [`loaderConfigKeys is missing`, Unlisted] = true;
void allKeysListed;

export const loaderConfigKeys: readonly string[] = declaredKeys;

const kebab = (key: string) => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

/** HTML attribute names for the same keys, used by the custom element. */
export const loaderAttributes: readonly string[] = loaderConfigKeys.map(kebab);

/** Reads an attribute-named object back into `LoaderConfig` keys. */
export function configFromAttributes(values: Record<string, string | undefined>): LoaderConfig {
  const config: Record<string, unknown> = {};
  for (const [attribute, value] of Object.entries(values)) {
    if (value === undefined) continue;
    const key = attribute.startsWith('data-') ? attribute : attribute.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
    config[key] = coerce(key, value);
  }
  return config as LoaderConfig;
}

const NUMERIC_ONLY = new Set(['strokeWidth', 'speed', 'value', 'max', 'count']);
const LENGTH_OR_NUMBER = new Set(['size', 'width', 'height']);
const BOOLEAN = new Set(['paused', 'decorative', 'loading', 'inline']);

/**
 * The `style` attribute is read as configuration only for `--wavelo-*` custom
 * properties. Anything else in it is left to the browser as ordinary host
 * styling — `<wavelo-loader style="margin-top:1rem">` must keep working — while
 * the JS `style` key is strict, because there it is configuration.
 */
const WAVELO_CUSTOM_PROPERTY = /(--wavelo-[a-z0-9-]+)\s*:\s*([^;]+)/gi;

function parseStyleAttribute(value: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [, property, declaration] of value.matchAll(WAVELO_CUSTOM_PROPERTY)) result[property] = declaration.trim();
  return result;
}

function coerce(key: string, value: string): unknown {
  if (key === 'style') return parseStyleAttribute(value);
  if (LENGTH_OR_NUMBER.has(key)) return /^\d+(?:\.\d+)?$/.test(value) ? Number(value) : value;
  if (NUMERIC_ONLY.has(key)) return Number(value);
  if (BOOLEAN.has(key)) return value !== 'false' && value !== '0';
  return value;
}
