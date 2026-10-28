import { LoaderConfigurationError, LoaderConfig, NormalizedLoaderConfig, Theme } from './types.js';

const SAFE_COLOR = /^(?:#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([^)]{1,80}\)|[a-z][a-z0-9 -]{0,30})$/i;
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
  if (!/^(?:\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh)|auto)$/.test(value)) throw new LoaderConfigurationError(`Invalid dimension: ${value}`);
  return value;
}

function color(value: string | undefined, fallback: string): string {
  if (value === undefined) return fallback;
  if (!SAFE_COLOR.test(value.trim())) throw new LoaderConfigurationError(`Invalid color: ${value}`);
  return value.trim();
}

function safeStyle(style: LoaderConfig['style']): Record<string, string> {
  if (!style) return {};
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    if (!key.startsWith('--wavelo-') || !/^--wavelo-[a-z0-9-]+$/.test(key)) continue;
    const stringValue = String(value);
    if (/[<>"'`{};]/.test(stringValue)) throw new LoaderConfigurationError(`Invalid CSS variable value for ${key}`);
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
  if (!/^\d+(?:\.\d+)?(?:ms|s)$/.test(value)) throw new LoaderConfigurationError('duration must use seconds or milliseconds.');
  return value;
}

export function normalizeConfig(input: LoaderConfig): NormalizedLoaderConfig {
  const className = input.className ?? '';
  if (!SAFE_CLASS.test(className)) throw new LoaderConfigurationError('className contains unsupported characters.');
  const speed = input.speed ?? 1;
  if (!Number.isFinite(speed) || speed <= 0 || speed > 20) throw new LoaderConfigurationError('speed must be greater than 0 and at most 20.');
  const max = input.max ?? 100;
  if (!Number.isFinite(max) || max <= 0) throw new LoaderConfigurationError('max must be greater than 0.');
  const value = input.value;
  if (value !== undefined && (!Number.isFinite(value) || value < 0 || value > max)) throw new LoaderConfigurationError('value must be between 0 and max.');
  if (input.strokeWidth !== undefined && (!Number.isFinite(input.strokeWidth) || input.strokeWidth <= 0 || input.strokeWidth > 100)) throw new LoaderConfigurationError('strokeWidth must be between 0 and 100.');
  if (input.direction !== undefined && !['normal', 'reverse'].includes(input.direction)) throw new LoaderConfigurationError('direction must be normal or reverse.');
  if (input.reducedMotion !== undefined && !['auto', 'always', 'never'].includes(input.reducedMotion)) throw new LoaderConfigurationError('reducedMotion must be auto, always, or never.');
  if (input.theme !== undefined && !THEMES.includes(input.theme)) throw new LoaderConfigurationError('theme must be light, dark, or system.');
  return {
    ...input,
    size: dimension(input.size, '2.5rem'),
    width: dimension(input.width, dimension(input.size, '2.5rem')),
    height: dimension(input.height, dimension(input.size, '2.5rem')),
    color: color(input.color, 'var(--wavelo-color, #6366f1)'),
    secondaryColor: color(input.secondaryColor, 'var(--wavelo-secondary-color, #a5b4fc)'),
    backgroundColor: color(input.backgroundColor, 'transparent'),
    duration: duration(input.duration, speed),
    speed,
    strokeWidth: input.strokeWidth ?? 3,
    theme: input.theme ?? 'light',
    max,
    value,
    style: safeStyle(input.style),
    dataAttributes: safeDataAttributes(input)
  } as NormalizedLoaderConfig;
}
