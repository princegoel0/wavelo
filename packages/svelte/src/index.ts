import { renderLoader } from '@wavelo/core';
import type { LoaderConfig, RenderResult } from '@wavelo/core';

export type WaveloProps = LoaderConfig;

/** Renders a design without a component tree, for Svelte stores and tests. */
export function renderSvelteLoader(props: WaveloProps = {}): RenderResult {
  return renderLoader(props);
}
