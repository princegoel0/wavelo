import { LoaderConfigurationError, LoaderConfig, NormalizedLoaderConfig, Theme } from './types.js';

/**
 * Anything that could end a declaration, open a block, load a URL or break out of
 * an attribute. Rejecting these is what makes a permissive grammar safe: an
 * unrecognised CSS value is ignored by the browser instead of reaching the sheet.
 */
const UNSAFE_CSS = /[;"'<>{}\\]|url\s*\(/i;
/** Hex, a keyword, or a colour function — nested arguments included. */
const SAFE_COLOR = /^(?:#[0-9a-f]{3,8}|[a-z][a-z0-9-]*(?:\(.+\))?)$/i;
/** `auto`, a number with a unit of at most five letters, or a function call. */
const SAFE_DIMENSION = /^(?:auto|-?\d+(?:\.\d+)?[a-z%]{1,5}|(?:calc|min|max|clamp|env)\(.+\)|var\(--wavelo-[a-z0-9-]+\))$/i;

function guarded(value: string, limit: number, pattern: RegExp, label: string, hint: string): string {
  const text = String(value).trim();
  if (!pattern.test(text) || text.length > limit || UNSAFE_CSS.test(text)) {
    throw new LoaderConfigurationError(`Invalid ${label}: ${value}. ${hint}`);
  }
  return text;
}

const COLOR_HINT = 'Use hex, a colour keyword, or a function like rgb(), oklch(), color-mix().';
const DIMENSION_HINT = 'Use a number with a unit, auto, or calc()/min()/max()/clamp()/env()/var().';

const SAFE_CLASS = /^[A-Za-z0-9 _-]{0,200}$/;
const SAFE_DATA_NAME = /^data-[a-z][a-z0-9._-]{0,60}$/;
const THEMES: Theme[] = ['light', 'dark', 'system'];

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character] as string);
}

function dimension(value: number | string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0 || value > 2000) throw new LoaderConfigurationError('Dimensions must be finite values between 0 and 2000.');
    return `${value}px`;
  }
  return guarded(value, 80, SAFE_DIMENSION, 'dimension', DIMENSION_HINT);
}

/**
 * Colours are validated but never defaulted here. Emitting a default like
 * `--wavelo-color: var(--wavelo-color, #6366f1)` on the element that also
 * declares the property is a self-reference, which CSS resolves as invalid at
 * computed-value time — the colour and every gradient using it would be lost.
 * Defaults live in the stylesheet rules that consume each property instead.
 */
function optionalColor(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return guarded(value, 120, SAFE_COLOR, 'color', COLOR_HINT);
}

/**
 * `style` carries CSS custom properties. A key that cannot be applied is
 * rejected instead of dropped: a silently discarded option is exactly the
 * failure this library is meant to remove.
 */
function safeStyle(style: LoaderConfig['style']): Record<string, string> {
  if (style === undefined) return {};
  if (typeof style !== 'object' || Array.isArray(style)) throw new LoaderConfigurationError('style must be an object of CSS custom properties.');
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (!/^--wavelo-[a-z0-9-]+$/.test(key)) {
      throw new LoaderConfigurationError(`Unsupported style key: ${key}. Style keys must be --wavelo-* custom properties.`);
    }
    const stringValue = String(value);
    if (/[\u0000-\u001f<>"'`{};]/.test(stringValue)) throw new LoaderConfigurationError(`Invalid CSS variable value for ${key}`);
    result[key] = stringValue;
  }
  return result;
}

/** `data-*` config keys are emitted as attributes; anything else is rejected. */
function safeDataAttributes(input: LoaderConfig): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!key.startsWith('data-') || value === undefined) continue;
    if (!SAFE_DATA_NAME.test(key)) throw new LoaderConfigurationError(`Invalid data attribute name: ${key}`);
    const stringValue = String(value);
    if (/[\u0000-\u001f]/.test(stringValue)) throw new LoaderConfigurationError(`Invalid data attribute value for ${key}`);
    result[key] = stringValue;
  }
  return result;
}

function duration(value: number | string | undefined, speed: number): string {
  if (value === undefined) return `${1 / speed}s`;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0 || value > 60) throw new LoaderConfigurationError('duration must be between 0 and 60 seconds.');
    return `${value}s`;
  }
  const text = String(value).trim();
  if (!/^\d+(?:\.\d+)?(?:ms|s)$/.test(text)) throw new LoaderConfigurationError('duration must use seconds or milliseconds.');
  return text;
}

/**
 * `paused` is one rule for every path. Framework templates deliver attributes as
 * strings, so `paused=""` means true and `paused="false"`/`"0"`/`false` mean
 * false, and a JavaScript caller passing the same strings gets the same result
 * as the custom element.
 */
function optionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  return value !== false && value !== 'false' && value !== '0';
}

function number(value: number | undefined, bounds: [number, number], label: string, exclusiveMin = false): number | undefined {
  if (value === undefined) return undefined;
  const parsed = typeof value === 'string' ? Number(value) : value;
  const lower = exclusiveMin ? parsed > bounds[0] : parsed >= bounds[0];
  if (!Number.isFinite(parsed) || !lower || parsed > bounds[1]) {
    throw new LoaderConfigurationError(`${label} must be ${exclusiveMin ? 'greater than' : 'at least'} ${bounds[0]} and at most ${bounds[1]}.`);
  }
  return parsed;
}

export function normalizeConfig(input: LoaderConfig): NormalizedLoaderConfig {
  const className = input.className ?? '';
  if (!SAFE_CLASS.test(className)) throw new LoaderConfigurationError('className contains unsupported characters.');
  const speed = number(input.speed, [0, 20], 'speed', true) ?? 1;
  const max = number(input.max, [0, Number.MAX_SAFE_INTEGER], 'max', true) ?? 100;
  const value = number(input.value, [0, max], 'value');
  const strokeWidth = number(input.strokeWidth, [0, 100], 'strokeWidth', true) ?? 3;
  if (input.direction !== undefined && !['normal', 'reverse'].includes(input.direction)) throw new LoaderConfigurationError('direction must be normal or reverse.');
  if (input.reducedMotion !== undefined && !['auto', 'always', 'never'].includes(input.reducedMotion)) throw new LoaderConfigurationError('reducedMotion must be auto, always, or never.');
  if (input.theme !== undefined && !THEMES.includes(input.theme)) throw new LoaderConfigurationError('theme must be light, dark, or system.');
  return {
    ...input,
    size: dimension(input.size, '2.5rem'),
    width: dimension(input.width, dimension(input.size, '2.5rem')),
    height: dimension(input.height, dimension(input.size, '2.5rem')),
    color: optionalColor(input.color),
    secondaryColor: optionalColor(input.secondaryColor),
    backgroundColor: optionalColor(input.backgroundColor),
    duration: duration(input.duration, speed),
    speed,
    strokeWidth,
    theme: input.theme ?? 'light',
    paused: optionalBoolean(input.paused),
    max,
    value,
    style: safeStyle(input.style),
    dataAttributes: safeDataAttributes(input)
  } as NormalizedLoaderConfig;
}
