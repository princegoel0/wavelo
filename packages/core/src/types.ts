import type { LoaderId } from './ids.js';

export type { LoaderId };

/**
 * The CSS custom properties Wavelo's stylesheets read. Setting one in `style`, on
 * an ancestor, or in a class rule configures every loader it contains; each key
 * below is the token-level twin of a config option, and the ones with no twin
 * (`--wavelo-radius`, the skeleton palette) are reachable only this way.
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
  '--wavelo-progress'?: string;
  '--wavelo-skeleton-base'?: string;
  '--wavelo-skeleton-highlight'?: string;
  '--wavelo-direction'?: 'normal' | 'reverse';
  '--wavelo-play-state'?: 'running' | 'paused';
}

/**
 * `style` accepts the typed Wavelo tokens plus any other CSS declaration, so
 * `marginTop` or `position` work the way they would on a plain element.
 */
export type LoaderStyle = WaveloTokens & Record<string, string | number>;

/**
 * Defaults registered once for a subtree, page or app. Anything a caller passes on
 * the individual loader wins over these.
 */
export type WaveloDefaults = Omit<LoaderConfig, 'type'>;

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
  /** Palette for skeleton and placeholder surfaces. Omitted means `light`. */
  theme?: Theme;
  direction?: 'normal' | 'reverse';
  /**
   * Templates deliver attributes as strings, so the string forms are accepted
   * alongside the boolean and mean the same thing the custom element means:
   * present and not `false`/`0` is paused.
   */
  paused?: boolean | 'true' | 'false' | '0' | '';
  label?: string;
  className?: string;
  style?: LoaderStyle;
  reducedMotion?: ReducedMotion;
  'data-testid'?: string;
  value?: number;
  max?: number;
  [key: DataAttribute]: string | undefined;
}

export interface NormalizedLoaderConfig extends Omit<LoaderConfig, 'size' | 'width' | 'height' | 'duration' | 'speed' | 'strokeWidth' | 'paused' | 'value' | 'max' | DataAttribute> {
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
