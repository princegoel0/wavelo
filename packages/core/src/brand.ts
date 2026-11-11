import { brandAnimations, LoaderConfigurationError } from './types.js';
import type { BrandConfig, NormalizedLoaderConfig } from './types.js';

const choices: Record<string, readonly string[]> = {
  animation: brandAnimations, indicator: ['ring', 'bar', 'dots', 'none'],
  layout: ['stacked', 'inline'], indicatorPosition: ['before', 'after'],
  align: ['start', 'center', 'end'], fontStyle: ['normal', 'italic', 'oblique'],
  textTransform: ['none', 'uppercase', 'lowercase', 'capitalize']
};
const lengths = new Set(['fontSize', 'captionSize', 'indicatorSize', 'gap', 'radius', 'letterSpacing']);
const colors = new Set(['textColor', 'trackColor', 'captionColor']);
const numbers: Record<string, [number, number]> = { stagger: [0, 2], delay: [0, 60], amplitude: [0, 100], lineHeight: [.5, 4] };
const fail = (key: string): never => { throw new LoaderConfigurationError(`Invalid brand.${key}. See the brand-loader configuration reference.`); };

/** Keep the nested object as strict as the root API; text is escaped at rendering. */
export function normalizeBrand(input: BrandConfig | undefined): BrandConfig | undefined {
  if (input === undefined) return undefined;
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('configuration');
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    if (key === 'text' || key === 'caption') {
      if (typeof value !== 'string' || [...value].length > (key === 'text' ? 80 : 160) || /[\u0000-\u001f]/.test(value)) fail(key);
    } else if (choices[key]) {
      if (typeof value !== 'string' || !choices[key].includes(value)) fail(key);
    } else if (lengths.has(key)) {
      if (typeof value === 'number') { if (!Number.isFinite(value) || value > 500 || value < (key === 'letterSpacing' ? -20 : 0)) fail(key); }
      else if (typeof value !== 'string' || !/^-?\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|ch)$/.test(value) || (key !== 'letterSpacing' && value.startsWith('-')) || value.length > 30) fail(key);
    } else if (colors.has(key)) {
      if (typeof value !== 'string' || value.length > 120 || !/^(?:#[0-9a-f]{3,8}|[a-z][a-z0-9-]*(?:\(.+\))?)$/i.test(value) || /[;"'<>{}\\]|url\s*\(/i.test(value)) fail(key);
    } else if (numbers[key]) {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < numbers[key][0] || value > numbers[key][1]) fail(key);
    } else if (key === 'fontWeight') {
      if (value !== 'normal' && value !== 'bold' && !(typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 1000)) fail(key);
    } else if (key === 'fontFamily') {
      if (typeof value !== 'string' || !value.trim() || value.length > 200 || /[\u0000-\u001f;<>`{}\\@]|url\s*\(/i.test(value)) fail(key);
    } else if (key === 'easing') {
      if (typeof value !== 'string' || !/^(?:linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\(\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\))$/.test(value)) fail(key);
      if (typeof value === 'string' && value.startsWith('cubic-bezier')) {
        const points = value.slice(value.indexOf('(') + 1, -1).split(',').map(Number);
        if (points[0] < 0 || points[0] > 1 || points[2] < 0 || points[2] > 1) fail(key);
      }
    } else if (key === 'showValue') {
      if (typeof value !== 'boolean') fail(key);
    } else fail(key);
    result[key] = value;
  }
  return result as BrandConfig;
}

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const length = (v: string | number) => typeof v === 'number' ? `${v}px` : v;

export function brandMarkup(config: NormalizedLoaderConfig): string {
  const b = config.brand ?? {}, text = b.text?.trim() || 'Wavelo';
  const animation = b.animation ?? 'wave', indicator = b.indicator ?? 'ring';
  const styles: string[] = [];
  if (config.value !== undefined) styles.push(`--brand-progress:${config.value / config.max}`);
  const fonts = { fontFamily: 'font-family', fontSize: 'font-size', fontWeight: 'font-weight', fontStyle: 'font-style', letterSpacing: 'letter-spacing', lineHeight: 'line-height', textTransform: 'text-transform' };
  for (const [key, property] of Object.entries(fonts)) {
    const value = b[key as keyof BrandConfig];
    if (value !== undefined) styles.push(`${property}:${lengths.has(key) ? length(value as string | number) : value}`);
  }
  const tokens: Record<string, string> = { textColor: 'text', trackColor: 'track', captionColor: 'caption', captionSize: 'caption-size', indicatorSize: 'indicator-size', gap: 'gap', radius: 'radius', stagger: 'stagger', delay: 'delay', amplitude: 'amplitude', easing: 'ease' };
  for (const [key, token] of Object.entries(tokens)) {
    const value = b[key as keyof BrandConfig];
    if (value !== undefined) styles.push(`--brand-${token}:${lengths.has(key) || key === 'amplitude' ? length(value as string | number) : key === 'stagger' || key === 'delay' ? `${value}s` : value}`);
  }
  // Segment grapheme clusters, so emoji and combining accents animate as one unit.
  const Segmenter = (Intl as typeof Intl & { Segmenter?: new (locale?: string, options?: { granularity: string }) => { segment(text: string): Iterable<{ segment: string }> } }).Segmenter;
  const letters = ['pulse', 'shimmer', 'none'].includes(animation) || !Segmenter ? [text] : [...new Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(s => s.segment);
  const chars = letters.map((char, i) => `<span class="wavelo__brand-char" style="--letter:${i}">${esc(char)}</span>`).join('');
  const caption = b.caption ? `<span class="wavelo__brand-caption">${esc(b.caption)}</span>` : '';
  const progress = config.value !== undefined;
  const value = b.showValue && progress ? `<span class="wavelo__brand-value">${Math.round(config.value! / config.max * 100)}%</span>` : '';
  const meter = indicator === 'none' ? '' : `<span class="wavelo__brand-indicator" data-indicator="${indicator}"><i></i><i></i><i></i></span>`;
  const label = `<span class="wavelo__brand-copy"><span class="wavelo__brand-text">${chars}</span>${caption}${value}</span>`;
  return `<span class="wavelo__brand" aria-hidden="true" data-animation="${animation}" data-layout="${b.layout ?? 'stacked'}" data-align="${b.align ?? 'center'}" data-progress="${progress}" style="${esc(styles.join(';'))}">${b.indicatorPosition === 'after' ? label + meter : meter + label}</span>`;
}
