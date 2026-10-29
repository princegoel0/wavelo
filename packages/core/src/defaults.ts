import { renderLoader } from './render-catalog.js';
import type { LoaderConfig, RenderResult, WaveloDefaults } from './types.js';

/**
 * Keys set to `undefined` mean "not provided", and a spread would otherwise let them
 * erase a default that was meant to fill them in.
 */
function provided<T extends object>(input: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) if (value !== undefined) result[key] = value;
  return result as Partial<T>;
}

/**
 * Layer a configuration over the defaults registered for its subtree: the loader's
 * own options always win, and a key the loader does not set falls through to the
 * defaults.
 */
export function mergeWaveloConfig(defaults: WaveloDefaults | null | undefined, config: LoaderConfig = {}): LoaderConfig {
  if (!defaults) return config;
  return { ...provided(defaults), ...provided(config) } as LoaderConfig;
}

/**
 * A renderer bound to a set of defaults, for one app, request or render tree.
 *
 * This is deliberately a factory rather than a global setter: a module-level default
 * would be shared by every request a server renders, so one visitor's theme could
 * leak into the next page.
 */
export function createWavelo(defaults: WaveloDefaults = {}): {
  defaults: WaveloDefaults;
  merge: (config?: LoaderConfig) => LoaderConfig;
  render: (config?: LoaderConfig) => RenderResult;
} {
  const frozen = Object.freeze({ ...provided(defaults) }) as WaveloDefaults;
  return {
    defaults: frozen,
    merge: (config = {}) => mergeWaveloConfig(frozen, config),
    render: (config = {}) => renderLoader(mergeWaveloConfig(frozen, config))
  };
}
