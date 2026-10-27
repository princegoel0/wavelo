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

export interface LoaderConfig {
  type?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
  color?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  speed?: number;
  duration?: number | string;
  strokeWidth?: number;
  theme?: Theme;
  direction?: 'normal' | 'reverse';
  paused?: boolean;
  label?: string;
  className?: string;
  style?: Record<string, string | number>;
  reducedMotion?: ReducedMotion;
  variant?: string;
  'data-testid'?: string;
  value?: number;
  max?: number;
  [key: `data-${string}`]: string | undefined;
}

export interface NormalizedLoaderConfig extends Omit<LoaderConfig, 'size' | 'width' | 'height' | 'duration' | 'speed' | 'strokeWidth' | 'value' | 'max'> {
  type: string;
  size: string;
  width: string;
  height: string;
  duration: string;
  speed: number;
  strokeWidth: number;
  value?: number;
  max: number;
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
  | 'overlay';

export interface RenderResult {
  html: string;
  css: string;
  config: NormalizedLoaderConfig;
  definition: LoaderDefinition;
  fallback: boolean;
}

export class LoaderConfigurationError extends Error {
  readonly code = 'WAVELO_INVALID_CONFIGURATION';
  constructor(message: string) {
    super(message);
    this.name = 'LoaderConfigurationError';
  }
}
