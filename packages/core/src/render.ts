import { escapeHtml, normalizeConfig } from './validation.js';
import { defaultConstellation, isConstellationPattern } from './constellations.js';
import type { LoaderConfig, LoaderDefinition, NormalizedLoaderConfig, RenderKind, RenderResult, ResolutionSource } from './types.js';

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
  snake: 5,
  'three-dots': 3,
  'four-dots': 4,
  'five-dots': 5,
  'dot-matrix': 9,
  'grid-pulse': 4,
  'expanding-dot': 1,
  'audio-waveform': 7,
  'dotted-circle': 8,
  infinity: 3,
  triangles: 3,
  'ripple-circles': 3,
  'expanding-circles': 3,
  'nested-squares': 3,
  'concentric-pulse': 3,
  helix: 18,
  'typing-dots': 3,
  'trip-orbit': 3,
  'thinking-glow': 1,
  'stream-cursor': 1,
  'neural-grid': 9,
  'comet-orbit': 1,
  'progress-ai-generate': 1,
  pendulum: 1,
  fireflies: 10,
  'solar-system': 5,
  constellation: 7,
  'bubble-rise': 8,
  'signal-bars': 4,
  spectrum: 8,
  breathing: 1,
  heartbeat: 1,
  'success-ring': 1,
  'error-shake': 1,
  'button-confirm': 3,
  'toast-loading': 2,
  'drag-drop-pulse': 1,
  'offline-dot': 1,
  'save-indicator': 1,
  'undo-progress': 1
};

/**
 * Tracks a composite skeleton draws when the caller gives no `count`. An inbox row is
 * an avatar and a subject, so its default is three rows of two; a metric card is
 * number, label and trend chip; a thread is three bubbles.
 */
const SKELETON_TRACKS: Record<string, number> = {
  'skeleton-card': 3,
  'skeleton-table': 6,
  'skeleton-inbox': 6,
  'skeleton-code': 6,
  'skeleton-chat': 3,
  'skeleton-metric': 3,
  'skeleton-product-card': 4,
  'skeleton-product-page': 5,
  'skeleton-cart': 4,
  'skeleton-review': 4,
  'skeleton-chart-bar': 5,
  'skeleton-chart-line': 4,
  'skeleton-chart-donut': 3,
  'skeleton-data-table': 6,
  'skeleton-kanban': 6,
  'skeleton-timeline': 4,
  'skeleton-calendar': 7,
  'skeleton-sidebar': 5,
  'skeleton-notification': 4,
  'skeleton-command': 5,
  'skeleton-feed': 5,
  'skeleton-filter-panel': 5,
  'skeleton-map': 4,
  'page-skeleton': 5
};

const KIND_COUNTS: Partial<Record<RenderKind, number>> = { bars: 5, wave: 5, dots: 5, orbit: 5, pulse: 3 };

/** Designs that fill in whole units, so each one carries its own filled or empty state. */
const DISCRETE_PROGRESS = ['progress-steps', 'progress-dots-fill', 'progress-multi-step', 'progress-orbit-fill'];
const DEFAULT_STEPS: Record<string, number> = { 'progress-orbit-fill': 6 };

/**
 * The parts of a determinate design. A single bar is one track; a design that counts
 * in units needs each unit marked, because CSS cannot compare a value against an
 * index, and a queue gives every file its own fraction of the same value.
 */
function progressParts(type: string, config: NormalizedLoaderConfig): string {
  const part = (extra: string) => `<span class="wavelo__part" aria-hidden="true"${extra}></span>`;
  if (type === 'progress-upload-multi') {
    const files = config.count ?? 3;
    const filled = ((config.value ?? 35) / config.max) * files;
    return Array.from({ length: files }, (_, index) => {
      const level = Math.round(Math.max(0, Math.min(1, filled - index)) * 100);
      return part(` style="--wavelo-progress:${level}%"`);
    }).join('');
  }
  if (DISCRETE_PROGRESS.includes(type)) {
    const steps = config.count ?? DEFAULT_STEPS[type] ?? 5;
    const done = Math.ceil(((config.value ?? 35) / config.max) * steps);
    return Array.from({ length: steps }, (_, index) => part(` data-wavelo-step="${index < done ? 'filled' : 'empty'}"`)).join('');
  }
  return part('');
}

function parts(kind: RenderKind, type: string, config: NormalizedLoaderConfig): string {
  const part = '<span class="wavelo__part" aria-hidden="true"></span>';
  const many = (count: number) => part.repeat(count);
  if (kind === 'skeleton') {
    // Line, avatar and image placeholders are painted by the element itself; only
    // the composite layouts have child tracks. A line with a `count` becomes a
    // stack of tracks, because that is what a block of placeholder text is.
    if (type === 'skeleton-avatar' || type === 'image-placeholder' || type === 'ai-shimmer') return '';
    if (type === 'skeleton-line') return config.count && config.count > 1 ? many(config.count) : '';
    return many(config.count ?? SKELETON_TRACKS[type] ?? 5);
  }
  if (kind === 'progress') return progressParts(type, config);
  if (type === 'svg-star') return SVG_STAR;
  if (PART_COUNTS[type] !== undefined) return many(PART_COUNTS[type]);
  return many(KIND_COUNTS[kind] ?? 1);
}

type Attributes = Record<string, string>;

function attributes(config: Attributes): string {
  const entries = Object.entries(config).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([name, value]) => ` ${name}="${escapeHtml(value)}"`).join('');
}

export function renderLoaderWithDefinition(input: LoaderConfig, definition: LoaderDefinition, css: string, resolution: ResolutionSource = 'exact', requestedType = input.type): RenderResult {
  const config = normalizeConfig({ ...input, type: definition.id });
  // A loader that is not loading costs nothing: no markup, and no stylesheet slice
  // to inject, so a page full of `loading={false}` adds no bytes to the document.
  if (!config.loading) return { html: '', css: '', styleKey: styleKey(''), config, definition, resolution, fallback: resolution === 'default' };
  const progressValue = definition.supportsProgress && config.value !== undefined;
  // Named either by its own label or by a reference to visible text. `decorative`
  // hides the loader from assistive technology even when it is named, for the case
  // where a caption or a sibling status already says the same thing.
  const named = Boolean(config.label) || Boolean(config.labelledBy);
  const attrs: Attributes =
    config.decorative || !named
      ? { 'aria-hidden': 'true' }
      : {
          ...(config.label ? { 'aria-label': config.label } : {}),
          ...(config.labelledBy ? { 'aria-labelledby': config.labelledBy } : {}),
          ...(config.describedBy ? { 'aria-describedby': config.describedBy } : {}),
          role: progressValue ? 'progressbar' : 'status'
        };
  if (progressValue && named && !config.decorative) {
    attrs['aria-valuemin'] = '0';
    attrs['aria-valuemax'] = String(config.max);
    attrs['aria-valuenow'] = String(config.value);
    if (config.valueText) attrs['aria-valuetext'] = config.valueText;
  }
  // Only what the caller chose is written inline. Every token the stylesheets read
  // has a default in the rule that consumes it, so an ancestor or a class can set
  // `--wavelo-size`, `--wavelo-duration` or `--wavelo-stroke` once and have it
  // apply — an inline default used to beat any of them.
  const chosen = (key: keyof LoaderConfig) => input[key] !== undefined;
  const inline = [
    chosen('size') ? `--wavelo-size:${config.size}` : '',
    chosen('width') ? `--wavelo-width:${config.width}` : '',
    chosen('height') ? `--wavelo-height:${config.height}` : '',
    // An inline `--wavelo-color: var(--wavelo-color, #6366f1)` is a
    // self-reference, which CSS resolves as invalid at computed-value time; and
    // setting `--wavelo-background` would defeat per-design fallbacks such as the
    // section overlay's own scrim.
    config.color === undefined ? '' : `--wavelo-color:${config.color}`,
    config.secondaryColor === undefined ? '' : `--wavelo-secondary-color:${config.secondaryColor}`,
    config.backgroundColor === undefined ? '' : `--wavelo-background:${config.backgroundColor}`,
    chosen('duration') || chosen('speed') ? `--wavelo-duration:${config.duration}` : '',
    chosen('strokeWidth') ? `--wavelo-stroke:${config.strokeWidth}px` : '',
    chosen('direction') ? `--wavelo-direction:${config.direction}` : '',
    chosen('paused') ? `--wavelo-play-state:${config.paused ? 'paused' : 'running'}` : '',
    chosen('value') ? `--wavelo-progress:${(config.value! / config.max) * 100}%` : '',
    // The same value twice, once as a fraction to fill to and once as the whole
    // percentage to print. Only determinate designs pay for it, and it is the
    // percentage rather than `value` because a bar at 40 of 80 reads 50%.
    progressValue ? `--wavelo-count:${Math.round((config.value! / config.max) * 100)}` : '',
    ...Object.entries(config.style).map(([name, value]) => `${name}:${value}`)
  ]
    .filter(Boolean)
    .join(';');
  // `wavelo-inline`/`wavelo-stacked` are single-dash classes on purpose: the
  // stylesheet-slice check reserves `wavelo--<name>` for a render kind or a design.
  const stacked = definition.kind === 'skeleton' && definition.id === 'skeleton-line' && (config.count ?? 1) > 1;
  const classes = [
    'wavelo',
    `wavelo--${definition.kind}`,
    `wavelo--${definition.id}`,
    config.className,
    config.inline ? 'wavelo-inline' : '',
    stacked ? 'wavelo-stacked' : ''
  ]
    .filter(Boolean)
    .join(' ');
  const motion = config.reducedMotion ?? 'auto';
  const dataAttributes = Object.fromEntries(Object.entries(config.dataAttributes).map(([name, value]) => [name, String(value)]));
  if (definition.id === 'constellation') {
    // The only design whose geometry is chosen from the page: the dots slice carries five
    // star patterns, each keyed on this attribute, so a preset name or the attribute itself
    // picks one. An unrecognised value would select no pattern and leave all seven stars
    // stacked at the box origin, so it is checked against the list rather than passed
    // through — the attribute stays a public contract with a defined failure mode.
    const requested =
      dataAttributes['data-wavelo-constellation'] ??
      (typeof requestedType === 'string' && requestedType.startsWith('constellation-') ? requestedType.slice('constellation-'.length) : undefined);
    dataAttributes['data-wavelo-constellation'] = isConstellationPattern(requested) ? requested : defaultConstellation;
  }
  // A request that matched nothing is otherwise invisible once it reaches the page:
  // the element looks exactly like the default design. Naming what was asked for
  // turns "why is the wrong loader showing" into one look at the inspector, and it
  // costs nothing when the type resolves.
  const diagnostics: Attributes =
    resolution === 'default' && typeof requestedType === 'string' && requestedType ? { 'data-wavelo-fallback': requestedType } : {};
  // `attr()` is how a value description reaches a pseudo-element's content, so the
  // label a design prints is the same string the assistive technology is told.
  const valueLabel: Attributes = config.valueText ? { 'data-wavelo-value-text': config.valueText } : {};
  const html =
    `<span class="${escapeHtml(classes)}"${inline ? ` style="${escapeHtml(inline)}"` : ''}` +
    ` data-wavelo-motion="${escapeHtml(motion)}" data-wavelo-theme="${escapeHtml(config.theme)}"` +
    attributes(dataAttributes) +
    attributes(attrs) +
    attributes(valueLabel) +
    attributes(diagnostics) +
    `>${parts(definition.kind, definition.id, config)}</span>`;
  return {
    html,
    css,
    styleKey: styleKey(css),
    config,
    definition,
    resolution,
    // `resolution` says exactly what happened; `fallback` stays the blunt signal
    // that the request was not understood at all.
    fallback: resolution === 'default'
  };
}
