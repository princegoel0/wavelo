import type { LoaderId } from './ids.js';

export type { LoaderId };

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
  paused?: boolean;
  label?: string;
  className?: string;
  style?: Record<string, string | number>;
  reducedMotion?: ReducedMotion;
  'data-testid'?: string;
  value?: number;
  max?: number;
  [key: DataAttribute]: string | undefined;
}

export interface NormalizedLoaderConfig extends Omit<LoaderConfig, 'size' | 'width' | 'height' | 'duration' | 'speed' | 'strokeWidth' | 'value' | 'max' | DataAttribute> {
  type: string;
  size: string;
  width: string;
  height: string;
  duration: string;
  speed: number;
  strokeWidth: number;
  theme: Theme;
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

export interface RenderResult {
  /** Element markup. Contains no stylesheet; see `css` and `ensureStyles`. */
  html: string;
  /** The stylesheet slice this design needs: shared base plus its render kind. */
  css: string;
  /** Identity of `css`, used to inject each slice into the document once. */
  styleKey: string;
  config: NormalizedLoaderConfig;
  definition: LoaderDefinition;
  /** True when the requested `type` was not used, including unknown IDs. */
  fallback: boolean;
}

export class LoaderConfigurationError extends Error {
  readonly code = 'WAVELO_INVALID_CONFIGURATION';
  constructor(message: string) {
    super(message);
    this.name = 'LoaderConfigurationError';
  }
}
