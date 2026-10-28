import { escapeHtml, normalizeConfig } from './validation.js';
import type { LoaderConfig, LoaderDefinition, RenderKind, RenderResult } from './types.js';

/** FNV-1a, used to identify a stylesheet slice so it is injected only once. */
export function styleKey(css: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < css.length; i++) {
    hash ^= css.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

function parts(kind: RenderKind, type: string): string {
  const part = '<span class="wavelo__part" aria-hidden="true"></span>';
  const many = (count: number) => part.repeat(count);
  if (kind === 'skeleton') {
    if (type === 'skeleton-line' || type === 'image-placeholder') return '';
    return many(type === 'skeleton-avatar' ? 1 : type === 'skeleton-card' ? 3 : type === 'skeleton-table' ? 6 : 5);
  }
  if (kind === 'progress') {
    if (type === 'progress-steps' || type === 'segmented-bar') return many(5);
    return part;
  }
  if (type === 'dotted-circle') return many(8);
  if (type === 'infinity') return many(2);
  if (type === 'triangles') return many(3);
  if (type === 'ripple-circles' || type === 'expanding-circles' || type === 'nested-squares' || type === 'concentric-pulse') return many(3);
  if (type === 'helix') return many(6);
  if (kind === 'bars' || kind === 'wave') return many(5);
  if (kind === 'dots') return many(type === 'three-dots' ? 3 : 5);
  if (kind === 'orbit') return many(5);
  if (kind === 'pulse') return many(3);
  return part;
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
    `--wavelo-color:${config.color}`,
    `--wavelo-secondary-color:${config.secondaryColor}`,
    `--wavelo-background:${config.backgroundColor}`,
    `--wavelo-duration:${config.duration}`,
    `--wavelo-stroke:${config.strokeWidth}px`,
    `--wavelo-direction:${config.direction ?? 'normal'}`,
    `--wavelo-play-state:${config.paused ? 'paused' : 'running'}`,
    `--wavelo-progress:${config.value === undefined ? '35%' : `${(config.value / config.max) * 100}%`}`,
    ...Object.entries(config.style).map(([name, value]) => `${name}:${value}`)
  ].join(';');
  const classes = ['wavelo', `wavelo--${definition.kind}`, `wavelo--${definition.id}`, config.className].filter(Boolean).join(' ');
  const motion = config.reducedMotion ?? 'auto';
  const dataAttributes = Object.fromEntries(Object.entries(config.dataAttributes).map(([name, value]) => [name, String(value)]));
  const html =
    `<span class="${escapeHtml(classes)}" style="${escapeHtml(inline)}"` +
    ` data-wavelo-motion="${escapeHtml(motion)}" data-wavelo-theme="${escapeHtml(config.theme)}"` +
    attributes(dataAttributes) +
    attributes(attrs) +
    `>${parts(definition.kind, definition.id)}</span>`;
  return {
    html,
    css,
    styleKey: styleKey(css),
    config,
    definition,
    fallback: requested !== definition.id
  };
}
