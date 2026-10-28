import { escapeHtml, normalizeConfig } from './validation.js';
import type { LoaderConfig, LoaderDefinition, NormalizedLoaderConfig, RenderKind, RenderResult } from './types.js';

/** FNV-1a, used to identify a stylesheet slice so it is injected only once. */
export function styleKey(css: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < css.length; i++) {
    hash ^= css.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/** The one design that renders real SVG rather than CSS boxes. */
const SVG_STAR =
  '<svg class="wavelo__part" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2l2.9 6.26 6.6.72-4.95 4.36 1.4 6.66L12 16.9 6.05 20l1.4-6.66L2.5 8.98l6.6-.72z"/></svg>';

/** Part count for designs whose name promises a specific number of elements. */
const PART_COUNTS: Record<string, number> = {
  'three-dots': 3,
  'four-dots': 4,
  'five-dots': 5,
  'dot-matrix': 9,
  'grid-pulse': 4,
  'expanding-dot': 1,
  'audio-waveform': 7,
  'dotted-circle': 8,
  infinity: 2,
  triangles: 3,
  'ripple-circles': 3,
  'expanding-circles': 3,
  'nested-squares': 3,
  'concentric-pulse': 3,
  helix: 6
};

const KIND_COUNTS: Partial<Record<RenderKind, number>> = { bars: 5, wave: 5, dots: 5, orbit: 5, pulse: 3 };

function parts(kind: RenderKind, type: string, config: NormalizedLoaderConfig): string {
  const part = '<span class="wavelo__part" aria-hidden="true"></span>';
  const many = (count: number) => part.repeat(count);
  if (kind === 'skeleton') {
    // Line, avatar and image placeholders are painted by the element itself;
    // only the composite layouts need child tracks.
    if (type === 'skeleton-line' || type === 'skeleton-avatar' || type === 'image-placeholder') return '';
    return many(type === 'skeleton-card' ? 3 : type === 'skeleton-table' ? 6 : 5);
  }
  if (kind === 'progress') {
    if (type === 'progress-steps') {
      // Steps are discrete: a value fills whole steps, and the same 35% default
      // used for `--wavelo-progress` decides the fill when no value is given.
      const steps = 5;
      const filled = Math.ceil(((config.value ?? 35) / config.max) * steps);
      return Array.from(
        { length: steps },
        (_, index) => `<span class="wavelo__part" aria-hidden="true" data-wavelo-step="${index < filled ? 'filled' : 'empty'}"></span>`
      ).join('');
    }
    return part;
  }
  if (type === 'svg-star') return SVG_STAR;
  if (PART_COUNTS[type] !== undefined) return many(PART_COUNTS[type]);
  return many(KIND_COUNTS[kind] ?? 1);
}

type Attributes = Record<string, string>;

function attributes(config: Attributes): string {
  const entries = Object.entries(config).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join('');
}

export function renderLoaderWithDefinition(input: LoaderConfig, definition: LoaderDefinition, css: string): RenderResult {
  const requested = input.type ?? definition.id;
  const config = normalizeConfig({ ...input, type: definition.id });
  const progressValue = definition.supportsProgress && config.value !== undefined;
  const labelled = config.label !== undefined && config.label !== '';
  const attrs: Attributes = labelled
    ? { 'aria-label': config.label as string, role: progressValue ? 'progressbar' : 'status' }
    : { 'aria-hidden': 'true' };
  if (progressValue && labelled) {
    attrs['aria-valuemin'] = '0';
    attrs['aria-valuemax'] = String(config.max);
    attrs['aria-valuenow'] = String(config.value);
  }
  const inline = [
    `--wavelo-size:${config.size}`,
    `--wavelo-width:${config.width}`,
    `--wavelo-height:${config.height}`,
    // Only the colours the caller chose are set here. An inline
    // `--wavelo-color: var(--wavelo-color, #6366f1)` is a self-reference, which
    // resolves to nothing and would leave every design inheriting the page
    // colour; setting `--wavelo-background` would also defeat the per-design
    // fallbacks, such as the section overlay's own scrim.
    config.color === undefined ? '' : `--wavelo-color:${config.color}`,
    config.secondaryColor === undefined ? '' : `--wavelo-secondary-color:${config.secondaryColor}`,
    config.backgroundColor === undefined ? '' : `--wavelo-background:${config.backgroundColor}`,
    `--wavelo-duration:${config.duration}`,
    `--wavelo-stroke:${config.strokeWidth}px`,
    `--wavelo-direction:${config.direction ?? 'normal'}`,
    `--wavelo-play-state:${config.paused ? 'paused' : 'running'}`,
    `--wavelo-progress:${config.value === undefined ? '35%' : `${(config.value / config.max) * 100}%`}`,
    ...Object.entries(config.style).map(([name, value]) => `${name}:${value}`)
  ]
    .filter(Boolean)
    .join(';');
  const classes = ['wavelo', `wavelo--${definition.kind}`, `wavelo--${definition.id}`, config.className].filter(Boolean).join(' ');
  const motion = config.reducedMotion ?? 'auto';
  const dataAttributes = Object.fromEntries(Object.entries(config.dataAttributes).map(([name, value]) => [name, String(value)]));
  const html =
    `<span class="${escapeHtml(classes)}" style="${escapeHtml(inline)}"` +
    ` data-wavelo-motion="${escapeHtml(motion)}" data-wavelo-theme="${escapeHtml(config.theme)}"` +
    attributes(dataAttributes) +
    attributes(attrs) +
    `>${parts(definition.kind, definition.id, config)}</span>`;
  return {
    html,
    css,
    styleKey: styleKey(css),
    config,
    definition,
    fallback: requested !== definition.id
  };
}
