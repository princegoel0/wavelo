import type { LoaderId } from './ids.js';

export type { LoaderId };

/**
 * The CSS custom properties Wavelo's stylesheets read. Setting one in `style`, on
 * an ancestor, or in a class rule configures every loader it contains; each key
 * below is the token-level twin of a config option, and the ones with no twin
 * (`--wavelo-radius`, `--wavelo-ease`, `--wavelo-gap`, `--wavelo-scrim`,
 * `--wavelo-z-index`, the skeleton palette) are reachable only this way.
 * `scripts/validate-docs.mjs` checks that the sheet reads exactly this set and that
 * the README documents every one of them.
 */
export interface WaveloTokens {
  '--wavelo-size'?: string | number;
  '--wavelo-width'?: string | number;
  '--wavelo-height'?: string | number;
  '--wavelo-color'?: string;
  '--wavelo-secondary-color'?: string;
  '--wavelo-background'?: string;
  '--wavelo-duration'?: string;
  '--wavelo-stroke'?: string | number;
  '--wavelo-radius'?: string;
  '--wavelo-gap'?: string;
  '--wavelo-ease'?: string;
  '--wavelo-progress'?: string;
  '--wavelo-skeleton-base'?: string;
  '--wavelo-skeleton-highlight'?: string;
  '--wavelo-scrim'?: string;
  '--wavelo-z-index'?: string | number;
  '--wavelo-direction'?: 'normal' | 'reverse';
  '--wavelo-play-state'?: 'running' | 'paused';
}

/**
 * `style` accepts the typed Wavelo tokens plus any other CSS declaration, so
 * `marginTop` or `position` work the way they would on a plain element.
 */
export type LoaderStyle = WaveloTokens & Record<string, string | number>;

/**
 * Defaults registered once for a subtree, page or app. They may name a design, in
 * which case a loader that chooses none gets it. Anything set on the individual
 * loader wins over these.
 */
export type WaveloDefaults = LoaderConfig;

export type LoaderCategory =
  | 'spinner'
  | 'dots'
  | 'bars'
  | 'creative'
  | 'skeleton'
  | 'progress'
  | 'application';

export type Theme = 'light' | 'dark' | 'system';
export type ReducedMotion = 'auto' | 'always' | 'never';

/**
 * Every `data-*` attribute value is emitted on the rendered element, so these
 * keys are a supported way to carry test or analytics hooks.
 */
export type DataAttribute = `data-${string}`;

export interface LoaderConfig {
  /** A catalog ID. Unknown values render the default design and set `fallback`. */
  type?: LoaderId | (string & {});
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  speed?: number;
  duration?: number | string;
  strokeWidth?: number;
  /**
   * The palette of the page the loader sits in: the colour a design falls back to,
   * the skeleton shimmer and the overlay scrim. Omitted means `light`; `system`
   * follows `prefers-color-scheme`. An explicit `color` or `backgroundColor` wins.
   */
  theme?: Theme;
  direction?: 'normal' | 'reverse';
  /**
   * Templates deliver attributes as strings, so the string forms are accepted
   * alongside the boolean and mean the same thing the custom element means:
   * present and not `false`/`0` is paused.
   */
  paused?: boolean | 'true' | 'false' | '0' | '';
  /** Text alternative for the loader itself; sets `aria-label`. */
  label?: string;
  /** Ids of the elements that name this one; sets `aria-labelledby`. */
  labelledBy?: string;
  /** Ids of the elements that explain this one; sets `aria-describedby`. */
  describedBy?: string;
  /**
   * Human-readable reading of `value`, such as `3 of 8 files` or `72% loaded`.
   * Without it, assistive technology announces the bare number against `max`.
   */
  valueText?: string;
  /**
   * Hide the loader from assistive technology even when a label is given, for the
   * case where a visible caption or a sibling status already announces it.
   */
  decorative?: boolean;
  /**
   * Bind visibility to a value instead of mounting and unmounting the component:
   * `loading={busy}`. `false` renders no markup and loads no stylesheet, so a
   * hidden loader costs nothing. Absent means `true`.
   */
  loading?: boolean;
  /**
   * How many repeated tracks the design draws — text lines, table rows, steps.
   * Only the designs that are built from repeating tracks honour it, and the
   * catalog lists exactly which those are.
   */
  count?: number;
  /**
   * Sit on the surrounding text line instead of starting a block of its own: a
   * spinner inside a button, a skeleton replacing one word. For a skeleton line it
   * also drops the paragraph width so the placeholder is the size you give it.
   */
  inline?: boolean;
  className?: string;
  style?: LoaderStyle;
  reducedMotion?: ReducedMotion;
  'data-testid'?: string;
  value?: number;
  max?: number;
  [key: DataAttribute]: string | undefined;
}

export interface NormalizedLoaderConfig extends Omit<LoaderConfig, 'size' | 'width' | 'height' | 'duration' | 'speed' | 'strokeWidth' | 'paused' | 'decorative' | 'loading' | 'inline' | 'count' | 'value' | 'max' | DataAttribute> {
  type: string;
  size: string;
  width: string;
  height: string;
  duration: string;
  speed: number;
  strokeWidth: number;
  theme: Theme;
  /** Always a boolean after validation, whatever form the caller used. */
  paused?: boolean;
  decorative?: boolean;
  /** Resolved to a boolean; `false` is the only value that renders nothing. */
  loading: boolean;
  inline?: boolean;
  count?: number;
  value?: number;
  max: number;
  /** Only `--wavelo-*` custom properties survive validation. */
  style: Record<string, string>;
  /** Validated `data-*` pairs from the input, ready to emit as attributes. */
  dataAttributes: Record<string, string>;
}

export interface LoaderDefinition {
  id: string;
  name: string;
  category: LoaderCategory;
  description: string;
  kind: RenderKind;
  options: string[];
  supportsProgress?: boolean;
  stability: 'stable' | 'experimental';
  visualSignature?: string;
  deprecated?: boolean;
  aliasOf?: string;
}

export type RenderKind =
  | 'ring'
  | 'dots'
  | 'bars'
  | 'wave'
  | 'orbit'
  | 'shape'
  | 'rings'
  | 'pulse'
  | 'skeleton'
  | 'progress'
  | 'scroll'
  | 'overlay';

/** How the requested `type` was turned into the design that rendered. */
export type ResolutionSource = 'exact' | 'alias' | 'preset' | 'default';

export interface RenderResult {
  /** Element markup. Contains no stylesheet; see `css` and `ensureStyles`. */
  html: string;
  /** The stylesheet slice this design needs: shared base plus its render kind. */
  css: string;
  /** Identity of `css`, used to inject each slice into the document once. */
  styleKey: string;
  config: NormalizedLoaderConfig;
  definition: LoaderDefinition;
  /**
   * `'preset'` means the caller asked for a usage-shaped preset and got the
   * design it names; only `'default'` means the request was not understood.
   */
  resolution: ResolutionSource;
  /** True only when the requested `type` was unknown and the default rendered. */
  fallback: boolean;
}

export class LoaderConfigurationError extends Error {
  readonly code = 'WAVELO_INVALID_CONFIGURATION';
  constructor(message: string) {
    super(message);
    this.name = 'LoaderConfigurationError';
  }
}
