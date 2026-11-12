import { mergeWaveloConfig, renderLoader } from '@wavelo/core';
import type { RenderResult, WaveloDefaults } from '@wavelo/core';
import type { WaveloProps } from './types.js';

/**
 * The render result without React, for server rendering and tests.
 *
 * This module declares no client boundary directive and imports no module that
 * does, so a React Server Component may call it. The component entry cannot,
 * because it is the boundary.
 */
export function renderReactLoader(props: WaveloProps = {}, defaults?: WaveloDefaults): RenderResult {
  return renderLoader(mergeWaveloConfig(defaults, props));
}

export type { WaveloProps };
