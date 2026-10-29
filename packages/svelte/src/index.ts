import { setContext } from 'svelte';
import { mergeWaveloConfig, renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult, WaveloDefaults } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

/** Context key `WaveloLoader.svelte` reads. The component inlines the same string. */
export const WAVELO_DEFAULTS_KEY = 'wavelo:defaults';

/**
 * Call during a parent component's initialisation to set the options every loader
 * in this subtree inherits; props on the `<WaveloLoader>` itself still win.
 */
export function provideWaveloDefaults(defaults: WaveloDefaults): void {
  setContext(WAVELO_DEFAULTS_KEY, defaults);
}

/** Renders a design without a component tree, for Svelte stores and tests. */
export function renderSvelteLoader(props: LoaderConfig = {}, defaults?: WaveloDefaults): RenderResult {
  return renderLoader(mergeWaveloConfig(defaults, props));
}
